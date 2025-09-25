const mangaList = [
  // More unique manga series
  { title: "Banana Fish", description: "A gang leader uncovers a government conspiracy", author: "Akimi Yoshida", artist: "Akimi Yoshida", publisher: "Shogakukan" },
  { title: "Given", description: "High school boys form a band and find love", author: "Natsuki Kizu", artist: "Natsuki Kizu", publisher: "Shinshokan" },
  { title: "Yuri!!! on Ice", description: "Figure skating and romance", author: "Mitsuro Kubo", artist: "Tadashi Hiramatsu", publisher: "Kadokawa" },
  { title: "Free!", description: "High school swimming team", author: "Koji Oji", artist: "Futoshi Nishiya", publisher: "Kyoto Animation" },
  { title: "Haikyuu!!", description: "High school volleyball team", author: "Haruichi Furudate", artist: "Haruichi Furudate", publisher: "Shueisha" },
  { title: "Kuroko's Basketball", description: "High school basketball with special abilities", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha" },
  { title: "Prince of Tennis", description: "Middle school tennis prodigy", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha" },
  { title: "Eyeshield 21", description: "High school American football", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Hikaru no Go", description: "A boy learns the ancient game of Go", author: "Yumi Hotta", artist: "Takeshi Obata", publisher: "Shueisha" },
  { title: "Bakuman", description: "Two friends try to create manga", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha" },
  
  // More classic series
  { title: "Golgo 13", description: "Professional assassin takes on various jobs", author: "Takao Saito", artist: "Takao Saito", publisher: "Shogakukan" },
  { title: "Lone Wolf and Cub", description: "A ronin and his son seek vengeance", author: "Kazuo Koike", artist: "Goseki Kojima", publisher: "Futabasha" },
  { title: "Lady Snowblood", description: "A woman seeks revenge for her family", author: "Kazuo Koike", artist: "Kazuo Kamimura", publisher: "Futabasha" },
  { title: "Crying Freeman", description: "An artist becomes an assassin", author: "Kazuo Koike", artist: "Ryoichi Ikegami", publisher: "Shogakukan" },
  { title: "Mai the Psychic Girl", description: "A girl with psychic powers", author: "Kazuya Kudo", artist: "Ryoichi Ikegami", publisher: "Shogakukan" },
  
  // More horror/thriller
  { title: "Another", description: "Students face a deadly curse", author: "Yukito Ayatsuji", artist: "Hiro Kiyohara", publisher: "Kadokawa" },
  { title: "Higurashi When They Cry", description: "A village with a dark secret", author: "Ryukishi07", artist: "Karin Suzuragi", publisher: "Square Enix" },
  { title: "Umineko When They Cry", description: "Murder mystery on a secluded island", author: "Ryukishi07", artist: "Jiro Suzuki", publisher: "Square Enix" },
  { title: "Shiki", description: "Vampires invade a small village", author: "Fuyumi Ono", artist: "Ryu Fujisaki", publisher: "Shogakukan" },
  { title: "School Live!", description: "Schoolgirls survive a zombie apocalypse", author: "Norimitsu Kaihou", artist: "Sadoru Chiba", publisher: "Houbunsha" },
  
  // More slice of life/comedy
  { title: "Barakamon", description: "A calligrapher moves to a rural island", author: "Satsuki Yoshino", artist: "Satsuki Yoshino", publisher: "Square Enix" },
  { title: "Silver Spoon", description: "City boy attends agricultural school", author: "Hiromu Arakawa", artist: "Hiromu Arakawa", publisher: "Shogakukan" },
  { title: "Sweetness and Lightning", description: "Single father learns to cook for his daughter", author: "Gido Amagakure", artist: "Gido Amagakure", publisher: "Kodansha" },
  { title: "Flying Witch", description: "A witch moves to the countryside to complete her training", author: "Chihiro Ishizuka", artist: "Chihiro Ishizuka", publisher: "Kodansha" },
  { title: "Non Non Biyori", description: "Rural elementary school students", author: "Atto", artist: "Atto", publisher: "Kadokawa" },
  
  // More action/adventure
  { title: "Magi: The Labyrinth of Magic", description: "Arabian Nights inspired adventure", author: "Shinobu Ohtaka", artist: "Shinobu Ohtaka", publisher: "Shogakukan" },
  { title: "Seven Deadly Sins", description: "Knights fight to save their kingdom", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha" },
  { title: "Fairy Tail", description: "Guild wizards go on magical adventures", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha" },
  { title: "Rave Master", description: "A boy wields a sword to save the world", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha" },
  { title: "Soul Eater", description: "Students at a school for weapon meisters", author: "Atsushi Ohkubo", artist: "Atsushi Ohkubo", publisher: "Square Enix" }
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

