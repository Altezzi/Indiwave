// Pure manga/manhwa series import - no movies or anime adaptations
const axios = require('axios');

// Pure manga/manhwa series across all genres including 18+
const PURE_MANGA_MANHWA_COLLECTION = [
  // 18+ Adult Series
  { title: "Nozoki Ana", description: "Peephole - student discovers neighbor's secret", author: "Wakou Honna", artist: "Wakou Honna", publisher: "Futabasha", tags: ["Romance", "Ecchi", "Drama"], contentRating: "mature" },
  { title: "Nana to Kaoru", description: "BDSM relationship between childhood friends", author: "Ryuta Amazume", artist: "Ryuta Amazume", publisher: "Kodansha", tags: ["Romance", "BDSM", "Drama"], contentRating: "mature" },
  { title: "Velvet Kiss", description: "Businessman's relationship with debt collector", author: "Chihiro Harumi", artist: "Chihiro Harumi", publisher: "Kodansha", tags: ["Romance", "Drama", "Business"], contentRating: "mature" },
  { title: "Harem Time", description: "Boy gets transported to harem world", author: "Shin Kurokawa", artist: "Shin Kurokawa", publisher: "Akita Shoten", tags: ["Harem", "Ecchi", "Fantasy"], contentRating: "mature" },
  { title: "To Love-Ru", description: "Boy's life changes when alien princess crashes into his room", author: "Saki Hasemi", artist: "Kentaro Yabuki", publisher: "Shueisha", tags: ["Harem", "Ecchi", "Aliens"], contentRating: "mature" },
  { title: "High School DxD", description: "Perverted high school student becomes demon", author: "Ichiei Ishibumi", artist: "Hiroji Kamo", publisher: "Fujimi Shobo", tags: ["Harem", "Ecchi", "Supernatural"], contentRating: "mature" },
  { title: "Prison School", description: "Boys enroll in former girls' school", author: "Akira Hiramoto", artist: "Akira Hiramoto", publisher: "Kodansha", tags: ["Comedy", "Ecchi", "School"], contentRating: "mature" },
  { title: "Shimoneta", description: "Future where dirty jokes are forbidden", author: "Hirotaka Akagi", artist: "Etsuya Amajishi", publisher: "Kadokawa", tags: ["Comedy", "Ecchi", "Dystopia"], contentRating: "mature" },
  { title: "Interspecies Reviewers", description: "Adventurers review brothels of different species", author: "Amahara", artist: "masha", publisher: "Kadokawa", tags: ["Fantasy", "Ecchi", "Adventure"], contentRating: "mature" },
  { title: "Why the Hell are You Here, Teacher!?", description: "Student and teacher in awkward situations", author: "Soborou", artist: "Soborou", publisher: "Kodansha", tags: ["Comedy", "Ecchi", "School"], contentRating: "mature" },

  // Psychological/Horror Series
  { title: "Monster", description: "Neurosurgeon saves boy who becomes serial killer", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Psychological", "Thriller", "Medical"], contentRating: "mature" },
  { title: "20th Century Boys", description: "Group of friends uncover conspiracy", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Shogakukan", tags: ["Psychological", "Mystery", "Conspiracy"], contentRating: "mature" },
  { title: "Billy Bat", description: "Detective discovers his comic character is real", author: "Naoki Urasawa", artist: "Naoki Urasawa", publisher: "Kodansha", tags: ["Psychological", "Mystery", "Meta"], contentRating: "mature" },
  { title: "Pluto", description: "Detective investigates robot murders", author: "Naoki Urasawa", artist: "Osamu Tezuka", publisher: "Shogakukan", tags: ["Sci-Fi", "Mystery", "Robots"], contentRating: "teen" },
  { title: "Master Keaton", description: "Archaeologist and insurance investigator", author: "Naoki Urasawa", artist: "Hokusei Katsushika", publisher: "Shogakukan", tags: ["Adventure", "Mystery", "Archaeology"], contentRating: "teen" },
  { title: "Homunculus", description: "Man undergoes trepanation surgery", author: "Hideo Yamamoto", artist: "Hideo Yamamoto", publisher: "Shogakukan", tags: ["Psychological", "Horror", "Supernatural"], contentRating: "mature" },
  { title: "Ichi the Killer", description: "Psychotic killer's violent adventures", author: "Hideo Yamamoto", artist: "Hideo Yamamoto", publisher: "Shogakukan", tags: ["Horror", "Violence", "Psychological"], contentRating: "mature" },
  { title: "Flowers of Evil", description: "Boy's life spirals after stealing girl's gym clothes", author: "Shuzo Oshimi", artist: "Shuzo Oshimi", publisher: "Kodansha", tags: ["Psychological", "Drama", "School"], contentRating: "mature" },
  { title: "Blood on the Tracks", description: "Mother's obsessive love for her son", author: "Shuzo Oshimi", artist: "Shuzo Oshimi", publisher: "Kodansha", tags: ["Psychological", "Horror", "Family"], contentRating: "mature" },
  { title: "Inside Mari", description: "Boy wakes up in girl's body", author: "Shuzo Oshimi", artist: "Shuzo Oshimi", publisher: "Kodansha", tags: ["Psychological", "Gender Bender", "Supernatural"], contentRating: "mature" },

  // Classic Shoujo Series
  { title: "Glass Mask", description: "Girl dreams of becoming actress", author: "Suzue Miuchi", artist: "Suzue Miuchi", publisher: "Hakusensha", tags: ["Drama", "Acting", "Shoujo"], contentRating: "teen" },
  { title: "Swan", description: "Girl pursues ballet career", author: "Kyoko Ariyoshi", artist: "Kyoko Ariyoshi", publisher: "Hakusensha", tags: ["Drama", "Ballet", "Shoujo"], contentRating: "teen" },
  { title: "Princess Knight", description: "Princess raised as prince", author: "Osamu Tezuka", artist: "Osamu Tezuka", publisher: "Kodansha", tags: ["Adventure", "Gender Bender", "Classic"], contentRating: "safe" },
  { title: "The Rose of Versailles", description: "Woman disguised as man in French Revolution", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Historical", "Drama", "Gender Bender"], contentRating: "teen" },
  { title: "Oniisama e...", description: "Girl's life at elite school", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Drama", "School", "Lesbian"], contentRating: "teen" },
  { title: "The Window of Orpheus", description: "Girl's journey through time", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Historical", "Drama", "Time Travel"], contentRating: "teen" },
  { title: "Fruits Basket", description: "Girl lives with cursed family", author: "Natsuki Takaya", artist: "Natsuki Takaya", publisher: "Hakusensha", tags: ["Romance", "Supernatural", "Family"], contentRating: "teen" },
  { title: "Ouran High School Host Club", description: "Girl joins male host club", author: "Bisco Hatori", artist: "Bisco Hatori", publisher: "Hakusensha", tags: ["Comedy", "Romance", "School"], contentRating: "teen" },
  { title: "Skip Beat!", description: "Girl seeks revenge through acting", author: "Yoshiki Nakamura", artist: "Yoshiki Nakamura", publisher: "Hakusensha", tags: ["Romance", "Acting", "Revenge"], contentRating: "teen" },
  { title: "Kimi ni Todoke", description: "Shy girl makes friends", author: "Karuho Shiina", artist: "Karuho Shiina", publisher: "Shueisha", tags: ["Romance", "School", "Slice of Life"], contentRating: "teen" },

  // Korean Manhwa Series
  { title: "Tower of God", description: "Boy climbs mysterious tower", author: "SIU", artist: "SIU", publisher: "Naver", tags: ["Action", "Fantasy", "Adventure"], contentRating: "teen" },
  { title: "The God of High School", description: "Martial arts tournament", author: "Yongje Park", artist: "Yongje Park", publisher: "Naver", tags: ["Action", "Martial Arts", "Tournament"], contentRating: "teen" },
  { title: "Noblesse", description: "Vampire noble awakens in modern world", author: "Jeho Son", artist: "Kwangsu Lee", publisher: "Naver", tags: ["Action", "Vampire", "School"], contentRating: "teen" },
  { title: "The Breaker", description: "Student learns martial arts", author: "Jeon Geuk-jin", artist: "Park Jin-hwan", publisher: "Daewon", tags: ["Action", "Martial Arts", "School"], contentRating: "teen" },
  { title: "The Breaker: New Waves", description: "Continuation of The Breaker", author: "Jeon Geuk-jin", artist: "Park Jin-hwan", publisher: "Daewon", tags: ["Action", "Martial Arts", "School"], contentRating: "teen" },
  { title: "Girls of the Wild's", description: "Girl-only martial arts school", author: "HUN", artist: "ZHENa", publisher: "Naver", tags: ["Action", "Martial Arts", "School"], contentRating: "teen" },
  { title: "Lookism", description: "Ugly boy becomes handsome", author: "Taejun Pak", artist: "Taejun Pak", publisher: "Naver", tags: ["Drama", "School", "Supernatural"], contentRating: "teen" },
  { title: "How to Fight", description: "Weak boy learns to fight", author: "Taejun Pak", artist: "Taejun Pak", publisher: "Naver", tags: ["Action", "Martial Arts", "School"], contentRating: "mature" },
  { title: "Viral Hit", description: "High schooler becomes internet fighter", author: "Taejun Pak", artist: "Taejun Pak", publisher: "Naver", tags: ["Action", "Martial Arts", "Internet"], contentRating: "mature" },
  { title: "Weak Hero", description: "Weak student becomes school's strongest", author: "SEOPASS", artist: "RAZEN", publisher: "Naver", tags: ["Action", "School", "Violence"], contentRating: "mature" },

  // Isekai Series
  { title: "Re:Zero - Starting Life in Another World", description: "Boy gets transported to fantasy world", author: "Tappei Nagatsuki", artist: "Matsuoka Daichi", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Time Loop"], contentRating: "teen" },
  { title: "That Time I Got Reincarnated as a Slime", description: "Man reincarnates as slime in fantasy world", author: "Fuse", artist: "Mitz Vah", publisher: "Kodansha", tags: ["Isekai", "Fantasy", "Monster"], contentRating: "teen" },
  { title: "The Rising of the Shield Hero", description: "Man becomes shield hero in fantasy world", author: "Aneko Yusagi", artist: "Minami Seira", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Hero"], contentRating: "teen" },
  { title: "Overlord", description: "Gamer trapped in game world", author: "Kugane Maruyama", artist: "Hugin Miyama", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Game"], contentRating: "teen" },
  { title: "Mushoku Tensei", description: "Man reincarnates in fantasy world", author: "Rifujin na Magonote", artist: "Yuka Fujikawa", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Magic"], contentRating: "mature" },
  { title: "Konosuba", description: "Boy dies and goes to fantasy world", author: "Natsume Akatsuki", artist: "Masahito Watari", publisher: "Kadokawa", tags: ["Isekai", "Comedy", "Fantasy"], contentRating: "teen" },
  { title: "No Game No Life", description: "Siblings get transported to game world", author: "Yu Kamiya", artist: "Mashiro Hiiragi", publisher: "Kadokawa", tags: ["Isekai", "Game", "Fantasy"], contentRating: "teen" },
  { title: "The Misfit of Demon King Academy", description: "Demon king reincarnates in modern world", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Magic"], contentRating: "teen" },
  { title: "How Not to Summon a Demon Lord", description: "Gamer gets summoned to fantasy world", author: "Yukiya Murasaki", artist: "Naoto Fukuda", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Harem"], contentRating: "mature" },
  { title: "The World After The Fall", description: "Man survives apocalypse", author: "Singshong", artist: "Undead Gamja", publisher: "Naver", tags: ["Isekai", "Post-Apocalyptic", "Action"], contentRating: "teen" },

  // Sports Series
  { title: "Hajime no Ippo", description: "High schooler becomes boxer", author: "George Morikawa", artist: "George Morikawa", publisher: "Kodansha", tags: ["Sports", "Boxing", "Drama"], contentRating: "teen" },
  { title: "Eyeshield 21", description: "Weak student becomes American football player", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha", tags: ["Sports", "American Football", "School"], contentRating: "teen" },
  { title: "Ace of Diamond", description: "High schooler joins baseball team", author: "Yuji Terajima", artist: "Yuji Terajima", publisher: "Kodansha", tags: ["Sports", "Baseball", "School"], contentRating: "teen" },
  { title: "Captain Tsubasa", description: "Boy dreams of becoming soccer player", author: "Yoichi Takahashi", artist: "Yoichi Takahashi", publisher: "Shueisha", tags: ["Sports", "Soccer", "Dreams"], contentRating: "teen" },
  { title: "Prince of Tennis", description: "Tennis prodigy joins school team", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha", tags: ["Sports", "Tennis", "School"], contentRating: "teen" },
  { title: "Initial D", description: "High schooler becomes street racer", author: "Shuichi Shigeno", artist: "Shuichi Shigeno", publisher: "Kodansha", tags: ["Sports", "Racing", "Cars"], contentRating: "teen" },
  { title: "Yowamushi Pedal", description: "Otaku becomes cyclist", author: "Wataru Watanabe", artist: "Wataru Watanabe", publisher: "Akita Shoten", tags: ["Sports", "Cycling", "School"], contentRating: "teen" },
  { title: "Free!", description: "Swimming club members", author: "Kouji Oji", artist: "Kouji Oji", publisher: "Kadokawa", tags: ["Sports", "Swimming", "School"], contentRating: "teen" },
  { title: "Kuroko's Basketball", description: "High school basketball team", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha", tags: ["Sports", "Basketball", "School"], contentRating: "teen" },
  { title: "Slam Dunk", description: "Delinquent joins basketball team", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha", tags: ["Sports", "Basketball", "School"], contentRating: "teen" }
];

async function importPureMangaManhwaWithDEXI(seriesData) {
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

async function bulkImportPureMangaManhwa() {
  console.log(`🚀 Starting Pure Manga/Manhwa import of ${PURE_MANGA_MANHWA_COLLECTION.length} unique series...\n`);
  console.log(`📚 Current collection size: 841 series`);
  console.log(`🎯 Target: Add ${PURE_MANGA_MANHWA_COLLECTION.length} pure manga/manhwa series!\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < PURE_MANGA_MANHWA_COLLECTION.length; i++) {
    const series = PURE_MANGA_MANHWA_COLLECTION[i];
    console.log(`\n📚 Importing ${i + 1}/${PURE_MANGA_MANHWA_COLLECTION.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importPureMangaManhwaWithDEXI(series);
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
  console.log('📊 PURE MANGA/MANHWA IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Attempted: ${PURE_MANGA_MANHWA_COLLECTION.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / PURE_MANGA_MANHWA_COLLECTION.length) * 100).toFixed(1)}%`);
  console.log(`🎯 New Collection Size: ${841 + successCount} series`);
  
  if (841 + successCount >= 900) {
    console.log(`🎉 NEW MILESTONE REACHED: Your collection now has 900+ series! 🎉`);
  }
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Pure manga/manhwa import complete! Your collection is now even more comprehensive!');
  
  return {
    total: PURE_MANGA_MANHWA_COLLECTION.length,
    success: successCount,
    failed: failCount,
    results: results,
    newCollectionSize: 841 + successCount
  };
}

bulkImportPureMangaManhwa();
