import fs from 'fs';
import path from 'path';

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');

class CoverDownloader {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.downloadedCount = 0;
    this.failedCount = 0;
    this.errors = [];
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-cover-downloader/1.0.0',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async getMangaById(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    const url = `${this.baseUrl}/manga/${mangaId}?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  getCoverUrl(manga) {
    if (!manga.relationships) {
      return null;
    }

    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (!coverRel || !coverRel.attributes?.fileName) {
      return null;
    }

    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
  }

  // Download cover and save to series folder
  async downloadCover(seriesFolder, mangaId, coverUrl, seriesName) {
    if (!coverUrl || !mangaId) {
      return { success: false, error: 'Manga ID or cover URL is missing.' };
    }

    const filename = 'cover.jpg';
    const localPath = path.join(seriesFolder, filename);

    // Check if file already exists
    if (fs.existsSync(localPath)) {
      console.log(`⏭️ Cover already exists for ${seriesName}`);
      return { success: true, localPath: filename };
    }

    try {
      console.log(`🖼️ Downloading cover for ${seriesName}...`);
      console.log(`   URL: ${coverUrl}`);
      
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
      
      console.log(`✅ Cover downloaded for ${seriesName}: ${filename}`);
      return { success: true, localPath: filename };
    } catch (error) {
      console.log(`❌ Cover download failed for ${seriesName}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async downloadCoversForSeries(seriesFolder) {
    const seriesName = path.basename(seriesFolder);
    const metadataPath = path.join(seriesFolder, 'metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      console.log(`⚠️ No metadata.json found for ${seriesName}`);
      return false;
    }

    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const mangaId = metadata.mangaMDId;
      
      if (!mangaId) {
        console.log(`⚠️ No mangaMDId found in metadata for ${seriesName}`);
        return false;
      }

      // Get manga data to find cover URL
      const mangaData = await this.getMangaById(mangaId);
      const coverUrl = this.getCoverUrl(mangaData);
      
      if (!coverUrl) {
        console.log(`⚠️ No cover URL found for ${seriesName}`);
        return false;
      }

      // Download the cover
      const result = await this.downloadCover(seriesFolder, mangaId, coverUrl, seriesName);
      
      if (result.success) {
        this.downloadedCount++;
        return true;
      } else {
        this.failedCount++;
        this.errors.push(`${seriesName}: ${result.error}`);
        return false;
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${seriesName}: ${error.message}`);
      this.failedCount++;
      this.errors.push(`${seriesName}: ${error.message}`);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting COVER DOWNLOAD for all series...');
    console.log(`📁 Looking in: ${SERIES_DIR}`);
    
    if (!fs.existsSync(SERIES_DIR)) {
      console.log('❌ Series directory does not exist!');
      return;
    }

    const seriesFolders = fs.readdirSync(SERIES_DIR)
      .filter(item => {
        const itemPath = path.join(SERIES_DIR, item);
        return fs.statSync(itemPath).isDirectory();
      });

    console.log(`📚 Found ${seriesFolders.length} series folders`);

    for (const folderName of seriesFolders) {
      const seriesFolder = path.join(SERIES_DIR, folderName);
      await this.downloadCoversForSeries(seriesFolder);
      
      // Add delay between downloads to be respectful to the API
      console.log('⏳ Waiting 2 seconds before next download...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎊 COVER DOWNLOAD completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Downloaded: ${this.downloadedCount} covers`);
    console.log(`   ❌ Failed: ${this.failedCount} covers`);
    console.log(`   📚 Total processed: ${seriesFolders.length} series`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n🎨 All covers downloaded to series folders!');
  }
}

// Main execution
async function main() {
  const downloader = new CoverDownloader();
  await downloader.run();
}

main().catch((error) => {
  console.error('💥 Cover download failed:', error);
  process.exit(1);
});
