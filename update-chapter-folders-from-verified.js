// Update chapter folders based on verified chapter counts from multiple sources
const fs = require('fs');
const path = require('path');

async function updateChapterFoldersFromVerified() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple'));

  console.log(`🔍 Updating chapter folders for ${seriesFolders.length} series based on verified counts...\n`);

  let totalSeries = 0;
  let updatedSeries = 0;
  let unchangedSeries = 0;
  let errorSeries = 0;
  let totalChaptersCreated = 0;

  for (const seriesName of seriesFolders) {
    try {
      totalSeries++;
      const seriesPath = path.join(seriesDir, seriesName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      const chaptersPath = path.join(seriesPath, 'chapters');
      
      console.log(`\n📚 Processing: ${seriesName} (${totalSeries}/${seriesFolders.length})`);
      
      let metadata = {};
      let verifiedCount = 0;
      
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        verifiedCount = metadata.totalChapters || metadata.chaptersCount || 0;
      }
      
      if (verifiedCount === 0) {
        console.log(`    ⚠️ No verified chapter count found, skipping`);
        unchangedSeries++;
        continue;
      }
      
      console.log(`    📊 Verified count: ${verifiedCount} chapters`);
      
      // Check current chapter folder count
      let currentChapterCount = 0;
      if (fs.existsSync(chaptersPath)) {
        const chapterFolders = fs.readdirSync(chaptersPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .filter(name => name.startsWith('Chapter'));
        currentChapterCount = chapterFolders.length;
      }
      
      console.log(`    📁 Current folders: ${currentChapterCount} chapters`);
      
      if (currentChapterCount !== verifiedCount) {
        // Remove existing chapters folder
        if (fs.existsSync(chaptersPath)) {
          fs.rmSync(chaptersPath, { recursive: true, force: true });
          console.log(`    🗑️ Removed existing chapters folder`);
        }

        // Create new chapters folder
        fs.mkdirSync(chaptersPath, { recursive: true });
        console.log(`    📁 Created new chapters folder`);

        // Create numbered chapter folders
        console.log(`    📖 Creating ${verifiedCount} chapter folders...`);
        for (let i = 1; i <= verifiedCount; i++) {
          const chapterFolderName = `Chapter ${i}`;
          const chapterPath = path.join(chaptersPath, chapterFolderName);
          fs.mkdirSync(chapterPath, { recursive: true });
          
          // Create a placeholder file to ensure the folder exists
          const placeholderPath = path.join(chapterPath, '.gitkeep');
          fs.writeFileSync(placeholderPath, '');
        }

        // Update metadata with folder creation info
        metadata.chaptersFolderUpdated = true;
        metadata.chaptersFolderUpdatedAt = new Date().toISOString();
        metadata.updatedAt = new Date().toISOString();

        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log(`    ✅ Created ${verifiedCount} chapter folders`);
        console.log(`    📝 Updated metadata.json`);
        
        updatedSeries++;
        totalChaptersCreated += verifiedCount;
      } else {
        console.log(`    ✅ Chapter folders already correct: ${currentChapterCount} chapters`);
        unchangedSeries++;
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
      errorSeries++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 CHAPTER FOLDER UPDATE SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalSeries}`);
  console.log(`🆕 Series Updated: ${updatedSeries}`);
  console.log(`✅ Series Unchanged: ${unchangedSeries}`);
  console.log(`❌ Series with Errors: ${errorSeries}`);
  console.log(`📖 Total Chapter Folders Created: ${totalChaptersCreated.toLocaleString()}`);
  console.log(`✅ Success Rate: ${(((updatedSeries + unchangedSeries) / totalSeries) * 100).toFixed(1)}%`);
  
  return {
    totalSeries,
    updatedSeries,
    unchangedSeries,
    errorSeries,
    totalChaptersCreated
  };
}

updateChapterFoldersFromVerified();
