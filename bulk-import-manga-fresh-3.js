const mangaList = [
  // Manhwa (Korean comics)
  { title: "Tower of God", description: "A boy climbs a mysterious tower to find his friend", author: "SIU", artist: "SIU", publisher: "Webtoon" },
  { title: "The God of High School", description: "High school students compete in a martial arts tournament", author: "Yongje Park", artist: "Yongje Park", publisher: "Webtoon" },
  { title: "Noblesse", description: "A powerful vampire awakens in modern times", author: "Jeho Son", artist: "Kwangsu Lee", publisher: "Webtoon" },
  { title: "Breaker", description: "A weak student learns martial arts", author: "Jeon Geuk-jin", artist: "Park Jin-hwan", publisher: "Daewon" },
  { title: "The Breaker: New Waves", description: "Continuation of The Breaker", author: "Jeon Geuk-jin", artist: "Park Jin-hwan", publisher: "Daewon" },
  { title: "Veritas", description: "A high school student learns about a martial arts school", author: "Yoon Joon-sik", artist: "Kim Dong-hoon", publisher: "Haksan" },
  { title: "Dice: The Cube That Changes Everything", description: "A dice app changes people's lives", author: "Yun Hyunseok", artist: "Yun Hyunseok", publisher: "Webtoon" },
  { title: "Lookism", description: "A boy can switch between two bodies", author: "Park Taejoon", artist: "Park Taejoon", publisher: "Webtoon" },
  { title: "Girls of the Wild's", description: "A boy attends an all-girls fighting school", author: "Hun", artist: "Zhena", publisher: "Naver" },
  { title: "Unordinary", description: "A powerless boy in a world of superpowers", author: "uru-chan", artist: "uru-chan", publisher: "Webtoon" },
  
  // Modern web manga/indie
  { title: "Mob Psycho 100", description: "A middle schooler with psychic powers", author: "ONE", artist: "ONE", publisher: "Shogakukan" },
  { title: "Spy x Family", description: "A spy, assassin, and telepath form a fake family", author: "Tatsuya Endo", artist: "Tatsuya Endo", publisher: "Shueisha" },
  { title: "Kaguya-sama: Love is War", description: "Student council president and vice president try to make each other confess", author: "Aka Akasaka", artist: "Aka Akasaka", publisher: "Shueisha" },
  { title: "Chainsaw Man", description: "A devil hunter with a chainsaw devil in his chest", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha" },
  { title: "Jujutsu Kaisen", description: "Students fight cursed spirits in modern Japan", author: "Gege Akutami", artist: "Gege Akutami", publisher: "Shueisha" },
  { title: "Demon Slayer", description: "A boy becomes a demon slayer to save his sister", author: "Koyoharu Gotouge", artist: "Koyoharu Gotouge", publisher: "Shueisha" },
  { title: "My Hero Academia", description: "A powerless boy dreams of becoming a hero", author: "Kohei Horikoshi", artist: "Kohei Horikoshi", publisher: "Shueisha" },
  { title: "One Punch Man", description: "A hero who can defeat any opponent with one punch", author: "ONE", artist: "Yusuke Murata", publisher: "Shueisha" },
  { title: "Attack on Titan", description: "Humanity fights giant humanoid creatures", author: "Hajime Isayama", artist: "Hajime Isayama", publisher: "Kodansha" },
  { title: "Tokyo Ghoul", description: "A college student becomes a half-ghoul", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Shueisha" },
  
  // Classic shoujo we might have missed
  { title: "Rose of Versailles", description: "French Revolution through the eyes of a female guard", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Margaret Comics" },
  { title: "Glass Mask", description: "A girl pursues her dream of becoming an actress", author: "Suzue Miuchi", artist: "Suzue Miuchi", publisher: "Hakusensha" },
  { title: "Princess Knight", description: "A princess raised as a boy fights for her kingdom", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kodansha" },
  { title: "Swan", description: "A girl from Hokkaido pursues ballet", author: "Kyoko Ariyoshi", artist: "Kyoko Ariyoshi", publisher: "Akita Shoten" },
  { title: "Ace wo Nerae!", description: "A girl learns to play tennis", author: "Sumika Yamamoto", artist: "Sumika Yamamoto", publisher: "Margaret Comics" },
  
  // More seinen
  { title: "Liar Game", description: "A naive girl is forced into psychological games", author: "Shinobu Kaitani", artist: "Shinobu Kaitani", publisher: "Shueisha" },
  { title: "Future Diary", description: "Diary users fight to become the next god", author: "Sakae Esuno", artist: "Sakae Esuno", publisher: "Kadokawa" },
  { title: "Deadman Wonderland", description: "A boy is wrongly convicted and sent to a prison theme park", author: "Jinsei Kataoka", artist: "Kazuma Kondou", publisher: "Kadokawa" },
  { title: "Elfen Lied", description: "Mutant children with deadly powers", author: "Lynn Okamoto", artist: "Lynn Okamoto", publisher: "Shueisha" },
  { title: "Psycho-Pass", description: "Cyberpunk police procedural about thought crime", author: "Gen Urobuchi", artist: "Hikaru Miyoshi", publisher: "Mag Garden" }
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
