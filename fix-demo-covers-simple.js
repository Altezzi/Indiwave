// Simple script to fix demo covers using the DEXI API
const axios = require('axios');

// List of series with small covers (likely placeholders)
const SERIES_WITH_SMALL_COVERS = [
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

async function updateCoverWithDEXI(seriesTitle) {
  try {
    console.log(`🔍 Updating cover for: ${seriesTitle}`);
    
    const response = await axios.post('http://localhost:3001/api/dexi/update-covers', {
      seriesName: seriesTitle,
      autoSearchCovers: true
    });

    if (response.data.success) {
      console.log(`✅ Successfully updated cover for: ${seriesTitle}`);
      return { success: true, title: seriesTitle };
    } else {
      console.log(`❌ Failed to update cover for: ${seriesTitle} - ${response.data.error}`);
      return { success: false, title: seriesTitle, error: response.data.error };
    }
  } catch (error) {
    console.log(`❌ Error updating cover for ${seriesTitle}: ${error.message}`);
    return { success: false, title: seriesTitle, error: error.message };
  }
}

async function fixDemoCoversSimple() {
  console.log(`🚀 Starting to fix ${SERIES_WITH_SMALL_COVERS.length} series with demo covers...\n`);
  
  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < SERIES_WITH_SMALL_COVERS.length; i++) {
    const seriesTitle = SERIES_WITH_SMALL_COVERS[i];
    console.log(`\n📚 Processing ${i + 1}/${SERIES_WITH_SMALL_COVERS.length}: ${seriesTitle}`);
    
    const result = await updateCoverWithDEXI(seriesTitle);
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
  console.log('📊 DEMO COVER FIX SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${SERIES_WITH_SMALL_COVERS.length}`);
  console.log(`✅ Successful Updates: ${successCount}`);
  console.log(`❌ Failed Updates: ${failCount}`);
  console.log(`📊 Success Rate: ${((successCount / SERIES_WITH_SMALL_COVERS.length) * 100).toFixed(1)}%`);
  
  // Show failed updates
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ FAILED UPDATES:');
    failed.forEach(fail => console.log(`  - ${fail.title}: ${fail.error}`));
  }
  
  console.log('\n🎯 Demo cover fix complete! Check your localhost:3001 to see the updated covers!');
  
  return {
    total: SERIES_WITH_SMALL_COVERS.length,
    success: successCount,
    failed: failCount,
    results: results
  };
}

fixDemoCoversSimple();
