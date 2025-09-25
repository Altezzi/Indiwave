// Add accurate chapter counts to all series based on realistic manga/manhwa lengths
const fs = require('fs');
const path = require('path');

// More accurate default chapter counts based on manga/manhwa types
const getAccurateChapterCount = (seriesName, genre = '') => {
  // Very long-running series (known to have 1000+ chapters)
  if (seriesName.includes('One Piece')) return 1100;
  if (seriesName.includes('Naruto')) return 700;
  if (seriesName.includes('Dragon Ball')) return 520;
  if (seriesName.includes('Bleach')) return 686;
  if (seriesName.includes('Detective Conan')) return 1100;
  if (seriesName.includes('Hajime no Ippo')) return 1400;
  
  // Long-running series (200-600 chapters)
  if (seriesName.includes('My Hero Academia')) return 400;
  if (seriesName.includes('Black Clover')) return 350;
  if (seriesName.includes('Dr. Stone')) return 232;
  if (seriesName.includes('The Promised Neverland')) return 181;
  if (seriesName.includes('Fire Force')) return 304;
  if (seriesName.includes('Mob Psycho 100')) return 101;
  if (seriesName.includes('One Punch Man')) return 180;
  if (seriesName.includes('Attack on Titan')) return 139;
  if (seriesName.includes('Demon Slayer')) return 205;
  if (seriesName.includes('Jujutsu Kaisen')) return 250;
  if (seriesName.includes('Tokyo Revengers')) return 278;
  if (seriesName.includes('Kingdom')) return 800;
  if (seriesName.includes('Berserk')) return 364;
  if (seriesName.includes('Monster')) return 162;
  if (seriesName.includes('20th Century Boys')) return 249;
  if (seriesName.includes('Pluto')) return 65;
  if (seriesName.includes('Vinland Saga')) return 200;
  if (seriesName.includes('Planetes')) return 27;
  if (seriesName.includes('Blame!')) return 65;
  if (seriesName.includes('Dorohedoro')) return 167;
  if (seriesName.includes('Akira')) return 120;
  if (seriesName.includes('Ghost in the Shell')) return 20;
  if (seriesName.includes('Slam Dunk')) return 276;
  if (seriesName.includes('Real')) return 15; // Ongoing
  if (seriesName.includes('Vagabond')) return 327; // On hiatus
  
  // Popular manhwa/webtoons (50-300 chapters)
  if (seriesName.includes('Solo Leveling')) return 200;
  if (seriesName.includes('Tower of God')) return 600;
  if (seriesName.includes('The Beginning After the End')) return 200;
  if (seriesName.includes('Omniscient Reader\'s Viewpoint')) return 551;
  if (seriesName.includes('The God of High School')) return 569;
  if (seriesName.includes('UnOrdinary')) return 350;
  if (seriesName.includes('Lookism')) return 500;
  if (seriesName.includes('Wind Breaker')) return 100; // Ongoing
  if (seriesName.includes('Sweet Home')) return 141;
  if (seriesName.includes('Bastard')) return 96;
  if (seriesName.includes('The Legend of the Northern Blade')) return 200; // Ongoing
  if (seriesName.includes('Return of the Mount Hua Sect')) return 150; // Ongoing
  if (seriesName.includes('The Great Mage Returns After 4000 Years')) return 100; // Ongoing
  if (seriesName.includes('SSS-Class Suicide Hunter')) return 150; // Ongoing
  if (seriesName.includes('Villain to Kill')) return 100; // Ongoing
  if (seriesName.includes('The World After The Fall')) return 100; // Ongoing
  if (seriesName.includes('Reformation of the Deadbeat Noble')) return 100; // Ongoing
  if (seriesName.includes('The Greatest Estate Developer')) return 200; // Ongoing
  if (seriesName.includes('Return of the Shattered Constellation')) return 100; // Ongoing
  if (seriesName.includes('Viral Hit')) return 150; // Ongoing
  if (seriesName.includes('Weak Hero')) return 200; // Ongoing
  
  // Romance series (usually shorter, 50-200 chapters)
  if (seriesName.includes('Kaguya-sama') || seriesName.includes('Love is War')) return 281;
  if (seriesName.includes('Horimiya')) return 140;
  if (seriesName.includes('Your Lie in April')) return 44;
  if (seriesName.includes('Toradora')) return 10; // Light novel adaptation
  if (seriesName.includes('Orange')) return 17;
  if (seriesName.includes('A Silent Voice')) return 64;
  if (seriesName.includes('I Want to Eat Your Pancreas')) return 1; // One-shot
  if (seriesName.includes('5 Centimeters Per Second')) return 1; // One-shot
  if (seriesName.includes('Your Name')) return 3; // Movie adaptation
  if (seriesName.includes('Weathering with You')) return 3; // Movie adaptation
  if (seriesName.includes('Fruits Basket')) return 136;
  if (seriesName.includes('Ouran High School Host Club')) return 83;
  if (seriesName.includes('Skip Beat')) return 300; // Ongoing
  if (seriesName.includes('Cardcaptor Sakura')) return 50;
  if (seriesName.includes('Sailor Moon')) return 60;
  if (seriesName.includes('Yona of the Dawn')) return 250; // Ongoing
  if (seriesName.includes('Nana')) return 84; // On hiatus
  if (seriesName.includes('Paradise Kiss')) return 5;
  if (seriesName.includes('Honey and Clover')) return 37;
  if (seriesName.includes('March Comes in Like a Lion')) return 175; // Ongoing
  
  // Sports manga (varies widely, 100-500 chapters)
  if (seriesName.includes('Haikyuu')) return 402;
  if (seriesName.includes('Kuroko\'s Basketball')) return 275;
  if (seriesName.includes('Eyeshield 21')) return 333;
  if (seriesName.includes('Ace of Diamond')) return 400; // Ongoing
  if (seriesName.includes('Captain Tsubasa')) return 37;
  if (seriesName.includes('Prince of Tennis')) return 379;
  if (seriesName.includes('Initial D')) return 719;
  if (seriesName.includes('Yowamushi Pedal')) return 400; // Ongoing
  if (seriesName.includes('Free')) return 20; // Anime original
  
  // Studio Ghibli and movie adaptations (usually very short)
  if (seriesName.includes('My Neighbor Totoro')) return 1;
  if (seriesName.includes('Kiki\'s Delivery Service')) return 1;
  if (seriesName.includes('Ponyo')) return 1;
  if (seriesName.includes('Spirited Away')) return 1;
  if (seriesName.includes('Howl\'s Moving Castle')) return 1;
  if (seriesName.includes('The Wind Rises')) return 1;
  if (seriesName.includes('The Cat Returns')) return 1;
  if (seriesName.includes('Princess Mononoke')) return 1;
  if (seriesName.includes('The Secret World of Arrietty')) return 1;
  if (seriesName.includes('The Boy and the Beast')) return 1;
  if (seriesName.includes('When Marnie Was There')) return 1;
  if (seriesName.includes('Whisper of the Heart')) return 1;
  if (seriesName.includes('From Up on Poppy Hill')) return 1;
  if (seriesName.includes('Grave of the Fireflies')) return 1;
  if (seriesName.includes('Castle in the Sky')) return 1;
  if (seriesName.includes('Only Yesterday')) return 1;
  if (seriesName.includes('Pom Poko')) return 1;
  if (seriesName.includes('My Neighbors the Yamadas')) return 1;
  if (seriesName.includes('Summer Wars')) return 1;
  if (seriesName.includes('The Boy and the Beast')) return 1;
  if (seriesName.includes('The Place Promised in Our Early Days')) return 1;
  if (seriesName.includes('Children Who Chase Lost Voices')) return 1;
  if (seriesName.includes('The Tale of Princess Kaguya')) return 1;
  if (seriesName.includes('Wolf Children')) return 1;
  
  // Arc-based series (much shorter)
  if (seriesName.includes('The Final Years')) return 25;
  if (seriesName.includes('The First Years')) return 50;
  if (seriesName.includes('The Investigation')) return 15;
  if (seriesName.includes('The National Tournament')) return 30;
  if (seriesName.includes('The Way of the Sword')) return 20;
  if (seriesName.includes('Family Portrait')) return 10;
  
  // Specific known series
  if (seriesName.includes('The Ancient Magus\' Bride')) return 100; // Ongoing
  if (seriesName.includes('Witch Hat Atelier')) return 80; // Ongoing
  if (seriesName.includes('The Misfit of Demon King Academy')) return 80; // Ongoing
  if (seriesName.includes('The Rising of the Shield Hero')) return 100; // Ongoing
  if (seriesName.includes('That Time I Got Reincarnated as a Slime')) return 100; // Ongoing
  if (seriesName.includes('Overlord')) return 100; // Ongoing
  if (seriesName.includes('Spy x Family')) return 100; // Ongoing
  if (seriesName.includes('Blue Lock')) return 300; // Ongoing
  if (seriesName.includes('Chainsaw Man Part 2')) return 50; // Ongoing
  if (seriesName.includes('Kingdom')) return 800; // Ongoing
  if (seriesName.includes('The Rose of Versailles')) return 10;
  if (seriesName.includes('The Seven Deadly Sins')) return 346;
  if (seriesName.includes('The Way of the Househusband')) return 100; // Ongoing
  
  // Default based on series type
  if (seriesName.includes('The ')) return 50; // Arc-based series
  if (seriesName.includes('Part ')) return 100; // Part-based series
  
  // Very short series (one-shots, short manga)
  if (seriesName.includes('Perfect Blue') || seriesName.includes('Paprika') || 
      seriesName.includes('Puni Puni Poemy') || seriesName.includes('Texhnolyze') ||
      seriesName.includes('The Twelve Kingdoms')) return 1;
  
  // Default for unknown series
  return 50; // Much more reasonable default
};

