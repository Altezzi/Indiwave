const mangaList = [
  // More Diverse Genres
  { title: "How to Fight: The Investigation", description: "A weak boy investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "How to Fight: The Final Years", description: "A weak boy's final years learning to fight", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Blue Period", description: "A high school student discovers his passion for art", author: "Tsubasa Yamaguchi", artist: "Tsubasa Yamaguchi", publisher: "Kodansha" },
  { title: "Skip and Loafer", description: "A country girl moves to Tokyo for high school", author: "Misaki Takamatsu", artist: "Misaki Takamatsu", publisher: "Kodansha" },
  { title: "The Apothecary Diaries", description: "A young woman becomes a palace pharmacist and solves mysteries", author: "Natsu Hyuuga", artist: "Nekokurage", publisher: "Shogakukan" },
  { title: "Kusuriya no Hitorigoto", description: "A young woman becomes a palace pharmacist and solves mysteries", author: "Natsu Hyuuga", artist: "Nekokurage", publisher: "Shogakukan" },
  { title: "The Way of the Househusband", description: "A former yakuza becomes a househusband", author: "Kousuke Oono", artist: "Kousuke Oono", publisher: "Kodansha" },
  { title: "Gokushufudou", description: "A former yakuza becomes a househusband", author: "Kousuke Oono", artist: "Kousuke Oono", publisher: "Kodansha" },
  { title: "Call of the Night", description: "A boy meets a vampire girl and becomes a vampire", author: "Kotoyama", artist: "Kotoyama", publisher: "Shogakukan" },
  { title: "Yofukashi no Uta", description: "A boy meets a vampire girl and becomes a vampire", author: "Kotoyama", artist: "Kotoyama", publisher: "Shogakukan" },
  
  // More Diverse Content
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
  
  // More Diverse Content
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
  
  // More Diverse Content
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
  
  // More Diverse Content
  { title: "Time Paradox Ghostwriter", description: "A manga artist travels back in time to steal ideas", author: "Kenji Ichima", artist: "Kenji Ichima", publisher: "Shueisha" },
  { title: "Tokyo Revengers", description: "A delinquent travels back in time to save his ex-girlfriend", author: "Ken Wakui", artist: "Ken Wakui", publisher: "Kodansha" },
  { title: "Beelzebub", description: "A delinquent becomes the foster parent of the demon lord's son", author: "Ryuhei Tamura", artist: "Ryuhei Tamura", publisher: "Shueisha" },
  { title: "Sket Dance", description: "A school club that helps students with their problems", author: "Kenta Shinohara", artist: "Kenta Shinohara", publisher: "Shueisha" },
  { title: "Medaka Box", description: "A perfect student becomes student council president", author: "Nisio Isin", artist: "Akira Akatsuki", publisher: "Shueisha" },
  { title: "Platinum End", description: "A boy becomes a candidate to become the next god", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "To Love-Ru", description: "A boy's life changes when an alien princess crashes into his bathroom", author: "Saki Hasemi", artist: "Kentaro Yabuki", publisher: "Shueisha" },
  { title: "To Love-Ru Darkness", description: "The sequel to To Love-Ru with more mature themes", author: "Saki Hasemi", artist: "Kentaro Yabuki", publisher: "Shueisha" },
  { title: "Black Cat", description: "A former assassin becomes a sweeper", author: "Kentaro Yabuki", artist: "Kentaro Yabuki", publisher: "Shueisha" },
  { title: "World Trigger", description: "Earth is invaded by creatures from another dimension", author: "Daisuke Ashihara", artist: "Daisuke Ashihara", publisher: "Shueisha" },
  
  // More Diverse Content
  { title: "Seraph of the End", description: "Humanity fights vampires in a post-apocalyptic world", author: "Takaya Kagami", artist: "Yamato Yamamoto", publisher: "Shueisha" },
  { title: "Owari no Seraph", description: "A boy seeks revenge against vampires who killed his family", author: "Takaya Kagami", artist: "Yamato Yamamoto", publisher: "Shueisha" },
  { title: "The Promised Neverland", description: "Orphaned children discover the dark truth about their home", author: "Kaiu Shirai", artist: "Posuka Demizu", publisher: "Shueisha" },
  { title: "Dr. Stone", description: "A scientist tries to rebuild civilization after petrification", author: "Riichiro Inagaki", artist: "Boichi", publisher: "Shueisha" },
  { title: "One Punch Man", description: "A hero who can defeat any opponent with one punch", author: "ONE", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Mob Psycho 100", description: "A middle schooler with psychic powers", author: "ONE", artist: "ONE", publisher: "Shogakukan" },
  { title: "Re:Monster", description: "A man reincarnated as a goblin becomes stronger", author: "Kogitsune Kanekiru", artist: "Haruyoshi Kobayakawa", publisher: "AlphaPolis" },
  { title: "Overlord", description: "A gamer becomes trapped in his favorite game as an evil overlord", author: "Kugane Maruyama", artist: "Satoshi Oshio", publisher: "Kadokawa" },
  { title: "That Time I Got Reincarnated as a Slime", description: "A man reincarnated as a slime builds a monster nation", author: "Fuse", artist: "Taiki Kawakami", publisher: "Kodansha" },
  { title: "The Rising of the Shield Hero", description: "A gamer is transported to another world as the Shield Hero", author: "Aneko Yusagi", artist: "Minami Seira", publisher: "Kadokawa" },
  
  // More Diverse Content
  { title: "Konosuba", description: "A NEET is reincarnated in a fantasy world with a useless goddess", author: "Natsume Akatsuki", artist: "Masahito Watari", publisher: "Kadokawa" },
  { title: "No Game No Life", description: "Siblings are transported to a world where everything is decided by games", author: "Yuu Kamiya", artist: "Yuu Kamiya", publisher: "Media Factory" },
  { title: "The Devil is a Part-Timer!", description: "The Devil King works at a fast food restaurant in modern Tokyo", author: "Satoshi Wagahara", artist: "Oniku", publisher: "ASCII Media Works" },
  { title: "Log Horizon", description: "Players trapped in an MMORPG work to build a new society", author: "Mamare Touno", artist: "Kazuhiro Hara", publisher: "Enterbrain" },
  { title: "Sword Art Online", description: "Players trapped in a VRMMORPG must clear the game to escape", author: "Reki Kawahara", artist: "abec", publisher: "ASCII Media Works" },
  { title: "Accel World", description: "A bullied boy discovers a virtual reality fighting game", author: "Reki Kawahara", artist: "Hima", publisher: "ASCII Media Works" },
  { title: "The Irregular at Magic High School", description: "A boy with no magic attends a magic high school", author: "Tsutomu Satou", artist: "Kana Ishida", publisher: "ASCII Media Works" },
  { title: "A Certain Scientific Railgun", description: "A girl with electric powers fights crime in Academy City", author: "Kazuma Kamachi", artist: "Motoi Fuyukawa", publisher: "ASCII Media Works" },
  { title: "A Certain Magical Index", description: "A boy with the power to negate magic lives in Academy City", author: "Kazuma Kamachi", artist: "Chuya Kogino", publisher: "ASCII Media Works" },
  { title: "A Certain Scientific Accelerator", description: "The strongest esper in Academy City faces new threats", author: "Kazuma Kamachi", artist: "Arata Yamaji", publisher: "ASCII Media Works" }
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

