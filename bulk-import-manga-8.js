const mangaList = [
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
  { title: "Kobayashi-san Chi no Maid Dragon", description: "A programmer's life changes when a dragon becomes her maid", author: "Coolkyousinnjya", artist: "Coolkyousinnjya", publisher: "Futabasha" },
  { title: "Miss Kobayashi's Dragon Maid", description: "A dragon becomes a maid for a human programmer", author: "Coolkyousinnjya", artist: "Coolkyousinnjya", publisher: "Futabasha" },
  { title: "Yuru Camp", description: "High school girls go camping and enjoy the outdoors", author: "Afro", artist: "Afro", publisher: "Houbunsha" },
  { title: "Laid-Back Camp", description: "Girls enjoy camping in the great outdoors", author: "Afro", artist: "Afro", publisher: "Houbunsha" },
  { title: "A Place Further Than the Universe", description: "High school girls travel to Antarctica", author: "Yorimoi", artist: "Yorimoi", publisher: "Kadokawa" },
  { title: "Girls' Last Tour", description: "Two girls travel through a post-apocalyptic world", author: "Tsukumizu", artist: "Tsukumizu", publisher: "Shinchosha" },
  { title: "Made in Abyss", description: "A girl explores a mysterious abyss in search of her mother", author: "Akihito Tsukushi", artist: "Akihito Tsukushi", publisher: "Takeshobo" },
  { title: "Land of the Lustrous", description: "Gem people fight against the Lunarians", author: "Haruko Ichikawa", artist: "Haruko Ichikawa", publisher: "Kodansha" },
  { title: "Houseki no Kuni", description: "Gem people fight against the Lunarians", author: "Haruko Ichikawa", artist: "Haruko Ichikawa", publisher: "Kodansha" },
  { title: "The Ancient Magus' Bride", description: "A girl becomes the apprentice of a mysterious mage", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "Mahoutsukai no Yome", description: "A girl becomes the bride of an ancient magus", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "Flying Witch", description: "A witch moves to the countryside to complete her training", author: "Chihiro Ishizuka", artist: "Chihiro Ishizuka", publisher: "Kodansha" },
  { title: "Witch Hat Atelier", description: "A girl discovers the world of magic through books", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha" },
  { title: "The Witch and the Beast", description: "A witch and a beast hunt down other witches", author: "Kousuke Satake", artist: "Kousuke Satake", publisher: "Kodansha" },
  { title: "Witch Watch", description: "A witch and a werewolf live together as roommates", author: "Kenta Shinohara", artist: "Kenta Shinohara", publisher: "Shueisha" },
  { title: "Little Witch Academia", description: "A girl attends a school for witches", author: "Yoh Yoshinari", artist: "Yoh Yoshinari", publisher: "Kodansha" },
  { title: "The Misfit of Demon King Academy", description: "A demon king reincarnates and attends a school for demons", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa" },
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
