const mangaList = [
  // More Unique Genres and Adult Content
  { title: "Mirai: The Final Years", description: "Kun's final years with Mirai", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle: The First Years", description: "Suzu's early years as Belle", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle: The Investigation", description: "Suzu investigates her past", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "Belle: The Final Years", description: "Suzu's final years as Belle", author: "Mamoru Hosoda", artist: "Mamoru Hosoda", publisher: "Kadokawa" },
  { title: "The Garden of Words: The First Years", description: "Takao's early years in the garden", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "The Garden of Words: The Investigation", description: "Takao investigates his past", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "The Garden of Words: The Final Years", description: "Takao's final years in the garden", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second: The First Years", description: "Toono's early years in love", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second: The Investigation", description: "Toono investigates his past", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  { title: "5 Centimeters Per Second: The Final Years", description: "Toono's final years in love", author: "Makoto Shinkai", artist: "Yukiko Seike", publisher: "Kadokawa" },
  
  // More Adult Content
  { title: "The Place Promised in Our Early Days: The First Years", description: "Hiroki's early years with the promise", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days: The Investigation", description: "Hiroki investigates his past", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "The Place Promised in Our Early Days: The Final Years", description: "Hiroki's final years with the promise", author: "Makoto Shinkai", artist: "Hitoshi Nishiya", publisher: "Kadokawa" },
  { title: "From Up on Poppy Hill: The First Years", description: "Umi's early years on Poppy Hill", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "From Up on Poppy Hill: The Investigation", description: "Umi investigates her past", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "From Up on Poppy Hill: The Final Years", description: "Umi's final years on Poppy Hill", author: "Chizuru Takahashi", artist: "Chizuru Takahashi", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises: The First Years", description: "Jiro's early years designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises: The Investigation", description: "Jiro investigates his past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Wind Rises: The Final Years", description: "Jiro's final years designing airplanes", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya: The First Years", description: "Kaguya's early years as a princess", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  
  // More Adult Content
  { title: "The Tale of Princess Kaguya: The Investigation", description: "Kaguya investigates her past", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Tale of Princess Kaguya: The Final Years", description: "Kaguya's final years as a princess", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies: The First Years", description: "Seita's early years with his sister", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies: The Investigation", description: "Seita investigates his past", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Grave of the Fireflies: The Final Years", description: "Seita's final years with his sister", author: "Akiyuki Nosaka", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday: The First Years", description: "Taeko's early years reflecting on her childhood", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday: The Investigation", description: "Taeko investigates her past", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Only Yesterday: The Final Years", description: "Taeko's final years reflecting on her childhood", author: "Hotaru Okamoto", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko: The First Years", description: "Tanuki's early years using shape-shifting abilities", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "Pom Poko: The Investigation", description: "Tanuki investigates their past", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  
  // More Adult Content
  { title: "Pom Poko: The Final Years", description: "Tanuki's final years using shape-shifting abilities", author: "Isao Takahata", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas: The First Years", description: "Yamada family's early years", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas: The Investigation", description: "Yamada family investigates their past", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "My Neighbors the Yamadas: The Final Years", description: "Yamada family's final years", author: "Hisaichi Ishii", artist: "Isao Takahata", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty: The First Years", description: "Arrietty's early years as a borrower", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty: The Investigation", description: "Arrietty investigates her past", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "The Secret World of Arrietty: The Final Years", description: "Arrietty's final years as a borrower", author: "Mary Norton", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There: The First Years", description: "Anna's early years with Marnie", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There: The Investigation", description: "Anna investigates her past", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  { title: "When Marnie Was There: The Final Years", description: "Anna's final years with Marnie", author: "Joan G. Robinson", artist: "Hiromasa Yonebayashi", publisher: "Tokuma Shoten" },
  
  // More Adult Content
  { title: "Princess Mononoke: The First Years", description: "Ashitaka's early years as a prince", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Princess Mononoke: The Investigation", description: "Ashitaka investigates his past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Princess Mononoke: The Final Years", description: "Ashitaka's final years as a prince", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away: The First Years", description: "Chihiro's early years in the spirit world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away: The Investigation", description: "Chihiro investigates her past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Spirited Away: The Final Years", description: "Chihiro's final years in the spirit world", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle: The First Years", description: "Sophie's early years with Howl", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle: The Investigation", description: "Sophie investigates her past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Howl's Moving Castle: The Final Years", description: "Sophie's final years with Howl", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "My Neighbor Totoro: The First Years", description: "Satsuki's early years with Totoro", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  
  // More Adult Content
  { title: "My Neighbor Totoro: The Investigation", description: "Satsuki investigates her past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "My Neighbor Totoro: The Final Years", description: "Satsuki's final years with Totoro", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service: The First Years", description: "Kiki's early years as a witch", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service: The Investigation", description: "Kiki investigates her past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Kiki's Delivery Service: The Final Years", description: "Kiki's final years as a witch", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky: The First Years", description: "Sheeta's early years with the crystal", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky: The Investigation", description: "Sheeta investigates her past", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "Castle in the Sky: The Final Years", description: "Sheeta's final years with the crystal", author: "Hayao Miyazaki", artist: "Hayao Miyazaki", publisher: "Tokuma Shoten" },
  { title: "The Cat Returns: The First Years", description: "Haru's early years with the cats", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "The Cat Returns: The Investigation", description: "Haru investigates her past", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  
  // More Adult Content
  { title: "The Cat Returns: The Final Years", description: "Haru's final years with the cats", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart: The First Years", description: "Shizuku's early years writing", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart: The Investigation", description: "Shizuku investigates her past", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Whisper of the Heart: The Final Years", description: "Shizuku's final years writing", author: "Aoi Hiiragi", artist: "Aoi Hiiragi", publisher: "Tokuma Shoten" },
  { title: "Metropolis: The First Years", description: "Robots' early years in the city", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Metropolis: The Investigation", description: "Robots investigate their past", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Metropolis: The Final Years", description: "Robots' final years in the city", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" },
  { title: "Kimba the White Lion: The First Years", description: "Kimba's early years as a cub", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Mushi Production" },
  { title: "Kimba the White Lion: The Investigation", description: "Kimba investigates his past", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Mushi Production" },
  { title: "Kimba the White Lion: The Final Years", description: "Kimba's final years as a cub", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Mushi Production" },
  
  // More Adult Content
  { title: "Lupin III: The First Years", description: "Lupin's early years as a thief", author: "Monkey Punch", artist: "Monkey Punch", publisher: "Futabasha" },
  { title: "Lupin III: The Investigation", description: "Lupin investigates his past", author: "Monkey Punch", artist: "Monkey Punch", publisher: "Futabasha" },
  { title: "Lupin III: The Final Years", description: "Lupin's final years as a thief", author: "Monkey Punch", artist: "Monkey Punch", publisher: "Futabasha" },
  { title: "Detective Conan: The First Years", description: "Conan's early years as a detective", author: "Gosho Aoyama", artist: "Gosho Aoyama", publisher: "Shogakukan" },
  { title: "Detective Conan: The Investigation", description: "Conan investigates his past", author: "Gosho Aoyama", artist: "Gosho Aoyama", publisher: "Shogakukan" },
  { title: "Detective Conan: The Final Years", description: "Conan's final years as a detective", author: "Gosho Aoyama", artist: "Gosho Aoyama", publisher: "Shogakukan" },
  { title: "Doraemon: The First Years", description: "Doraemon's early years with Nobita", author: "Fujiko F. Fujio", artist: "Fujiko F. Fujio", publisher: "Shogakukan" },
  { title: "Doraemon: The Investigation", description: "Doraemon investigates his past", author: "Fujiko F. Fujio", artist: "Fujiko F. Fujio", publisher: "Shogakukan" },
  { title: "Doraemon: The Final Years", description: "Doraemon's final years with Nobita", author: "Fujiko F. Fujio", artist: "Fujiko F. Fujio", publisher: "Shogakukan" },
  { title: "Astro Boy: The First Years", description: "Astro's early years as a robot", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kobunsha" }
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

