const mangaList = [
  { title: "Gintama", description: "A samurai in an alternate history where aliens have taken over Japan", author: "Hideaki Sorachi", artist: "Hideaki Sorachi", publisher: "Shueisha" },
  { title: "Beelzebub", description: "A delinquent becomes the foster parent of the demon lord's son", author: "Ryuhei Tamura", artist: "Ryuhei Tamura", publisher: "Shueisha" },
  { title: "Sket Dance", description: "A school club that helps students with their problems", author: "Kenta Shinohara", artist: "Kenta Shinohara", publisher: "Shueisha" },
  { title: "Medaka Box", description: "A perfect student becomes student council president", author: "Nisio Isin", artist: "Akira Akatsuki", publisher: "Shueisha" },
  { title: "Bakuman", description: "Two friends aim to become the best manga creators", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Death Note", description: "A high school student finds a supernatural notebook", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Platinum End", description: "A boy becomes a candidate to become the next god", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Ayakashi Triangle", description: "A boy becomes a girl and must protect his childhood friend", author: "Kentaro Yabuki", artist: "Kentaro Yabuki", publisher: "Shueisha" },
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
  { title: "The Devil is a Part-Timer!", description: "The Devil King works at a fast food restaurant in modern Tokyo", author: "Satoshi Wagahara", artist: "Oniku", publisher: "ASCII Media Works" },
  { title: "Log Horizon", description: "Players trapped in an MMORPG work to build a new society", author: "Mamare Touno", artist: "Kazuhiro Hara", publisher: "Enterbrain" },
  { title: "Sword Art Online", description: "Players trapped in a VRMMORPG must clear the game to escape", author: "Reki Kawahara", artist: "abec", publisher: "ASCII Media Works" },
  { title: "Accel World", description: "A bullied boy discovers a virtual reality fighting game", author: "Reki Kawahara", artist: "Hima", publisher: "ASCII Media Works" },
  { title: "The Irregular at Magic High School", description: "A boy with no magic attends a magic high school", author: "Tsutomu Satou", artist: "Kana Ishida", publisher: "ASCII Media Works" },
  { title: "A Certain Scientific Railgun", description: "A girl with electric powers fights crime in Academy City", author: "Kazuma Kamachi", artist: "Motoi Fuyukawa", publisher: "ASCII Media Works" }
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

