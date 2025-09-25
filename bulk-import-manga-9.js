const mangaList = [
  { title: "Your Name", description: "Two teenagers swap bodies and try to find each other", author: "Makoto Shinkai", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Weathering with You", description: "A boy meets a girl who can control the weather", author: "Makoto Shinkai", artist: "Wataru Kubota", publisher: "Kadokawa" },
  { title: "The Garden of Words", description: "A high school student and an older woman meet in a garden", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second", description: "A story about distance and time in relationships", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days", description: "Three friends are separated by war and time", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "A Silent Voice", description: "A former bully tries to make amends with a deaf girl he bullied", author: "Yoshitoki Oima", artist: "Yoshitoki Oima", publisher: "Kodansha" },
  { title: "Orange", description: "A girl receives a letter from herself ten years in the future", author: "Ichigo Takano", artist: "Ichigo Takano", publisher: "Shogakukan" },
  { title: "Erased", description: "A man travels back in time to prevent a murder", author: "Kei Sanbe", artist: "Kei Sanbe", publisher: "Kadokawa" },
  { title: "The Girl Who Leapt Through Time", description: "A girl discovers she can leap through time", author: "Yasutaka Tsutsui", artist: "Ranmaru Kotone", publisher: "Kadokawa" },
  { title: "Perfect Blue", description: "A pop idol's life spirals into psychological horror", author: "Yoshikazu Takeuchi", artist: "Yoshikazu Takeuchi", publisher: "Kodansha" },
  { title: "Paprika", description: "Scientists use a device to enter people's dreams", author: "Yasutaka Tsutsui", artist: "Reiji Hagiwara", publisher: "Kodansha" },
  { title: "Ghost in the Shell", description: "Cyborg police officers fight cybercrime in future Japan", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha" },
  { title: "Akira", description: "Biker gangs and psychic powers in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha" },
  { title: "Nausicaä of the Valley of the Wind", description: "A princess tries to prevent war in a post-apocalyptic world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Lupin III", description: "The adventures of the world's greatest thief", author: "Monkey Punch", artist: "Monkey Punch", publisher: "Futabasha" },
  { title: "Detective Conan", description: "A high school detective is turned into a child", author: "Gosho Aoyama", artist: "Gosho Aoyama", publisher: "Shogakukan" },
  { title: "Doraemon", description: "A robotic cat from the future helps a lazy boy", author: "Fujiko F. Fujio", artist: "Fujiko F. Fujio", publisher: "Shogakukan" },
  { title: "Astro Boy", description: "A powerful robot boy fights for justice", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Black Jack", description: "An unlicensed surgeon performs miraculous operations", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Akita Shoten" },
  { title: "Phoenix", description: "An epic spanning multiple time periods about immortality", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Metropolis", description: "Robots and humans clash in a futuristic city", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Kimba the White Lion", description: "A white lion cub becomes king of the jungle", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Mushi Production" },
  { title: "Princess Mononoke", description: "A prince gets involved in a war between humans and forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away", description: "A girl enters a spirit world to save her parents", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle", description: "A girl cursed with old age seeks help from a wizard", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "My Neighbor Totoro", description: "Two sisters befriend forest spirits", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service", description: "A young witch starts a delivery service", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky", description: "A girl with a magic crystal seeks a floating castle", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Cat Returns", description: "A girl saves a cat and enters a magical cat kingdom", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart", description: "A girl discovers her passion for writing", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" }
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
