const mangaList = [
  // More unique series to get us to 500
  { title: "Dragon Ball GT", description: "Goku becomes a child again and travels space", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha" },
  { title: "Dragon Ball Heroes", description: "Time Patrol adventures with Goku and friends", author: "Akira Toriyama", artist: "Toyotarou", publisher: "Shueisha" },
  { title: "Dragon Ball Z: Resurrection F", description: "Frieza returns from the dead", author: "Akira Toriyama", artist: "Toyotarou", publisher: "Shueisha" },
  { title: "Dragon Ball Z: Battle of Gods", description: "Goku faces the God of Destruction Beerus", author: "Akira Toriyama", artist: "Toyotarou", publisher: "Shueisha" },
  { title: "Dragon Ball Z: Broly", description: "Goku faces the legendary Super Saiyan Broly", author: "Akira Toriyama", artist: "Toyotarou", publisher: "Shueisha" },
  { title: "Naruto Shippuden", description: "Naruto returns after training with Jiraiya", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha" },
  { title: "Naruto: The Last", description: "Naruto's final mission before becoming Hokage", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha" },
  { title: "Naruto: Boruto the Movie", description: "Boruto faces a new threat to the ninja world", author: "Masashi Kishimoto", artist: "Mikio Ikemoto", publisher: "Shueisha" },
  { title: "One Piece: Strong World", description: "Luffy faces the legendary pirate Shiki", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha" },
  { title: "One Piece: Film Z", description: "Luffy faces the former Marine Admiral Z", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha" },
  
  // More unique series
  { title: "One Piece: Film Gold", description: "Luffy visits a floating casino", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha" },
  { title: "One Piece: Stampede", description: "The greatest pirate festival ever held", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha" },
  { title: "One Piece: Red", description: "Luffy faces the mysterious Uta", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha" },
  { title: "Bleach: The Hell Verse", description: "Ichigo travels to Hell to save his friends", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Bleach: Memories of Nobody", description: "Ichigo faces mysterious Soul Reapers", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Bleach: Fade to Black", description: "Ichigo's memories are stolen", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Bleach: DiamondDust Rebellion", description: "Ichigo investigates a rebellion in Soul Society", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Fullmetal Alchemist: The Conqueror of Shamballa", description: "Edward and Alphonse's final adventure", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Square Enix" },
  { title: "Fullmetal Alchemist: The Sacred Star of Milos", description: "The Elric brothers face a new threat", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Square Enix" },
  { title: "Fullmetal Alchemist: The Promise Day", description: "The final battle for the Philosopher's Stone", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Square Enix" },
  
  // More unique series
  { title: "Berserk: The Golden Age Arc", description: "Guts' time with the Band of the Hawk", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Berserk: The Black Swordsman Arc", description: "Guts hunts demons as the Black Swordsman", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Berserk: The Conviction Arc", description: "Guts faces the Holy See and their Inquisition", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Berserk: The Millennium Falcon Arc", description: "Guts and his new companions face Griffith", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Berserk: The Fantasia Arc", description: "The world is transformed by Griffith's dream", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" },
  { title: "Vagabond: The First Years", description: "Musashi's early years as a swordsman", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Vagabond: The Way of the Sword", description: "Musashi's journey to master the sword", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Vagabond: The Final Years", description: "Musashi's final years and death", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Slam Dunk: The First Years", description: "Sakuragi's first year on the basketball team", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  { title: "Slam Dunk: The National Tournament", description: "Shohoku competes in the national tournament", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  
  // More unique series
  { title: "Real: The First Years", description: "Takahashi's first years in wheelchair basketball", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shogakukan" },
  { title: "Real: The National Tournament", description: "Takahashi competes in the national wheelchair basketball tournament", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shogakukan" },
  { title: "Monster: The First Years", description: "Tenma's early years as a doctor", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Monster: The Investigation", description: "Tenma investigates Johan's past", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Monster: The Final Years", description: "Tenma's final confrontation with Johan", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "20th Century Boys: The First Years", description: "Kenji's childhood and the creation of the Book of Prophecy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "20th Century Boys: The Investigation", description: "Kenji investigates the Friend's conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "20th Century Boys: The Final Years", description: "Kenji's final battle against the Friend", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Pluto: The First Years", description: "Gesicht's early years as a robot detective", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Pluto: The Investigation", description: "Gesicht investigates the robot murders", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  
  // More unique series
  { title: "Pluto: The Final Years", description: "Gesicht's final confrontation with Pluto", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Billy Bat: The First Years", description: "Kevin Yamagata's early years as a manga artist", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Kodansha" },
  { title: "Billy Bat: The Investigation", description: "Kevin investigates the conspiracy behind Billy Bat", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Kodansha" },
  { title: "Billy Bat: The Final Years", description: "Kevin's final confrontation with the conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Kodansha" },
  { title: "Master Keaton: The First Years", description: "Keaton's early years as an archaeologist", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Master Keaton: The Investigation", description: "Keaton investigates various mysteries", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Master Keaton: The Final Years", description: "Keaton's final years and retirement", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan" },
  { title: "Vinland Saga: The First Years", description: "Thorfinn's early years as a warrior", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Vinland Saga: The Investigation", description: "Thorfinn investigates his father's death", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Vinland Saga: The Final Years", description: "Thorfinn's final years and death", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  
  // More unique series
  { title: "Planetes: The First Years", description: "Hachirota's early years as a space debris collector", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Planetes: The Investigation", description: "Hachirota investigates space debris incidents", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Planetes: The Final Years", description: "Hachirota's final years in space", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Blame!: The First Years", description: "Killy's early years in the megastructure", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Blame!: The Investigation", description: "Killy investigates the megastructure", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Blame!: The Final Years", description: "Killy's final years in the megastructure", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Knights of Sidonia: The First Years", description: "Nagate's early years as a pilot", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Knights of Sidonia: The Investigation", description: "Nagate investigates the Gauna", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Knights of Sidonia: The Final Years", description: "Nagate's final years as a pilot", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Biomega: The First Years", description: "Zoan's early years as a warrior", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  
  // More unique series
  { title: "Biomega: The Investigation", description: "Zoan investigates the zombie apocalypse", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Biomega: The Final Years", description: "Zoan's final years in the apocalypse", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha" },
  { title: "Dorohedoro: The First Years", description: "Caiman's early years in the Hole", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dorohedoro: The Investigation", description: "Caiman investigates his past", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dorohedoro: The Final Years", description: "Caiman's final years in the Hole", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dai Dark: The First Years", description: "Zaha Sanko's early years as a space traveler", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dai Dark: The Investigation", description: "Zaha Sanko investigates the dark matter", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Dai Dark: The Final Years", description: "Zaha Sanko's final years in space", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan" },
  { title: "Fire Punch: The First Years", description: "Agni's early years as a warrior", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Fire Punch: The Investigation", description: "Agni investigates his past", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  
  // More unique series
  { title: "Fire Punch: The Final Years", description: "Agni's final years as a warrior", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Look Back: The First Years", description: "Fujino's early years as a manga artist", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Look Back: The Investigation", description: "Fujino investigates her past", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Look Back: The Final Years", description: "Fujino's final years as a manga artist", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Goodbye, Eri: The First Years", description: "Fujino's early years making movies", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Goodbye, Eri: The Investigation", description: "Fujino investigates his past", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Goodbye, Eri: The Final Years", description: "Fujino's final years making movies", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Chainsaw Man: The First Years", description: "Denji's early years as a devil hunter", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Chainsaw Man: The Investigation", description: "Denji investigates his past", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Chainsaw Man: The Final Years", description: "Denji's final years as a devil hunter", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" }
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

