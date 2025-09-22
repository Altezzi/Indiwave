import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Create covers directory
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

// Alternative cover sources to try
const COVER_SOURCES = [
  // MangaDex
  (mangaId) => `https://uploads.mangadex.org/covers/${mangaId}/cover.jpg`,
  (mangaId) => `https://uploads.mangadex.org/covers/${mangaId}/cover.png`,
  
  // Alternative sources (you can add more)
  (mangaId) => `https://mangadex.org/covers/${mangaId}/cover.jpg`,
  (mangaId) => `https://mangadex.org/covers/${mangaId}/cover.png`,
];

async function downloadCover(mangaId, title) {
  const filename = `${mangaId}.jpg`;
  const localPath = path.join(COVERS_DIR, filename);
  const publicPath = `/covers/${filename}`;

  // Check if we already have this cover
  if (fs.existsSync(localPath)) {
    console.log(`⏭️  Cover already exists for ${title}`);
    return publicPath;
  }

  // Try each source
  for (let i = 0; i < COVER_SOURCES.length; i++) {
    const coverUrl = COVER_SOURCES[i](mangaId);
    
    try {
      console.log(`📥 Trying source ${i + 1} for ${title}...`);
      
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        
        // Check if it's actually an image (not HTML error page)
        if (arrayBuffer.byteLength > 1000) { // Basic size check
          fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
          console.log(`✅ Downloaded cover for ${title} from source ${i + 1}`);
          return publicPath;
        }
      }
    } catch (error) {
      console.log(`❌ Source ${i + 1} failed for ${title}: ${error.message}`);
    }
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`❌ All sources failed for ${title}`);
  return null;
}

async function processCovers() {
  console.log('🚀 Starting comprehensive cover download process...');

  // Get all manga that currently have placeholders
  const mangaWithPlaceholders = await prisma.series.findMany({
    where: {
      coverImage: '/placeholder.svg'
    },
    select: {
      id: true,
      title: true,
      mangaMDId: true
    }
  });

  console.log(`📚 Found ${mangaWithPlaceholders.length} manga with placeholder covers`);

  let downloadedCount = 0;
  let failedCount = 0;

  for (const manga of mangaWithPlaceholders) {
    // Try to download cover using mangaMDId if available, otherwise use our internal ID
    const coverId = manga.mangaMDId || manga.id;
    const localPath = await downloadCover(coverId, manga.title);
    
    if (localPath) {
      // Update database with local path
      await prisma.series.update({
        where: { id: manga.id },
        data: { coverImage: localPath }
      });
      downloadedCount++;
    } else {
      failedCount++;
    }

    // Delay between downloads to be nice to servers
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎉 Cover download process complete!');
  console.log(`   ✅ Downloaded: ${downloadedCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log(`   📁 Covers stored in: ${COVERS_DIR}`);
}

processCovers()
  .catch(e => {
    console.error('❌ Cover download failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
