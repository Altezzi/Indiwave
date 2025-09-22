import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');

// Create covers directory if it doesn't exist
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

class MangaDexAPI {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.userAgent = 'indiwave/1.0.0';
  }

  async getMangaCovers(mangaId) {
    try {
      const response = await fetch(`${this.baseUrl}/cover?manga[]=${mangaId}&limit=100`, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching covers for ${mangaId}:`, error.message);
      return null;
    }
  }

  getCoverUrl(cover, size = 'large') {
    if (!cover.attributes?.fileName) return null;
    const baseUrl = 'https://uploads.mangadex.org/covers';
    const fileName = cover.attributes.fileName;
    return `${baseUrl}/${cover.id}/${fileName}.${size}.jpg`;
  }

  async downloadCover(mangaId, coverUrl, retryCount = 0) {
    if (!coverUrl || !mangaId) {
      return { success: false, error: 'Manga ID or cover URL is missing.' };
    }

    const filename = `${mangaId}.jpg`;
    const localPath = path.join(COVERS_DIR, filename);
    const publicPath = `/covers/${filename}`;

    try {
      console.log(`Attempting to download cover for ${mangaId} from ${coverUrl}`);
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorText);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
      console.log(`Successfully downloaded cover for ${mangaId} to ${publicPath}`);
      return { success: true, localPath: publicPath };
    } catch (error) {
      console.error(`Error downloading cover for ${mangaId}: ${error.message}`);
      if (retryCount < 2) {
        console.log(`Retrying download for ${mangaId} (attempt ${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.downloadCover(mangaId, coverUrl, retryCount + 1);
      }
      return { success: false, error: error.message };
    }
  }
}

const mangaAPI = new MangaDexAPI();

async function fixCoversWithAPI() {
  console.log('🚀 Starting cover fix with MangaDex API...');

  // Get all manga that have MangaDex IDs
  const mangaWithMangaDexIds = await prisma.series.findMany({
    where: {
      mangaMDId: {
        not: null,
      },
    },
    select: {
      id: true,
      mangaMDId: true,
      title: true,
      coverImage: true,
    },
  });

  console.log(`📚 Found ${mangaWithMangaDexIds.length} manga with MangaDex IDs`);

  let downloadedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const manga of mangaWithMangaDexIds) {
    console.log(`📖 Processing: ${manga.title} (MangaDex ID: ${manga.mangaMDId})`);

    // Skip if already has local cover
    if (manga.coverImage && manga.coverImage.startsWith('/covers/')) {
      console.log(`⏭️  ${manga.title} already has a local cover, skipping.`);
      skippedCount++;
      continue;
    }

    try {
      // Get covers from MangaDex API
      const coversResponse = await mangaAPI.getMangaCovers(manga.mangaMDId);
      
      if (!coversResponse || !coversResponse.data || coversResponse.data.length === 0) {
        console.log(`⚠️  No covers found for ${manga.title}`);
        failedCount++;
        continue;
      }

      // Try to download the first cover
      const cover = coversResponse.data[0];
      const coverUrl = mangaAPI.getCoverUrl(cover, 'large');
      
      if (!coverUrl) {
        console.log(`⚠️  Could not generate cover URL for ${manga.title}`);
        failedCount++;
        continue;
      }

      const downloadResult = await mangaAPI.downloadCover(manga.id, coverUrl);

      if (downloadResult.success) {
        // Update database with local path
        await prisma.series.update({
          where: { id: manga.id },
          data: { coverImage: downloadResult.localPath },
        });
        downloadedCount++;
        console.log(`✅ Successfully downloaded and updated cover for ${manga.title}`);
      } else {
        failedCount++;
        console.log(`❌ Failed to download cover for ${manga.title}: ${downloadResult.error}`);
      }

      // Add a small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error processing ${manga.title}:`, error.message);
      failedCount++;
    }
  }

  console.log('\n🎉 Cover fix process complete!');
  console.log(`   Downloaded covers: ${downloadedCount}`);
  console.log(`   Failed downloads: ${failedCount}`);
  console.log(`   Skipped (already local): ${skippedCount}`);
  console.log(`   Total manga processed: ${mangaWithMangaDexIds.length}`);
}

fixCoversWithAPI()
  .catch(e => {
    console.error('❌ Cover fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
