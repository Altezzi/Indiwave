// Fix series with demo/placeholder covers by finding real cover art
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const seriesDir = path.join(process.cwd(), 'series');

// Helper function to search MangaDex for cover art
async function searchMangaDexCover(title) {
  try {
    const response = await axios.get(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = response.data;
    if (data.result === 'ok' && data.data.length > 0) {
      // Try to find the best match
      for (const manga of data.data) {
        const mangaTitle = manga.attributes.title.en || manga.attributes.title.ja || manga.attributes.title.ko || '';
        
        // Check if titles match reasonably well
        if (mangaTitle.toLowerCase().includes(title.toLowerCase().split(' ')[0]) || 
            title.toLowerCase().includes(mangaTitle.toLowerCase().split(' ')[0])) {
          
          // Get cover art
          if (manga.relationships) {
            const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
            if (coverArt) {
              const coverResponse = await axios.get(`https://api.mangadex.org/cover/${coverArt.id}`, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              });
              
              const coverData = coverResponse.data;
              if (coverData.result === 'ok') {
                const fileName = coverData.data.attributes.fileName;
                const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;
                return { url: coverUrl, mangaId: manga.id };
              }
            }
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error searching MangaDex for ${title}:`, error.message);
    return null;
  }
}

// Helper function to download cover art
async function downloadCover(url, filePath) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(filePath, Buffer.from(response.data));
    return true;
  } catch (error) {
    console.error(`Error downloading cover:`, error.message);
    return false;
  }
}

async function fixDemoCovers() {
  console.log('🔍 Scanning for series with demo/placeholder covers...\n');
  
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let totalProcessed = 0;
  let coversFixed = 0;
  let coversSearched = 0;

  for (const folderName of seriesFolders) {
    const seriesPath = path.join(seriesDir, folderName);
    const coverPath = path.join(seriesPath, 'cover.jpg');
    const metadataPath = path.join(seriesPath, 'metadata.json');

    // Check if cover exists and is small (likely a placeholder)
    if (fs.existsSync(coverPath)) {
      const stats = fs.statSync(coverPath);
      const sizeKB = Math.round(stats.size / 1024);
      
      // Consider covers smaller than 50KB as potential placeholders
      if (stats.size < 50000) {
        console.log(`📚 Found potential placeholder: ${folderName} (${sizeKB}KB)`);
        
        let metadata = {};
        if (fs.existsSync(metadataPath)) {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        }

        const seriesTitle = metadata.title || folderName;
        console.log(`  🔍 Searching for real cover: ${seriesTitle}`);
        coversSearched++;

        // Search MangaDex for cover art
        const coverResult = await searchMangaDexCover(seriesTitle);
        
        if (coverResult) {
          console.log(`  ✅ Found cover on MangaDex: ${coverResult.url}`);
          
          // Download the new cover
          const success = await downloadCover(coverResult.url, coverPath);
          
          if (success) {
            const newStats = fs.statSync(coverPath);
            const newSizeKB = Math.round(newStats.size / 1024);
            console.log(`  🎨 Downloaded new cover: ${newSizeKB}KB`);
            
            // Update metadata with MangaDex ID
            metadata.mangaDexId = coverResult.mangaId;
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            
            coversFixed++;
          } else {
            console.log(`  ❌ Failed to download cover`);
          }
        } else {
          console.log(`  ⚠️ No cover found for: ${seriesTitle}`);
        }
        
        // Add delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    totalProcessed++;
    
    // Progress update every 50 series
    if (totalProcessed % 50 === 0) {
      console.log(`\n📊 Progress: ${totalProcessed}/${seriesFolders.length} series processed`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 DEMO COVER FIX SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalProcessed}`);
  console.log(`🔍 Covers Searched: ${coversSearched}`);
  console.log(`🎨 Covers Fixed: ${coversFixed}`);
  console.log(`📊 Success Rate: ${coversSearched > 0 ? ((coversFixed / coversSearched) * 100).toFixed(1) : 0}%`);
  console.log(`✅ Demo covers fixed! Your collection now has real cover art!`);
}

fixDemoCovers();
