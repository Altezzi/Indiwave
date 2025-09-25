const mangaList = [
  { title: "Bakuman", description: "Two friends aim to become the best manga creators", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Food Wars!", description: "A young chef enters an elite culinary school", author: "Yuto Tsukuda", artist: "Shun Saeki", publisher: "Shueisha" },
  { title: "The Seven Deadly Sins", description: "Knights with the power of deadly sins fight demons", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha" },
  { title: "Fairy Tail: 100 Years Quest", description: "The continuation of Fairy Tail's adventures", author: "Hiro Mashima", artist: "Atsuo Ueda", publisher: "Kodansha" },
  { title: "Boruto: Naruto Next Generations", description: "Naruto's son faces new challenges as a ninja", author: "Masashi Kishimoto", artist: "Mikio Ikemoto", publisher: "Shueisha" },
  { title: "Dragon Ball Super", description: "Goku faces new threats to the universe", author: "Akira Toriyama", artist: "Toyotaro", publisher: "Shueisha" },
  { title: "Pokemon Adventures", description: "The adventures of Pokemon trainers in the Pokemon world", author: "Hidenori Kusaka", artist: "Satoshi Yamamoto", publisher: "Shogakukan" },
  { title: "Yu-Gi-Oh!", description: "A boy solves ancient puzzles and duels with cards", author: "Kazuki Takahashi", artist: "Kazuki Takahashi", publisher: "Shueisha" },
  { title: "Beyblade", description: "Kids battle with spinning tops called Beyblades", author: "Takao Aoki", artist: "Takao Aoki", publisher: "Shogakukan" },
  { title: "Digimon Adventure", description: "Kids are transported to the Digital World", author: "Akiyoshi Hongo", artist: "Yabuno Tenya", publisher: "Toei Animation" },
  { title: "Cardcaptor Sakura", description: "A girl captures magical cards that escaped from a book", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "Sailor Moon", description: "A schoolgirl becomes a magical warrior", author: "Naoko Takeuchi", artist: "Naoko Takeuchi", publisher: "Kodansha" },
  { title: "Revolutionary Girl Utena", description: "A girl fights duels to become a prince", author: "Chiho Saito", artist: "Chiho Saito", publisher: "Shogakukan" },
  { title: "Princess Mononoke", description: "A prince gets involved in a war between humans and forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away", description: "A girl enters a spirit world to save her parents", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle", description: "A girl cursed with old age seeks help from a wizard", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "My Neighbor Totoro", description: "Two sisters befriend forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service", description: "A young witch starts a delivery service", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky", description: "A girl with a magic crystal seeks a floating castle", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Cat Returns", description: "A girl saves a cat and enters a magical cat kingdom", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart", description: "A girl discovers her passion for writing", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "From Up on Poppy Hill", description: "High school students try to save their clubhouse", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises", description: "A young man dreams of designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya", description: "A bamboo cutter finds a tiny princess in a bamboo stalk", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies", description: "Two siblings struggle to survive during World War II", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday", description: "A woman reflects on her childhood during a trip to the countryside", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko", description: "Tanuki use their shape-shifting abilities to save their forest", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas", description: "The daily life of an ordinary Japanese family", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty", description: "A tiny borrower girl befriends a human boy", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There", description: "A girl discovers a mysterious connection to a ghost", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" }
];

async function importManga() {
  const baseUrl = 'http://localhost:3000/api/dexi';
  
  for (const manga of mangaList) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...manga,
          autoSearchCovers: true
        })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Imported: ${manga.title}`);
      } else {
        console.log(`❌ Failed: ${manga.title} - ${result.error}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ Error importing ${manga.title}:`, error.message);
    }
  }
}

importManga();
