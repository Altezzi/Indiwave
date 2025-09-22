import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Create covers directory
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

async function downloadCover(mangaId, coverUrl) {
  if (!coverUrl || !coverUrl.startsWith('https://uploads.mangadex.org/')) {
    return null;
  }

  const filename = `${mangaId}.jpg`;
  const localPath = path.join(COVERS_DIR, filename);
  const publicPath = `/covers/${filename}`;

  try {
    console.log(`📥 Downloading cover for ${mangaId}...`);
    
    const response = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://mangadex.org/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
    
    console.log(`✅ Downloaded cover for ${mangaId}`);
    return publicPath;
  } catch (error) {
    console.log(`❌ Failed to download cover for ${mangaId}: ${error.message}`);
    return null;
  }
}

async function processCovers() {
  console.log('🚀 Starting cover download process...');

  // Get all manga with MangaDex cover URLs
  const mangaWithCovers = await prisma.series.findMany({
    where: {
      coverImage: {
        startsWith: 'https://uploads.mangadex.org/'
      }
    },
    select: {
      id: true,
      title: true,
      coverImage: true
    }
  });

  console.log(`📚 Found ${mangaWithCovers.length} manga with MangaDex covers`);

  let downloadedCount = 0;
  let failedCount = 0;

  for (const manga of mangaWithCovers) {
    const localPath = await downloadCover(manga.id, manga.coverImage);
    
    if (localPath) {
      // Update database with local path
      await prisma.series.update({
        where: { id: manga.id },
        data: { coverImage: localPath }
      });
      downloadedCount++;
    } else {
      // Set to placeholder if download failed
      await prisma.series.update({
        where: { id: manga.id },
        data: { coverImage: '/placeholder.svg' }
      });
      failedCount++;
    }

    // Small delay to be nice to the server
    await new Promise(resolve => setTimeout(resolve, 100));
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
