import fs from 'fs';
import path from 'path';

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');

class MetadataInspector {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-metadata-debugger/1.0.0',
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

  async debugOnePiece() {
    console.log('🔍 Debugging One Piece metadata extraction...');
    
    const metadataPath = path.join(SERIES_DIR, 'One Piece', 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      console.log('❌ One Piece metadata.json not found!');
      return;
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const mangaId = metadata.mangaMDId;
    
    console.log(`📖 Fetching data for manga ID: ${mangaId}`);
    
    const mangaData = await this.getMangaById(mangaId);
    
    console.log('\n🔍 RAW API RESPONSE STRUCTURE:');
    console.log('=====================================');
    console.log('Manga ID:', mangaData.data?.id);
    console.log('Manga Type:', mangaData.data?.type);
    console.log('Manga Attributes:', JSON.stringify(mangaData.data?.attributes, null, 2));
    console.log('Manga Relationships:', JSON.stringify(mangaData.data?.relationships, null, 2));
    
    console.log('\n📝 TITLE EXTRACTION:');
    console.log('=====================================');
    const title = mangaData.data?.attributes?.title;
    console.log('Raw title object:', JSON.stringify(title, null, 2));
    if (typeof title === 'object' && title !== null) {
      console.log('English title:', title.en);
      console.log('Japanese title:', title.ja);
      console.log('All title keys:', Object.keys(title));
    }
    
    console.log('\n📖 DESCRIPTION EXTRACTION:');
    console.log('=====================================');
    const description = mangaData.data?.attributes?.description;
    console.log('Raw description object:', JSON.stringify(description, null, 2));
    if (typeof description === 'object' && description !== null) {
      console.log('English description:', description.en);
      console.log('Japanese description:', description.ja);
      console.log('All description keys:', Object.keys(description));
    }
    
    console.log('\n👥 AUTHORS/ARTISTS EXTRACTION:');
    console.log('=====================================');
    const relationships = mangaData.data?.relationships || [];
    console.log('Total relationships:', relationships.length);
    relationships.forEach((rel, index) => {
      console.log(`Relationship ${index + 1}:`, {
        type: rel.type,
        id: rel.id,
        attributes: rel.attributes
      });
    });
    
    const authors = relationships.filter(rel => rel.type === 'author');
    const artists = relationships.filter(rel => rel.type === 'artist');
    console.log('Author relationships:', authors.length);
    console.log('Artist relationships:', artists.length);
    
    console.log('\n🏷️ TAGS EXTRACTION:');
    console.log('=====================================');
    const tags = mangaData.data?.attributes?.tags;
    console.log('Raw tags array:', JSON.stringify(tags, null, 2));
    if (Array.isArray(tags)) {
      console.log('Number of tags:', tags.length);
      tags.forEach((tag, index) => {
        console.log(`Tag ${index + 1}:`, {
          id: tag.id,
          type: tag.type,
          attributes: tag.attributes
        });
      });
    }
    
    console.log('\n🖼️ COVER EXTRACTION:');
    console.log('=====================================');
    const coverRel = relationships.find(rel => rel.type === 'cover_art');
    if (coverRel) {
      console.log('Cover relationship found:', JSON.stringify(coverRel, null, 2));
    } else {
      console.log('No cover relationship found');
    }
  }

  async run() {
    console.log('🚀 Starting METADATA DEBUG for One Piece...');
    await this.debugOnePiece();
    console.log('\n🎊 Debug completed!');
  }
}

// Main execution
async function main() {
  const inspector = new MetadataInspector();
  await inspector.run();
}

main().catch((error) => {
  console.error('💥 Debug failed:', error);
  process.exit(1);
});
