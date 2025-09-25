// Final comprehensive multi-source chapter verification using all working APIs
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { searchByKeyword, getByID } = require("batoto.js");

// Configuration for all available APIs
const API_CONFIG = {
  // Jikan (MyAnimeList unofficial API) - No auth required, very reliable
  jikan: {
    baseUrl: 'https://api.jikan.moe/v4',
    rateLimit: 1000,
    enabled: true,
    priority: 1
  },
  
  // MangaDex API - No auth required, very reliable for manga
  mangadex: {
    baseUrl: 'https://api.mangadex.org',
    rateLimit: 1000,
    enabled: true,
    priority: 1
  },
  
  // AniList GraphQL API - No auth required, good data quality
  anilist: {
    baseUrl: 'https://graphql.anilist.co',
    rateLimit: 1000,
    enabled: true,
    priority: 2
  },
  
  // Kitsu API - Public API, good for some series
  kitsu: {
    baseUrl: 'https://kitsu.io/api/edge',
    rateLimit: 1000,
    enabled: true,
    priority: 3
  },
  
  // bato.to API - Good for webtoons and some manga
  batoto: {
    enabled: true,
    rateLimit: 2000,
    priority: 4
  },
  
  // MangaVerse API (RapidAPI) - Requires API key
  mangaverse: {
    baseUrl: 'https://mangaverse-api.p.rapidapi.com',
    rateLimit: 2000,
    enabled: false, // Disabled by default - requires API key
    apiKey: process.env.RAPIDAPI_KEY || 'your-rapidapi-key-here',
    priority: 5
  },
  
  // Manga Hook API - Currently unavailable
  mangahook: {
    baseUrl: 'https://mangahook.com/api',
    rateLimit: 1000,
    enabled: false, // Disabled - domain not found
    priority: 6
  },
  
  // AniDB - Requires registration and may not be easily accessible
  anidb: {
    baseUrl: 'https://anidb.net',
    rateLimit: 2000,
    enabled: false, // Disabled - requires complex setup
    priority: 7
  }
};

