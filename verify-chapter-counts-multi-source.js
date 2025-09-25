// Verify and update chapter counts from multiple sources (AniList, MangaDex, bato.to)
const fs = require('fs');
const path = require('path');

// Import bato.to library
const { searchByKeyword, getByID } = require("batoto.js");

// AniList GraphQL query
async function searchAniList(title) {
  const query = `
    query ($search: String) {
      Media (search: $search, type: MANGA, format_in: [MANGA, NOVEL, ONE_SHOT]) {
        id
        title {
          romaji
          english
          native
        }
        description
        chapters
        volumes
        status
        genres
      }
    }
  `;
  const variables = {
    search: title
  };

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.Media;
  } catch (error) {
    console.error('Error searching AniList:', error);
    return null;
  }
}

// MangaDex search function
async function searchMangaDex(title) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.result === 'ok' && data.data.length > 0) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return null;
  }
}

// Bato.to search function
async function searchBatoTo(title) {
  try {
    console.log(`    🔍 Searching bato.to for: ${title}`);
    const search = await searchByKeyword(title, 1);
    
    if (!search.valid || search.results.length === 0) {
      console.log(`    ❌ No bato.to results found`);
      return null;
    }

    const topResult = search.results[0];
    console.log(`    ✅ Found bato.to entry: ${topResult.title} (ID: ${topResult.id})`);
    
    const manga = await getByID(topResult.id);
    
    if (!manga.valid) {
      console.log(`    ❌ Error retrieving bato.to manga details`);
      return null;
    }

    return {
      title: manga.title,
      chapters: manga.chapters,
      chapterCount: manga.chapters ? manga.chapters.length : 0
    };
  } catch (error) {
    console.error(`    ❌ Error searching bato.to: ${error.message}`);
    return null;
  }
}

// Get the most accurate chapter count from multiple sources
async function getAccurateChapterCount(seriesName, currentCount = 0) {
  const searchTitles = [
    seriesName,
    seriesName.replace(/ The (Final Years|First Years|Investigation|Slave Arc|National Tournament|Family Portrait|Way of the Sword|Part \d+)/g, '').trim(),
    seriesName.replace(/ Part \d+$/g, '').trim()
  ].filter(Boolean);

  let anilistCount = null;
  let mangaDexCount = null;
  let batoToCount = null;
  let finalCount = currentCount;
  let source = 'current';

  // Try AniList first
  for (const searchTitle of [...new Set(searchTitles)]) {
    console.log(`    📊 Searching AniList for: ${searchTitle}`);
    try {
      const aniListData = await searchAniList(searchTitle);
      if (aniListData && aniListData.chapters) {
        anilistCount = aniListData.chapters;
        console.log(`    ✅ AniList: ${anilistCount} chapters`);
        break;
      }
    } catch (error) {
      console.error(`    ❌ AniList error: ${error.message}`);
      if (error.message.includes('Too Many Requests')) {
        console.log('    ⏳ AniList rate limit hit. Waiting 60 seconds...');
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }
  }

  // Try MangaDex
  for (const searchTitle of [...new Set(searchTitles)]) {
    console.log(`    📚 Searching MangaDex for: ${searchTitle}`);
    try {
      const mangaDexData = await searchMangaDex(searchTitle);
      if (mangaDexData && mangaDexData.attributes.lastChapter) {
        mangaDexCount = parseInt(mangaDexData.attributes.lastChapter, 10);
        console.log(`    ✅ MangaDex: ${mangaDexCount} chapters`);
        break;
      }
    } catch (error) {
      console.error(`    ❌ MangaDex error: ${error.message}`);
    }
  }

  // Try bato.to
  for (const searchTitle of [...new Set(searchTitles)]) {
    try {
      const batoToData = await searchBatoTo(searchTitle);
      if (batoToData && batoToData.chapterCount > 0) {
        batoToCount = batoToData.chapterCount;
        console.log(`    ✅ bato.to: ${batoToCount} chapters`);
        break;
      }
    } catch (error) {
      console.error(`    ❌ bato.to error: ${error.message}`);
    }
  }

  // Determine the most accurate count
  const counts = [anilistCount, mangaDexCount, batoToCount].filter(count => count !== null && count > 0);
  
  if (counts.length > 0) {
    // Use the median of available counts for accuracy
    counts.sort((a, b) => a - b);
    const medianIndex = Math.floor(counts.length / 2);
    finalCount = counts[medianIndex];
    
    // Determine source
    if (anilistCount === finalCount) source = 'anilist';
    else if (mangaDexCount === finalCount) source = 'mangadex';
    else if (batoToCount === finalCount) source = 'batoto';
    else source = 'median';
    
    console.log(`    🎯 Final count: ${finalCount} chapters (source: ${source})`);
  } else {
    console.log(`    ⚠️ No external data found, keeping current: ${currentCount} chapters`);
  }

  return {
    count: finalCount,
    source: source,
    sources: {
      anilist: anilistCount,
      mangadex: mangaDexCount,
      batoto: batoToCount
    }
  };
}

async function verifyAllChapterCounts() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple'));

  console.log(`🔍 Verifying chapter counts for ${seriesFolders.length} series using multiple sources...\n`);

  let totalSeries = 0;
  let updatedSeries = 0;
  let unchangedSeries = 0;
  let errorSeries = 0;
  const updateLog = [];

  for (const seriesName of seriesFolders) {
    try {
      totalSeries++;
      const seriesPath = path.join(seriesDir, seriesName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      console.log(`\n📚 Processing: ${seriesName} (${totalSeries}/${seriesFolders.length})`);
      
      let metadata = {};
      let currentCount = 0;
      
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        currentCount = metadata.totalChapters || metadata.chaptersCount || 0;
      }
      
      console.log(`    📊 Current count: ${currentCount} chapters`);
      
      // Get accurate count from multiple sources
      const result = await getAccurateChapterCount(seriesName, currentCount);
      
      if (result.count !== currentCount) {
        // Update metadata
        metadata.totalChapters = result.count;
        metadata.chapterSource = result.source;
        metadata.chapterSources = result.sources;
        metadata.chapterVerifiedAt = new Date().toISOString();
        metadata.updatedAt = new Date().toISOString();
        
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        
        console.log(`    ✅ Updated: ${currentCount} → ${result.count} chapters`);
        updateLog.push(`${seriesName}: ${currentCount} → ${result.count} (${result.source})`);
        updatedSeries++;
      } else {
        console.log(`    ✅ No change needed: ${currentCount} chapters`);
        unchangedSeries++;
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
      errorSeries++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 CHAPTER COUNT VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalSeries}`);
  console.log(`🆕 Series Updated: ${updatedSeries}`);
  console.log(`✅ Series Unchanged: ${unchangedSeries}`);
  console.log(`❌ Series with Errors: ${errorSeries}`);
  console.log(`✅ Success Rate: ${(((updatedSeries + unchangedSeries) / totalSeries) * 100).toFixed(1)}%`);
  
  if (updateLog.length > 0) {
    console.log('\n📝 UPDATES MADE:');
    updateLog.forEach(log => console.log(`  ${log}`));
  }
  
  return {
    totalSeries,
    updatedSeries,
    unchangedSeries,
    errorSeries,
    updateLog
  };
}

verifyAllChapterCounts();

