const mangaList = [
  { title: "Nausicaä of the Valley of the Wind", description: "A princess tries to prevent war in a post-apocalyptic world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Girl Who Leapt Through Time", description: "A girl discovers she can leap through time", author: "Yasutaka Tsutsui", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "A Silent Voice", description: "A former bully tries to make amends with a deaf girl he bullied", author: "Yoshitoki Oima", artist: "Yoshitoki Oima", publisher: "Kodansha" },
  { title: "Orange", description: "A girl receives a letter from herself ten years in the future", author: "Ichigo Takano", artist: "Ichigo Takano", publisher: "Shogakukan" },
  { title: "Erased", description: "A man travels back in time to prevent a murder", author: "Kei Sanbe", artist: "Kei Sanbe", publisher: "Kadokawa" },
  { title: "Your Name", description: "Two teenagers swap bodies and try to find each other", author: "Makoto Shinkai", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Weathering with You", description: "A boy meets a girl who can control the weather", author: "Makoto Shinkai", artist: "Wataru Kubota", publisher: "Kadokawa" },
  { title: "Toradora!", description: "A small girl and a scary guy team up to help each other with their crushes", author: "Yuyuko Takemiya", artist: "Zekkyou", publisher: "ASCII Media Works" },
  { title: "Konosuba", description: "A NEET is reincarnated in a fantasy world with a useless goddess", author: "Natsume Akatsuki", artist: "Masahito Watari", publisher: "Kadokawa" },
  { title: "No Game No Life", description: "Siblings are transported to a world where everything is decided by games", author: "Yuu Kamiya", artist: "Yuu Kamiya", publisher: "Media Factory" },
  { title: "The Devil is a Part-Timer!", description: "The Devil King works at a fast food restaurant in modern Tokyo", author: "Satoshi Wagahara", artist: "Oniku", publisher: "ASCII Media Works" },
  { title: "Log Horizon", description: "Players trapped in an MMORPG work to build a new society", author: "Mamare Touno", artist: "Kazuhiro Hara", publisher: "Enterbrain" },
  { title: "Sword Art Online", description: "Players trapped in a VRMMORPG must clear the game to escape", author: "Reki Kawahara", artist: "abec", publisher: "ASCII Media Works" },
  { title: "Accel World", description: "A bullied boy discovers a virtual reality fighting game", author: "Reki Kawahara", artist: "Hima", publisher: "ASCII Media Works" },
  { title: "The Irregular at Magic High School", description: "A boy with no magic attends a magic high school", author: "Tsutomu Satou", artist: "Kana Ishida", publisher: "ASCII Media Works" },
  { title: "A Certain Scientific Railgun", description: "A girl with electric powers fights crime in Academy City", author: "Kazuma Kamachi", artist: "Motoi Fuyukawa", publisher: "ASCII Media Works" },
  { title: "A Certain Magical Index", description: "A boy with the power to negate magic lives in Academy City", author: "Kazuma Kamachi", artist: "Chuya Kogino", publisher: "ASCII Media Works" },
  { title: "A Certain Scientific Accelerator", description: "The strongest esper in Academy City faces new threats", author: "Kazuma Kamachi", artist: "Arata Yamaji", publisher: "ASCII Media Works" },
  { title: "The Melancholy of Haruhi Suzumiya", description: "A high school student discovers her classmates have supernatural powers", author: "Nagaru Tanigawa", artist: "Gaku Tsugano", publisher: "Kadokawa" },
  { title: "Lucky Star", description: "The daily life of high school girls who love anime and manga", author: "Kagami Yoshimizu", artist: "Kagami Yoshimizu", publisher: "Kadokawa" },
  { title: "Azumanga Daioh", description: "The daily life of high school girls and their teachers", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "MediaWorks" },
  { title: "Nichijou", description: "The surreal daily life of high school students", author: "Keiichi Arawi", artist: "Keiichi Arawi", publisher: "Kadokawa" },
  { title: "K-On!", description: "High school girls form a light music club", author: "Kakifly", artist: "Kakifly", publisher: "Houbunsha" },
  { title: "Hidamari Sketch", description: "Art students live together in an apartment complex", author: "Ume Aoki", artist: "Ume Aoki", publisher: "Houbunsha" },
  { title: "Working!!", description: "The daily life of employees at a family restaurant", author: "Karino Takatsu", artist: "Karino Takatsu", publisher: "Square Enix" },
  { title: "Servant x Service", description: "Government employees deal with their daily work and personal lives", author: "Karino Takatsu", artist: "Karino Takatsu", publisher: "Square Enix" },
  { title: "New Game!", description: "A girl starts working at a video game company", author: "Shoutarou Tokunou", artist: "Shoutarou Tokunou", publisher: "Houbunsha" },
  { title: "Gabriel DropOut", description: "Angels and demons attend high school on Earth", author: "Ukami", artist: "Ukami", publisher: "Houbunsha" },
  { title: "Kobayashi-san Chi no Maid Dragon", description: "A programmer's life changes when a dragon becomes her maid", author: "Coolkyousinnjya", artist: "Coolkyousinnjya", publisher: "Futabasha" }
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
