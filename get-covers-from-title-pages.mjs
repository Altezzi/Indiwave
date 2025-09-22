import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');

// Create covers directory if it doesn't exist
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

class MangaDexTitlePageAPI {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  async getMangaDetails(mangaId) {
    try {
      const response = await fetch(`${this.baseUrl}/manga/${mangaId}?includes[]=cover_art`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching manga details for ${mangaId}:`, error.message);
      return null;
    }
  }

  getCoverUrlFromTitlePage(mangaId, coverData) {
    if (!coverData || !coverData.attributes || !coverData.attributes.fileName) {
      return null;
    }

    const fileName = coverData.attributes.fileName;
    const coverId = coverData.id;
    
    // Use the title page URL format: https://mangadex.org/title/{mangaId}/cover
    return `https://mangadex.org/title/${mangaId}/cover/${coverId}/${fileName}.large.jpg`;
  }

  async downloadCoverFromTitlePage(mangaId, coverUrl, retryCount = 0) {
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
          'User-Agent': this.userAgent,
          'Referer': `https://mangadex.org/title/${mangaId}`,
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        method: 'GET',
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.downloadCoverFromTitlePage(mangaId, coverUrl, retryCount + 1);
      }
      return { success: false, error: error.message };
    }
  }

  // Try alternative cover URL formats for title pages
  getAlternativeTitlePageUrls(mangaId, cover) {
    if (!cover.attributes?.fileName) return [];
    
    const fileName = cover.attributes.fileName;
    const coverId = cover.id;
    
    const urls = [
      `https://mangadex.org/title/${mangaId}/cover/${coverId}/${fileName}.large.jpg`,
      `https://mangadex.org/title/${mangaId}/cover/${coverId}/${fileName}.medium.jpg`,
      `https://mangadex.org/title/${mangaId}/cover/${coverId}/${fileName}.small.jpg`,
      `https://mangadex.org/title/${mangaId}/cover/${coverId}/${fileName}.jpg`,
      `https://mangadex.org/title/${mangaId}/cover/${coverId}/${fileName}.png`,
    ];
    
    return urls;
  }
}

const mangaAPI = new MangaDexTitlePageAPI();

async function getCoversFromTitlePages() {
  console.log('🚀 Starting cover download from MangaDex title pages...');

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
      // Get manga details including cover art
      const mangaResponse = await mangaAPI.getMangaDetails(manga.mangaMDId);
      
      if (!mangaResponse || !mangaResponse.data || !mangaResponse.data.relationships) {
        console.log(`⚠️  No manga data found for ${manga.title}`);
        failedCount++;
        continue;
      }

      // Find cover art in relationships
      const coverArt = mangaResponse.data.relationships.find(rel => rel.type === 'cover_art');
      
      if (!coverArt) {
        console.log(`⚠️  No cover art found for ${manga.title}`);
        failedCount++;
        continue;
      }

      // Try to download the cover with multiple URL formats
      const alternativeUrls = mangaAPI.getAlternativeTitlePageUrls(manga.mangaMDId, coverArt);
      
      let downloadSuccess = false;
      let lastError = null;

      for (const coverUrl of alternativeUrls) {
        if (!coverUrl) continue;
        
        console.log(`🔄 Trying cover URL: ${coverUrl}`);
        const downloadResult = await mangaAPI.downloadCoverFromTitlePage(manga.id, coverUrl);

        if (downloadResult.success) {
          // Update database with local path
          await prisma.series.update({
            where: { id: manga.id },
            data: { coverImage: downloadResult.localPath },
          });
          downloadedCount++;
          console.log(`✅ Successfully downloaded and updated cover for ${manga.title}`);
          downloadSuccess = true;
          break;
        } else {
          lastError = downloadResult.error;
          console.log(`❌ Failed to download from ${coverUrl}: ${downloadResult.error}`);
        }
      }

      if (!downloadSuccess) {
        failedCount++;
        console.log(`❌ Failed to download cover for ${manga.title} from all URLs. Last error: ${lastError}`);
      }

      // Add a small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`❌ Error processing ${manga.title}:`, error.message);
      failedCount++;
    }
  }

  console.log('\n🎉 Cover download process complete!');
  console.log(`   Downloaded covers: ${downloadedCount}`);
  console.log(`   Failed downloads: ${failedCount}`);
  console.log(`   Skipped (already local): ${skippedCount}`);
  console.log(`   Total manga processed: ${mangaWithMangaDexIds.length}`);
}

getCoversFromTitlePages()
  .catch(e => {
    console.error('❌ Cover download failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
