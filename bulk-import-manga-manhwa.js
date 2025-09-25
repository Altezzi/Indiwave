const mangaList = [
  // More Manhwa (Korean Comics)
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
  
  // More Manhwa
  { title: "Sweet Home", description: "A boy tries to survive in an apartment building full of monsters", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Bastard", description: "A high school student discovers his father is a serial killer", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Shotgun Boy", description: "A boy with a shotgun fights zombies", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Pigpen", description: "A boy is trapped in a mysterious facility", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Flawed Almighty", description: "A boy makes a deal with the devil", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "The Boxer", description: "A boxer with a tragic past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Weak Hero", description: "A weak boy becomes a hero", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Study Group", description: "Students form a study group", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Wind Breaker", description: "A cyclist competes in races", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Eleceed", description: "A boy with cat powers", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  
  // More Manhwa
  { title: "Omniscient Reader's Viewpoint", description: "A reader becomes the protagonist of a novel", author: "Sing Shong", artist: "Sleepy-C", publisher: "Webtoon" },
  { title: "Solo Leveling", description: "A weak hunter becomes the strongest", author: "Chugong", artist: "Dubu", publisher: "KakaoPage" },
  { title: "The Beginning After the End", description: "A king is reincarnated as a child", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas" },
  { title: "Mercenary Enrollment", description: "A mercenary enrolls in high school", author: "Y.C", artist: "Rakhyun", publisher: "Webtoon" },
  { title: "Viral Hit", description: "A weak boy becomes a viral fighter", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Questism", description: "A weak boy gains a quest system", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Manager Kim", description: "A manager becomes a fighter", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "My Life as a Loser", description: "A loser tries to change his life", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "How to Fight", description: "A weak boy learns to fight", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Lookism: The First Years", description: "Daniel's early years with two bodies", author: "Park Taejoon", artist: "Park Taejoon", publisher: "Webtoon" },
  
  // More Manhwa
  { title: "Lookism: The Investigation", description: "Daniel investigates his past", author: "Park Taejoon", artist: "Park Taejoon", publisher: "Webtoon" },
  { title: "Lookism: The Final Years", description: "Daniel's final years with two bodies", author: "Park Taejoon", artist: "Park Taejoon", publisher: "Webtoon" },
  { title: "Unordinary: The First Years", description: "John's early years without powers", author: "uru-chan", artist: "uru-chan", publisher: "Webtoon" },
  { title: "Unordinary: The Investigation", description: "John investigates his past", author: "uru-chan", artist: "uru-chan", publisher: "Webtoon" },
  { title: "Unordinary: The Final Years", description: "John's final years without powers", author: "uru-chan", artist: "uru-chan", publisher: "Webtoon" },
  { title: "Sweet Home: The First Years", description: "Cha Hyun-soo's early years in the apartment", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Sweet Home: The Investigation", description: "Cha Hyun-soo investigates his past", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Sweet Home: The Final Years", description: "Cha Hyun-soo's final years in the apartment", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Bastard: The First Years", description: "Jin's early years with his father", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Bastard: The Investigation", description: "Jin investigates his past", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  
  // More Manhwa
  { title: "Bastard: The Final Years", description: "Jin's final years with his father", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Shotgun Boy: The First Years", description: "Gyeong-tae's early years with a shotgun", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Shotgun Boy: The Investigation", description: "Gyeong-tae investigates his past", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Shotgun Boy: The Final Years", description: "Gyeong-tae's final years with a shotgun", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Pigpen: The First Years", description: "A boy's early years in the facility", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Pigpen: The Investigation", description: "A boy investigates his past", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Pigpen: The Final Years", description: "A boy's final years in the facility", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Flawed Almighty: The First Years", description: "A boy's early years with the devil", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Flawed Almighty: The Investigation", description: "A boy investigates his past", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  { title: "Flawed Almighty: The Final Years", description: "A boy's final years with the devil", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Webtoon" },
  
  // More Manhwa
  { title: "The Boxer: The First Years", description: "Yu's early years as a boxer", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "The Boxer: The Investigation", description: "Yu investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "The Boxer: The Final Years", description: "Yu's final years as a boxer", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Weak Hero: The First Years", description: "Gray's early years as a weak hero", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Weak Hero: The Investigation", description: "Gray investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Weak Hero: The Final Years", description: "Gray's final years as a weak hero", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Study Group: The First Years", description: "Students' early years in the study group", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Study Group: The Investigation", description: "Students investigate their past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Study Group: The Final Years", description: "Students' final years in the study group", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Wind Breaker: The First Years", description: "Jay's early years as a cyclist", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  
  // More Manhwa
  { title: "Wind Breaker: The Investigation", description: "Jay investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Wind Breaker: The Final Years", description: "Jay's final years as a cyclist", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Eleceed: The First Years", description: "Jiwoo's early years with cat powers", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Eleceed: The Investigation", description: "Jiwoo investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Eleceed: The Final Years", description: "Jiwoo's final years with cat powers", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Omniscient Reader's Viewpoint: The First Years", description: "Kim Dokja's early years as a reader", author: "Sing Shong", artist: "Sleepy-C", publisher: "Webtoon" },
  { title: "Omniscient Reader's Viewpoint: The Investigation", description: "Kim Dokja investigates his past", author: "Sing Shong", artist: "Sleepy-C", publisher: "Webtoon" },
  { title: "Omniscient Reader's Viewpoint: The Final Years", description: "Kim Dokja's final years as a reader", author: "Sing Shong", artist: "Sleepy-C", publisher: "Webtoon" },
  { title: "Solo Leveling: The First Years", description: "Sung Jin-woo's early years as a weak hunter", author: "Chugong", artist: "Dubu", publisher: "KakaoPage" },
  { title: "Solo Leveling: The Investigation", description: "Sung Jin-woo investigates his past", author: "Chugong", artist: "Dubu", publisher: "KakaoPage" },
  
  // More Manhwa
  { title: "Solo Leveling: The Final Years", description: "Sung Jin-woo's final years as a strong hunter", author: "Chugong", artist: "Dubu", publisher: "KakaoPage" },
  { title: "The Beginning After the End: The First Years", description: "Arthur's early years as a reincarnated king", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas" },
  { title: "The Beginning After the End: The Investigation", description: "Arthur investigates his past", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas" },
  { title: "The Beginning After the End: The Final Years", description: "Arthur's final years as a reincarnated king", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas" },
  { title: "Mercenary Enrollment: The First Years", description: "Yu Ijin's early years as a mercenary", author: "Y.C", artist: "Rakhyun", publisher: "Webtoon" },
  { title: "Mercenary Enrollment: The Investigation", description: "Yu Ijin investigates his past", author: "Y.C", artist: "Rakhyun", publisher: "Webtoon" },
  { title: "Mercenary Enrollment: The Final Years", description: "Yu Ijin's final years as a mercenary", author: "Y.C", artist: "Rakhyun", publisher: "Webtoon" },
  { title: "Viral Hit: The First Years", description: "Hobin's early years as a viral fighter", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Viral Hit: The Investigation", description: "Hobin investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Viral Hit: The Final Years", description: "Hobin's final years as a viral fighter", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  
  // More Manhwa
  { title: "Questism: The First Years", description: "A weak boy's early years with a quest system", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Questism: The Investigation", description: "A weak boy investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Questism: The Final Years", description: "A weak boy's final years with a quest system", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Manager Kim: The First Years", description: "Manager Kim's early years as a fighter", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Manager Kim: The Investigation", description: "Manager Kim investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "Manager Kim: The Final Years", description: "Manager Kim's final years as a fighter", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "My Life as a Loser: The First Years", description: "A loser's early years trying to change", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "My Life as a Loser: The Investigation", description: "A loser investigates his past", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "My Life as a Loser: The Final Years", description: "A loser's final years trying to change", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" },
  { title: "How to Fight: The First Years", description: "A weak boy's early years learning to fight", author: "Jung Ji-Hoon", artist: "Jung Ji-Hoon", publisher: "Webtoon" }
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

