const mangaList = [
  // More unique series we definitely haven't added
  { title: "Chobits", description: "A student finds a personal computer in the shape of a girl", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "Cardcaptor Sakura", description: "A girl must capture magical cards", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "xxxHOLiC", description: "A boy works at a shop that grants wishes", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "Tsubasa: Reservoir Chronicle", description: "Dimensional travelers search for feathers", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "Magic Knight Rayearth", description: "Three girls are summoned to save a magical world", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "Angelic Layer", description: "Fighting dolls controlled by mental power", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha" },
  { title: "X/1999", description: "Psychic warriors fight for the fate of Earth", author: "CLAMP", artist: "CLAMP", publisher: "Kadokawa" },
  { title: "Tokyo Babylon", description: "An onmyoji protects Tokyo from supernatural threats", author: "CLAMP", artist: "CLAMP", publisher: "Shinshokan" },
  { title: "Legal Drug", description: "Two boys work at a pharmacy with supernatural cases", author: "CLAMP", artist: "CLAMP", publisher: "Kadokawa" },
  { title: "Wish", description: "An angel falls in love with a human", author: "CLAMP", artist: "CLAMP", publisher: "Kadokawa" },
  
  // Cooking manga
  { title: "Food Wars!", description: "Culinary school competition", author: "Yuto Tsukuda", artist: "Shun Saeki", publisher: "Shueisha" },
  { title: "Yakitate!! Japan", description: "A boy tries to create the perfect Japanese bread", author: "Takashi Hashiguchi", artist: "Takashi Hashiguchi", publisher: "Shogakukan" },
  { title: "Toriko", description: "Gourmet hunters search for rare ingredients", author: "Mitsutoshi Shimabukuro", artist: "Mitsutoshi Shimabukuro", publisher: "Shueisha" },
  { title: "Bartender", description: "A bartender helps customers with their problems", author: "Araki Joh", artist: "Kenji Nagatomo", publisher: "Shueisha" },
  { title: "Bambino!", description: "A cook works at an Italian restaurant", author: "Tetsuji Sekiya", artist: "Tetsuji Sekiya", publisher: "Shogakukan" },
  
  // Music manga
  { title: "Your Lie in April", description: "A pianist rediscovers music through a violinist", author: "Naoshi Arakawa", artist: "Naoshi Arakawa", publisher: "Kodansha" },
  { title: "Kids on the Slope", description: "Jazz music brings unlikely friends together", author: "Yuki Kodama", artist: "Yuki Kodama", publisher: "Shogakukan" },
  { title: "Nana", description: "Two women named Nana navigate love and friendship in Tokyo", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shueisha" },
  { title: "Detroit Metal City", description: "A pop musician becomes a death metal star", author: "Kiminori Wakasugi", artist: "Kiminori Wakasugi", publisher: "Hakusensha" },
  { title: "Shiori Experience", description: "A teacher's life changes when Jimi Hendrix's ghost possesses her", author: "Machida Kazuya", artist: "Osada Yui", publisher: "BigGangan" },
  
  // More recent hits
  { title: "Vinland Saga", description: "Vikings in medieval Europe", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Dr. Stone", description: "A scientist tries to rebuild civilization after petrification", author: "Riichiro Inagaki", artist: "Boichi", publisher: "Shueisha" },
  { title: "The Promised Neverland", description: "Orphaned children discover the dark truth about their home", author: "Kaiu Shirai", artist: "Posuka Demizu", publisher: "Shueisha" },
  { title: "Stone Ocean", description: "Jojo's Bizarre Adventure Part 6", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "Steel Ball Run", description: "Jojo's Bizarre Adventure Part 7", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "JoJolion", description: "Jojo's Bizarre Adventure Part 8", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "Golden Wind", description: "Jojo's Bizarre Adventure Part 5", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "Diamond is Unbreakable", description: "Jojo's Bizarre Adventure Part 4", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "Stardust Crusaders", description: "Jojo's Bizarre Adventure Part 3", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "Battle Tendency", description: "Jojo's Bizarre Adventure Part 2", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  
  // More classic series
  { title: "Rurouni Kenshin", description: "A former assassin seeks redemption in Meiji era Japan", author: "Nobuhiro Watsuki", artist: "Nobuhiro Watsuki", publisher: "Shueisha" },
  { title: "Yu Yu Hakusho", description: "A delinquent becomes a spirit detective", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Hunter x Hunter", description: "A boy searches for his father who is a legendary hunter", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Level E", description: "Aliens secretly live on Earth", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Yu-Gi-Oh!", description: "A boy plays dangerous games with ancient powers", author: "Kazuki Takahashi", artist: "Kazuki Takahashi", publisher: "Shueisha" },
  
  // Unique/experimental manga
  { title: "Dorohedoro", description: "A man with a lizard head searches for his identity", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dai Dark", description: "Space horror adventure", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Fire Punch", description: "A man who burns forever seeks revenge", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Look Back", description: "Two girls bond over manga creation", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Goodbye, Eri", description: "A boy makes movies about the people he loves", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" }
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

