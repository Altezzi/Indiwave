// Third batch of unique manga/manhwa series to push collection to 800+ series
const axios = require('axios');

// Another massive collection of unique series across all genres
const BATCH_3_MANGA_COLLECTION = [
  // Classic/Retro Series
  { title: "Dragon Quest: The Adventure of Dai", description: "Boy becomes hero in Dragon Quest world", author: "Riku Sanjo", artist: "Koji Inada", publisher: "Shueisha", tags: ["Fantasy", "Adventure", "RPG"], contentRating: "teen" },
  { title: "Saint Seiya", description: "Bronze Saints protect Athena", author: "Masami Kurumada", artist: "Masami Kurumada", publisher: "Shueisha", tags: ["Action", "Fantasy", "Greek Mythology"], contentRating: "teen" },
  { title: "Fist of the North Star", description: "Martial artist in post-apocalyptic world", author: "Buronson", artist: "Tetsuo Hara", publisher: "Shueisha", tags: ["Action", "Martial Arts", "Post-Apocalyptic"], contentRating: "mature" },
  { title: "JoJo's Bizarre Adventure", description: "Joestar family's supernatural adventures", author: "Hirohiko Araki", artist: "Hirohiko Araki", publisher: "Shueisha", tags: ["Action", "Supernatural", "Adventure"], contentRating: "mature" },
  { title: "City Hunter", description: "Sweeper solves cases in Tokyo", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha", tags: ["Action", "Comedy", "Detective"], contentRating: "mature" },
  { title: "Cat's Eye", description: "Sisters steal art to find their father", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha", tags: ["Action", "Romance", "Thief"], contentRating: "teen" },
  { title: "Maison Ikkoku", description: "Student falls for apartment manager", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Romance", "Comedy", "Slice of Life"], contentRating: "teen" },
  { title: "Ranma 1/2", description: "Boy turns into girl when splashed with water", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Comedy", "Martial Arts", "Gender Bender"], contentRating: "teen" },
  { title: "Inuyasha", description: "Girl travels to feudal Japan with half-demon", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Action", "Fantasy", "Historical"], contentRating: "teen" },
  { title: "Urusei Yatsura", description: "Boy's life changes when alien princess arrives", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Comedy", "Romance", "Aliens"], contentRating: "teen" },

  // Sports Manga
  { title: "Hajime no Ippo", description: "Shy boy becomes boxing champion", author: "George Morikawa", artist: "George Morikawa", publisher: "Kodansha", tags: ["Sports", "Boxing", "School"], contentRating: "teen" },
  { title: "Touch", description: "Twin brothers' baseball rivalry", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Baseball", "Romance"], contentRating: "teen" },
  { title: "Cross Game", description: "Boy's baseball journey after friend's death", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Baseball", "Drama"], contentRating: "teen" },
  { title: "H2", description: "Two friends' baseball rivalry", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Baseball", "Romance"], contentRating: "teen" },
  { title: "Rough", description: "Swimmer and diver's romance", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Swimming", "Romance"], contentRating: "teen" },
  { title: "Katsu!", description: "Boxer's journey to championship", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Boxing", "Romance"], contentRating: "teen" },
  { title: "Mix", description: "Baseball team's journey to Koshien", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Baseball", "School"], contentRating: "teen" },
  { title: "Q and A", description: "Boxer's comeback story", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Boxing", "Drama"], contentRating: "teen" },
  { title: "Slow Step", description: "Softball player's love triangle", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Softball", "Romance"], contentRating: "teen" },
  { title: "Short Program", description: "Various sports short stories", author: "Mitsuru Adachi", artist: "Mitsuru Adachi", publisher: "Shogakukan", tags: ["Sports", "Anthology", "Romance"], contentRating: "teen" },

  // Mecha Series
  { title: "Mobile Suit Gundam", description: "War in space with giant robots", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kodansha", tags: ["Mecha", "War", "Space"], contentRating: "teen" },
  { title: "Mobile Suit Gundam: The Origin", description: "Gundam's origin story", author: "Yoshikazu Yasuhiko", artist: "Yoshikazu Yasuhiko", publisher: "Kodansha", tags: ["Mecha", "War", "Space"], contentRating: "teen" },
  { title: "Mobile Suit Zeta Gundam", description: "Continuation of Gundam story", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kodansha", tags: ["Mecha", "War", "Space"], contentRating: "teen" },
  { title: "Mobile Suit Gundam ZZ", description: "Gundam ZZ's adventures", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kodansha", tags: ["Mecha", "War", "Space"], contentRating: "teen" },
  { title: "Mobile Suit Gundam: Char's Counterattack", description: "Final battle between Char and Amuro", author: "Yoshiyuki Tomino", artist: "Yoshiyuki Tomino", publisher: "Kodansha", tags: ["Mecha", "War", "Space"], contentRating: "teen" },
  { title: "Evangelion", description: "Teenagers pilot giant robots against angels", author: "Yoshiyuki Sadamoto", artist: "Yoshiyuki Sadamoto", publisher: "Kadokawa", tags: ["Mecha", "Psychological", "Sci-Fi"], contentRating: "mature" },
  { title: "Code Geass", description: "Prince gains power to command anyone", author: "Goro Taniguchi", artist: "Majiko!", publisher: "Kadokawa", tags: ["Mecha", "Action", "Supernatural"], contentRating: "teen" },
  { title: "Full Metal Panic", description: "Soldier protects girl at school", author: "Shoji Gatoh", artist: "Shikidouji", publisher: "Kadokawa", tags: ["Mecha", "Action", "School"], contentRating: "teen" },
  { title: "Gurren Lagann", description: "Underground boy pilots giant robot", author: "Kazuki Nakashima", artist: "Gurihiru", publisher: "Kadokawa", tags: ["Mecha", "Action", "Sci-Fi"], contentRating: "teen" },
  { title: "Eureka Seven", description: "Boy joins resistance group", author: "Bones", artist: "Bones", publisher: "Kadokawa", tags: ["Mecha", "Action", "Romance"], contentRating: "teen" },

  // Horror/Thriller Series
  { title: "Uzumaki", description: "Town cursed by spiral patterns", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Psychological"], contentRating: "mature" },
  { title: "Tomie", description: "Beautiful girl with regenerative powers", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Psychological"], contentRating: "mature" },
  { title: "Gyo", description: "Fish with mechanical legs invade land", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Body Horror", "Sci-Fi"], contentRating: "mature" },
  { title: "Souichi's Diary of Delights", description: "Evil boy's supernatural diary", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Comedy"], contentRating: "mature" },
  { title: "Fragments of Horror", description: "Collection of horror short stories", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Anthology", "Supernatural"], contentRating: "mature" },
  { title: "Frankenstein", description: "Junji Ito's adaptation of Frankenstein", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Classic Literature", "Monster"], contentRating: "mature" },
  { title: "No Longer Human", description: "Man's psychological descent", author: "Junji Ito", artist: "Osamu Dazai", publisher: "Asahi Sonorama", tags: ["Horror", "Psychological", "Drama"], contentRating: "mature" },
  { title: "Dissolving Classroom", description: "Brother and sister's supernatural powers", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Supernatural", "Family"], contentRating: "mature" },
  { title: "The Liminal Zone", description: "Collection of supernatural stories", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Anthology", "Supernatural"], contentRating: "mature" },
  { title: "Black Paradox", description: "Four people's suicide pact", author: "Junji Ito", artist: "Junji Ito", publisher: "Asahi Sonorama", tags: ["Horror", "Psychological", "Sci-Fi"], contentRating: "mature" },

  // Slice of Life/Comedy Series
  { title: "Yotsuba&!", description: "Little girl's daily adventures", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "ASCII Media Works", tags: ["Slice of Life", "Comedy", "Family"], contentRating: "safe" },
  { title: "Lucky Star", description: "Otaku girls' daily conversations", author: "Kagami Yoshimizu", artist: "Kagami Yoshimizu", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Otaku"], contentRating: "safe" },
  { title: "K-On!", description: "High school music club adventures", author: "Kakifly", artist: "Kakifly", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Music"], contentRating: "safe" },
  { title: "Nichijou", description: "High school girls' absurd daily life", author: "Keiichi Arawi", artist: "Keiichi Arawi", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Absurd"], contentRating: "safe" },
  { title: "Azumanga Daioh", description: "High school girls' daily life", author: "Kiyohiko Azuma", artist: "Kiyohiko Azuma", publisher: "MediaWorks", tags: ["Comedy", "Slice of Life", "School"], contentRating: "safe" },
  { title: "Daily Lives of High School Boys", description: "Three boys' ridiculous daily life", author: "Yamauchi Yasunobu", artist: "Yamauchi Yasunobu", publisher: "Square Enix", tags: ["Comedy", "Slice of Life", "School"], contentRating: "teen" },
  { title: "Gintama", description: "Samurai in alternate Edo period", author: "Hideaki Sorachi", artist: "Hideaki Sorachi", publisher: "Shueisha", tags: ["Comedy", "Action", "Samurai"], contentRating: "teen" },
  { title: "Excel Saga", description: "Office worker's absurd adventures", author: "Koshi Rikudo", artist: "Koshi Rikudo", publisher: "Shonengahosha", tags: ["Comedy", "Parody", "Absurd"], contentRating: "mature" },
  { title: "Working!!", description: "Restaurant staff daily life", author: "Karin Anzai", artist: "Karin Anzai", publisher: "Square Enix", tags: ["Comedy", "Slice of Life", "Workplace"], contentRating: "teen" },
  { title: "Yuru Camp", description: "Girls go camping together", author: "Afro", artist: "Afro", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Camping"], contentRating: "safe" },

  // Fantasy/Magic Series
  { title: "Fairy Tail", description: "Wizard guild adventures", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha", tags: ["Fantasy", "Magic", "Adventure"], contentRating: "teen" },
  { title: "Rave Master", description: "Boy searches for Rave stones", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha", tags: ["Fantasy", "Adventure", "Magic"], contentRating: "teen" },
  { title: "Edens Zero", description: "Boy's space adventure with friends", author: "Hiro Mashima", artist: "Hiro Mashima", publisher: "Kodansha", tags: ["Fantasy", "Space", "Adventure"], contentRating: "teen" },
  { title: "Black Clover", description: "Magic-less boy aims to become Wizard King", author: "Yuki Tabata", artist: "Yuki Tabata", publisher: "Shueisha", tags: ["Action", "Fantasy", "Magic"], contentRating: "teen" },
  { title: "The Seven Deadly Sins", description: "Knights with deadly sins fight demons", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha", tags: ["Fantasy", "Adventure", "Magic"], contentRating: "teen" },
  { title: "Four Knights of the Apocalypse", description: "Son of Seven Deadly Sins", author: "Nakaba Suzuki", artist: "Nakaba Suzuki", publisher: "Kodansha", tags: ["Fantasy", "Adventure", "Magic"], contentRating: "teen" },
  { title: "The Ancient Magus' Bride", description: "Girl becomes apprentice to ancient mage", author: "Kore Yamazaki", artist: "Kore Yamazaki", publisher: "Mag Garden", tags: ["Fantasy", "Magic", "Supernatural"], contentRating: "teen" },
  { title: "Witch Hat Atelier", description: "Girl discovers magical drawing abilities", author: "Kamome Shirahama", artist: "Kamome Shirahama", publisher: "Kodansha", tags: ["Fantasy", "Magic", "Art"], contentRating: "teen" },
  { title: "The Misfit of Demon King Academy", description: "Demon king reincarnates in modern era", author: "Shu", artist: "Kayaharuka", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Magic"], contentRating: "teen" },
  { title: "The Rising of the Shield Hero", description: "Gamer summoned as shield hero", author: "Aneko Yusagi", artist: "Minami Seira", publisher: "Kadokawa", tags: ["Fantasy", "Isekai", "Adventure"], contentRating: "teen" }
];

async function importBatch3WithDEXI(seriesData) {
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

async function bulkImportBatch3() {
  console.log(`🚀 Starting Batch 3 import of ${BATCH_3_MANGA_COLLECTION.length} unique manga/manhwa series...\n`);
  console.log(`📚 Current collection size: 795 series`);
  console.log(`🎯 Target: Add ${BATCH_3_MANGA_COLLECTION.length} more unique series to reach 800+!\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < BATCH_3_MANGA_COLLECTION.length; i++) {
    const series = BATCH_3_MANGA_COLLECTION[i];
    console.log(`\n📚 Importing ${i + 1}/${BATCH_3_MANGA_COLLECTION.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importBatch3WithDEXI(series);
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
  console.log('📊 BATCH 3 IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Attempted: ${BATCH_3_MANGA_COLLECTION.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / BATCH_3_MANGA_COLLECTION.length) * 100).toFixed(1)}%`);
  console.log(`🎯 New Collection Size: ${795 + successCount} series`);
  
  if (795 + successCount >= 800) {
    console.log(`🎉 MILESTONE REACHED: Your collection now has 800+ series! 🎉`);
  }
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Batch 3 import complete! Your collection is now massive!');
  
  return {
    total: BATCH_3_MANGA_COLLECTION.length,
    success: successCount,
    failed: failCount,
    results: results,
    newCollectionSize: 795 + successCount
  };
}

bulkImportBatch3();
