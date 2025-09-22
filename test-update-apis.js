// Test script for the update APIs
const BASE_URL = 'http://localhost:3002';

async function testUpdateAPIs() {
  console.log('🧪 Testing Update APIs...\n');

  try {
    // Test 1: Check for updates on a specific series
    console.log('1️⃣ Testing GET /api/admin/update-series (check for updates)');
    const checkResponse = await fetch(`${BASE_URL}/api/admin/update-series?seriesId=One Piece`);
    const checkData = await checkResponse.json();
    
    if (checkResponse.ok) {
      console.log('✅ Check successful:');
      console.log(`   Series: ${checkData.seriesName}`);
      console.log(`   Current chapters: ${checkData.currentChapters}`);
      console.log(`   Total chapters: ${checkData.totalChapters}`);
      console.log(`   New chapters: ${checkData.newChapters}`);
      if (checkData.newChapters > 0) {
        console.log(`   New chapters: ${checkData.newChaptersList.map(ch => `Ch.${ch.chapterNumber}: ${ch.title}`).join(', ')}`);
      }
    } else {
      console.log('❌ Check failed:', checkData.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Update a specific series
    console.log('2️⃣ Testing POST /api/admin/update-series (update specific series)');
    const updateResponse = await fetch(`${BASE_URL}/api/admin/update-series`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seriesId: 'One Piece',
        updateChapters: true,
        updateMetadata: false
      })
    });
    
    const updateData = await updateResponse.json();
    
    if (updateResponse.ok) {
      console.log('✅ Update successful:');
      console.log(`   Series: ${updateData.seriesName}`);
      console.log(`   Updates:`, updateData.updates);
      if (updateData.errors && updateData.errors.length > 0) {
        console.log(`   Errors:`, updateData.errors);
      }
    } else {
      console.log('❌ Update failed:', updateData.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Check all series for updates
    console.log('3️⃣ Testing GET /api/admin/update-all-series (check all series)');
    const checkAllResponse = await fetch(`${BASE_URL}/api/admin/update-all-series?delayMs=500`);
    const checkAllData = await checkAllResponse.json();
    
    if (checkAllResponse.ok) {
      console.log('✅ Check all successful:');
      console.log(`   Total series: ${checkAllData.totalSeries}`);
      console.log(`   Checked: ${checkAllData.checked}`);
      console.log(`   Series with updates: ${checkAllData.seriesWithUpdates}`);
      console.log(`   Errors: ${checkAllData.errors}`);
      
      // Show series with updates
      const seriesWithUpdates = checkAllData.seriesResults.filter(s => s.hasUpdates);
      if (seriesWithUpdates.length > 0) {
        console.log('\n   📚 Series with new chapters:');
        seriesWithUpdates.forEach(series => {
          console.log(`      - ${series.seriesName}: ${series.newChapters} new chapters`);
        });
      }
    } else {
      console.log('❌ Check all failed:', checkAllData.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Update all series (commented out to avoid long execution)
    console.log('4️⃣ Testing POST /api/admin/update-all-series (update all series)');
    console.log('⚠️  This is commented out to avoid long execution time');
    console.log('   Uncomment the code below to test bulk updates');
    
    /*
    const updateAllResponse = await fetch(`${BASE_URL}/api/admin/update-all-series`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updateChapters: true,
        updateMetadata: false,
        delayMs: 1000
      })
    });
    
    const updateAllData = await updateAllResponse.json();
    
    if (updateAllResponse.ok) {
      console.log('✅ Bulk update successful:');
      console.log(`   Total series: ${updateAllData.totalSeries}`);
      console.log(`   Updated: ${updateAllData.updated}`);
      console.log(`   Errors: ${updateAllData.errors}`);
    } else {
      console.log('❌ Bulk update failed:', updateAllData.error);
    }
    */

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testUpdateAPIs();
