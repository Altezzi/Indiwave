const mangaList = [
  { title: "From Up on Poppy Hill", description: "High school students try to save their clubhouse", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises", description: "A young man dreams of designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya", description: "A bamboo cutter finds a tiny princess in a bamboo stalk", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies", description: "Two siblings struggle to survive during World War II", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday", description: "A woman reflects on her childhood during a trip to the countryside", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko", description: "Tanuki use their shape-shifting abilities to save their forest", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas", description: "The daily life of an ordinary Japanese family", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty", description: "A tiny borrower girl befriends a human boy", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There", description: "A girl discovers a mysterious connection to a ghost", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "Princess Mononoke", description: "A prince gets involved in a war between humans and forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away", description: "A girl enters a spirit world to save her parents", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle", description: "A girl cursed with old age seeks help from a wizard", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "My Neighbor Totoro", description: "Two sisters befriend forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service", description: "A young witch starts a delivery service", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky", description: "A girl with a magic crystal seeks a floating castle", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Cat Returns", description: "A girl saves a cat and enters a magical cat kingdom", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart", description: "A girl discovers her passion for writing", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Metropolis", description: "Robots and humans clash in a futuristic city", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Kimba the White Lion", description: "A white lion cub becomes king of the jungle", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Mushi Production" },
  { title: "Lupin III", description: "The adventures of the world's greatest thief", author: "Monkey Punch", artist: "Monkey Punch", publisher: "Futabasha" },
  { title: "Detective Conan", description: "A high school detective is turned into a child", author: "Gosho Aoyama", artist: "Gosho Aoyama", publisher: "Shogakukan" },
  { title: "Doraemon", description: "A robotic cat from the future helps a lazy boy", author: "Fujiko F. Fujio", artist: "Fujiko F. Fujio", publisher: "Shogakukan" },
  { title: "Astro Boy", description: "A powerful robot boy fights for justice", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Black Jack", description: "An unlicensed surgeon performs miraculous operations", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Akita Shoten" },
  { title: "Phoenix", description: "An epic spanning multiple time periods about immortality", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Perfect Blue", description: "A pop idol's life spirals into psychological horror", author: "Yoshikazu Takeuchi", artist: "Yoshikazu Takeuchi", publisher: "Kodansha" },
  { title: "Paprika", description: "Scientists use a device to enter people's dreams", author: "Yasutaka Tsutsui", artist: "Reiji Hagiwara", publisher: "Kodansha" },
  { title: "Ghost in the Shell", description: "Cyborg police officers fight cybercrime in future Japan", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha" },
  { title: "Akira", description: "Biker gangs and psychic powers in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha" }
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

