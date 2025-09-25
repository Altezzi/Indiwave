const mangaList = [
  { title: "Attack on Titan: Before the Fall", description: "The story of the first person to use vertical maneuvering equipment", author: "Ryo Suzukaze", artist: "Satoshi Shiki", publisher: "Kodansha" },
  { title: "Attack on Titan: No Regrets", description: "Levi's backstory before joining the Survey Corps", author: "Gun Snark", artist: "Hikaru Suruga", publisher: "Kodansha" },
  { title: "Attack on Titan: Lost Girls", description: "Side stories focusing on Annie and Mikasa", author: "Hiroshi Seko", artist: "Ryosuke Fuji", publisher: "Kodansha" },
  { title: "Naruto: The Seventh Hokage and the Scarlet Spring", description: "Naruto's son Boruto's early adventures", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha" },
  { title: "Naruto: Sasuke's Story", description: "Sasuke's journey after the Fourth Great Ninja War", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha" },
  { title: "Naruto: Sakura's Story", description: "Sakura's medical ninja training and adventures", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha" },
  { title: "One Piece: Ace's Story", description: "Portgas D. Ace's journey before joining the Whitebeard Pirates", author: "Eiichiro Oda", artist: "Boichi", publisher: "Shueisha" },
  { title: "One Piece: Law's Story", description: "Trafalgar Law's backstory and alliance with Luffy", author: "Eiichiro Oda", artist: "Tatsuya Hamazaki", publisher: "Shueisha" },
  { title: "Dragon Ball: The Path to Power", description: "A retelling of Goku's early adventures", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha" },
  { title: "Dragon Ball: Episode of Bardock", description: "Bardock's final moments and potential survival", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha" },
  { title: "Bleach: Can't Fear Your Own World", description: "Events after the Thousand-Year Blood War arc", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Bleach: We Do Knot Always Love You", description: "Ichigo and Orihime's wedding and aftermath", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha" },
  { title: "Demon Slayer: Rengoku", description: "Kyojuro Rengoku's backstory and training", author: "Koyoharu Gotouge", artist: "Koyoharu Gotouge", publisher: "Shueisha" },
  { title: "Demon Slayer: Tomioka Giyu", description: "Giyu Tomioka's backstory and relationship with Sabito", author: "Koyoharu Gotouge", artist: "Koyoharu Gotouge", publisher: "Shueisha" },
  { title: "My Hero Academia: Vigilantes", description: "The story of vigilantes in the My Hero Academia world", author: "Hideyuki Furuhashi", artist: "Betten Court", publisher: "Shueisha" },
  { title: "My Hero Academia: Team-Up Missions", description: "Crossovers and team-ups between various heroes", author: "Kohei Horikoshi", artist: "Yoco Akiyama", publisher: "Shueisha" },
  { title: "Jujutsu Kaisen: Tokyo Metropolitan Curse Technical School", description: "The story of Gojo and Geto's school days", author: "Gege Akutami", artist: "Gege Akutami", publisher: "Shueisha" },
  { title: "Chainsaw Man: Buddy Stories", description: "Side stories featuring various characters", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Spy x Family: Family Portrait", description: "Extra stories about the Forger family", author: "Tatsuya Endo", artist: "Tatsuya Endo", publisher: "Shueisha" },
  { title: "Tokyo Ghoul: Jack", description: "Kishou Arima's backstory as a young investigator", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Shueisha" },
  { title: "Tokyo Ghoul: Joker", description: "Hideyoshi Nagachika's perspective during Tokyo Ghoul", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Shueisha" },
  { title: "Death Note: L Change the World", description: "L's final days and his successor", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Death Note: Another Note", description: "A murder case investigated by L and Naomi Misora", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Fullmetal Alchemist: The Ties That Bind", description: "Side stories set in the Fullmetal Alchemist universe", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Square Enix" },
  { title: "Fullmetal Alchemist: The First Attack", description: "Ed and Al's early adventures as State Alchemists", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Square Enix" },
  { title: "Hunter x Hunter: Kurapika's Memories", description: "Kurapika's backstory and the Kurta Clan massacre", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "One Punch Man: Road to Hero", description: "Saitama's journey from salaryman to hero", author: "ONE", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Mob Psycho 100: Reigen", description: "Reigen's backstory and early days as a con artist", author: "ONE", artist: "ONE", publisher: "Shogakukan" },
  { title: "Vinland Saga: Slave Arc", description: "Thorfinn's time as a slave and his path to redemption", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha" },
  { title: "Berserk: The Golden Age Arc", description: "Guts' time with the Band of the Hawk", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha" }
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
