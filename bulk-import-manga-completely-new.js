const mangaList = [
  // Completely new series we definitely haven't added
  { title: "Blue Exorcist", description: "A boy discovers he's the son of Satan and becomes an exorcist", author: "Kazue Kato", artist: "Kazue Kato", publisher: "Shueisha" },
  { title: "Noragami", description: "A minor god tries to become famous", author: "Adachitoka", artist: "Adachitoka", publisher: "Kodansha" },
  { title: "The Seven Deadly Sins", description: "Knights fight to save their kingdom", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha" },
  { title: "Fairy Tail", description: "Guild wizards go on magical adventures", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha" },
  { title: "Rave Master", description: "A boy wields a sword to save the world", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha" },
  { title: "Soul Eater", description: "Students at a school for weapon meisters", author: "Atsushi Ohkubo", artist: "Atsushi Ohkubo", publisher: "Square Enix" },
  { title: "Fire Force", description: "Firefighters fight infernals and cultists", author: "Atsushi Ohkubo", artist: "Atsushi Ohkubo", publisher: "Kodansha" },
  { title: "Magi: The Labyrinth of Magic", description: "Arabian Nights inspired adventure", author: "Shinobu Ohtaka", artist: "Shinobu Ohtaka", publisher: "Shogakukan" },
  { title: "The Ancient Magus' Bride", description: "A girl becomes the apprentice of a mysterious mage", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden" },
  { title: "Witch Hat Atelier", description: "A girl discovers the world of magic through books", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha" },
  
  // More new series
  { title: "The Promised Neverland", description: "Orphaned children discover the dark truth about their home", author: "Kaiu Shirai", artist: "Posuka Demizu", publisher: "Shueisha" },
  { title: "Dr. Stone", description: "A scientist tries to rebuild civilization after petrification", author: "Riichiro Inagaki", artist: "Boichi", publisher: "Shueisha" },
  { title: "Tokyo Revengers", description: "A delinquent travels back in time to save his ex-girlfriend", author: "Ken Wakui", artist: "Ken Wakui", publisher: "Kodansha" },
  { title: "Jujutsu Kaisen", description: "Students fight cursed spirits in modern Japan", author: "Gege Akutami", artist: "Gege Akutami", publisher: "Shueisha" },
  { title: "Demon Slayer", description: "A boy becomes a demon slayer to save his sister", author: "Koyoharu Gotouge", artist: "Koyoharu Gotouge", publisher: "Shueisha" },
  { title: "My Hero Academia", description: "A powerless boy dreams of becoming a hero", author: "Kohei Horikoshi", artist: "Kohei Horikoshi", publisher: "Shueisha" },
  { title: "One Punch Man", description: "A hero who can defeat any opponent with one punch", author: "ONE", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Attack on Titan", description: "Humanity fights giant humanoid creatures", author: "Hajime Isayama", artist: "Hajime Isayama", publisher: "Kodansha" },
  { title: "Tokyo Ghoul", description: "A college student becomes a half-ghoul", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Shueisha" },
  { title: "Death Note", description: "A student finds a notebook that can kill anyone", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  
  // More new series
  { title: "Bakuman", description: "Two friends try to create manga", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Hikaru no Go", description: "A boy learns the ancient game of Go", author: "Yumi Hotta", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Rurouni Kenshin", description: "A former assassin seeks redemption in Meiji era Japan", author: "Nobuhiro Watsuki", artist: "Nobuhiro Watsuki", publisher: "Shueisha" },
  { title: "Yu Yu Hakusho", description: "A delinquent becomes a spirit detective", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Hunter x Hunter", description: "A boy searches for his father who is a legendary hunter", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Level E", description: "Aliens secretly live on Earth", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Yu-Gi-Oh!", description: "A boy plays dangerous games with ancient powers", author: "Kazuki Takahashi", artist: "Kazuki Takahashi", publisher: "Shueisha" },
  { title: "Dragon Ball", description: "A boy searches for magical balls with his friends", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha" },
  { title: "Dragon Ball Z", description: "Goku protects Earth from powerful enemies", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha" },
  { title: "Dragon Ball Super", description: "Goku faces even stronger enemies", author: "Akira Toriyama", artist: "Toyotarou", publisher: "Shueisha" },
  
  // More new series
  { title: "Naruto", description: "A ninja boy dreams of becoming the Hokage", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha" },
  { title: "Boruto: Naruto Next Generations", description: "Naruto's son continues the ninja legacy", author: "Masashi Kishimoto", artist: "Mikio Ikemoto", publisher: "Shueisha" },
  { title: "One Piece", description: "A pirate boy searches for the ultimate treasure", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha" },
  { title: "Bleach", description: "A teenager becomes a Soul Reaper", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Fullmetal Alchemist", description: "Two brothers use alchemy to find the Philosopher's Stone", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Square Enix" },
  { title: "Silver Spoon", description: "City boy attends agricultural school", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Shogakukan" },
  { title: "The Heroic Legend of Arslan", description: "A prince fights to reclaim his kingdom", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Kodansha" },
  { title: "Berserk", description: "A lone mercenary fights demons and his dark past", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Vagabond", description: "The life of legendary swordsman Miyamoto Musashi", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Slam Dunk", description: "A delinquent joins the basketball team", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  
  // More new series
  { title: "Real", description: "Wheelchair basketball and overcoming disabilities", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shogakukan" },
  { title: "Monster", description: "A doctor hunts a psychopathic patient", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "20th Century Boys", description: "Childhood friends face a cult conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Pluto", description: "A robot detective investigates robot murders", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Billy Bat", description: "A manga artist uncovers a conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Kodansha" },
  { title: "Master Keaton", description: "An archaeologist solves mysteries", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Vinland Saga", description: "Vikings in medieval Europe", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Planetes", description: "Space debris collectors in the near future", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Blame!", description: "A cyberpunk story in a vast megastructure", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Knights of Sidonia", description: "Humanity fights alien creatures from giant robots", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  
  // More new series
  { title: "Biomega", description: "Zombie apocalypse in a cyberpunk setting", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Dorohedoro", description: "A man with a lizard head searches for his identity", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dai Dark", description: "Space horror adventure", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Fire Punch", description: "A man who burns forever seeks revenge", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Look Back", description: "Two girls bond over manga creation", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Goodbye, Eri", description: "A boy makes movies about the people he loves", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Chainsaw Man", description: "A devil hunter with a chainsaw devil in his chest", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Spy x Family", description: "A spy, assassin, and telepath form a fake family", author: "Tatsuya Endo", artist: "Tatsuya Endo", publisher: "Shueisha" },
  { title: "Kaguya-sama: Love is War", description: "Student council president and vice president try to make each other confess", author: "Aka Akasaka", artist: "Aka Akasaka", publisher: "Shueisha" },
  { title: "Oshi no Ko", description: "A doctor is reincarnated as the son of an idol", author: "Aka Akasaka", artist: "Mengo Yokoyari", publisher: "Shueisha" }
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
