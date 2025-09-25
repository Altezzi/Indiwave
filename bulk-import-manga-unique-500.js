const mangaList = [
  // Completely unique series we definitely haven't added
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
  
  // More unique series
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
  
  // More unique series
  { title: "5 Centimeters Per Second", description: "A story about distance and time in relationships", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days", description: "Three friends are separated by war and time", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "From Up on Poppy Hill", description: "High school students try to save their clubhouse", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises", description: "A young man dreams of designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya", description: "A bamboo cutter finds a tiny princess in a bamboo stalk", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies", description: "Two siblings struggle to survive during World War II", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday", description: "A woman reflects on her childhood during a trip to the countryside", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko", description: "Tanuki use their shape-shifting abilities to save their forest", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas", description: "The daily life of an ordinary Japanese family", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty", description: "A tiny borrower girl befriends a human boy", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  
  // More unique series
  { title: "When Marnie Was There", description: "A girl discovers a mysterious connection to a ghost", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "Princess Mononoke", description: "A prince gets involved in a war between humans and forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away", description: "A girl enters a spirit world to save her parents", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle", description: "A girl cursed with old age seeks help from a wizard", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "My Neighbor Totoro", description: "Two sisters befriend forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service", description: "A young witch starts a delivery service", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky", description: "A girl with a magic crystal seeks a floating castle", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Cat Returns", description: "A girl saves a cat and enters a magical cat kingdom", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart", description: "A girl discovers her passion for writing", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Metropolis", description: "Robots and humans clash in a futuristic city", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  
  // More unique series
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
  
  // More unique series
  { title: "Akira", description: "Biker gangs and psychic powers in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha" },
  { title: "Nausicaä of the Valley of the Wind", description: "A princess tries to prevent war in a post-apocalyptic world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Girl Who Leapt Through Time", description: "A girl discovers she can leap through time", author: "Yasutaka Tsutsui", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "A Silent Voice", description: "A former bully tries to make amends with a deaf girl he bullied", author: "Yoshitoki Oima", artist: "Yoshitoki Oima", publisher: "Kodansha" },
  { title: "Orange", description: "A girl receives a letter from herself ten years in the future", author: "Ichigo Takano", artist: "Ichigo Takano", publisher: "Shogakukan" },
  { title: "Erased", description: "A man travels back in time to prevent a murder", author: "Kei Sanbe", artist: "Kei Sanbe", publisher: "Kadokawa" },
  { title: "Your Name", description: "Two teenagers swap bodies and try to find each other", author: "Makoto Shinkai", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Weathering with You", description: "A boy meets a girl who can control the weather", author: "Makoto Shinkai", artist: "Wataru Kubota", publisher: "Kadokawa" },
  { title: "Toradora!", description: "A small girl and a scary guy team up to help each other with their crushes", author: "Yuyuko Takemiya", artist: "Zekkyou", publisher: "ASCII Media Works" },
  { title: "Konosuba", description: "A NEET is reincarnated in a fantasy world with a useless goddess", author: "Natsume Akatsuki", artist: "Masahito Watari", publisher: "Kadokawa" }
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

