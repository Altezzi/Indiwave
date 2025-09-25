// Focus on main series that should definitely have covers
const seriesWithoutCovers = [
  "Astro Boy",
  "Attack on Titan", 
  "Bayonetta",
  "Berserk The Black Swordsman Arc",
  "Berserk The Conviction Arc", 
  "Berserk The Fantasia Arc",
  "Berserk The Golden Age Arc",
  "Berserk The Millennium Falcon Arc",
  "Bleach Can't Fear Your Own World",
  "Bleach DiamondDust Rebellion",
  "Bleach We Do Knot Always Love You",
  "Demon Slayer Rengoku",
  "Dragon Ball The Path to Power",
  "Dragon Ball Z Battle of Gods",
  "Fullmetal Alchemist The Conqueror of Shamballa",
  "Fullmetal Alchemist The First Attack", 
  "Fullmetal Alchemist The Promise Day",
  "Fullmetal Alchemist The Sacred Star of Milos",
  "Fullmetal Alchemist The Ties That Bind",
  "Hell's Paradise Jigokuraku",
  "Hunter x Hunter Kurapika's Memories",
  "Kiki's Delivery Service",
  "Metal Gear Solid",
  "My Neighbor Totoro",
  "Naruto Sakura's Story",
  "Niji-iro Togarashi",
  "One Piece Film Gold",
  "One Piece Red", 
  "One Piece Stampede",
  "One Punch Man Road to Hero",
  "Paprika",
  "Perfect Blue",
  "Ponyo",
  "Puni Puni Poemy",
  "RuriDragon",
  "Texhnolyze",
  "The Twelve Kingdoms",
  "Tokyo Ghoul Joker",
  "Vinland Saga Slave Arc"
];

async function searchAndUpdateCovers() {
  const baseUrl = 'http://localhost:3000/api/dexi/search-manga';
  
  for (const seriesName of seriesWithoutCovers) {
    try {
      console.log(`\n🔍 Searching for cover: ${seriesName}`);
      
      // Search for the series on MangaDex
      const searchResponse = await fetch(`${baseUrl}?title=${encodeURIComponent(seriesName)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!searchResponse.ok) {
        console.log(`❌ Search failed for ${seriesName}: ${searchResponse.statusText}`);
        continue;
      }
      
      const searchResult = await searchResponse.json();
      
      if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
        const manga = searchResult.data[0];
        console.log(`✅ Found: ${manga.title} (ID: ${manga.id})`);
        
        // Now try to download the cover
        try {
          const coverResponse = await fetch(`http://localhost:3000/api/dexi/update-covers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              seriesName: seriesName,
              mangaDexId: manga.id,
              action: 'download'
            })
          });
          
          const coverResult = await coverResponse.json();
          
          if (coverResult.success) {
            console.log(`🎨 ✅ Cover downloaded for ${seriesName}`);
          } else {
            console.log(`❌ Cover download failed for ${seriesName}: ${coverResult.error}`);
          }
          
        } catch (coverError) {
          console.log(`❌ Cover download error for ${seriesName}: ${coverError.message}`);
        }
        
      } else {
        console.log(`❌ No results found for ${seriesName}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }
}

searchAndUpdateCovers();

