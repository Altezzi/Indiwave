const mangaList = [
  // More unique series to push us higher
  { title: "The Legend of Zelda", description: "The classic adventure game in manga form", author: "Shigeru Miyamoto", artist: "Akira Himekawa", publisher: "Shogakukan" },
  { title: "The Legend of Zelda: Ocarina of Time", description: "Link's adventure through time", author: "Shigeru Miyamoto", artist: "Akira Himekawa", publisher: "Shogakukan" },
  { title: "The Legend of Zelda: Majora's Mask", description: "Link's adventure in Termina", author: "Shigeru Miyamoto", artist: "Akira Himekawa", publisher: "Shogakukan" },
  { title: "The Legend of Zelda: Twilight Princess", description: "Link transforms between human and wolf", author: "Shigeru Miyamoto", artist: "Akira Himekawa", publisher: "Shogakukan" },
  { title: "The Legend of Zelda: Wind Waker", description: "Link sails the Great Sea", author: "Shigeru Miyamoto", artist: "Akira Himekawa", publisher: "Shogakukan" },
  { title: "Super Mario", description: "The plumber's adventures in the Mushroom Kingdom", author: "Shigeru Miyamoto", artist: "Various", publisher: "Shogakukan" },
  { title: "Kirby", description: "A pink puffball's adventures", author: "Masahiro Sakurai", artist: "Various", publisher: "Shogakukan" },
  { title: "Metroid", description: "Bounty hunter Samus Aran's missions", author: "Gunpei Yokoi", artist: "Various", publisher: "Kodansha" },
  { title: "Donkey Kong", description: "The ape's adventures with his friends", author: "Shigeru Miyamoto", artist: "Various", publisher: "Shogakukan" },
  { title: "Pokemon Adventures", description: "Red's journey to become a Pokemon Master", author: "Satoshi Tajiri", artist: "Hidenori Kusaka", publisher: "Shogakukan" },
  
  // More unique anime/manga
  { title: "Serial Experiments Lain", description: "A girl discovers the wired world", author: "Yoshitoshi ABe", artist: "Yoshitoshi ABe", publisher: "Kadokawa" },
  { title: "Haibane Renmei", description: "Angels with wings in a mysterious town", author: "Yoshitoshi ABe", artist: "Yoshitoshi ABe", publisher: "Kadokawa" },
  { title: "Texhnolyze", description: "Cyberpunk story about body modification", author: "Yoshitoshi ABe", artist: "Yoshitoshi ABe", publisher: "Kadokawa" },
  { title: "NieR: Automata", description: "Androids fight for humanity", author: "Yoko Taro", artist: "Jun Eishima", publisher: "Square Enix" },
  { title: "Drakengard", description: "Dark fantasy about war and dragons", author: "Yoko Taro", artist: "Jun Eishima", publisher: "Square Enix" },
  { title: "Bayonetta", description: "A witch fights angels", author: "Hideki Kamiya", artist: "Various", publisher: "Sega" },
  { title: "Devil May Cry", description: "Demon hunter Dante's adventures", author: "Hideki Kamiya", artist: "Various", publisher: "Capcom" },
  { title: "Resident Evil", description: "Survival horror in a zombie apocalypse", author: "Shinji Mikami", artist: "Various", publisher: "Capcom" },
  { title: "Silent Hill", description: "Psychological horror in a foggy town", author: "Keiichiro Toyama", artist: "Various", publisher: "Konami" },
  { title: "Metal Gear Solid", description: "Tactical espionage action", author: "Hideo Kojima", artist: "Ashley Wood", publisher: "Konami" },
  
  // More unique series
  { title: "Kino's Journey", description: "A traveler visits different countries", author: "Keiichi Sigsawa", artist: "Kouhaku Kuroboshi", publisher: "ASCII Media Works" },
  { title: "The Melancholy of Haruhi Suzumiya", description: "A high school student discovers her classmates have supernatural powers", author: "Nagaru Tanigawa", artist: "Gaku Tsugano", publisher: "Kadokawa" },
  { title: "Lucky Star", description: "The daily life of high school girls who love anime and manga", author: "Kagami Yoshimizu", artist: "Kagami Yoshimizu", publisher: "Kadokawa" },
  { title: "Azumanga Daioh", description: "The daily life of high school girls and their teachers", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "MediaWorks" },
  { title: "Nichijou", description: "The surreal daily life of high school students", author: "Keiichi Arawi", artist: "Keiichi Arawi", publisher: "Kadokawa" },
  { title: "K-On!", description: "High school girls form a light music club", author: "Kakifly", artist: "Kakifly", publisher: "Houbunsha" },
  { title: "Hidamari Sketch", description: "Art students live together in an apartment complex", author: "Ume Aoki", artist: "Ume Aoki", publisher: "Houbunsha" },
  { title: "Working!!", description: "The daily life of employees at a family restaurant", author: "Karino Takatsu", artist: "Karino Takatsu", publisher: "Square Enix" },
  { title: "Servant x Service", description: "Government employees deal with their daily work and personal lives", author: "Karino Takatsu", artist: "Karino Takatsu", publisher: "Square Enix" },
  { title: "New Game!", description: "A girl starts working at a video game company", author: "Shoutarou Tokunou", artist: "Shoutarou Tokunou", publisher: "Houbunsha" },
  
  // More unique series
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
  
  // More unique series
  { title: "The Ancient Magus' Bride", description: "A girl becomes the apprentice of a mysterious mage", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "Mahoutsukai no Yome", description: "A girl becomes the bride of an ancient magus", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "Flying Witch", description: "A witch moves to the countryside to complete her training", author: "Chihiro Ishizuka", artist: "Chihiro Ishizuka", publisher: "Kodansha" },
  { title: "Witch Hat Atelier", description: "A girl discovers the world of magic through books", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha" },
  { title: "The Witch and the Beast", description: "A witch and a beast hunt down other witches", author: "Kousuke Satake", artist: "Kousuke Satake", publisher: "Kodansha" },
  { title: "Little Witch Academia", description: "A girl attends a school for witches", author: "Yoh Yoshinari", artist: "Yoh Yoshinari", publisher: "Kodansha" },
  { title: "The Misfit of Demon King Academy", description: "A demon king reincarnates and attends a school for demons", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa" }
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

