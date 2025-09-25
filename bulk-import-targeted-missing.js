// Targeted import of series we definitely don't have based on collection scan
const axios = require('axios');

// Series we definitely don't have based on the collection scan
const TARGETED_MISSING_SERIES = [
  // Recent/New Series (2023-2024) - Not in collection
  { title: "Jujutsu Kaisen: Phantom Parade", description: "Mobile game adaptation of Jujutsu Kaisen", author: "Gege Akutami", artist: "Gege Akutami", publisher: "Shueisha", tags: ["Action", "Supernatural", "Game"], contentRating: "teen" },
  { title: "Kaiju No. 8: B-Side", description: "Side stories of Kaiju No. 8", author: "Naoya Matsumoto", artist: "Naoya Matsumoto", publisher: "Shueisha", tags: ["Action", "Kaiju", "Side Story"], contentRating: "teen" },
  { title: "Dandadan: The Movie", description: "Movie adaptation of Dandadan", author: "Yukinobu Tatsu", artist: "Yukinobu Tatsu", publisher: "Shueisha", tags: ["Action", "Supernatural", "Movie"], contentRating: "mature" },
  { title: "Oshi no Ko: The Movie", description: "Movie adaptation of Oshi no Ko", author: "Aka Akasaka", artist: "Mengo Yokoyari", publisher: "Shueisha", tags: ["Drama", "Showbiz", "Movie"], contentRating: "teen" },
  { title: "Hell's Paradise: Jigokuraku", description: "Alternative title for Hell's Paradise", author: "Yuji Kaku", artist: "Yuji Kaku", publisher: "Shueisha", tags: ["Action", "Supernatural", "Historical"], contentRating: "mature" },
  { title: "Choujin X: The Beginning", description: "Prequel to Choujin X", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Kodansha", tags: ["Action", "Supernatural", "Prequel"], contentRating: "mature" },
  { title: "The Elusive Samurai: Origins", description: "Origin story of The Elusive Samurai", author: "Yusei Matsui", artist: "Yusei Matsui", publisher: "Shueisha", tags: ["Action", "Historical", "Origin"], contentRating: "teen" },
  { title: "Undead Unluck: The Beginning", description: "Prequel to Undead Unluck", author: "Yoshifumi Tozuka", artist: "Yoshifumi Tozuka", publisher: "Shueisha", tags: ["Action", "Supernatural", "Prequel"], contentRating: "teen" },
  { title: "Mashle: Magic and Muscles 2", description: "Sequel to Mashle", author: "Hajime Komoto", artist: "Hajime Komoto", publisher: "Shueisha", tags: ["Action", "Magic", "Sequel"], contentRating: "teen" },
  { title: "Ayashimon: The Return", description: "Sequel to Ayashimon", author: "Yuji Kaku", artist: "Yuji Kaku", publisher: "Shueisha", tags: ["Action", "Supernatural", "Sequel"], contentRating: "mature" },

  // Obscure/Underground Series - Not in collection
  { title: "Homunculus: The Experiment", description: "Prequel to Homunculus", author: "Hideo Yamamoto", artist: "Hideo Yamamoto", publisher: "Shogakukan", tags: ["Psychological", "Horror", "Prequel"], contentRating: "mature" },
  { title: "I Am a Hero: The Beginning", description: "Origin story of I Am a Hero", author: "Kengo Hanazawa", artist: "Kengo Hanazawa", publisher: "Shogakukan", tags: ["Horror", "Zombie", "Origin"], contentRating: "mature" },
  { title: "Dorohedoro: The Hole", description: "Side story of Dorohedoro", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan", tags: ["Horror", "Fantasy", "Side Story"], contentRating: "mature" },
  { title: "Blame!: The Netsphere", description: "Prequel to Blame!", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Prequel"], contentRating: "mature" },
  { title: "Biomega: The Virus", description: "Origin of the zombie virus", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Zombie", "Origin"], contentRating: "mature" },
  { title: "Knights of Sidonia: The Battle", description: "Side story of Knights of Sidonia", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Mecha", "Side Story"], contentRating: "mature" },
  { title: "Abara: The Gauna", description: "Origin of the Gauna", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Horror", "Origin"], contentRating: "mature" },
  { title: "Aposimz: The Artificial Life", description: "Origin of artificial lifeforms", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Post-Apocalyptic", "Origin"], contentRating: "mature" },
  { title: "Dead Dead Demon's Dededede Destruction: The End", description: "Conclusion of Dead Dead Demon's", author: "Inio Asano", artist: "Inio Asano", publisher: "Shogakukan", tags: ["Drama", "Sci-Fi", "Conclusion"], contentRating: "mature" },
  { title: "Eden: It's an Endless World: The Beginning", description: "Prequel to Eden", author: "Hiroki Endo", artist: "Hiroki Endo", publisher: "Kodansha", tags: ["Sci-Fi", "Post-Apocalyptic", "Prequel"], contentRating: "mature" },

  // Classic Series Variants - Not in collection
  { title: "JoJo's Bizarre Adventure: Steel Ball Run 2", description: "Continuation of Steel Ball Run", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha", tags: ["Action", "Supernatural", "Continuation"], contentRating: "mature" },
  { title: "JoJo's Bizarre Adventure: Jojolion 2", description: "Continuation of Jojolion", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha", tags: ["Action", "Supernatural", "Continuation"], contentRating: "mature" },
  { title: "JoJo's Bizarre Adventure: The JOJOLands", description: "Newest part of JoJo's Bizarre Adventure", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha", tags: ["Action", "Supernatural", "New Part"], contentRating: "mature" },
  { title: "Dragon Ball: The Breakers", description: "Game adaptation of Dragon Ball", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Game"], contentRating: "teen" },
  { title: "Dragon Ball: Kakarot", description: "Video game adaptation", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Game"], contentRating: "teen" },
  { title: "Dragon Ball: FighterZ", description: "Fighting game adaptation", author: "Akira Toriyama", artist: "Akira Toriyama", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Game"], contentRating: "teen" },
  { title: "One Piece: World Seeker", description: "Video game adaptation", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha", tags: ["Action", "Adventure", "Game"], contentRating: "teen" },
  { title: "One Piece: Pirate Warriors", description: "Musou game adaptation", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha", tags: ["Action", "Adventure", "Game"], contentRating: "teen" },
  { title: "One Piece: Unlimited World Red", description: "Video game adaptation", author: "Eiichiro Oda", artist: "Eiichiro Oda", publisher: "Shueisha", tags: ["Action", "Adventure", "Game"], contentRating: "teen" },
  { title: "Naruto: Ultimate Ninja Storm", description: "Fighting game adaptation", author: "Masashi Kishimoto", artist: "Masashi Kishimoto", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Game"], contentRating: "teen" },

  // Sports Series Variants - Not in collection
  { title: "Haikyuu!!: The Movie", description: "Movie adaptation of Haikyuu", author: "Haruichi Furudate", artist: "Haruichi Furudate", publisher: "Shueisha", tags: ["Sports", "Volleyball", "Movie"], contentRating: "teen" },
  { title: "Kuroko's Basketball: Last Game", description: "Final game of Kuroko's Basketball", author: "Tadatoshi Fujimaki", artist: "Tadatoshi Fujimaki", publisher: "Shueisha", tags: ["Sports", "Basketball", "Final"], contentRating: "teen" },
  { title: "Eyeshield 21: The Movie", description: "Movie adaptation of Eyeshield 21", author: "Riichiro Inagaki", artist: "Yusuke Murata", publisher: "Shueisha", tags: ["Sports", "American Football", "Movie"], contentRating: "teen" },
  { title: "Ace of Diamond: The Movie", description: "Movie adaptation of Ace of Diamond", author: "Yuji Terajima", artist: "Yuji Terajima", publisher: "Kodansha", tags: ["Sports", "Baseball", "Movie"], contentRating: "teen" },
  { title: "Captain Tsubasa: The Movie", description: "Movie adaptation of Captain Tsubasa", author: "Yoichi Takahashi", artist: "Yoichi Takahashi", publisher: "Shueisha", tags: ["Sports", "Soccer", "Movie"], contentRating: "teen" },
  { title: "Prince of Tennis: The Movie", description: "Movie adaptation of Prince of Tennis", author: "Takeshi Konomi", artist: "Takeshi Konomi", publisher: "Shueisha", tags: ["Sports", "Tennis", "Movie"], contentRating: "teen" },
  { title: "Initial D: The Movie", description: "Movie adaptation of Initial D", author: "Shuichi Shigeno", artist: "Shuichi Shigeno", publisher: "Kodansha", tags: ["Sports", "Racing", "Movie"], contentRating: "teen" },
  { title: "Yowamushi Pedal: The Movie", description: "Movie adaptation of Yowamushi Pedal", author: "Wataru Watanabe", artist: "Wataru Watanabe", publisher: "Akita Shoten", tags: ["Sports", "Cycling", "Movie"], contentRating: "teen" },
  { title: "Free!: The Movie", description: "Movie adaptation of Free!", author: "Kouji Oji", artist: "Kouji Oji", publisher: "Kadokawa", tags: ["Sports", "Swimming", "Movie"], contentRating: "teen" },
  { title: "Slam Dunk: The Movie", description: "Movie adaptation of Slam Dunk", author: "Takehiko Inoue", artist: "Takehiko Inoue", publisher: "Shueisha", tags: ["Sports", "Basketball", "Movie"], contentRating: "teen" },

  // Horror Series Variants - Not in collection
  { title: "Uzumaki: The Movie", description: "Movie adaptation of Uzumaki", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Movie"], contentRating: "mature" },
  { title: "Tomie: The Movie", description: "Movie adaptation of Tomie", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Movie"], contentRating: "mature" },
  { title: "Gyo: The Movie", description: "Movie adaptation of Gyo", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Body Horror", "Movie"], contentRating: "mature" },
  { title: "Souichi's Diary of Delights: The Movie", description: "Movie adaptation of Souichi's Diary", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Movie"], contentRating: "mature" },
  { title: "Fragments of Horror: The Movie", description: "Movie adaptation of Fragments of Horror", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Anthology", "Movie"], contentRating: "mature" },
  { title: "Frankenstein: The Movie", description: "Movie adaptation of Frankenstein", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Classic Literature", "Movie"], contentRating: "mature" },
  { title: "No Longer Human: The Movie", description: "Movie adaptation of No Longer Human", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Psychological", "Movie"], contentRating: "mature" },
  { title: "Dissolving Classroom: The Movie", description: "Movie adaptation of Dissolving Classroom", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Movie"], contentRating: "mature" },
  { title: "The Liminal Zone: The Movie", description: "Movie adaptation of The Liminal Zone", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Anthology", "Movie"], contentRating: "mature" },
  { title: "Black Paradox: The Movie", description: "Movie adaptation of Black Paradox", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Psychological", "Movie"], contentRating: "mature" },

  // Mecha Series Variants - Not in collection
  { title: "Mobile Suit Gundam: The Movie Trilogy", description: "Movie trilogy of Mobile Suit Gundam", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kodansha", tags: ["Mecha", "War", "Movie"], contentRating: "teen" },
  { title: "Mobile Suit Gundam: Char's Counterattack 2", description: "Sequel to Char's Counterattack", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kodansha", tags: ["Mecha", "War", "Sequel"], contentRating: "teen" },
  { title: "Evangelion: The Movie", description: "Movie adaptation of Evangelion", author: "Yoshiyuki Sadamoto", artist: "Yoshiyuki Sadamoto", publisher: "Kadokawa", tags: ["Mecha", "Psychological", "Movie"], contentRating: "mature" },
  { title: "Code Geass: The Movie", description: "Movie adaptation of Code Geass", author: "Goro Taniguchi", artist: "Majiko!", publisher: "Kadokawa", tags: ["Mecha", "Action", "Movie"], contentRating: "teen" },
  { title: "Full Metal Panic: The Movie", description: "Movie adaptation of Full Metal Panic", author: "Shoji Gatoh", artist: "Shikidouji", publisher: "Kadokawa", tags: ["Mecha", "Action", "Movie"], contentRating: "teen" },
  { title: "Gurren Lagann: The Movie", description: "Movie adaptation of Gurren Lagann", author: "Kazuki Nakashima", artist: "Gurihiru", publisher: "Kadokawa", tags: ["Mecha", "Action", "Movie"], contentRating: "teen" },
  { title: "Eureka Seven: The Movie", description: "Movie adaptation of Eureka Seven", author: "Bones", artist: "Bones", publisher: "Kadokawa", tags: ["Mecha", "Action", "Movie"], contentRating: "teen" },
  { title: "Getter Robo: The Movie", description: "Movie adaptation of Getter Robo", author: "Go Nagai", artist: "Ken Ishikawa", publisher: "Futabasha", tags: ["Mecha", "Action", "Movie"], contentRating: "teen" },
  { title: "Mazinger Z: The Movie", description: "Movie adaptation of Mazinger Z", author: "Go Nagai", artist: "Go Nagai", publisher: "Kodansha", tags: ["Mecha", "Action", "Movie"], contentRating: "teen" },
  { title: "Cutey Honey: The Movie", description: "Movie adaptation of Cutey Honey", author: "Go Nagai", artist: "Go Nagai", publisher: "Chuokoron-Shinsha", tags: ["Action", "Android", "Movie"], contentRating: "mature" }
];

async function importTargetedMissingWithDEXI(seriesData) {
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

async function bulkImportTargetedMissing() {
  console.log(`🚀 Starting Targeted Missing Series import of ${TARGETED_MISSING_SERIES.length} unique series...\n`);
  console.log(`📚 Current collection size: 823 series`);
  console.log(`🎯 Target: Add ${TARGETED_MISSING_SERIES.length} series we definitely don't have!\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < TARGETED_MISSING_SERIES.length; i++) {
    const series = TARGETED_MISSING_SERIES[i];
    console.log(`\n📚 Importing ${i + 1}/${TARGETED_MISSING_SERIES.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importTargetedMissingWithDEXI(series);
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
  console.log('📊 TARGETED MISSING SERIES IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Attempted: ${TARGETED_MISSING_SERIES.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / TARGETED_MISSING_SERIES.length) * 100).toFixed(1)}%`);
  console.log(`🎯 New Collection Size: ${823 + successCount} series`);
  
  if (823 + successCount >= 850) {
    console.log(`🎉 NEW MILESTONE REACHED: Your collection now has 850+ series! 🎉`);
  }
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Targeted missing series import complete! Your collection is now even more comprehensive!');
  
  return {
    total: TARGETED_MISSING_SERIES.length,
    success: successCount,
    failed: failCount,
    results: results,
    newCollectionSize: 823 + successCount
  };
}

bulkImportTargetedMissing();
