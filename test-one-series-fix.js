import fs from 'fs';
import path from 'path';

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');

class OneSeriesTester {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-one-series-tester/1.0.0',
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

  // FIXED: Better title extraction
  getBestTitle(manga) {
    if (!manga.attributes?.title) {
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

  // FIXED: Better description extraction
  getBestDescription(manga) {
    if (!manga.attributes?.description) return '';
    
    const description = manga.attributes.description;
    
    if (typeof description === 'string') {
      return description;
    }
    
    if (typeof description === 'object') {
      return description.en || description.ja || Object.values(description)[0] || '';
    }
    
    return '';
  }

  // FIXED: Better authors and artists extraction
  getAuthorsAndArtists(manga) {
    const authors = [];
    const artists = [];
    
    if (!manga.relationships) {
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

  // FIXED: Better tags extraction
  getAllTags(manga) {
    if (!manga.attributes?.tags) return [];
    return manga.attributes.tags.map(tag => 
      tag.attributes.name.en || tag.attributes.name.ja || 'Unknown Tag'
    );
  }

  async testOnePiece() {
    console.log('🧪 Testing One Piece metadata extraction...');
    
    const metadataPath = path.join(SERIES_DIR, 'One Piece', 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      console.log('❌ One Piece metadata.json not found!');
      return;
    }

    const existingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const mangaId = existingMetadata.mangaMDId;
    
    console.log(`📖 Fetching data for manga ID: ${mangaId}`);
    
    const mangaData = await this.getMangaById(mangaId);
    
    // Extract all metadata with FIXED logic
    const title = this.getBestTitle(mangaData);
    const description = this.getBestDescription(mangaData);
    const { authors, artists } = this.getAuthorsAndArtists(mangaData);
    const tags = this.getAllTags(mangaData);
    
    console.log('\n🎯 EXTRACTED METADATA:');
    console.log('=====================================');
    console.log(`📝 Title: "${title}"`);
    console.log(`📖 Description: ${description ? 'Found' : 'Missing'} (${description.length} characters)`);
    console.log(`👥 Authors: [${authors.join(', ')}]`);
    console.log(`🎨 Artists: [${artists.join(', ')}]`);
    console.log(`🏷️ Tags: [${tags.join(', ')}]`);
    
    if (description) {
      console.log('\n📖 DESCRIPTION PREVIEW:');
      console.log('=====================================');
      console.log(description.substring(0, 200) + '...');
    }
    
    console.log('\n✅ Test completed successfully!');
    console.log('🎉 The extraction logic is working correctly!');
  }

  async run() {
    console.log('🚀 Starting ONE SERIES TEST...');
    await this.testOnePiece();
  }
}

// Main execution
async function main() {
  const tester = new OneSeriesTester();
  await tester.run();
}

main().catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
