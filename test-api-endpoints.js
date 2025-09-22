// Using built-in fetch

async function testAPIEndpoints() {
  console.log('🧪 Testing API endpoints with series folder data...');
  
  try {
    // Test the main comics endpoint
    console.log('\n📚 Testing /api/comics endpoint...');
    const comicsResponse = await fetch('http://localhost:3000/api/comics');
    
    if (comicsResponse.ok) {
      const comicsData = await comicsResponse.json();
      console.log(`✅ Comics endpoint working! Found ${comicsData.comics.length} series`);
      
      // Show first few series
      comicsData.comics.slice(0, 3).forEach((comic, index) => {
        console.log(`   ${index + 1}. ${comic.title}`);
        console.log(`      - Description: ${comic.description ? 'Yes' : 'No'} (${comic.description?.length || 0} chars)`);
        console.log(`      - Authors: ${comic.authors?.length || 0}`);
        console.log(`      - Tags: ${comic.tags?.length || 0}`);
        console.log(`      - Chapters: ${comic.chapters?.length || 0}`);
        console.log(`      - Cover: ${comic.cover ? 'Yes' : 'No'}`);
      });
      
      // Test individual comic endpoint if we have comics
      if (comicsData.comics.length > 0) {
        const firstComic = comicsData.comics[0];
        console.log(`\n📖 Testing /api/comics/${firstComic.id} endpoint...`);
        
        const comicResponse = await fetch(`http://localhost:3000/api/comics/${firstComic.id}`);
        
        if (comicResponse.ok) {
          const comicData = await comicResponse.json();
          console.log(`✅ Individual comic endpoint working!`);
          console.log(`   - Title: ${comicData.comic.title}`);
          console.log(`   - Description: ${comicData.comic.description ? 'Yes' : 'No'}`);
          console.log(`   - Authors: ${comicData.comic.authors?.length || 0}`);
          console.log(`   - Tags: ${comicData.comic.tags?.length || 0}`);
          console.log(`   - Chapters: ${comicData.comic.chapters?.length || 0}`);
        } else {
          console.log(`❌ Individual comic endpoint failed: ${comicResponse.status}`);
        }
      }
      
    } else {
      console.log(`❌ Comics endpoint failed: ${comicsResponse.status}`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing API endpoints: ${error.message}`);
  }
}

// Wait a moment for the server to start, then test
setTimeout(() => {
  testAPIEndpoints();
}, 5000);
