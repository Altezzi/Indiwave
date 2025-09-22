import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Ensure covers directory exists
const coversDir = path.join(__dirname, 'public', 'covers');
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

class MangaDexCoverDownloader {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.rateLimitDelay = 1000; // 1 second between requests
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Fetching ${url}`);
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': 'indiwave/1.0 (https://indiwave.com)',
            'Accept': 'application/json, image/*',
            ...options.headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        console.log(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxRetries) {
          throw error;
        }
        await this.delay(2000 * attempt); // Exponential backoff
      }
    }
  }

  async getMangaDetails(mangaId) {
    try {
      const url = `${this.baseUrl}/manga/${mangaId}?includes[]=cover_art`;
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to get manga details for ${mangaId}:`, error.message);
      return null;
    }
  }

  async downloadCoverImage(coverUrl, localPath) {
    try {
      console.log(`Downloading cover from: ${coverUrl}`);
      
      const response = await this.fetchWithRetry(coverUrl, {
        headers: {
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/jpeg,image/png,image/webp,*/*'
        }
      });

      // Verify it's actually an image
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const buffer = await response.arrayBuffer();
      
      // Verify it's not HTML (check for JPEG/PNG magic bytes)
      const bytes = new Uint8Array(buffer);
      const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8;
      const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
      
      if (!isJPEG && !isPNG) {
        throw new Error('Downloaded content is not a valid image file');
      }

      fs.writeFileSync(localPath, Buffer.from(buffer));
      console.log(`✅ Successfully saved cover: ${localPath}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to download cover: ${error.message}`);
      return false;
    }
  }

  async getCoverUrlFromMangaDetails(mangaData) {
    try {
      if (!mangaData.data || !mangaData.data.relationships) {
        return null;
      }

      // Find cover art relationship
      const coverArt = mangaData.data.relationships.find(
        rel => rel.type === 'cover_art'
      );

      if (!coverArt || !coverArt.attributes) {
        return null;
      }

      const fileName = coverArt.attributes.fileName;
      const mangaId = mangaData.data.id;
      
      // Construct the cover URL using the title page format
      const coverUrl = `https://mangadex.org/title/${mangaId}/cover/${coverArt.id}/${fileName}.large.jpg`;
      return coverUrl;
    } catch (error) {
      console.error('Error extracting cover URL:', error.message);
      return null;
    }
  }

  async tryAlternativeCoverMethods(manga) {
    console.log(`🔄 Trying alternative methods for ${manga.title}...`);
    
    // Method 1: Try direct MangaDex cover URL construction
    try {
      const directUrl = `https://uploads.mangadex.org/covers/${manga.mangaMDId}/cover.jpg`;
      const localFileName = `${manga.mangaMDId}_alt1.jpg`;
      const localPath = path.join(coversDir, localFileName);
      
      const success = await this.downloadCoverImage(directUrl, localPath);
      if (success) {
        const coverImagePath = `/covers/${localFileName}`;
        await prisma.series.update({
          where: { id: manga.id },
          data: { coverImage: coverImagePath }
        });
        console.log(`✅ Alternative method 1 succeeded for ${manga.title}`);
        return true;
      }
    } catch (error) {
      console.log(`❌ Alternative method 1 failed for ${manga.title}: ${error.message}`);
    }

    // Method 2: Try different cover ID variations
    try {
      for (let coverId = 1; coverId <= 5; coverId++) {
        const altUrl = `https://uploads.mangadex.org/covers/${manga.mangaMDId}/${coverId}.jpg`;
        const localFileName = `${manga.mangaMDId}_alt2_${coverId}.jpg`;
        const localPath = path.join(coversDir, localFileName);
        
        const success = await this.downloadCoverImage(altUrl, localPath);
        if (success) {
          const coverImagePath = `/covers/${localFileName}`;
          await prisma.series.update({
            where: { id: manga.id },
            data: { coverImage: coverImagePath }
          });
          console.log(`✅ Alternative method 2 succeeded for ${manga.title} with cover ID ${coverId}`);
          return true;
        }
        await this.delay(500); // Small delay between attempts
      }
    } catch (error) {
      console.log(`❌ Alternative method 2 failed for ${manga.title}: ${error.message}`);
    }

    // Method 3: Try MangaDex title page format with different extensions
    try {
      const extensions = ['jpg', 'png', 'webp'];
      for (const ext of extensions) {
        const titleUrl = `https://mangadex.org/title/${manga.mangaMDId}/cover.${ext}`;
        const localFileName = `${manga.mangaMDId}_alt3.${ext}`;
        const localPath = path.join(coversDir, localFileName);
        
        const success = await this.downloadCoverImage(titleUrl, localPath);
        if (success) {
          const coverImagePath = `/covers/${localFileName}`;
          await prisma.series.update({
            where: { id: manga.id },
            data: { coverImage: coverImagePath }
          });
          console.log(`✅ Alternative method 3 succeeded for ${manga.title} with ${ext}`);
          return true;
        }
        await this.delay(500);
      }
    } catch (error) {
      console.log(`❌ Alternative method 3 failed for ${manga.title}: ${error.message}`);
    }

    console.log(`❌ All alternative methods failed for ${manga.title}`);
    return false;
  }

  async downloadCoverForManga(manga) {
    try {
      if (!manga.mangaMDId) {
        console.log(`Skipping ${manga.title} - no MangaDex ID`);
        return false;
      }

      console.log(`\nProcessing: ${manga.title} (ID: ${manga.mangaMDId})`);

      // Primary method: Get manga details with cover art
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;

      while (!success && attempts < maxAttempts) {
        attempts++;
        console.log(`Attempt ${attempts}/${maxAttempts} for ${manga.title}`);

        try {
          const mangaData = await this.getMangaDetails(manga.mangaMDId);
          if (!mangaData) {
            console.log(`❌ Failed to get manga details for ${manga.title} (attempt ${attempts})`);
            continue;
          }

          // Extract cover URL
          const coverUrl = await this.getCoverUrlFromMangaDetails(mangaData);
          if (!coverUrl) {
            console.log(`❌ No cover URL found for ${manga.title} (attempt ${attempts})`);
            continue;
          }

          // Generate local filename
          const localFileName = `${manga.mangaMDId}.jpg`;
          const localPath = path.join(coversDir, localFileName);

          // Download the cover
          success = await this.downloadCoverImage(coverUrl, localPath);
          if (success) {
            // Update database
            const coverImagePath = `/covers/${localFileName}`;
            await prisma.series.update({
              where: { id: manga.id },
              data: { coverImage: coverImagePath }
            });
            console.log(`✅ Primary method succeeded for ${manga.title} with ${coverImagePath}`);
            return true;
          }
        } catch (error) {
          console.log(`❌ Attempt ${attempts} failed for ${manga.title}: ${error.message}`);
        }

        if (attempts < maxAttempts) {
          await this.delay(2000 * attempts); // Exponential backoff
        }
      }

      // If primary method failed after 3 attempts, try alternative methods
      if (!success) {
        console.log(`🔄 Primary method failed after ${maxAttempts} attempts, trying alternatives...`);
        return await this.tryAlternativeCoverMethods(manga);
      }

      return false;
    } catch (error) {
      console.error(`❌ Error processing ${manga.title}:`, error.message);
      return false;
    }
  }
}

async function downloadCovers() {
  const downloader = new MangaDexCoverDownloader();
  
  try {
    console.log('Starting cover download process...');
    
    // Get all manga that need covers (currently using placeholders)
    const mangaNeedingCovers = await prisma.series.findMany({
      where: {
        coverImage: '/placeholder.svg',
        mangaMDId: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        mangaMDId: true
      }
    });

    console.log(`Found ${mangaNeedingCovers.length} manga needing covers`);

    let successCount = 0;
    let failCount = 0;

    for (const manga of mangaNeedingCovers) {
      try {
        const success = await downloader.downloadCoverForManga(manga);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
        
        // Rate limiting
        await downloader.delay(downloader.rateLimitDelay);
        
        // Progress update every 10 manga
        if ((successCount + failCount) % 10 === 0) {
          console.log(`\nProgress: ${successCount} successful, ${failCount} failed`);
        }
      } catch (error) {
        console.error(`Error processing ${manga.title}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n🎉 Cover download complete!`);
    console.log(`✅ Successfully downloaded: ${successCount} covers`);
    console.log(`❌ Failed to download: ${failCount} covers`);

  } catch (error) {
    console.error('Error in cover download process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

downloadCovers();
