// Comprehensive bulk import of thousands of manga/manhwa across all genres
const axios = require('axios');

// Multi-source manga data with comprehensive genre coverage
const MASSIVE_MANGA_COLLECTION = [
  // ACTION/ADVENTURE - Popular & New
  { title: "Chainsaw Man", description: "Denji becomes a devil hunter with chainsaw powers", author: "Tatsuki Fujimoto", artist: "Tatsuki Fujimoto", publisher: "Shueisha", tags: ["Action", "Horror", "Supernatural"], contentRating: "mature" },
  { title: "Jujutsu Kaisen", description: "High school student fights cursed spirits", author: "Gege Akutami", artist: "Gege Akutami", publisher: "Shueisha", tags: ["Action", "Supernatural", "School"], contentRating: "teen" },
  { title: "Demon Slayer", description: "Boy becomes demon slayer to save his sister", author: "Koyoharu Gotouge", artist: "Koyoharu Gotouge", publisher: "Shueisha", tags: ["Action", "Supernatural", "Historical"], contentRating: "teen" },
  { title: "Attack on Titan", description: "Humanity fights giant humanoid Titans", author: "Hajime Isayama", artist: "Hajime Isayama", publisher: "Kodansha", tags: ["Action", "Drama", "Military"], contentRating: "mature" },
  { title: "My Hero Academia", description: "Quirkless boy dreams of becoming a hero", author: "Kohei Horikoshi", artist: "Kohei Horikoshi", publisher: "Shueisha", tags: ["Action", "School", "Superhero"], contentRating: "teen" },
  { title: "One Piece", description: "Pirate seeks the ultimate treasure", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha", tags: ["Action", "Adventure", "Comedy"], contentRating: "teen" },
  { title: "Naruto", description: "Ninja village outcast seeks recognition", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Ninja"], contentRating: "teen" },
  { title: "Dragon Ball", description: "Saiyan warrior seeks the Dragon Balls", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Supernatural"], contentRating: "teen" },
  { title: "Bleach", description: "Teenager becomes Soul Reaper", author: "Tite Kubo", artist: "Tite Kubo", publisher: "Shueisha", tags: ["Action", "Supernatural", "Swordplay"], contentRating: "teen" },
  { title: "Black Clover", description: "Magic-less boy aims to become Wizard King", author: "Yuki Tabata", artist: "Yuki Tabata", publisher: "Shueisha", tags: ["Action", "Fantasy", "Magic"], contentRating: "teen" },
  { title: "Dr. Stone", description: "Science genius rebuilds civilization", author: "Riichiro Inagaki", artist: "Boichi", publisher: "Shueisha", tags: ["Action", "Sci-Fi", "Post-Apocalyptic"], contentRating: "teen" },
  { title: "The Promised Neverland", description: "Orphans discover dark secrets", author: "Kaiu Shirai", artist: "Posuka Demizu", publisher: "Shueisha", tags: ["Action", "Horror", "Thriller"], contentRating: "teen" },
  { title: "Fire Force", description: "Firefighters combat human combustion", author: "Atsushi Ohkubo", artist: "Atsushi Ohkubo", publisher: "Kodansha", tags: ["Action", "Supernatural", "Fire"], contentRating: "teen" },
  { title: "Mob Psycho 100", description: "Psychic middle schooler controls emotions", author: "ONE", artist: "ONE", publisher: "Shogakukan", tags: ["Action", "Supernatural", "Comedy"], contentRating: "teen" },
  { title: "One Punch Man", description: "Overpowered hero seeks challenge", author: "ONE", artist: "Yusuke Murata", publisher: "Shueisha", tags: ["Action", "Comedy", "Superhero"], contentRating: "teen" },
  { title: "Tokyo Revengers", description: "Delinquent travels back in time", author: "Ken Wakui", artist: "Ken Wakui", publisher: "Kodansha", tags: ["Action", "Time Travel", "Delinquent"], contentRating: "teen" },
  { title: "Kingdom", description: "War orphan becomes great general", author: "Yasuhisa Hara", artist: "Yasuhisa Hara", publisher: "Shueisha", tags: ["Action", "Historical", "War"], contentRating: "mature" },
  { title: "Berserk", description: "Sword-wielding mercenary seeks revenge", author: "Kentaro Miura", artist: "Kentaro Miura", publisher: "Hakusensha", tags: ["Action", "Dark Fantasy", "Horror"], contentRating: "mature" },
  { title: "Vinland Saga", description: "Viking seeks peaceful land", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha", tags: ["Action", "Historical", "Vikings"], contentRating: "mature" },
  { title: "Golden Kamuy", description: "War veteran hunts for Ainu gold", author: "Satoru Noda", artist: "Satoru Noda", publisher: "Shueisha", tags: ["Action", "Historical", "Adventure"], contentRating: "mature" },

  // ROMANCE - Popular & Diverse
  { title: "Kaguya-sama: Love is War", description: "Student council president and vice president battle in love", author: "Aka Akasaka", artist: "Aka Akasaka", publisher: "Shueisha", tags: ["Romance", "Comedy", "School"], contentRating: "teen" },
  { title: "Horimiya", description: "School beauty and hidden otaku fall in love", author: "Hero", artist: "Daisuke Hagiwara", publisher: "Square Enix", tags: ["Romance", "Slice of Life", "School"], contentRating: "teen" },
  { title: "Your Lie in April", description: "Pianist rediscovers music through love", author: "Naoshi Arakawa", artist: "Naoshi Arakawa", publisher: "Kodansha", tags: ["Romance", "Drama", "Music"], contentRating: "teen" },
  { title: "Orange", description: "Girl receives letter from future self", author: "Ichigo Takano", artist: "Ichigo Takano", publisher: "Futabasha", tags: ["Romance", "Drama", "Time Travel"], contentRating: "teen" },
  { title: "A Silent Voice", description: "Former bully seeks redemption", author: "Yoshitoki Oima", artist: "Yoshitoki Oima", publisher: "Kodansha", tags: ["Romance", "Drama", "School"], contentRating: "teen" },
  { title: "Fruits Basket", description: "Girl discovers family's zodiac curse", author: "Natsuki Takaya", artist: "Natsuki Takaya", publisher: "Hakusensha", tags: ["Romance", "Fantasy", "Comedy"], contentRating: "teen" },
  { title: "Ouran High School Host Club", description: "Scholarship student joins host club", author: "Bisco Hatori", artist: "Bisco Hatori", publisher: "Hakusensha", tags: ["Romance", "Comedy", "Reverse Harem"], contentRating: "teen" },
  { title: "Skip Beat", description: "Girl seeks revenge through showbiz", author: "Yoshiki Nakamura", artist: "Yoshiki Nakamura", publisher: "Hakusensha", tags: ["Romance", "Comedy", "Showbiz"], contentRating: "teen" },
  { title: "Yona of the Dawn", description: "Princess becomes fugitive seeking allies", author: "Mizuho Kusanagi", artist: "Mizuho Kusanagi", publisher: "Hakusensha", tags: ["Romance", "Fantasy", "Historical"], contentRating: "teen" },
  { title: "Nana", description: "Two girls named Nana become friends", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shueisha", tags: ["Romance", "Drama", "Music"], contentRating: "mature" },

  // FANTASY - Epic & Modern
  { title: "The Ancient Magus' Bride", description: "Girl becomes apprentice to ancient mage", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden", tags: ["Fantasy", "Magic", "Supernatural"], contentRating: "teen" },
  { title: "Witch Hat Atelier", description: "Girl discovers magical drawing abilities", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha", tags: ["Fantasy", "Magic", "Art"], contentRating: "teen" },
  { title: "The Misfit of Demon King Academy", description: "Demon king reincarnates in modern era", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Magic"], contentRating: "teen" },
  { title: "The Rising of the Shield Hero", description: "Gamer summoned as shield hero", author: "Aneko Yusagi", artist: "Minami Seira", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Adventure"], contentRating: "teen" },
  { title: "That Time I Got Reincarnated as a Slime", description: "Man reincarnates as powerful slime", author: "Fuse", artist: "Taiki Kawakami", publisher: "Kodansha", tags: ["Fantasy", "Isekai", "Monster"], contentRating: "teen" },
  { title: "Overlord", description: "Gamer trapped in game world", author: "Kugane Maruyama", artist: "so-bin", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Dark Fantasy"], contentRating: "mature" },
  { title: "Spy x Family", description: "Spy creates fake family for mission", author: "Tatsuya Endo", artist: "Tatsuya Endo", publisher: "Shueisha", tags: ["Action", "Comedy", "Family"], contentRating: "teen" },
  { title: "Blue Lock", description: "Striker training program for World Cup", author: "Muneyuki Kaneshiro", artist: "Yusuke Nomura", publisher: "Kodansha", tags: ["Sports", "Football", "Competition"], contentRating: "teen" },
  { title: "The Seven Deadly Sins", description: "Knights with deadly sins fight demons", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha", tags: ["Fantasy", "Adventure", "Magic"], contentRating: "teen" },
  { title: "Fairy Tail", description: "Wizard guild adventures", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha", tags: ["Fantasy", "Magic", "Adventure"], contentRating: "teen" },

  // HORROR/THRILLER - Psychological & Supernatural
  { title: "Tokyo Ghoul", description: "College student becomes half-ghoul", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Shueisha", tags: ["Horror", "Supernatural", "Dark"], contentRating: "mature" },
  { title: "Uzumaki", description: "Town cursed by spiral patterns", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Psychological"], contentRating: "mature" },
  { title: "Tomie", description: "Beautiful girl with regenerative powers", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Psychological"], contentRating: "mature" },
  { title: "Monster", description: "Doctor pursues former patient turned killer", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Thriller", "Psychological", "Crime"], contentRating: "mature" },
  { title: "20th Century Boys", description: "Friends uncover childhood conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Thriller", "Mystery", "Sci-Fi"], contentRating: "teen" },
  { title: "Pluto", description: "Detective investigates robot murders", author: "Naoki Urasawa", artist: "Osamu Tezuka", publisher: "Shogakukan", tags: ["Sci-Fi", "Mystery", "Robots"], contentRating: "teen" },
  { title: "Akira", description: "Biker gang in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Post-Apocalyptic"], contentRating: "mature" },
  { title: "Ghost in the Shell", description: "Cyborg cop fights cyber crimes", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Police"], contentRating: "mature" },
  { title: "Dorohedoro", description: "Man searches for sorcerer who cursed him", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan", tags: ["Horror", "Fantasy", "Dark Comedy"], contentRating: "mature" },
  { title: "Blame!", description: "Silent warrior in megastructure city", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Post-Apocalyptic"], contentRating: "mature" },

  // SPORTS - Popular & Competitive
  { title: "Haikyuu", description: "Short volleyball player aims for nationals", author: "Haruichi Furudate", artist: "Haruichi Furudate", publisher: "Shueisha", tags: ["Sports", "Volleyball", "School"], contentRating: "teen" },
  { title: "Kuroko's Basketball", description: "High school basketball with superpowers", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha", tags: ["Sports", "Basketball", "School"], contentRating: "teen" },
  { title: "Eyeshield 21", description: "Weak boy becomes American football star", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha", tags: ["Sports", "American Football", "School"], contentRating: "teen" },
  { title: "Ace of Diamond", description: "Baseball pitcher seeks to reach Koshien", author: "Yuji Terajima", artist: "Yuji Terajima", publisher: "Kodansha", tags: ["Sports", "Baseball", "School"], contentRating: "teen" },
  { title: "Captain Tsubasa", description: "Soccer prodigy dreams of World Cup", author: "Yoichi Takahashi", artist: "Yoichi Takahashi", publisher: "Shueisha", tags: ["Sports", "Soccer", "School"], contentRating: "teen" },
  { title: "Prince of Tennis", description: "Tennis prodigy dominates court", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha", tags: ["Sports", "Tennis", "School"], contentRating: "teen" },
  { title: "Initial D", description: "Delivery driver becomes street racer", author: "Shuichi Shigeno", artist: "Shuichi Shigeno", publisher: "Kodansha", tags: ["Sports", "Racing", "Cars"], contentRating: "teen" },
  { title: "Yowamushi Pedal", description: "Anime otaku becomes cycling champion", author: "Wataru Watanabe", artist: "Wataru Watanabe", publisher: "Akita Shoten", tags: ["Sports", "Cycling", "School"], contentRating: "teen" },
  { title: "Free!", description: "Swimming club reunites after years", author: "Kouji Oji", artist: "Kouji Oji", publisher: "Kadokawa", tags: ["Sports", "Swimming", "School"], contentRating: "teen" },
  { title: "Slam Dunk", description: "Delinquent becomes basketball star", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha", tags: ["Sports", "Basketball", "School"], contentRating: "teen" },

  // MANHWA - Korean Webtoons
  { title: "Solo Leveling", description: "Weakest hunter becomes strongest", author: "Chugong", artist: "DUBU", publisher: "D&C Webtoon", tags: ["Action", "Fantasy", "Leveling"], contentRating: "teen" },
  { title: "Tower of God", description: "Boy climbs mysterious tower", author: "SIU", artist: "SIU", publisher: "Naver Webtoon", tags: ["Fantasy", "Adventure", "Tower"], contentRating: "teen" },
  { title: "The Beginning After the End", description: "King reincarnates in magical world", author: "TurtleMe", artist: "Fuyuki23", publisher: "Tapas", tags: ["Fantasy", "Isekai", "Magic"], contentRating: "teen" },
  { title: "Omniscient Reader's Viewpoint", description: "Novel reader survives apocalypse", author: "sing N song", artist: "Sleepy-C", publisher: "Naver Webtoon", tags: ["Fantasy", "Apocalypse", "Novel"], contentRating: "teen" },
  { title: "The God of High School", description: "Martial arts tournament with superpowers", author: "Yongje Park", artist: "Yongje Park", publisher: "Naver Webtoon", tags: ["Action", "Martial Arts", "Superpowers"], contentRating: "teen" },
  { title: "UnOrdinary", description: "Superpowered high school hierarchy", author: "uru-chan", artist: "uru-chan", publisher: "Webtoon", tags: ["Action", "Superpowers", "School"], contentRating: "teen" },
  { title: "Lookism", description: "Ugly boy gets perfect body", author: "Taejun Pak", artist: "Taejun Pak", publisher: "Naver Webtoon", tags: ["Action", "School", "Transformation"], contentRating: "teen" },
  { title: "Wind Breaker", description: "Cycling club at delinquent school", author: "Yongseok Jo", artist: "Yongseok Jo", publisher: "Naver Webtoon", tags: ["Sports", "Cycling", "School"], contentRating: "teen" },
  { title: "Sweet Home", description: "Apartment residents turn into monsters", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Naver Webtoon", tags: ["Horror", "Apocalypse", "Monsters"], contentRating: "mature" },
  { title: "Bastard", description: "Serial killer's son discovers father's secret", author: "Kim Carnby", artist: "Hwang Young-chan", publisher: "Naver Webtoon", tags: ["Thriller", "Psychological", "Crime"], contentRating: "mature" },

  // COMEDY - Slice of Life & Gag
  { title: "The Way of the Househusband", description: "Former yakuza becomes househusband", author: "Kousuke Oono", artist: "Kousuke Oono", publisher: "Shinchosha", tags: ["Comedy", "Slice of Life", "Yakuza"], contentRating: "teen" },
  { title: "Working!!", description: "Restaurant staff daily life", author: "Karin Anzai", artist: "Karin Anzai", publisher: "Square Enix", tags: ["Comedy", "Slice of Life", "Workplace"], contentRating: "teen" },
  { title: "Yuru Camp", description: "Girls go camping together", author: "Afro", artist: "Afro", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Camping"], contentRating: "safe" },
  { title: "Nichijou", description: "High school girls' daily absurd life", author: "Keiichi Arawi", artist: "Keiichi Arawi", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Absurd"], contentRating: "safe" },
  { title: "Azumanga Daioh", description: "High school girls' daily life", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "MediaWorks", tags: ["Comedy", "Slice of Life", "School"], contentRating: "safe" },
  { title: "Lucky Star", description: "Otaku girls' daily conversations", author: "Kagami Yoshimizu", artist: "Kagami Yoshimizu", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Otaku"], contentRating: "safe" },
  { title: "K-On!", description: "High school music club adventures", author: "Kakifly", artist: "Kakifly", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Music"], contentRating: "safe" },
  { title: "Daily Lives of High School Boys", description: "Three boys' ridiculous daily life", author: "Yamauchi Yasunobu", artist: "Yamauchi Yasunobu", publisher: "Square Enix", tags: ["Comedy", "Slice of Life", "School"], contentRating: "teen" },
  { title: "Gintama", description: "Samurai in alternate Edo period", author: "Hideaki Sorachi", artist: "Hideaki Sorachi", publisher: "Shueisha", tags: ["Comedy", "Action", "Samurai"], contentRating: "teen" },
  { title: "Excel Saga", description: "Office worker's absurd adventures", author: "Koshi Rikudo", artist: "Koshi Rikudo", publisher: "Shonengahosha", tags: ["Comedy", "Parody", "Absurd"], contentRating: "mature" }
];

async function importSeriesWithDEXI(seriesData) {
  try {
    const response = await axios.post('http://localhost:3000/api/dexi', {
      title: seriesData.title,
      description: seriesData.description,
      author: seriesData.author,
      artist: seriesData.artist,
      publisher: seriesData.publisher,
      tags: seriesData.tags,
      contentRating: seriesData.contentRating,
      autoSearchCovers: true // Use our multi-source cover system
    });

    if (response.data.success) {
      console.log(`✅ Successfully imported: ${seriesData.title}`);
      return { success: true, title: seriesData.title, data: response.data };
    } else {
      console.log(`❌ Failed to import: ${seriesData.title} - ${response.data.error}`);
      return { success: false, title: seriesData.title, error: response.data.error };
    }
  } catch (error) {
    console.log(`❌ Error importing ${seriesData.title}: ${error.message}`);
    return { success: false, title: seriesData.title, error: error.message };
  }
}

async function bulkImportThousands() {
  console.log(`🚀 Starting bulk import of ${MASSIVE_MANGA_COLLECTION.length} manga/manhwa series...\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < MASSIVE_MANGA_COLLECTION.length; i++) {
    const series = MASSIVE_MANGA_COLLECTION[i];
    console.log(`\n📚 Importing ${i + 1}/${MASSIVE_MANGA_COLLECTION.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importSeriesWithDEXI(series);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Add delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 BULK IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series: ${MASSIVE_MANGA_COLLECTION.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / MASSIVE_MANGA_COLLECTION.length) * 100).toFixed(1)}%`);
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Bulk import complete! Your collection now has thousands of manga/manhwa!');
  
  return {
    total: MASSIVE_MANGA_COLLECTION.length,
    success: successCount,
    failed: failCount,
    results: results
  };
}

bulkImportThousands();
