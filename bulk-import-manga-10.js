const mangaList = [
  { title: "From Up on Poppy Hill", description: "High school students try to save their clubhouse", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises", description: "A young man dreams of designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya", description: "A bamboo cutter finds a tiny princess in a bamboo stalk", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies", description: "Two siblings struggle to survive during World War II", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday", description: "A woman reflects on her childhood during a trip to the countryside", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko", description: "Tanuki use their shape-shifting abilities to save their forest", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas", description: "The daily life of an ordinary Japanese family", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty", description: "A tiny borrower girl befriends a human boy", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There", description: "A girl discovers a mysterious connection to a ghost", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "The Boy and the Beast", description: "A boy is raised by a beast in a parallel world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars", description: "A high school student helps save the world from a computer virus", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "The Girl Who Leapt Through Time", description: "A girl discovers she can leap through time", author: "Yasutaka Tsutsui", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Wolf Children", description: "A woman raises her half-wolf children after their father's death", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Mirai", description: "A boy travels through time to meet his family members", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle", description: "A girl becomes a famous singer in a virtual world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Your Name", description: "Two teenagers swap bodies and try to find each other", author: "Makoto Shinkai", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Weathering with You", description: "A boy meets a girl who can control the weather", author: "Makoto Shinkai", artist: "Wataru Kubota", publisher: "Kadokawa" },
  { title: "The Garden of Words", description: "A high school student and an older woman meet in a garden", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second", description: "A story about distance and time in relationships", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days", description: "Three friends are separated by war and time", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "Children Who Chase Lost Voices", description: "A girl searches for a mysterious crystal in an underground world", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa" },
  { title: "The Secret World of Arrietty", description: "A tiny borrower girl befriends a human boy", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There", description: "A girl discovers a mysterious connection to a ghost", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "The Boy and the Beast", description: "A boy is raised by a beast in a parallel world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars", description: "A high school student helps save the world from a computer virus", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "The Girl Who Leapt Through Time", description: "A girl discovers she can leap through time", author: "Yasutaka Tsutsui", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Wolf Children", description: "A woman raises her half-wolf children after their father's death", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Mirai", description: "A boy travels through time to meet his family members", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle", description: "A girl becomes a famous singer in a virtual world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "A Silent Voice", description: "A former bully tries to make amends with a deaf girl he bullied", author: "Yoshitoki Oima", artist: "Yoshitoki Oima", publisher: "Kodansha" }
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
