const mangaList = [
  { title: "Tokyo Revengers", description: "A delinquent travels back in time to save his ex-girlfriend", author: "Ken Wakui", artist: "Ken Wakui", publisher: "Kodansha" },
  { title: "Hell's Paradise: Jigokuraku", description: "A ninja sentenced to death seeks immortality on a mysterious island", author: "Yuji Kaku", artist: "Yuji Kaku", publisher: "Shueisha" },
  { title: "Mashle: Magic and Muscles", description: "A boy without magic uses pure muscle to compete in a magical school", author: "Hajime Komoto", artist: "Hajime Komoto", publisher: "Shueisha" },
  { title: "Undead Unluck", description: "A girl with unlucky powers teams up with an undead man", author: "Yoshifumi Tozuka", artist: "Yoshifumi Tozuka", publisher: "Shueisha" },
  { title: "Mission: Yozakura Family", description: "A boy marries into a family of spies", author: "Hitsuji Gondaira", artist: "Hitsuji Gondaira", publisher: "Shueisha" },
  { title: "The Elusive Samurai", description: "A young samurai uses his wits to survive in war-torn Japan", author: "Yusei Matsui", artist: "Yusei Matsui", publisher: "Shueisha" },
  { title: "Witch Watch", description: "A witch and a werewolf live together as roommates", author: "Kenta Shinohara", artist: "Kenta Shinohara", publisher: "Shueisha" },
  { title: "Ayakashi Triangle", description: "A boy becomes a girl and must protect his childhood friend", author: "Kentaro Yabuki", artist: "Kentaro Yabuki", publisher: "Shueisha" },
  { title: "Me & Roboco", description: "A boy befriends a housekeeping robot", author: "Shuhei Miyazaki", artist: "Shuhei Miyazaki", publisher: "Shueisha" },
  { title: "Sakamoto Days", description: "A former legendary hitman now runs a convenience store", author: "Yuto Suzuki", artist: "Yuto Suzuki", publisher: "Shueisha" },
  { title: "Blue Box", description: "A badminton player falls for a basketball player", author: "Kouji Miura", artist: "Kouji Miura", publisher: "Shueisha" },
  { title: "The Ichinose Family's Deadly Sins", description: "A family tries to rebuild their relationships after amnesia", author: "Taizan 5", artist: "Taizan 5", publisher: "Shueisha" },
  { title: "Fabricant 100", description: "A girl created by a mad scientist seeks her creator", author: "Daisuke Enoshima", artist: "Daisuke Enoshima", publisher: "Shueisha" },
  { title: "Cipher Academy", description: "Students compete in code-breaking competitions", author: "Nisio Isin", artist: "Yuji Iwahara", publisher: "Shueisha" },
  { title: "Tenmaku Cinema", description: "Students create movies to save their school", author: "Yuto Tsukuda", artist: "Shun Saeki", publisher: "Shueisha" },
  { title: "Do Retry", description: "A boxer returns to the ring after a long hiatus", author: "Kento Matsuura", artist: "Kento Matsuura", publisher: "Shueisha" },
  { title: "Kill Blue", description: "An assassin becomes a middle school student", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha" },
  { title: "Nue's Exorcist", description: "A boy with supernatural powers becomes an exorcist", author: "Kouta Kawae", artist: "Kouta Kawae", publisher: "Shueisha" },
  { title: "Two on Ice", description: "A figure skater and a hockey player team up", author: "Elck Itsumo", artist: "Elck Itsumo", publisher: "Shueisha" },
  { title: "Akane-banashi", description: "A girl pursues her dream of becoming a rakugo performer", author: "Yuki Suenaga", artist: "Takamasa Moue", publisher: "Shueisha" },
  { title: "Ginka & Glüna", description: "A girl searches for her missing friend in a magical world", author: "Shinpei Watanabe", artist: "Shinpei Watanabe", publisher: "Shueisha" },
  { title: "RuriDragon", description: "A girl discovers she's half-dragon", author: "Masaoki Shindou", artist: "Masaoki Shindou", publisher: "Shueisha" },
  { title: "PPPPPP", description: "A family of piano prodigies deals with their complex relationships", author: "Mapollo 3", artist: "Mapollo 3", publisher: "Shueisha" },
  { title: "High School Family", description: "A high school student lives with his parents who are also students", author: "Rensuke Oshikiri", artist: "Rensuke Oshikiri", publisher: "Shueisha" },
  { title: "Aliens Area", description: "A boy with alien powers fights other aliens", author: "Fusai Naba", artist: "Fusai Naba", publisher: "Shueisha" },
  { title: "The Last Saiyuki", description: "A boy becomes involved in a battle between heaven and earth", author: "Daijiro Nonoue", artist: "Daijiro Nonoue", publisher: "Shueisha" },
  { title: "MamaYuyu", description: "A hero and a demon king live together as mother and son", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Super Psychic Policeman Chojo", description: "A psychic policeman solves supernatural crimes", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Red Hood", description: "A young hunter protects a village from monsters", author: "Yamaguchi Yuki", artist: "Yamaguchi Yuki", publisher: "Shueisha" },
  { title: "Time Paradox Ghostwriter", description: "A manga artist travels back in time to steal ideas", author: "Kenji Ichima", artist: "Kenji Ichima", publisher: "Shueisha" }
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
