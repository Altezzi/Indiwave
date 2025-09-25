const mangaList = [
  { title: "Blue Period", description: "A high school student discovers his passion for art", author: "Tsubasa Yamaguchi", artist: "Tsubasa Yamaguchi", publisher: "Kodansha" },
  { title: "Skip and Loafer", description: "A country girl moves to Tokyo for high school", author: "Misaki Takamatsu", artist: "Misaki Takamatsu", publisher: "Kodansha" },
  { title: "The Apothecary Diaries", description: "A young woman becomes a palace pharmacist and solves mysteries", author: "Natsu Hyuuga", artist: "Nekokurage", publisher: "Shogakukan" },
  { title: "Kusuriya no Hitorigoto", description: "A young woman becomes a palace pharmacist and solves mysteries", author: "Natsu Hyuuga", artist: "Nekokurage", publisher: "Shogakukan" },
  { title: "The Way of the Househusband", description: "A former yakuza becomes a househusband", author: "Kousuke Oono", artist: "Kousuke Oono", publisher: "Kodansha" },
  { title: "Gokushufudou", description: "A former yakuza becomes a househusband", author: "Kousuke Oono", artist: "Kousuke Oono", publisher: "Kodansha" },
  { title: "Call of the Night", description: "A boy meets a vampire girl and becomes a vampire", author: "Kotoyama", artist: "Kotoyama", publisher: "Shogakukan" },
  { title: "Yofukashi no Uta", description: "A boy meets a vampire girl and becomes a vampire", author: "Kotoyama", artist: "Kotoyama", publisher: "Shogakukan" },
  { title: "Dandadan", description: "A boy and girl hunt supernatural creatures", author: "Yukinobu Tatsu", artist: "Yukinobu Tatsu", publisher: "Shueisha" },
  { title: "Kaiju No. 8", description: "A man gains the power to transform into a kaiju", author: "Naoya Matsumoto", artist: "Naoya Matsumoto", publisher: "Shueisha" },
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
  { title: "RuriDragon", description: "A girl discovers she's half-dragon", author: "Masaoki Shindou", artist: "Masaoki Shindou", publisher: "Shueisha" }
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

