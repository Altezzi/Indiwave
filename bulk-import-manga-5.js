const mangaList = [
  { title: "Love Hina", description: "A boy accidentally becomes the manager of an all-girls dormitory", author: "Ken Akamatsu", artist: "Ken Akamatsu", publisher: "Kodansha" },
  { title: "Negima! Magister Negi Magi", description: "A ten-year-old wizard becomes a teacher at an all-girls school", author: "Ken Akamatsu", artist: "Ken Akamatsu", publisher: "Kodansha" },
  { title: "UQ Holder!", description: "The sequel to Negima featuring immortal warriors", author: "Ken Akamatsu", artist: "Ken Akamatsu", publisher: "Kodansha" },
  { title: "Ranma 1/2", description: "A boy who turns into a girl when splashed with cold water", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan" },
  { title: "Inuyasha", description: "A girl travels back in time and meets a half-demon", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan" },
  { title: "Maison Ikkoku", description: "A college student falls in love with his landlady", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan" },
  { title: "Urusei Yatsura", description: "An alien girl comes to Earth and causes chaos", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan" },
  { title: "Rin-ne", description: "A girl who can see ghosts meets a shinigami", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan" },
  { title: "Yu Yu Hakusho", description: "A delinquent becomes a Spirit Detective after dying", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Level E", description: "Aliens living on Earth cause various problems", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha" },
  { title: "Rurouni Kenshin", description: "A former assassin becomes a wandering swordsman", author: "Nobuhiro Watsuki", artist: "Nobuhiro Watsuki", publisher: "Shueisha" },
  { title: "Busou Renkin", description: "A boy becomes a warrior using alchemical weapons", author: "Nobuhiro Watsuki", artist: "Nobuhiro Watsuki", publisher: "Shueisha" },
  { title: "Slam Dunk", description: "A delinquent joins the basketball team to impress a girl", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  { title: "Vagabond", description: "The fictionalized life of legendary swordsman Miyamoto Musashi", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Real", description: "A story about wheelchair basketball and personal growth", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  { title: "City Hunter", description: "A private detective who specializes in protecting women", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha" },
  { title: "Cat's Eye", description: "Three sisters who are also art thieves", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha" },
  { title: "Angel Heart", description: "A sequel to City Hunter featuring a new protagonist", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha" },
  { title: "Hokuto no Ken", description: "A martial artist fights to save a post-apocalyptic world", author: "Tetsuo Hara", artist: "Buronson", publisher: "Shueisha" },
  { title: "Fist of the Blue Sky", description: "A prequel to Hokuto no Ken set in 1930s Shanghai", author: "Tetsuo Hara", artist: "Buronson", publisher: "Shueisha" },
  { title: "Saint Seiya", description: "Five warriors protect the goddess Athena", author: "Masami Kurumada", artist: "Masami Kurumada", publisher: "Shueisha" },
  { title: "Ring ni Kakero", description: "A young boxer fights to become the world champion", author: "Masami Kurumada", artist: "Masami Kurumada", publisher: "Shueisha" },
  { title: "B't X", description: "A boy searches for his kidnapped brother in a world of cyborgs", author: "Masami Kurumada", artist: "Masami Kurumada", publisher: "Shueisha" },
  { title: "Shaman King", description: "A boy competes in a tournament to become the Shaman King", author: "Hiroyuki Takei", artist: "Hiroyuki Takei", publisher: "Shueisha" },
  { title: "Ultimo", description: "Two dolls representing good and evil fight for supremacy", author: "Hiroyuki Takei", artist: "Stan Lee", publisher: "Shueisha" },
  { title: "Bakuman", description: "Two friends aim to become the best manga creators", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "All You Need Is Kill", description: "A soldier relives the same battle over and over", author: "Hiroshi Sakurazaka", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Ral Grad", description: "A boy with a demon inside him fights to control his power", author: "Tsuneo Takano", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Mx0", description: "A boy accidentally enrolls in a magic school", author: "Yasuhiro Kano", artist: "Yasuhiro Kano", publisher: "Shueisha" },
  { title: "Claymore", description: "Half-human, half-demon warriors fight monsters", author: "Norihiro Yagi", artist: "Norihiro Yagi", publisher: "Shueisha" }
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
