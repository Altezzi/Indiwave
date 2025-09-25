// Fix demo covers by using good covers from other series in the local collection
const fs = require('fs');
const path = require('path');

const seriesDir = path.join(process.cwd(), 'series');

// Series with small covers (likely placeholders) that need fixing
const SERIES_TO_FIX = [
  "Blade of the Immortal",
  "Gundam Wing", 
  "Itsumo Kokoro ni Taiyō o!",
  "Jujutsu Kaisen",
  "Mobile Suit Gundam The Origin",
  "Naruto The Last",
  "Paprika",
  "Princess Mononoke",
  "Princess Mononoke The Final Years",
  "Princess Mononoke The First Years", 
  "Princess Mononoke The Investigation",
  "Reformation of the Deadbeat Noble",
  "Solo Leveling The Final Years",
  "Solo Leveling The First Years",
  "Spirited Away The Final Years",
  "Spirited Away The First Years",
  "SSS-Class Suicide Hunter",
  "Summer Wars The First Years",
  "The Beginning After the End The Final Years",
  "The Beginning After the End The First Years",
  "The Great Mage Returns After 4000 Years",
  "The Misfit of Demon King Academy The Final Years",
  "The Misfit of Demon King Academy The First Years",
  "The Place Promised in Our Early Days",
  "The Place Promised in Our Early Days The Final Years",
  "The Place Promised in Our Early Days The First Years",
  "The Place Promised in Our Early Days The Investigation",
  "The Rose of Versailles",
  "The World After The Fall",
  "Viral Hit The Final Years",
  "Viral Hit The First Years",
  "Weak Hero The Final Years",
  "Weak Hero The First Years",
  "Wind Breaker The Final Years",
  "Wind Breaker The First Years",
  "Wolf Children The First Years",
  "Wolf Children The Investigation"
];

// Find series with good covers (larger than 100KB)
function findGoodCovers() {
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const goodCovers = [];
  
  for (const folderName of seriesFolders) {
    const coverPath = path.join(seriesDir, folderName, 'cover.jpg');
    
    if (fs.existsSync(coverPath)) {
      const stats = fs.statSync(coverPath);
      const sizeKB = Math.round(stats.size / 1024);
      
      // Consider covers larger than 100KB as good quality
      if (stats.size > 100000) {
        goodCovers.push({
          name: folderName,
          path: coverPath,
          size: stats.size,
          sizeKB: sizeKB
        });
      }
    }
  }
  
  return goodCovers.sort((a, b) => b.size - a.size); // Sort by size, largest first
}

async function fixDemoCoversLocal() {
  console.log('🔍 Finding series with good covers to use as replacements...\n');
  
  const goodCovers = findGoodCovers();
  console.log(`✅ Found ${goodCovers.length} series with good covers (100KB+)\n`);
  
  if (goodCovers.length === 0) {
    console.log('❌ No good covers found! Cannot fix demo covers.');
    return;
  }
  
  console.log('🎨 Top 10 largest covers available:');
  goodCovers.slice(0, 10).forEach((cover, index) => {
    console.log(`  ${index + 1}. ${cover.name} - ${cover.sizeKB}KB`);
  });
  
  console.log('\n🚀 Starting to fix demo covers using local files...\n');
  
  let fixedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < SERIES_TO_FIX.length; i++) {
    const seriesToFix = SERIES_TO_FIX[i];
    const seriesPath = path.join(seriesDir, seriesToFix);
    const targetCoverPath = path.join(seriesPath, 'cover.jpg');
    
    if (!fs.existsSync(seriesPath)) {
      console.log(`⚠️ Series folder not found: ${seriesToFix}`);
      failedCount++;
      continue;
    }
    
    if (!fs.existsSync(targetCoverPath)) {
      console.log(`⚠️ Cover file not found: ${seriesToFix}`);
      failedCount++;
      continue;
    }
    
    // Pick a good cover (cycle through them)
    const sourceCover = goodCovers[i % goodCovers.length];
    
    try {
      // Backup the original small cover
      const backupPath = path.join(seriesPath, 'cover-backup.jpg');
      fs.copyFileSync(targetCoverPath, backupPath);
      
      // Replace with good cover
      fs.copyFileSync(sourceCover.path, targetCoverPath);
      
      const newStats = fs.statSync(targetCoverPath);
      const newSizeKB = Math.round(newStats.size / 1024);
      
      console.log(`✅ Fixed: ${seriesToFix}`);
      console.log(`   📁 Source: ${sourceCover.name} (${sourceCover.sizeKB}KB)`);
      console.log(`   🎨 New size: ${newSizeKB}KB`);
      console.log(`   💾 Backup saved as: cover-backup.jpg\n`);
      
      fixedCount++;
      
    } catch (error) {
      console.log(`❌ Failed to fix ${seriesToFix}: ${error.message}`);
      failedCount++;
    }
  }
  
  // Summary
  console.log('='.repeat(80));
  console.log('📊 LOCAL DEMO COVER FIX SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series to Fix: ${SERIES_TO_FIX.length}`);
  console.log(`✅ Successfully Fixed: ${fixedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📊 Success Rate: ${((fixedCount / SERIES_TO_FIX.length) * 100).toFixed(1)}%`);
  console.log(`🎨 Used ${goodCovers.length} good covers from your local collection`);
  console.log('\n🎯 Demo covers fixed! Check your localhost:3001 to see the updated covers!');
  console.log('💡 Original covers are backed up as "cover-backup.jpg" in each series folder');
}

fixDemoCoversLocal();
