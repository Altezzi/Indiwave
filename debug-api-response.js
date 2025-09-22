import fs from 'fs';
import path from 'path';

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');

class APIResponseInspector {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-api-debugger/1.0.0',
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

  async debugAPIResponse() {
    console.log('🔍 Debugging API response structure...');
    
    const metadataPath = path.join(SERIES_DIR, 'One Piece', 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      console.log('❌ One Piece metadata.json not found!');
      return;
    }

    const existingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const mangaId = existingMetadata.mangaMDId;
    
    console.log(`📖 Fetching data for manga ID: ${mangaId}`);
    
    const apiResponse = await this.getMangaById(mangaId);
    
    console.log('\n🔍 API RESPONSE STRUCTURE:');
    console.log('=====================================');
    console.log('Response keys:', Object.keys(apiResponse));
    console.log('Response.data keys:', apiResponse.data ? Object.keys(apiResponse.data) : 'No data');
    
    if (apiResponse.data) {
      console.log('\n📝 MANGA DATA:');
      console.log('=====================================');
      console.log('ID:', apiResponse.data.id);
      console.log('Type:', apiResponse.data.type);
      console.log('Attributes keys:', Object.keys(apiResponse.data.attributes));
      console.log('Relationships count:', apiResponse.data.relationships?.length || 0);
      
      console.log('\n📖 ATTRIBUTES:');
      console.log('=====================================');
      console.log('Title:', apiResponse.data.attributes.title);
      console.log('Description exists:', !!apiResponse.data.attributes.description);
      console.log('Tags count:', apiResponse.data.attributes.tags?.length || 0);
      
      console.log('\n👥 RELATIONSHIPS:');
      console.log('=====================================');
      const relationships = apiResponse.data.relationships || [];
      relationships.forEach((rel, index) => {
        if (index < 5) { // Only show first 5
          console.log(`Relationship ${index + 1}:`, {
            type: rel.type,
            id: rel.id,
            hasAttributes: !!rel.attributes,
            attributesKeys: rel.attributes ? Object.keys(rel.attributes) : 'No attributes'
          });
        }
      });
      
      // Test extraction
      console.log('\n🧪 TESTING EXTRACTION:');
      console.log('=====================================');
      
      // Title
      const title = apiResponse.data.attributes.title;
      console.log('Raw title:', title);
      if (typeof title === 'object' && title !== null) {
        console.log('Title.en:', title.en);
        console.log('Title.ja:', title.ja);
      }
      
      // Description
      const description = apiResponse.data.attributes.description;
      console.log('Raw description exists:', !!description);
      if (description && typeof description === 'object') {
        console.log('Description.en exists:', !!description.en);
        console.log('Description.en length:', description.en?.length || 0);
      }
      
      // Authors
      const authors = relationships.filter(rel => rel.type === 'author');
      console.log('Author relationships found:', authors.length);
      authors.forEach((author, index) => {
        console.log(`Author ${index + 1}:`, {
          id: author.id,
          name: author.attributes?.name,
          hasAttributes: !!author.attributes
        });
      });
      
      // Tags
      const tags = apiResponse.data.attributes.tags || [];
      console.log('Tags found:', tags.length);
      tags.slice(0, 3).forEach((tag, index) => {
        console.log(`Tag ${index + 1}:`, {
          id: tag.id,
          name: tag.attributes?.name,
          hasAttributes: !!tag.attributes
        });
      });
    }
  }

  async run() {
    console.log('🚀 Starting API RESPONSE DEBUG...');
    await this.debugAPIResponse();
    console.log('\n🎊 Debug completed!');
  }
}

// Main execution
async function main() {
  const inspector = new APIResponseInspector();
  await inspector.run();
}

main().catch((error) => {
  console.error('💥 Debug failed:', error);
  process.exit(1);
});
