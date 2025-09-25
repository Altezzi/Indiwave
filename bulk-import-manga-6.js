const mangaList = [
  { title: "Ace of Diamond", description: "A pitcher joins a prestigious baseball school", author: "Yuji Terajima", artist: "Yuji Terajima", publisher: "Kodansha" },
  { title: "Kuroko's Basketball", description: "A high school basketball team with extraordinary players", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha" },
  { title: "Eyeshield 21", description: "A weak boy becomes a star American football player", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Hajime no Ippo", description: "A shy boy becomes a professional boxer", author: "George Morikawa", artist: "George Morikawa", publisher: "Kodansha" },
  { title: "Prince of Tennis", description: "A tennis prodigy joins his school's tennis team", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha" },
  { title: "Captain Tsubasa", description: "A boy dreams of becoming the world's greatest soccer player", author: "Yoichi Takahashi", artist: "Yoichi Takahashi", publisher: "Shueisha" },
  { title: "Major", description: "A boy's journey from Little League to Major League Baseball", author: "Takuya Mitsuda", artist: "Takuya Mitsuda", publisher: "Shogakukan" },
  { title: "Touch", description: "Twin brothers compete in baseball and love", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Cross Game", description: "A boy and girl's relationship through baseball", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "H2", description: "Two childhood friends meet again in high school baseball", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Rough", description: "A swimming rivalry turns into romance", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Katsu!", description: "A boy becomes a boxer to impress a girl", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Q and A", description: "A detective solves mysteries using deductive reasoning", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Mix", description: "A sequel to Touch featuring the next generation", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Itsumo Kokoro ni Taiyō o!", description: "A story about family and personal growth", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Slow Step", description: "A girl's love triangle involving two baseball players", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Miyuki", description: "A girl's coming-of-age story", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Short Program", description: "A collection of short stories about youth and sports", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Niji-iro Togarashi", description: "A story about family and personal growth", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "Katsu!", description: "A boy becomes a boxer to impress a girl", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan" },
  { title: "The Prince of Tennis", description: "A tennis prodigy joins his school's tennis team", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha" },
  { title: "New Prince of Tennis", description: "The continuation of Prince of Tennis", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha" },
  { title: "The Prince of Tennis II", description: "The next generation of tennis players", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha" },
  { title: "Kuroko's Basketball: Extra Game", description: "A sequel to Kuroko's Basketball", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha" },
  { title: "Robot x Laserbeam", description: "A boy discovers his talent for golf", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha" },
  { title: "Ahiru no Sora", description: "A short boy joins his school's basketball team", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Real", description: "A story about wheelchair basketball and personal growth", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  { title: "Slam Dunk", description: "A delinquent joins the basketball team to impress a girl", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" },
  { title: "Vagabond", description: "The fictionalized life of legendary swordsman Miyamoto Musashi", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Kodansha" },
  { title: "Buzzer Beater", description: "A basketball manga set in space", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha" }
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
