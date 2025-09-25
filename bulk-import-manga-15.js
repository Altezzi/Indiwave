const mangaList = [
  { title: "PPPPPP", description: "A family of piano prodigies deals with their complex relationships", author: "Mapollo 3", artist: "Mapollo 3", publisher: "Shueisha" },
  { title: "High School Family", description: "A high school student lives with his parents who are also students", author: "Rensuke Oshikiri", artist: "Rensuke Oshikiri", publisher: "Shueisha" },
  { title: "Aliens Area", description: "A boy with alien powers fights other aliens", author: "Fusai Naba", artist: "Fusai Naba", publisher: "Shueisha" },
  { title: "The Last Saiyuki", description: "A boy becomes involved in a battle between heaven and earth", author: "Daijiro Nonoue", artist: "Daijiro Nonoue", publisher: "Shueisha" },
  { title: "MamaYuyu", description: "A hero and a demon king live together as mother and son", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Super Psychic Policeman Chojo", description: "A psychic policeman solves supernatural crimes", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Red Hood", description: "A young hunter protects a village from monsters", author: "Yamaguchi Yuki", artist: "Yamaguchi Yuki", publisher: "Shueisha" },
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
  { title: "Konosuba", description: "A NEET is reincarnated in a fantasy world with a useless goddess", author: "Natsume Akatsuki", artist: "Masahito Watari", publisher: "Kadokawa" },
  { title: "No Game No Life", description: "Siblings are transported to a world where everything is decided by games", author: "Yuu Kamiya", artist: "Yuu Kamiya", publisher: "Media Factory" },
  { title: "The Devil is a Part-Timer!", description: "The Devil King works at a fast food restaurant in modern Tokyo", author: "Satoshi Wagahara", artist: "Oniku", publisher: "ASCII Media Works" }
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
