import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugMangaDexAPI() {
  try {
    console.log('🔍 Debugging MangaDex API response structure...\n');
    
    // Test with a simple search
    const searchUrl = 'https://api.mangadex.org/manga?title=One%20Piece&limit=1&includes[]=cover_art&includes[]=author&includes[]=artist';
    console.log('🔗 Search URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'indiwave/1.0.0',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const searchResult = await response.json();
    console.log('\n📋 Search Result Structure:');
    console.log(JSON.stringify(searchResult, null, 2));
    
    if (searchResult.data && searchResult.data.length > 0) {
      const manga = searchResult.data[0];
      console.log('\n📖 First Manga Structure:');
      console.log(JSON.stringify(manga, null, 2));
      
      // Now get detailed info
      const detailUrl = `https://api.mangadex.org/manga/${manga.id}?includes[]=cover_art&includes[]=author&includes[]=artist`;
      console.log('\n🔗 Detail URL:', detailUrl);
      
      const detailResponse = await fetch(detailUrl, {
        headers: {
          'User-Agent': 'indiwave/1.0.0',
          'Accept': 'application/json',
        },
      });
      
      if (detailResponse.ok) {
        const detailResult = await detailResponse.json();
        console.log('\n📋 Detail Result Structure:');
        console.log(JSON.stringify(detailResult, null, 2));
        
        // Test title extraction
        console.log('\n🔍 Title Extraction Test:');
        const mangaData = detailResult.data;
        console.log('Raw title:', mangaData.attributes?.title);
        console.log('Title type:', typeof mangaData.attributes?.title);
        
        if (mangaData.attributes?.title) {
          if (typeof mangaData.attributes.title === 'object') {
            console.log('Title object keys:', Object.keys(mangaData.attributes.title));
            console.log('English title:', mangaData.attributes.title.en);
            console.log('Japanese title:', mangaData.attributes.title.ja);
          }
        }
        
        // Test cover extraction
        console.log('\n🖼️ Cover Extraction Test:');
        console.log('Relationships:', mangaData.relationships?.length);
        if (mangaData.relationships) {
          const coverRel = mangaData.relationships.find(rel => rel.type === 'cover_art');
          console.log('Cover relationship:', coverRel);
          if (coverRel) {
            console.log('Cover filename:', coverRel.attributes?.fileName);
            const coverUrl = `https://uploads.mangadex.org/covers/${mangaData.id}/${coverRel.attributes.fileName}.512.jpg`;
            console.log('Cover URL:', coverUrl);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMangaDexAPI();