// API search functions
async function searchJikan(title) {
  try {
    const response = await axios.get(`${API_CONFIG.jikan.baseUrl}/manga`, {
      params: { q: title, limit: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.chapters || 0;
      if (chapterCount > 0) {
        return { title: manga.title, chapters: chapterCount, source: 'jikan', priority: API_CONFIG.jikan.priority };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function searchMangaDex(title) {
  try {
    const response = await axios.get(`${API_CONFIG.mangadex.baseUrl}/manga`, {
      params: { title: title, limit: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (response.data.result === 'ok' && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.attributes.lastChapter ? parseInt(manga.attributes.lastChapter, 10) : 0;
      if (chapterCount > 0) {
        return { 
          title: manga.attributes.title.en || Object.values(manga.attributes.title)[0], 
          chapters: chapterCount, 
          source: 'mangadex', 
          priority: API_CONFIG.mangadex.priority 
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function searchAniList(title) {
  const query = `query ($search: String) { Media (search: $search, type: MANGA) { title { romaji english } chapters } }`;
  try {
    const response = await axios.post(API_CONFIG.anilist.baseUrl, {
      query, variables: { search: title }
    }, { headers: { 'Content-Type': 'application/json' } });
    
    if (response.data.data.Media && response.data.data.Media.chapters) {
      const manga = response.data.data.Media;
      const chapterCount = manga.chapters;
      if (chapterCount > 0) {
        return { 
          title: manga.title.romaji || manga.title.english, 
          chapters: chapterCount, 
          source: 'anilist', 
          priority: API_CONFIG.anilist.priority 
        };
      }
    }
    return null;
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.message?.includes('Too Many Requests')) {
      console.log('    ⏳ AniList rate limit hit. Waiting 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    return null;
  }
}

async function searchKitsu(title) {
  try {
    const response = await axios.get(`${API_CONFIG.kitsu.baseUrl}/manga`, {
      params: { 'filter[text]': title, 'page[limit]': 1 },
      headers: { 
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.attributes.chapterCount || 0;
      if (chapterCount > 0) {
        return { 
          title: manga.attributes.canonicalTitle, 
          chapters: chapterCount, 
          source: 'kitsu', 
          priority: API_CONFIG.kitsu.priority 
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function searchBatoTo(title) {
  try {
    const search = await searchByKeyword(title, 1);
    
    if (search.valid && search.results.length > 0) {
      const topResult = search.results[0];
      const manga = await getByID(topResult.id);
      
      if (manga.valid && manga.chapters) {
        const chapterCount = manga.chapters.length;
        if (chapterCount > 0) {
          return { 
            title: manga.title, 
            chapters: chapterCount, 
            source: 'batoto', 
            priority: API_CONFIG.batoto.priority 
          };
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Get the most accurate chapter count from all working sources
async function getAccurateChapterCountFinal(seriesName, currentCount = 0) {
  const searchTitles = [
    seriesName,
    seriesName.replace(/ The (Final Years|First Years|Investigation|Slave Arc|National Tournament|Family Portrait|Way of the Sword|Part \d+)/g, '').trim(),
    seriesName.replace(/ Part \d+$/g, '').trim()
  ].filter(Boolean);

  const results = [];
  let finalCount = currentCount;
  let source = 'current';

  // Search all enabled sources in priority order
  const searchFunctions = [
    { name: 'jikan', func: searchJikan, enabled: API_CONFIG.jikan.enabled },
    { name: 'mangadex', func: searchMangaDex, enabled: API_CONFIG.mangadex.enabled },
    { name: 'anilist', func: searchAniList, enabled: API_CONFIG.anilist.enabled },
    { name: 'kitsu', func: searchKitsu, enabled: API_CONFIG.kitsu.enabled },
    { name: 'batoto', func: searchBatoTo, enabled: API_CONFIG.batoto.enabled }
  ];

  // Sort by priority
  searchFunctions.sort((a, b) => API_CONFIG[a.name].priority - API_CONFIG[b.name].priority);

  for (const { name, func, enabled } of searchFunctions) {
    if (!enabled) continue;

    for (const searchTitle of [...new Set(searchTitles)]) {
      try {
        const result = await func(searchTitle);
        if (result && result.chapters > 0) {
          results.push(result);
          break; // Found result for this source, move to next source
        }
      } catch (error) {
        console.error(`    ❌ Error with ${name}: ${error.message}`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, API_CONFIG[name]?.rateLimit || 1000));
    }
  }

  // Determine the most accurate count using weighted approach
  if (results.length > 0) {
    // Group results by chapter count
    const countGroups = {};
    results.forEach(result => {
      const count = result.chapters;
      if (!countGroups[count]) {
        countGroups[count] = [];
      }
      countGroups[count].push(result);
    });

    // Find the most frequent count (or use highest priority if tied)
    let bestCount = 0;
    let bestScore = 0;

    Object.entries(countGroups).forEach(([count, sources]) => {
      // Score based on frequency and priority (lower priority number = higher priority)
      const frequency = sources.length;
      const avgPriority = sources.reduce((sum, s) => sum + s.priority, 0) / sources.length;
      const score = frequency * (10 - avgPriority); // Higher frequency and priority = higher score

      if (score > bestScore) {
        bestScore = score;
        bestCount = parseInt(count, 10);
      }
    });

    finalCount = bestCount;
    const bestResult = countGroups[bestCount][0];
    source = bestResult.source;

    console.log(`    🎯 Final count: ${finalCount} chapters (source: ${source}, score: ${bestScore.toFixed(1)})`);
    console.log(`    📊 All sources: ${results.map(r => `${r.source}:${r.chapters}`).join(', ')}`);
  } else {
    console.log(`    ⚠️ No external data found, keeping current: ${currentCount} chapters`);
  }

  return {
    count: finalCount,
    source: source,
    sources: results.reduce((acc, result) => {
      acc[result.source] = result.chapters;
      return acc;
    }, {}),
    allResults: results
  };
}

async function verifyAllChapterCountsFinal() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple'));

  console.log(`🔍 Final chapter count verification for ${seriesFolders.length} series using ALL working sources...\n`);
  
  const enabledAPIs = Object.entries(API_CONFIG)
    .filter(([key, config]) => config.enabled)
    .sort((a, b) => a[1].priority - b[1].priority);
  
  console.log(`📡 Enabled APIs (by priority): ${enabledAPIs.map(([key]) => key).join(' → ')}\n`);

  let totalSeries = 0;
  let updatedSeries = 0;
  let unchangedSeries = 0;
  let errorSeries = 0;
  const updateLog = [];
  const sourceStats = {};

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
      
      // Get accurate count from all sources
      const result = await getAccurateChapterCountFinal(seriesName, currentCount);
      
      // Update source statistics
      Object.keys(result.sources).forEach(source => {
        sourceStats[source] = (sourceStats[source] || 0) + 1;
      });
      
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
      
      // Add delay to avoid overwhelming APIs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
      errorSeries++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL COMPREHENSIVE CHAPTER COUNT VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalSeries}`);
  console.log(`🆕 Series Updated: ${updatedSeries}`);
  console.log(`✅ Series Unchanged: ${unchangedSeries}`);
  console.log(`❌ Series with Errors: ${errorSeries}`);
  console.log(`✅ Success Rate: ${(((updatedSeries + unchangedSeries) / totalSeries) * 100).toFixed(1)}%`);
  console.log(`📡 APIs Used: ${Object.entries(API_CONFIG).filter(([key, config]) => config.enabled).map(([key]) => key).join(', ')}`);
  
  console.log('\n📊 Source Usage Statistics:');
  Object.entries(sourceStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([source, count]) => {
      console.log(`  ${source}: ${count} series (${((count / totalSeries) * 100).toFixed(1)}%)`);
    });
  
  if (updateLog.length > 0) {
    console.log('\n📝 UPDATES MADE:');
    updateLog.slice(0, 20).forEach(log => console.log(`  ${log}`));
    if (updateLog.length > 20) {
      console.log(`  ... and ${updateLog.length - 20} more updates`);
    }
  }
  
  return {
    totalSeries,
    updatedSeries,
    unchangedSeries,
    errorSeries,
    updateLog,
    sourceStats
  };
}

verifyAllChapterCountsFinal();

