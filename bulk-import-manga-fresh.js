const mangaList = [
  // Indie/Underground manga
  { title: "Yokohama Kaidashi Kikou", description: "A peaceful post-apocalyptic slice of life about an android cafe owner", author: "Hitoshi Ashinano", artist: "Hitoshi Ashinano", publisher: "Kodansha" },
  { title: "Aria", description: "Gondoliers on Mars in a peaceful future setting", author: "Kozue Amano", artist: "Kozue Amano", publisher: "Enix" },
  { title: "Aqua", description: "The prequel to Aria about training to become an undine", author: "Kozue Amano", artist: "Kozue Amano", publisher: "Enix" },
  { title: "Blame!", description: "A cyberpunk story in a vast megastructure", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Knights of Sidonia", description: "Humanity fights alien creatures from giant robots", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Biomega", description: "Zombie apocalypse in a cyberpunk setting", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Planetes", description: "Space debris collectors in the near future", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Tekkonkinkreet", description: "Two street children protect their city from developers", author: "Taiyo Matsumoto", artist: "Taiyo Matsumoto", publisher: "Shogakukan" },
  { title: "Ping Pong", description: "Two friends compete in table tennis", author: "Taiyo Matsumoto", artist: "Taiyo Matsumoto", publisher: "Shogakukan" },
  { title: "Sunny", description: "Children in a group home in 1970s Japan", author: "Taiyo Matsumoto", artist: "Taiyo Matsumoto", publisher: "Shogakukan" },
  
  // Classic josei/shoujo
  { title: "Nana", description: "Two women named Nana navigate love and friendship in Tokyo", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shueisha" },
  { title: "Paradise Kiss", description: "A high school student becomes a model for fashion students", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shodensha" },
  { title: "Honey and Clover", description: "Art students navigate college and relationships", author: "Chica Umino", artist: "Chica Umino", publisher: "Shueisha" },
  { title: "March Comes in Like a Lion", description: "A young professional shogi player finds family", author: "Chica Umino", artist: "Chica Umino", publisher: "Hakusensha" },
  { title: "Nodame Cantabile", description: "Music students at a conservatory", author: "Tomoko Ninomiya", artist: "Tomoko Ninomiya", publisher: "Kodansha" },
  { title: "Skip Beat!", description: "A girl seeks revenge through the entertainment industry", author: "Yoshiki Nakamura", artist: "Yoshiki Nakamura", publisher: "Hakusensha" },
  { title: "Kimi ni Todoke", description: "A shy girl learns to make friends and find love", author: "Karuho Shiina", artist: "Karuho Shiina", publisher: "Shueisha" },
  { title: "Boys Over Flowers", description: "A poor girl attends an elite school", author: "Yoko Kamio", artist: "Yoko Kamio", publisher: "Shueisha" },
  { title: "Ouran High School Host Club", description: "A girl accidentally joins a host club", author: "Bisco Hatori", artist: "Bisco Hatori", publisher: "Hakusensha" },
  { title: "Fruits Basket", description: "A girl lives with a family cursed to turn into zodiac animals", author: "Natsuki Takaya", artist: "Natsuki Takaya", publisher: "Hakusensha" },
  
  // Horror/thriller
  { title: "Uzumaki", description: "A town becomes obsessed with spirals", author: "Junji Ito", artist: "Junji Ito", publisher: "Shogakukan" },
  { title: "Tomie", description: "A beautiful girl who drives people to madness", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama" },
  { title: "Gyo", description: "Fish with mechanical legs invade the land", author: "Junji Ito", artist: "Junji Ito", publisher: "Shogakukan" },
  { title: "Hellsing", description: "A vampire organization fights supernatural threats", author: "Kouta Hirano", artist: "Kouta Hirano", publisher: "Shonen Gahosha" },
  { title: "Drifters", description: "Historical figures fight in a fantasy world", author: "Kouta Hirano", artist: "Kouta Hirano", publisher: "Shonen Gahosha" },
  { title: "Claymore", description: "Half-demon warriors fight monsters", author: "Norihiro Yagi", artist: "Norihiro Yagi", publisher: "Shueisha" },
  { title: "Gantz", description: "People who die are forced to fight aliens", author: "Hiroya Oku", artist: "Hiroya Oku", publisher: "Shueisha" },
  { title: "Parasyte", description: "Alien parasites take over human hosts", author: "Hitoshi Iwaaki", artist: "Hitoshi Iwaaki", publisher: "Kodansha" },
  
  // Sports manga
  { title: "Real", description: "Wheelchair basketball and overcoming disabilities", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shogakukan" },
  { title: "Ashita no Joe", description: "A delinquent becomes a boxer", author: "Asao Takamori", artist: "Tetsuya Chiba", publisher: "Kodansha" }
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

