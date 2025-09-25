// Focus on main series that should definitely have covers
const seriesWithoutCovers = [
  "Astro Boy",
  "Attack on Titan", 
  "Bayonetta",
  "Hell's Paradise Jigokuraku",
  "Kiki's Delivery Service",
  "Metal Gear Solid",
  "My Neighbor Totoro",
  "Niji-iro Togarashi",
  "Paprika",
  "Perfect Blue",
  "Ponyo",
  "Puni Puni Poemy",
  "RuriDragon",
  "Texhnolyze",
  "The Twelve Kingdoms",
  "Tokyo Ghoul Joker"
];

async function searchAndUpdateCovers() {
  const searchUrl = 'http://localhost:3000/api/dexi/search-manga';
  const updateUrl = 'http://localhost:3000/api/dexi/update-covers';
  
  for (const seriesName of seriesWithoutCovers) {
    try {
      console.log(`\n🔍 Searching for cover: ${seriesName}`);
      
      // Search for the series on MangaDex
      const searchResponse = await fetch(`${searchUrl}?q=${encodeURIComponent(seriesName)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!searchResponse.ok) {
        console.log(`❌ Search failed for ${seriesName}: ${searchResponse.statusText}`);
        continue;
      }
      
      const searchResult = await searchResponse.json();
      
      if (searchResult.success && searchResult.manga && searchResult.manga.length > 0) {
        const manga = searchResult.manga[0];
        console.log(`✅ Found: ${manga.title} (ID: ${manga.id})`);
        
        // Now try to download the cover using the DEXI API
        try {
          const coverResponse = await fetch(`http://localhost:3000/api/dexi`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: seriesName,
              description: `Cover update for ${seriesName}`,
              author: "Unknown",
              artist: "Unknown", 
              publisher: "Unknown",
              autoSearchCovers: true,
              updateExisting: true
            })
          });
          
          const coverResult = await coverResponse.json();
          
          if (coverResult.success) {
            console.log(`🎨 ✅ Cover updated for ${seriesName}`);
          } else {
            console.log(`❌ Cover update failed for ${seriesName}: ${coverResult.error}`);
          }
          
        } catch (coverError) {
          console.log(`❌ Cover update error for ${seriesName}: ${coverError.message}`);
        }
        
      } else {
        console.log(`❌ No results found for ${seriesName}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }
}

searchAndUpdateCovers();