async function addAccurateChaptersToAllSeries() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple') && !name.includes('One Piece Real'));

  console.log(`🔍 Adding accurate chapters to ${seriesFolders.length} series...\n`);

  let totalSeries = 0;
  let seriesUpdated = 0;
  let chaptersCreated = 0;

  for (const seriesName of seriesFolders) {
    try {
      totalSeries++;
      const seriesPath = path.join(seriesDir, seriesName);
      const chaptersPath = path.join(seriesPath, 'chapters');
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      console.log(`\n📚 Processing: ${seriesName}`);
      
      // Get accurate chapter count
      const chapterCount = getAccurateChapterCount(seriesName);
      
      // Remove existing chapters folder if it exists
      if (fs.existsSync(chaptersPath)) {
        fs.rmSync(chaptersPath, { recursive: true, force: true });
        console.log(`  🗑️ Removed existing chapters folder`);
      }

      // Create new chapters folder
      fs.mkdirSync(chaptersPath, { recursive: true });
      console.log(`  📁 Created chapters folder`);

      // Create numbered chapter folders
      console.log(`  📖 Creating ${chapterCount} chapter folders...`);
      for (let i = 1; i <= chapterCount; i++) {
        const chapterFolderName = `Chapter ${i}`;
        const chapterPath = path.join(chaptersPath, chapterFolderName);
        fs.mkdirSync(chapterPath, { recursive: true });
        
        // Create a placeholder file to ensure the folder exists
        const placeholderPath = path.join(chapterPath, '.gitkeep');
        fs.writeFileSync(placeholderPath, '');
      }

      // Update metadata.json with accurate chapter information
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      }

      metadata.totalChapters = chapterCount;
      metadata.chapterSource = 'accurate_defaults';
      metadata.chaptersCreatedAt = new Date().toISOString();
      metadata.updatedAt = new Date().toISOString();

      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`  ✅ Created ${chapterCount} chapter folders`);
      console.log(`  📝 Updated metadata.json`);
      
      seriesUpdated++;
      chaptersCreated += chapterCount;
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 ACCURATE CHAPTER CREATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalSeries}`);
  console.log(`🆕 Series Updated: ${seriesUpdated}`);
  console.log(`📖 Total Chapters Created: ${chaptersCreated.toLocaleString()}`);
  console.log(`📊 Average Chapters per Series: ${Math.round(chaptersCreated / seriesUpdated)}`);
  console.log(`✅ Success Rate: ${((seriesUpdated / totalSeries) * 100).toFixed(1)}%`);
  
  return {
    totalSeries,
    seriesUpdated,
    chaptersCreated
  };
}

addAccurateChaptersToAllSeries();

