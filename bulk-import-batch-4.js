// Fourth batch of unique manga/manhwa series to push collection to 850+ series
const axios = require('axios');

// Another massive collection of unique series across all genres
const BATCH_4_MANGA_COLLECTION = [
  // Psychological/Thriller Series
  { title: "Death Note", description: "Student finds notebook that kills people", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha", tags: ["Thriller", "Psychological", "Supernatural"], contentRating: "mature" },
  { title: "Bakuman", description: "Two boys aim to become manga artists", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha", tags: ["Drama", "Manga", "Slice of Life"], contentRating: "teen" },
  { title: "Platinum End", description: "Boy becomes angel candidate", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha", tags: ["Action", "Supernatural", "Psychological"], contentRating: "mature" },
  { title: "All You Need Is Kill", description: "Soldier stuck in time loop", author: "Hiroshi Sakurazaka", artist: "Takeshi Obata", publisher: "Shueisha", tags: ["Sci-Fi", "Time Loop", "Military"], contentRating: "mature" },
  { title: "Ral Grad", description: "Boy controls monster", author: "Tsugumi Ohba", artist: "Takeshi Obata", publisher: "Shueisha", tags: ["Action", "Supernatural", "Monster"], contentRating: "teen" },
  { title: "Ayakashi Triangle", description: "Ninja becomes girl", author: "Kentaro Yabuki", artist: "Kentaro Yabuki", publisher: "Shueisha", tags: ["Comedy", "Gender Bender", "Ninja"], contentRating: "mature" },
  { title: "Black Cat", description: "Assassin becomes sweeper", author: "Kentaro Yabuki", artist: "Kentaro Yabuki", publisher: "Shueisha", tags: ["Action", "Assassin", "Supernatural"], contentRating: "teen" },
  { title: "To Love-Ru Darkness", description: "Continuation of To Love-Ru", author: "Saki Hasemi", artist: "Kentaro Yabuki", publisher: "Shueisha", tags: ["Romance", "Harem", "Aliens"], contentRating: "mature" },
  { title: "The World God Only Knows", description: "Gamer must make real girls fall in love", author: "Tamiki Wakaki", artist: "Tamiki Wakaki", publisher: "Shogakukan", tags: ["Romance", "Comedy", "Harem"], contentRating: "teen" },
  { title: "TWGOK: Goddesses", description: "Continuation of The World God Only Knows", author: "Tamiki Wakaki", artist: "Tamiki Wakaki", publisher: "Shogakukan", tags: ["Romance", "Comedy", "Harem"], contentRating: "teen" },

  // Supernatural/Action Series
  { title: "Blue Exorcist", description: "Son of Satan becomes exorcist", author: "Kazue Kato", artist: "Kazue Kato", publisher: "Shueisha", tags: ["Action", "Supernatural", "School"], contentRating: "teen" },
  { title: "Seraph of the End", description: "Vampire apocalypse survivors", author: "Takaya Kagami", artist: "Yamato Yamamoto", publisher: "Shueisha", tags: ["Action", "Vampire", "Post-Apocalyptic"], contentRating: "teen" },
  { title: "The Promised Neverland", description: "Orphans discover dark secrets", author: "Kaiu Shirai", artist: "Posuka Demizu", publisher: "Shueisha", tags: ["Action", "Horror", "Thriller"], contentRating: "teen" },
  { title: "Fire Force", description: "Firefighters combat human combustion", author: "Atsushi Ohkubo", artist: "Atsushi Ohkubo", publisher: "Kodansha", tags: ["Action", "Supernatural", "Fire"], contentRating: "teen" },
  { title: "Soul Eater", description: "Students become weapons and meisters", author: "Atsushi Ohkubo", artist: "Atsushi Ohkubo", publisher: "Square Enix", tags: ["Action", "Supernatural", "School"], contentRating: "teen" },
  { title: "Bungo Stray Dogs", description: "Detective agency with supernatural powers", author: "Kafka Asagiri", artist: "Sango Harukawa", publisher: "Kadokawa", tags: ["Action", "Supernatural", "Detective"], contentRating: "teen" },
  { title: "Noragami", description: "God without shrine seeks worshippers", author: "Adachitoka", artist: "Adachitoka", publisher: "Kodansha", tags: ["Action", "Supernatural", "Gods"], contentRating: "teen" },
  { title: "The Seven Deadly Sins", description: "Knights with deadly sins fight demons", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha", tags: ["Fantasy", "Adventure", "Magic"], contentRating: "teen" },
  { title: "Fairy Tail", description: "Wizard guild adventures", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha", tags: ["Fantasy", "Magic", "Adventure"], contentRating: "teen" },
  { title: "Rave Master", description: "Boy searches for Rave stones", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha", tags: ["Fantasy", "Adventure", "Magic"], contentRating: "teen" },

  // Comedy/Gag Series
  { title: "Gintama", description: "Samurai in alternate Edo period", author: "Hideaki Sorachi", artist: "Hideaki Sorachi", publisher: "Shueisha", tags: ["Comedy", "Action", "Samurai"], contentRating: "teen" },
  { title: "Excel Saga", description: "Office worker's absurd adventures", author: "Koshi Rikudo", artist: "Koshi Rikudo", publisher: "Shonengahosha", tags: ["Comedy", "Parody", "Absurd"], contentRating: "mature" },
  { title: "Working!!", description: "Restaurant staff daily life", author: "Karin Anzai", artist: "Karin Anzai", publisher: "Square Enix", tags: ["Comedy", "Slice of Life", "Workplace"], contentRating: "teen" },
  { title: "Yuru Camp", description: "Girls go camping together", author: "Afro", artist: "Afro", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Camping"], contentRating: "safe" },
  { title: "Nichijou", description: "High school girls' absurd daily life", author: "Keiichi Arawi", artist: "Keiichi Arawi", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Absurd"], contentRating: "safe" },
  { title: "Azumanga Daioh", description: "High school girls' daily life", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "MediaWorks", tags: ["Comedy", "Slice of Life", "School"], contentRating: "safe" },
  { title: "Daily Lives of High School Boys", description: "Three boys' ridiculous daily life", author: "Yamauchi Yasunobu", artist: "Yamauchi Yasunobu", publisher: "Square Enix", tags: ["Comedy", "Slice of Life", "School"], contentRating: "teen" },
  { title: "Lucky Star", description: "Otaku girls' daily conversations", author: "Kagami Yoshimizu", artist: "Kagami Yoshimizu", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Otaku"], contentRating: "safe" },
  { title: "K-On!", description: "High school music club adventures", author: "Kakifly", artist: "Kakifly", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Music"], contentRating: "safe" },
  { title: "Yotsuba&!", description: "Little girl's daily adventures", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "ASCII Media Works", tags: ["Slice of Life", "Comedy", "Family"], contentRating: "safe" },

  // Historical/Drama Series
  { title: "Rurouni Kenshin", description: "Former assassin becomes wandering swordsman", author: "Nobuhiro Watsuki", artist: "Nobuhiro Watsuki", publisher: "Shueisha", tags: ["Action", "Historical", "Samurai"], contentRating: "teen" },
  { title: "Vagabond", description: "Sword saint's journey", author: "Takehiko Inoue", artist: "Eiji Yoshikawa", publisher: "Kodansha", tags: ["Historical", "Samurai", "Philosophy"], contentRating: "mature" },
  { title: "Real", description: "Wheelchair basketball players", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha", tags: ["Sports", "Drama", "Disability"], contentRating: "mature" },
  { title: "Planetes", description: "Space debris collectors", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha", tags: ["Sci-Fi", "Space", "Drama"], contentRating: "teen" },
  { title: "Vinland Saga", description: "Viking seeks peaceful land", author: "Makoto Yukimura", artist: "Makoto Yukimura", publisher: "Kodansha", tags: ["Action", "Historical", "Vikings"], contentRating: "mature" },
  { title: "Golden Kamuy", description: "War veteran hunts for Ainu gold", author: "Satoru Noda", artist: "Satoru Noda", publisher: "Shueisha", tags: ["Action", "Historical", "Adventure"], contentRating: "mature" },
  { title: "Kingdom", description: "War orphan becomes great general", author: "Yasuhisa Hara", artist: "Yasuhisa Hara", publisher: "Shueisha", tags: ["Action", "Historical", "War"], contentRating: "mature" },
  { title: "The Rose of Versailles", description: "Woman disguised as man in French Revolution", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Historical", "Drama", "Gender Bender"], contentRating: "teen" },
  { title: "Oniisama e...", description: "Girl's life at elite school", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Drama", "School", "Lesbian"], contentRating: "teen" },
  { title: "The Window of Orpheus", description: "Girl's journey through time", author: "Riyoko Ikeda", artist: "Riyoko Ikeda", publisher: "Shueisha", tags: ["Historical", "Drama", "Time Travel"], contentRating: "teen" },

  // Sci-Fi/Cyberpunk Series
  { title: "Akira", description: "Biker gang in post-apocalyptic Tokyo", author: "Katsuhiro Otomo", artist: "Katsuhiro Otomo", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Post-Apocalyptic"], contentRating: "mature" },
  { title: "Ghost in the Shell", description: "Cyborg cop fights cyber crimes", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Police"], contentRating: "mature" },
  { title: "Appleseed", description: "Soldier fights in utopian city", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Sci-Fi", "Mecha", "Utopia"], contentRating: "mature" },
  { title: "Dominion Tank Police", description: "Police force uses mini-tanks", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Sci-Fi", "Comedy", "Police"], contentRating: "teen" },
  { title: "Black Magic M-66", description: "Girl chased by combat androids", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Sci-Fi", "Action", "Android"], contentRating: "teen" },
  { title: "Orion", description: "Warrior fights in ancient world", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Fantasy", "Historical", "Warrior"], contentRating: "teen" },
  { title: "Blame!", description: "Silent warrior in megastructure city", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Post-Apocalyptic"], contentRating: "mature" },
  { title: "Biomega", description: "Agent fights zombie virus in future", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Zombie", "Cyberpunk"], contentRating: "mature" },
  { title: "Knights of Sidonia", description: "Humanity fights aliens in space", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Mecha", "Space"], contentRating: "mature" },
  { title: "Abara", description: "Monsters called Gauna threaten humanity", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Horror", "Monster"], contentRating: "mature" },

  // Romance/Drama Series
  { title: "Your Name", description: "Boy and girl swap bodies", author: "Makoto Shinkai", artist: "Ranmaru Kotone", publisher: "Kadokawa", tags: ["Romance", "Fantasy", "Body Swap"], contentRating: "teen" },
  { title: "Weathering with You", description: "Boy meets weather-controlling girl", author: "Makoto Shinkai", artist: "Wataru Kubota", publisher: "Kadokawa", tags: ["Romance", "Fantasy", "Weather"], contentRating: "teen" },
  { title: "5 Centimeters Per Second", description: "Boy and girl's long-distance relationship", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Romance", "Drama", "Distance"], contentRating: "teen" },
  { title: "The Garden of Words", description: "Boy and woman meet in rain", author: "Makoto Shinkai", artist: "Midori Motohashi", publisher: "Kadokawa", tags: ["Romance", "Drama", "Age Gap"], contentRating: "teen" },
  { title: "Children Who Chase Lost Voices", description: "Girl's journey to underworld", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Fantasy", "Adventure", "Romance"], contentRating: "teen" },
  { title: "The Place Promised in Our Early Days", description: "Three friends' promise", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Romance", "Drama", "Promise"], contentRating: "teen" },
  { title: "She and Her Cat", description: "Cat's perspective on owner's life", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Slice of Life", "Drama", "Cat"], contentRating: "safe" },
  { title: "Voices of a Distant Star", description: "Long-distance relationship in space", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Romance", "Sci-Fi", "Space"], contentRating: "teen" },
  { title: "Cross Road", description: "Two students' intersecting paths", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Romance", "Drama", "Fate"], contentRating: "teen" },
  { title: "Someone's Gaze", description: "Father and daughter's relationship", author: "Makoto Shinkai", artist: "Makoto Shinkai", publisher: "Kadokawa", tags: ["Drama", "Family", "Slice of Life"], contentRating: "safe" }
];

async function importBatch4WithDEXI(seriesData) {
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

async function bulkImportBatch4() {
  console.log(`🚀 Starting Batch 4 import of ${BATCH_4_MANGA_COLLECTION.length} unique manga/manhwa series...\n`);
  console.log(`📚 Current collection size: 815 series`);
  console.log(`🎯 Target: Add ${BATCH_4_MANGA_COLLECTION.length} more unique series to reach 850+!\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < BATCH_4_MANGA_COLLECTION.length; i++) {
    const series = BATCH_4_MANGA_COLLECTION[i];
    console.log(`\n📚 Importing ${i + 1}/${BATCH_4_MANGA_COLLECTION.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importBatch4WithDEXI(series);
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
  console.log('📊 BATCH 4 IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Attempted: ${BATCH_4_MANGA_COLLECTION.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / BATCH_4_MANGA_COLLECTION.length) * 100).toFixed(1)}%`);
  console.log(`🎯 New Collection Size: ${815 + successCount} series`);
  
  if (815 + successCount >= 850) {
    console.log(`🎉 NEW MILESTONE REACHED: Your collection now has 850+ series! 🎉`);
  }
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Batch 4 import complete! Your collection is now absolutely massive!');
  
  return {
    total: BATCH_4_MANGA_COLLECTION.length,
    success: successCount,
    failed: failCount,
    results: results,
    newCollectionSize: 815 + successCount
  };
}

bulkImportBatch4();
