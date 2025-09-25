// Update covers for main series that should definitely have them
const mainSeries = [
  { title: "Attack on Titan", description: "Humanity fights giant humanoid creatures", author: "Hajime Isayama", artist: "Hajime Isayama", publisher: "Kodansha" },
  { title: "My Neighbor Totoro", description: "Two sisters befriend forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service", description: "A young witch starts a delivery service", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Ponyo", description: "A goldfish wants to become human", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Astro Boy", description: "A powerful robot boy fights for justice", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Hell's Paradise Jigokuraku", description: "A ninja sentenced to death seeks immortality on a mysterious island", author: "Yuji Kaku", artist: "Yuji Kaku", publisher: "Shueisha" },
  { title: "Texhnolyze", description: "Cyberpunk story about body modification", author: "Yoshitoshi ABe", artist: "Yoshitoshi ABe", publisher: "Kadokawa" },
  { title: "The Twelve Kingdoms", description: "A girl is transported to a fantasy world", author: "Fuyumi Ono", artist: "Akihiro Yamada", publisher: "Kodansha" },
  { title: "RuriDragon", description: "A girl discovers she's half-dragon", author: "Masaoki Shindou", artist: "Masaoki Shindou", publisher: "Shueisha" },
  { title: "Niji-iro Togarashi", description: "A colorful story about life", author: "Unknown", artist: "Unknown", publisher: "Unknown" }
];

async function updateCovers() {
  const baseUrl = 'http://localhost:3000/api/dexi';
  
  for (const manga of mainSeries) {
    try {
      console.log(`\n🔍 Updating cover for: ${manga.title}`);
      
      // Use the DEXI API to import with auto cover search
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...manga,
          autoSearchCovers: true,
          updateExisting: true // This should update existing series
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Updated: ${manga.title} - Cover: ${result.coverImage || 'Auto-searched'}`);
      } else {
        console.log(`❌ Failed: ${manga.title} - ${result.error}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error updating ${manga.title}:`, error.message);
    }
  }
}

updateCovers();

