import fs from 'fs';
import path from 'path';

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');

class FinalMetadataFixer {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.updatedCount = 0;
    this.failedCount = 0;
    this.errors = [];
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-final-metadata-fixer/1.0.0',
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

  // FIXED: Correct title extraction from apiResponse.data
  getBestTitle(apiResponse) {
    const manga = apiResponse.data;
    if (!manga?.attributes?.title) {
      return 'Unknown Title';
    }
    
    const title = manga.attributes.title;
    
    if (typeof title === 'string') {
      return title;
    }
    
    if (typeof title === 'object') {
      return title.en || title.ja || Object.values(title)[0] || 'Unknown Title';
    }
    
    return 'Unknown Title';
  }

  // FIXED: Correct description extraction from apiResponse.data
  getBestDescription(apiResponse) {
    const manga = apiResponse.data;
    if (!manga?.attributes?.description) return '';
    
    const description = manga.attributes.description;
    
    if (typeof description === 'string') {
      return description;
    }
    
    if (typeof description === 'object') {
      return description.en || description.ja || Object.values(description)[0] || '';
    }
    
    return '';
  }

  // FIXED: Correct authors and artists extraction from apiResponse.data
  getAuthorsAndArtists(apiResponse) {
    const manga = apiResponse.data;
    const authors = [];
    const artists = [];
    
    if (!manga?.relationships) {
      return { authors, artists };
    }
    
    manga.relationships.forEach(rel => {
      if (rel.type === 'author' && rel.attributes?.name) {
        authors.push(rel.attributes.name);
      } else if (rel.type === 'artist' && rel.attributes?.name) {
        artists.push(rel.attributes.name);
      }
    });
    
    return { authors, artists };
  }

  // FIXED: Correct tags extraction from apiResponse.data
  getAllTags(apiResponse) {
    const manga = apiResponse.data;
    if (!manga?.attributes?.tags) return [];
    return manga.attributes.tags.map(tag => 
      tag.attributes.name.en || tag.attributes.name.ja || 'Unknown Tag'
    );
  }

  // Get cover URL
  getCoverUrl(apiResponse) {
    const manga = apiResponse.data;
    if (!manga?.relationships) {
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
      return { success: true, localPath: filename };
    }

    try {
      console.log(`🖼️ Downloading cover for ${seriesName}...`);
      
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
      
      console.log(`✅ Cover downloaded for ${seriesName}`);
      return { success: true, localPath: filename };
    } catch (error) {
      console.log(`⚠️ Cover download failed for ${seriesName}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async updateSeriesMetadata(seriesFolder) {
    const seriesName = path.basename(seriesFolder);
    const metadataPath = path.join(seriesFolder, 'metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      console.log(`⚠️ No metadata.json found for ${seriesName}`);
      return false;
    }

    try {
      const existingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const mangaId = existingMetadata.mangaMDId;
      
      if (!mangaId) {
        console.log(`⚠️ No mangaMDId found in metadata for ${seriesName}`);
        return false;
      }

      console.log(`📖 Fetching complete metadata for ${seriesName}...`);

      // Get complete manga data
      const apiResponse = await this.getMangaById(mangaId);
      
      // Extract all metadata with CORRECTED logic
      const title = this.getBestTitle(apiResponse);
      const description = this.getBestDescription(apiResponse);
      const { authors, artists } = this.getAuthorsAndArtists(apiResponse);
      const tags = this.getAllTags(apiResponse);
      const coverUrl = this.getCoverUrl(apiResponse);
      
      console.log(`📝 Found description: ${description ? 'Yes' : 'No'} (${description.length} chars)`);
      console.log(`👥 Found authors: ${authors.length}, artists: ${artists.length}`);
      console.log(`🏷️ Found tags: ${tags.length}`);
      console.log(`🖼️ Found cover: ${coverUrl ? 'Yes' : 'No'}`);

      // Download cover if it doesn't exist
      let coverFilename = 'cover.jpg';
      if (coverUrl) {
        const downloadResult = await this.downloadCover(seriesFolder, mangaId, coverUrl, seriesName);
        if (downloadResult.success) {
          coverFilename = downloadResult.localPath;
        }
      }

      // Create updated metadata
      const updatedMetadata = {
        title: title,
        mangaMDId: mangaId,
        description: description,
        authors: authors,
        artists: artists,
        tags: tags,
        status: apiResponse.data.attributes?.status || 'ongoing',
        year: apiResponse.data.attributes?.year || null,
        contentRating: apiResponse.data.attributes?.contentRating || 'safe',
        coverImage: coverFilename,
        totalChapters: existingMetadata.totalChapters || 0,
        createdAt: existingMetadata.createdAt,
        updatedAt: new Date().toISOString(),
        source: 'MangaDex'
      };

      // Write updated metadata
      fs.writeFileSync(
        metadataPath,
        JSON.stringify(updatedMetadata, null, 2)
      );

      // Update README.md with new information
      const readmePath = path.join(seriesFolder, 'README.md');
      const readme = `# ${title}

## Description
${description || 'No description available.'}

## Details
- **Authors**: ${authors.join(', ') || 'Unknown'}
- **Artists**: ${artists.join(', ') || 'Unknown'}
- **Status**: ${updatedMetadata.status}
- **Year**: ${updatedMetadata.year || 'Unknown'}
- **Content Rating**: ${updatedMetadata.contentRating}
- **Total Chapters**: ${updatedMetadata.totalChapters}

## Tags
${tags.map(tag => `- ${tag}`).join('\n')}

## Files
- \`cover.jpg\` - Series cover image
- \`metadata.json\` - Complete series metadata
- \`chapters.json\` - Chapter information and reading links
- \`README.md\` - This file

---
*Generated by IndiWave Series Creator*
*Last updated: ${new Date().toLocaleString()}*
`;

      fs.writeFileSync(readmePath, readme);

      this.updatedCount++;
      console.log(`✅ Updated metadata for ${seriesName}`);
      return true;
      
    } catch (error) {
      console.log(`❌ Error updating ${seriesName}: ${error.message}`);
      this.failedCount++;
      this.errors.push(`${seriesName}: ${error.message}`);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting FINAL METADATA FIX for all series...');
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
      await this.updateSeriesMetadata(seriesFolder);
      
      // Add delay between updates to be respectful to the API
      console.log('⏳ Waiting 2 seconds before next update...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎊 FINAL METADATA FIX completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Updated: ${this.updatedCount} series`);
    console.log(`   ❌ Failed: ${this.failedCount} series`);
    console.log(`   📚 Total processed: ${seriesFolders.length} series`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n🎨 All series metadata updated with descriptions, authors, artists, and tags!');
    console.log('📁 Each series folder now contains complete metadata including:');
    console.log('   - Full descriptions');
    console.log('   - Author and artist information');
    console.log('   - Genre tags');
    console.log('   - Cover images');
    console.log('   - Updated README files');
  }
}

// Main execution
async function main() {
  const fixer = new FinalMetadataFixer();
  await fixer.run();
}

main().catch((error) => {
  console.error('💥 Final metadata fix failed:', error);
  process.exit(1);
});
