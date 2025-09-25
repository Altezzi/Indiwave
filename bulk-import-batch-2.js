// Second batch of unique manga/manhwa series to expand the collection further
const axios = require('axios');

// Another massive collection of unique series across all genres
const BATCH_2_MANGA_COLLECTION = [
  // Recent Popular Series (2023-2024)
  { title: "Mission: Yozakura Family", description: "Boy marries into family of spies", author: "Hitsuji Gondaira", artist: "Hitsuji Gondaira", publisher: "Shueisha", tags: ["Action", "Comedy", "Spy"], contentRating: "teen" },
  { title: "Me & Roboco", description: "Boy gets robot maid from future", author: "Shuhei Miyazaki", artist: "Shuhei Miyazaki", publisher: "Shueisha", tags: ["Comedy", "Sci-Fi", "Robot"], contentRating: "safe" },
  { title: "The Hunters Guild: Red Hood", description: "Girl becomes fairy tale hunter", author: "Yuki Kawaguchi", artist: "Yuki Kawaguchi", publisher: "Shueisha", tags: ["Action", "Fantasy", "Fairy Tale"], contentRating: "teen" },
  { title: "Time Paradox Ghostwriter", description: "Writer receives manga from future self", author: "Kenji Ichima", artist: "Kenji Ichima", publisher: "Shueisha", tags: ["Drama", "Time Travel", "Manga"], contentRating: "teen" },
  { title: "Agravity Boys", description: "Boys live in space station", author: "Atsushi Nakamura", artist: "Atsushi Nakamura", publisher: "Shueisha", tags: ["Comedy", "Sci-Fi", "Space"], contentRating: "teen" },
  { title: "Phantom Seer", description: "Boy exorcises spirits with supernatural powers", author: "Togashi Shinya", artist: "Togashi Shinya", publisher: "Shueisha", tags: ["Action", "Supernatural", "Exorcism"], contentRating: "teen" },
  { title: "Candy Flurry", description: "Girl with candy powers fights crime", author: "Rin Matsui", artist: "Rin Matsui", publisher: "Shueisha", tags: ["Action", "Superpowers", "Comedy"], contentRating: "teen" },
  { title: "Build King", description: "Builders construct amazing structures", author: "Mitsutoshi Shimabukuro", artist: "Mitsutoshi Shimabukuro", publisher: "Shueisha", tags: ["Action", "Construction", "Fantasy"], contentRating: "teen" },
  { title: "Neru: Way of the Martial Artist", description: "Girl masters martial arts", author: "Minoru Kawasaki", artist: "Minoru Kawasaki", publisher: "Shueisha", tags: ["Action", "Martial Arts", "School"], contentRating: "teen" },
  { title: "High School Family", description: "Family attends high school together", author: "Ryou Nakama", artist: "Ryou Nakama", publisher: "Shueisha", tags: ["Comedy", "School", "Family"], contentRating: "teen" },

  // Shoujo/Josei Series
  { title: "Fushigi Yuugi", description: "Girl transported to fantasy world", author: "Yuu Watase", artist: "Yuu Watase", publisher: "Shogakukan", tags: ["Romance", "Fantasy", "Historical"], contentRating: "teen" },
  { title: "Cardcaptor Sakura", description: "Girl captures magical cards", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha", tags: ["Magical Girl", "Fantasy", "School"], contentRating: "safe" },
  { title: "Magic Knight Rayearth", description: "Girls become magic knights", author: "CLAMP", artist: "CLAMP", publisher: "Kodansha", tags: ["Magical Girl", "Fantasy", "Mecha"], contentRating: "teen" },
  { title: "Revolutionary Girl Utena", description: "Girl seeks to become prince", author: "Chiho Saito", artist: "Chiho Saito", publisher: "Shogakukan", tags: ["Drama", "Psychological", "School"], contentRating: "mature" },
  { title: "Paradise Kiss", description: "Girl becomes fashion model", author: "Ai Yazawa", artist: "Ai Yazawa", publisher: "Shodensha", tags: ["Romance", "Fashion", "Drama"], contentRating: "mature" },
  { title: "Honey and Clover", description: "Art students' love triangle", author: "Chica Umino", artist: "Chica Umino", publisher: "Shueisha", tags: ["Romance", "Drama", "Art"], contentRating: "teen" },
  { title: "March Comes in Like a Lion", description: "Shogi player finds family", author: "Chica Umino", artist: "Chica Umino", publisher: "Hakusensha", tags: ["Drama", "Shogi", "Slice of Life"], contentRating: "teen" },
  { title: "Kare Kano", description: "Perfect student reveals true self", author: "Masami Tsuda", artist: "Masami Tsuda", publisher: "Hakusensha", tags: ["Romance", "Comedy", "School"], contentRating: "teen" },
  { title: "Peach Girl", description: "Girl's complicated love life", author: "Miwa Ueda", artist: "Miwa Ueda", publisher: "Kodansha", tags: ["Romance", "Drama", "School"], contentRating: "teen" },
  { title: "Boys Over Flowers", description: "Poor girl at elite school", author: "Yoko Kamio", artist: "Yoko Kamio", publisher: "Shueisha", tags: ["Romance", "Drama", "School"], contentRating: "teen" },

  // Seinen Series
  { title: "Vagabond", description: "Sword saint's journey", author: "Takehiko Inoue", artist: "Eiji Yoshikawa", publisher: "Kodansha", tags: ["Historical", "Samurai", "Philosophy"], contentRating: "mature" },
  { title: "Real", description: "Wheelchair basketball players", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha", tags: ["Sports", "Drama", "Disability"], contentRating: "mature" },
  { title: "Planetes", description: "Space debris collectors", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha", tags: ["Sci-Fi", "Space", "Drama"], contentRating: "teen" },
  { title: "Eden: It's an Endless World", description: "Post-apocalyptic survival", author: "Hiroki Endo", artist: "Hiroki Endo", publisher: "Kodansha", tags: ["Sci-Fi", "Post-Apocalyptic", "Cyberpunk"], contentRating: "mature" },
  { title: "Parasyte", description: "Boy's hand becomes alien parasite", author: "Hitoshi Iwaaki", artist: "Hitoshi Iwaaki", publisher: "Kodansha", tags: ["Horror", "Sci-Fi", "Body Horror"], contentRating: "mature" },
  { title: "Devilman", description: "Boy fuses with demon", author: "Go Nagai", artist: "Go Nagai", publisher: "Kodansha", tags: ["Horror", "Demons", "Action"], contentRating: "mature" },
  { title: "Mazinger Z", description: "Pilot controls giant robot", author: "Go Nagai", artist: "Go Nagai", publisher: "Kodansha", tags: ["Mecha", "Action", "Super Robot"], contentRating: "teen" },
  { title: "Cutey Honey", description: "Android girl fights evil", author: "Go Nagai", artist: "Go Nagai", publisher: "Chuokoron-Shinsha", tags: ["Action", "Android", "Transformation"], contentRating: "mature" },
  { title: "Violence Jack", description: "Post-apocalyptic warrior", author: "Go Nagai", artist: "Go Nagai", publisher: "Akita Shoten", tags: ["Action", "Post-Apocalyptic", "Violence"], contentRating: "mature" },
  { title: "Getter Robo", description: "Three pilots combine into robot", author: "Go Nagai", artist: "Ken Ishikawa", publisher: "Futabasha", tags: ["Mecha", "Action", "Super Robot"], contentRating: "teen" },

  // Manhwa/Webtoons - More Korean Series
  { title: "The Legend of the Northern Blade", description: "Martial artist seeks revenge", author: "Woo-Gak", artist: "Hae-Min", publisher: "Lezhin Comics", tags: ["Action", "Martial Arts", "Revenge"], contentRating: "mature" },
  { title: "Return of the Mount Hua Sect", description: "Martial artist reincarnates", author: "Big Carrot Studio", artist: "Big Carrot Studio", publisher: "KakaoPage", tags: ["Action", "Martial Arts", "Reincarnation"], contentRating: "teen" },
  { title: "The Great Mage Returns After 4000 Years", description: "Mage returns after long sleep", author: "Barnacle", artist: "D-Cheese", publisher: "KakaoPage", tags: ["Fantasy", "Magic", "Reincarnation"], contentRating: "teen" },
  { title: "SSS-Class Suicide Hunter", description: "Hunter gains time reversal power", author: "Shin Noah", artist: "Kkongchi", publisher: "KakaoPage", tags: ["Action", "Fantasy", "Time Loop"], contentRating: "mature" },
  { title: "Villain to Kill", description: "Hero reincarnates as villain", author: "Chamnamu", artist: "Kkuba", publisher: "KakaoPage", tags: ["Action", "Superhero", "Reincarnation"], contentRating: "teen" },
  { title: "The World After The Fall", description: "Man survives apocalypse", author: "Sing Shong", artist: "Undead Gamja", publisher: "KakaoPage", tags: ["Action", "Apocalypse", "Survival"], contentRating: "mature" },
  { title: "Reformation of the Deadbeat Noble", description: "Noble becomes martial artist", author: "Ro Yu-jin", artist: "Kim Min-kyu", publisher: "KakaoPage", tags: ["Action", "Martial Arts", "Nobility"], contentRating: "teen" },
  { title: "The Greatest Estate Developer", description: "Civil engineer in fantasy world", author: "Moon Hyun-seung", artist: "Lee Hyun-min", publisher: "KakaoPage", tags: ["Fantasy", "Engineering", "Comedy"], contentRating: "teen" },
  { title: "Return of the Shattered Constellation", description: "Martial artist returns from death", author: "Sadoyeon", artist: "Sadoyeon", publisher: "KakaoPage", tags: ["Action", "Martial Arts", "Fantasy"], contentRating: "mature" },
  { title: "Viral Hit", description: "High schooler becomes fighter", author: "Taejun Pak", artist: "Kim Jun", publisher: "Naver Webtoon", tags: ["Action", "Fighting", "School"], contentRating: "mature" },

  // Ecchi/Harem Series
  { title: "To Love-Ru", description: "Boy's life changes when alien princess arrives", author: "Saki Hasemi", artist: "Kentaro Yabuki", publisher: "Shueisha", tags: ["Romance", "Harem", "Aliens"], contentRating: "mature" },
  { title: "To Love-Ru Darkness", description: "Continuation of To Love-Ru", author: "Saki Hasemi", artist: "Kentaro Yabuki", publisher: "Shueisha", tags: ["Romance", "Harem", "Aliens"], contentRating: "mature" },
  { title: "High School DxD", description: "Boy becomes demon's servant", author: "Ichiei Ishibumi", artist: "Hiroji Kikuta", publisher: "Fujimi Shobo", tags: ["Action", "Harem", "Demons"], contentRating: "mature" },
  { title: "Rosario + Vampire", description: "Boy attends monster school", author: "Akihisa Ikeda", artist: "Akihisa Ikeda", publisher: "Shueisha", tags: ["Romance", "Harem", "Monsters"], contentRating: "mature" },
  { title: "Heaven's Lost Property", description: "Boy finds angeloid android", author: "Sou Minazuki", artist: "Sou Minazuki", publisher: "Kadokawa", tags: ["Comedy", "Harem", "Androids"], contentRating: "mature" },
  { title: "Sekirei", description: "Boy becomes Sekirei master", author: "Sakurako Gokurakuin", artist: "Sakurako Gokurakuin", publisher: "Square Enix", tags: ["Action", "Harem", "Superpowers"], contentRating: "mature" },
  { title: "Freezing", description: "Boy becomes Pandora partner", author: "Dall-Young Lim", artist: "Kwang-Hyun Kim", publisher: "Comic Valkyrie", tags: ["Action", "Harem", "Sci-Fi"], contentRating: "mature" },
  { title: "Queen's Blade", description: "Warriors compete in tournament", author: "Hobby Japan", artist: "Various", publisher: "Hobby Japan", tags: ["Action", "Fighting", "Fantasy"], contentRating: "mature" },
  { title: "Ikki Tousen", description: "High school girls fight with ancient powers", author: "Yuji Shiozaki", artist: "Yuji Shiozaki", publisher: "Wani Books", tags: ["Action", "Fighting", "Historical"], contentRating: "mature" },
  { title: "High School of the Dead", description: "Students survive zombie apocalypse", author: "Daisuke Sato", artist: "Shoji Sato", publisher: "Kadokawa", tags: ["Action", "Zombie", "Survival"], contentRating: "mature" },

  // Isekai Series
  { title: "Re:Zero - Starting Life in Another World", description: "Boy can return from death", author: "Tappei Nagatsuki", artist: "Shinichirou Otsuka", publisher: "Kadokawa", tags: ["Isekai", "Fantasy", "Time Loop"], contentRating: "mature" },
  { title: "Konosuba", description: "Boy dies and goes to fantasy world", author: "Natsume Akatsuki", artist: "Masahito Watari", publisher: "Kadokawa", tags: ["Isekai", "Comedy", "Fantasy"], contentRating: "teen" },
  { title: "The Devil is a Part-Timer!", description: "Devil king works part-time", author: "Satoshi Wagahara", artist: "Oniku", publisher: "ASCII Media Works", tags: ["Comedy", "Fantasy", "Workplace"], contentRating: "teen" },
  { title: "No Game No Life", description: "Gaming siblings go to game world", author: "Yu Kamiya", artist: "Mashiro Hiiragi", publisher: "Media Factory", tags: ["Isekai", "Gaming", "Strategy"], contentRating: "mature" },
  { title: "Log Horizon", description: "Players trapped in MMORPG", author: "Mamare Touno", artist: "Kazuhiro Hara", publisher: "Enterbrain", tags: ["Isekai", "Gaming", "Strategy"], contentRating: "teen" },
  { title: "Sword Art Online", description: "Players trapped in VRMMORPG", author: "Reki Kawahara", artist: "abec", publisher: "ASCII Media Works", tags: ["Isekai", "Gaming", "Virtual Reality"], contentRating: "teen" },
  { title: "Accel World", description: "Boy plays virtual fighting game", author: "Reki Kawahara", artist: "Hiroyuki Aigamo", publisher: "ASCII Media Works", tags: ["Gaming", "Virtual Reality", "Fighting"], contentRating: "teen" },
  { title: "Overlord", description: "Gamer trapped in game world", author: "Kugane Maruyama", artist: "so-bin", publisher: "Kadokawa", tags: ["Isekai", "Gaming", "Dark Fantasy"], contentRating: "mature" },
  { title: "How Not to Summon a Demon Lord", description: "Gamer summoned as demon lord", author: "Yukiya Murasaki", artist: "Naoto Fukuda", publisher: "Kodansha", tags: ["Isekai", "Comedy", "Fantasy"], contentRating: "mature" },
  { title: "Arifureta", description: "Weakest student becomes strongest", author: "Ryo Shirakome", artist: "RoGa", publisher: "Overlap", tags: ["Isekai", "Fantasy", "Adventure"], contentRating: "mature" }
];

async function importBatch2WithDEXI(seriesData) {
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

async function bulkImportBatch2() {
  console.log(`🚀 Starting Batch 2 import of ${BATCH_2_MANGA_COLLECTION.length} unique manga/manhwa series...\n`);
  console.log(`📚 Current collection size: 770 series`);
  console.log(`🎯 Target: Add ${BATCH_2_MANGA_COLLECTION.length} more unique series\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < BATCH_2_MANGA_COLLECTION.length; i++) {
    const series = BATCH_2_MANGA_COLLECTION[i];
    console.log(`\n📚 Importing ${i + 1}/${BATCH_2_MANGA_COLLECTION.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importBatch2WithDEXI(series);
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
  console.log('📊 BATCH 2 IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Attempted: ${BATCH_2_MANGA_COLLECTION.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / BATCH_2_MANGA_COLLECTION.length) * 100).toFixed(1)}%`);
  console.log(`🎯 New Collection Size: ${770 + successCount} series`);
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Batch 2 import complete! Your collection keeps growing!');
  
  return {
    total: BATCH_2_MANGA_COLLECTION.length,
    success: successCount,
    failed: failCount,
    results: results,
    newCollectionSize: 770 + successCount
  };
}

bulkImportBatch2();

