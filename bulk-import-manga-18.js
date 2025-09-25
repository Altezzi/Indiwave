const mangaList = [
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
  { title: "Akira", description: "Biker gangs and psychic powers in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha" },
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
