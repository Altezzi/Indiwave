const mangaList = [
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
  { title: "Little Witch Academia", description: "A girl attends a school for witches", author: "Yoh Yoshinari", artist: "Yoh Yoshinari", publisher: "Kodansha" },
  { title: "The Misfit of Demon King Academy", description: "A demon king reincarnates and attends a school for demons", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa" },
  { title: "Children Who Chase Lost Voices", description: "A girl searches for a mysterious crystal in an underground world", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa" },
  { title: "The Boy and the Beast", description: "A boy is raised by a beast in a parallel world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Summer Wars", description: "A high school student helps save the world from a computer virus", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Wolf Children", description: "A woman raises her half-wolf children after their father's death", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Mirai", description: "A boy travels through time to meet his family members", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle", description: "A girl becomes a famous singer in a virtual world", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "The Garden of Words", description: "A high school student and an older woman meet in a garden", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second", description: "A story about distance and time in relationships", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days", description: "Three friends are separated by war and time", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "From Up on Poppy Hill", description: "High school students try to save their clubhouse", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises", description: "A young man dreams of designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya", description: "A bamboo cutter finds a tiny princess in a bamboo stalk", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies", description: "Two siblings struggle to survive during World War II", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday", description: "A woman reflects on her childhood during a trip to the countryside", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko", description: "Tanuki use their shape-shifting abilities to save their forest", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" }
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
