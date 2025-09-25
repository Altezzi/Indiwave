// Import completely new, unique manga/manhwa series that haven't been added yet
const axios = require('axios');

// Completely new and unique series across all genres
const UNIQUE_MANGA_COLLECTION = [
  // Recent/New Popular Series (2020-2024)
  { title: "Kaiju No. 8", description: "Man becomes kaiju in kaiju-fighting organization", author: "Naoya Matsumoto", artist: "Naoya Matsumoto", publisher: "Shueisha", tags: ["Action", "Kaiju", "Superhero"], contentRating: "teen" },
  { title: "Sakamoto Days", description: "Former legendary hitman now runs convenience store", author: "Yuto Suzuki", artist: "Yuto Suzuki", publisher: "Shueisha", tags: ["Action", "Comedy", "Assassin"], contentRating: "teen" },
  { title: "Dandadan", description: "Boy and girl fight supernatural threats", author: "Yukinobu Tatsu", artist: "Yukinobu Tatsu", publisher: "Shueisha", tags: ["Action", "Supernatural", "Comedy"], contentRating: "mature" },
  { title: "Oshi no Ko", description: "Doctor reincarnates as idol's child", author: "Aka Akasaka", artist: "Mengo Yokoyari", publisher: "Shueisha", tags: ["Drama", "Showbiz", "Reincarnation"], contentRating: "teen" },
  { title: "Hell's Paradise", description: "Ninja seeks immortality on cursed island", author: "Yuji Kaku", artist: "Yuji Kaku", publisher: "Shueisha", tags: ["Action", "Supernatural", "Historical"], contentRating: "mature" },
  { title: "Choujin X", description: "Boy gains superpowers in modern world", author: "Sui Ishida", artist: "Sui Ishida", publisher: "Kodansha", tags: ["Action", "Supernatural", "Transformation"], contentRating: "mature" },
  { title: "The Elusive Samurai", description: "Young samurai seeks to restore his clan", author: "Yusei Matsui", artist: "Yusei Matsui", publisher: "Shueisha", tags: ["Action", "Historical", "Samurai"], contentRating: "teen" },
  { title: "Undead Unluck", description: "Immortal girl and unlucky boy team up", author: "Yoshifumi Tozuka", artist: "Yoshifumi Tozuka", publisher: "Shueisha", tags: ["Action", "Supernatural", "Comedy"], contentRating: "teen" },
  { title: "Mashle", description: "Muscle-bound boy in magic world", author: "Hajime Komoto", artist: "Hajime Komoto", publisher: "Shueisha", tags: ["Action", "Magic", "Comedy"], contentRating: "teen" },
  { title: "Ayashimon", description: "Boy becomes yakuza in supernatural world", author: "Yuji Kaku", artist: "Yuji Kaku", publisher: "Shueisha", tags: ["Action", "Supernatural", "Yakuza"], contentRating: "mature" },

  // Lesser-Known but Quality Series
  { title: "Golden Time", description: "College student with amnesia finds love", author: "Yuyuko Takemiya", artist: "Umechazuke", publisher: "ASCII Media Works", tags: ["Romance", "Drama", "College"], contentRating: "teen" },
  { title: "Toradora", description: "Short boy and scary girl form alliance", author: "Yuyuko Takemiya", artist: "Zekkyo", publisher: "ASCII Media Works", tags: ["Romance", "Comedy", "School"], contentRating: "teen" },
  { title: "A Certain Scientific Railgun", description: "Electromaster fights in Academy City", author: "Kazuma Kamachi", artist: "Motoi Fuyukawa", publisher: "ASCII Media Works", tags: ["Action", "Sci-Fi", "Superpowers"], contentRating: "teen" },
  { title: "The World God Only Knows", description: "Gamer must make real girls fall in love", author: "Tamiki Wakaki", artist: "Tamiki Wakaki", publisher: "Shogakukan", tags: ["Romance", "Comedy", "Harem"], contentRating: "teen" },
  { title: "Haganai", description: "Misfit students form friendship club", author: "Yomi Hirasaka", artist: "Buriki", publisher: "Media Factory", tags: ["Comedy", "School", "Slice of Life"], contentRating: "teen" },
  { title: "Baka and Test", description: "Idiot students fight with test scores", author: "Kenji Inoue", artist: "Yui Haga", publisher: "Fujimi Shobo", tags: ["Comedy", "School", "Fantasy"], contentRating: "teen" },
  { title: "The Melancholy of Haruhi Suzumiya", description: "Girl creates SOS Brigade for supernatural", author: "Nagaru Tanigawa", artist: "Gaku Tsugawa", publisher: "Kadokawa", tags: ["Comedy", "Supernatural", "School"], contentRating: "teen" },
  { title: "Lucky Star", description: "Otaku girls' daily conversations and life", author: "Kagami Yoshimizu", artist: "Kagami Yoshimizu", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Otaku"], contentRating: "safe" },
  { title: "K-On!", description: "High school music club adventures", author: "Kakifly", artist: "Kakifly", publisher: "Houbunsha", tags: ["Comedy", "Slice of Life", "Music"], contentRating: "safe" },
  { title: "Nichijou", description: "High school girls' absurd daily life", author: "Keiichi Arawi", artist: "Keiichi Arawi", publisher: "Kadokawa", tags: ["Comedy", "Slice of Life", "Absurd"], contentRating: "safe" },

  // Obscure/Underground Series
  { title: "Homunculus", description: "Man undergoes trepanation and sees homunculi", author: "Hideo Yamamoto", artist: "Hideo Yamamoto", publisher: "Shogakukan", tags: ["Psychological", "Horror", "Mind"], contentRating: "mature" },
  { title: "Gantz", description: "Dead people forced to hunt aliens", author: "Hiroya Oku", artist: "Hiroya Oku", publisher: "Shueisha", tags: ["Action", "Sci-Fi", "Horror"], contentRating: "mature" },
  { title: "I Am a Hero", description: "Manga assistant survives zombie apocalypse", author: "Kengo Hanazawa", artist: "Kengo Hanazawa", publisher: "Shogakukan", tags: ["Horror", "Zombie", "Survival"], contentRating: "mature" },
  { title: "Dorohedoro", description: "Man searches for sorcerer who cursed him", author: "Q Hayashida", artist: "Q Hayashida", publisher: "Shogakukan", tags: ["Horror", "Fantasy", "Dark Comedy"], contentRating: "mature" },
  { title: "Blame!", description: "Silent warrior in megastructure city", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Cyberpunk", "Post-Apocalyptic"], contentRating: "mature" },
  { title: "Biomega", description: "Agent fights zombie virus in future", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Zombie", "Cyberpunk"], contentRating: "mature" },
  { title: "Knights of Sidonia", description: "Humanity fights aliens in space", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Mecha", "Space"], contentRating: "mature" },
  { title: "Abara", description: "Monsters called Gauna threaten humanity", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Horror", "Monster"], contentRating: "mature" },
  { title: "Aposimz", description: "Humanity fights artificial lifeforms", author: "Tsutomu Nihei", artist: "Tsutomu Nihei", publisher: "Kodansha", tags: ["Sci-Fi", "Post-Apocalyptic", "Artificial Life"], contentRating: "mature" },
  { title: "Dead Dead Demon's Dededede Destruction", description: "Teenagers live under alien mothership", author: "Inio Asano", artist: "Inio Asano", publisher: "Shogakukan", tags: ["Drama", "Sci-Fi", "Coming of Age"], contentRating: "mature" },

  // Classic/Retro Series
  { title: "City Hunter", description: "Sweeper solves cases in Tokyo", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha", tags: ["Action", "Comedy", "Detective"], contentRating: "mature" },
  { title: "Cat's Eye", description: "Sisters steal art to find their father", author: "Tsukasa Hojo", artist: "Tsukasa Hojo", publisher: "Shueisha", tags: ["Action", "Romance", "Thief"], contentRating: "teen" },
  { title: "Maison Ikkoku", description: "Student falls for apartment manager", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Romance", "Comedy", "Slice of Life"], contentRating: "teen" },
  { title: "Ranma 1/2", description: "Boy turns into girl when splashed with water", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Comedy", "Martial Arts", "Gender Bender"], contentRating: "teen" },
  { title: "Inuyasha", description: "Girl travels to feudal Japan with half-demon", author: "Rumiko Takahashi", artist: "Rumiko Takahashi", publisher: "Shogakukan", tags: ["Action", "Fantasy", "Historical"], contentRating: "teen" },
  { title: "Rurouni Kenshin", description: "Former assassin becomes wandering swordsman", author: "Nobuhiro Watsuki", artist: "Nobuhiro Watsuki", publisher: "Shueisha", tags: ["Action", "Historical", "Samurai"], contentRating: "teen" },
  { title: "Yu Yu Hakusho", description: "Delinquent becomes Spirit Detective", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha", tags: ["Action", "Supernatural", "Martial Arts"], contentRating: "teen" },
  { title: "Hunter x Hunter", description: "Boy seeks to become Hunter like his father", author: "Yoshihiro Togashi", artist: "Yoshihiro Togashi", publisher: "Shueisha", tags: ["Action", "Adventure", "Superpowers"], contentRating: "teen" },
  { title: "Dragon Quest", description: "Adventures in Dragon Quest world", author: "Riku Sanjo", artist: "Koji Inada", publisher: "Shueisha", tags: ["Fantasy", "Adventure", "RPG"], contentRating: "teen" },
  { title: "Saint Seiya", description: "Bronze Saints protect Athena", author: "Masami Kurumada", artist: "Masami Kurumada", publisher: "Shueisha", tags: ["Action", "Fantasy", "Greek Mythology"], contentRating: "teen" },

  // Niche/Genre-Specific Series
  { title: "Hellsing", description: "Vampire hunter organization fights undead", author: "Kouta Hirano", artist: "Kouta Hirano", publisher: "Shonengahosha", tags: ["Action", "Horror", "Vampire"], contentRating: "mature" },
  { title: "Trigun", description: "Peaceful gunslinger with massive bounty", author: "Yasuhiro Nightow", artist: "Yasuhiro Nightow", publisher: "Tokuma Shoten", tags: ["Action", "Sci-Fi", "Western"], contentRating: "mature" },
  { title: "Trigun Maximum", description: "Continuation of Vash's adventures", author: "Yasuhiro Nightow", artist: "Yasuhiro Nightow", publisher: "Tokuma Shoten", tags: ["Action", "Sci-Fi", "Western"], contentRating: "mature" },
  { title: "Cowboy Bebop", description: "Space bounty hunters' adventures", author: "Yutaka Nanten", artist: "Cain Kuga", publisher: "Kadokawa", tags: ["Sci-Fi", "Space", "Bounty Hunter"], contentRating: "mature" },
  { title: "Outlaw Star", description: "Space outlaw's treasure hunting adventures", author: "Takehiko Itoh", artist: "Takehiko Itoh", publisher: "Kadokawa", tags: ["Sci-Fi", "Space", "Adventure"], contentRating: "teen" },
  { title: "Bubblegum Crisis", description: "Knight Sabers fight rogue robots", author: "Toshimichi Suzuki", artist: "Haruhiko Mikimoto", publisher: "Kadokawa", tags: ["Sci-Fi", "Mecha", "Cyberpunk"], contentRating: "mature" },
  { title: "Appleseed", description: "Soldier fights in utopian city", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Sci-Fi", "Mecha", "Utopia"], contentRating: "mature" },
  { title: "Dominion Tank Police", description: "Police force uses mini-tanks", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Sci-Fi", "Comedy", "Police"], contentRating: "teen" },
  { title: "Black Magic M-66", description: "Girl chased by combat androids", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Sci-Fi", "Action", "Android"], contentRating: "teen" },
  { title: "Orion", description: "Warrior fights in ancient world", author: "Masamune Shirow", artist: "Masamune Shirow", publisher: "Seishinsha", tags: ["Fantasy", "Historical", "Warrior"], contentRating: "teen" },

  // International/Non-Japanese Series
  { title: "The Walking Dead", description: "Survivors navigate zombie apocalypse", author: "Robert Kirkman", artist: "Tony Moore", publisher: "Image Comics", tags: ["Horror", "Zombie", "Survival"], contentRating: "mature" },
  { title: "Saga", description: "Soldiers from warring worlds fall in love", author: "Brian K. Vaughan", artist: "Fiona Staples", publisher: "Image Comics", tags: ["Sci-Fi", "Romance", "Space"], contentRating: "mature" },
  { title: "Y: The Last Man", description: "Last man on Earth after plague", author: "Brian K. Vaughan", artist: "Pia Guerra", publisher: "Vertigo", tags: ["Sci-Fi", "Post-Apocalyptic", "Drama"], contentRating: "mature" },
  { title: "Preacher", description: "Preacher gains power to command anyone", author: "Garth Ennis", artist: "Steve Dillon", publisher: "Vertigo", tags: ["Supernatural", "Horror", "Western"], contentRating: "mature" },
  { title: "Hellblazer", description: "John Constantine fights supernatural threats", author: "Various", artist: "Various", publisher: "Vertigo", tags: ["Supernatural", "Horror", "Magic"], contentRating: "mature" },
  { title: "Sandman", description: "Lord of Dreams' adventures", author: "Neil Gaiman", artist: "Various", publisher: "Vertigo", tags: ["Fantasy", "Supernatural", "Mythology"], contentRating: "mature" },
  { title: "Watchmen", description: "Retired superheroes investigate murder", author: "Alan Moore", artist: "Dave Gibbons", publisher: "DC Comics", tags: ["Superhero", "Mystery", "Drama"], contentRating: "mature" },
  { title: "V for Vendetta", description: "Anarchist fights totalitarian government", author: "Alan Moore", artist: "David Lloyd", publisher: "Vertigo", tags: ["Political", "Dystopian", "Revolution"], contentRating: "mature" },
  { title: "From Hell", description: "Jack the Ripper investigation", author: "Alan Moore", artist: "Eddie Campbell", publisher: "Top Shelf", tags: ["Historical", "Horror", "Mystery"], contentRating: "mature" },
  { title: "League of Extraordinary Gentlemen", description: "Literary characters team up", author: "Alan Moore", artist: "Kevin O'Neill", publisher: "America's Best Comics", tags: ["Adventure", "Literary", "Steampunk"], contentRating: "mature" }
];

async function importUniqueSeriesWithDEXI(seriesData) {
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

async function bulkImportUniqueSeries() {
  console.log(`🚀 Starting bulk import of ${UNIQUE_MANGA_COLLECTION.length} completely unique manga/manhwa series...\n`);
  console.log(`📚 Current collection size: 743 series`);
  console.log(`🎯 Target: Add ${UNIQUE_MANGA_COLLECTION.length} new unique series\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < UNIQUE_MANGA_COLLECTION.length; i++) {
    const series = UNIQUE_MANGA_COLLECTION[i];
    console.log(`\n📚 Importing ${i + 1}/${UNIQUE_MANGA_COLLECTION.length}: ${series.title}`);
    console.log(`   Genre: ${series.tags.join(', ')}`);
    console.log(`   Rating: ${series.contentRating}`);
    
    const result = await importUniqueSeriesWithDEXI(series);
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
  console.log('📊 UNIQUE SERIES IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Attempted: ${UNIQUE_MANGA_COLLECTION.length}`);
  console.log(`✅ Successful Imports: ${successCount}`);
  console.log(`❌ Failed Imports: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / UNIQUE_MANGA_COLLECTION.length) * 100).toFixed(1)}%`);
  console.log(`🎯 New Collection Size: ${743 + successCount} series`);
  
  // Show failed imports
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED IMPORTS:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Bulk import complete! Your collection now has even more diverse manga/manhwa!');
  
  return {
    total: UNIQUE_MANGA_COLLECTION.length,
    success: successCount,
    failed: failCount,
    results: results,
    newCollectionSize: 743 + successCount
  };
}

bulkImportUniqueSeries();

