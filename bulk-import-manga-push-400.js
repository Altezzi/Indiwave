const mangaList = [
  // More unique series to get us to 400+
  { title: "Phantom Blood", description: "Jojo's Bizarre Adventure Part 1", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "JoJo's Bizarre Adventure", description: "The complete JoJo series", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha" },
  { title: "The World Ends with You", description: "A game adaptation about teens in Tokyo", author: "Tetsuya Nomura", artist: "Shiro Amano", publisher: "Square Enix" },
  { title: "Kingdom Hearts", description: "Disney and Final Fantasy crossover", author: "Tetsuya Nomura", artist: "Shiro Amano", publisher: "Square Enix" },
  { title: "Final Fantasy VII", description: "The classic RPG in manga form", author: "Tetsuya Nomura", artist: "Shiro Amano", publisher: "Square Enix" },
  { title: "Dragon Quest", description: "The classic RPG adventure", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Enix" },
  { title: "Chrono Trigger", description: "Time travel RPG adventure", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Enix" },
  { title: "Slayers", description: "A sorceress goes on comedic adventures", author: "Hajime Kanzaka", artist: "Rui Araizumi", publisher: "Fujimi Shobo" },
  { title: "The Twelve Kingdoms", description: "A girl is transported to a fantasy world", author: "Fuyumi Ono", artist: "Akihiro Yamada", publisher: "Kodansha" },
  { title: "Scrapped Princess", description: "A girl with a terrible fate", author: "Ichiro Sakaki", artist: "Nakayohi Mogudan", publisher: "Fujimi Shobo" },
  
  // More classic anime adaptations
  { title: "Neon Genesis Evangelion", description: "Teenagers pilot giant robots against angels", author: "Yoshiyuki Sadamoto", artist: "Yoshiyuki Sadamoto", publisher: "Kadokawa" },
  { title: "Cowboy Bebop", description: "Bounty hunters in space", author: "Yutaka Nanten", artist: "Cain Kuga", publisher: "Kadokawa" },
  { title: "Trigun", description: "A pacifist gunman with a huge bounty", author: "Yasuhiro Nightow", artist: "Yasuhiro Nightow", publisher: "Tokuma Shoten" },
  { title: "Outlaw Star", description: "Space pirates on the galactic leyline", author: "Takehiko Itou", artist: "Takehiko Itou", publisher: "Kadokawa" },
  { title: "Bubblegum Crisis", description: "Female mercenaries fight robots in future Tokyo", author: "Toshimichi Suzuki", artist: "Toshimichi Suzuki", publisher: "Kadokawa" },
  { title: "Patlabor", description: "Police use giant robots", author: "Masami Yuki", artist: "Masami Yuki", publisher: "Shogakukan" },
  { title: "Macross", description: "Space war and transforming robots", author: "Hikaru Ichijyo", artist: "Haruhiko Mikimoto", publisher: "Kadokawa" },
  { title: "Robotech", description: "Humans fight alien invaders with transforming mechs", author: "Carl Macek", artist: "Various", publisher: "Harmony Gold" },
  { title: "Gundam Wing", description: "Five mobile suit pilots fight for peace", author: "Yoshiyuki Tomino", artist: "Katsuyuki Sumisawa", publisher: "Kadokawa" },
  { title: "Mobile Suit Gundam", description: "The original giant robot war", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kadokawa" },
  
  // More unique genres
  { title: "Nausicaä of the Valley of the Wind", description: "A princess tries to prevent war in a post-apocalyptic world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Laputa: Castle in the Sky", description: "A girl with a magic crystal seeks a floating castle", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Porco Rosso", description: "A pig pilot in 1920s Italy", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Ponyo", description: "A goldfish wants to become human", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya", description: "A bamboo cutter finds a tiny princess in a bamboo stalk", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies", description: "Two siblings struggle to survive during World War II", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday", description: "A woman reflects on her childhood during a trip to the countryside", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko", description: "Tanuki use their shape-shifting abilities to save their forest", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas", description: "The daily life of an ordinary Japanese family", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty", description: "A tiny borrower girl befriends a human boy", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  
  // More unique series
  { title: "When Marnie Was There", description: "A girl discovers a mysterious connection to a ghost", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "The Boy and the Beast", description: "A boy is raised by a beast in a parallel world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars", description: "A high school student helps save the world from a computer virus", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Wolf Children", description: "A woman raises her half-wolf children after their father's death", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Mirai", description: "A boy travels through time to meet his family members", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle", description: "A girl becomes a famous singer in a virtual world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Children Who Chase Lost Voices", description: "A girl searches for a mysterious crystal in an underground world", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa" },
  { title: "The Garden of Words", description: "A high school student and an older woman meet in a garden", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second", description: "A story about distance and time in relationships", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days", description: "Three friends are separated by war and time", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" }
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
