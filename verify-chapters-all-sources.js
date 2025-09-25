// Comprehensive multi-source chapter count verification using all available APIs
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Import bato.to library
const { searchByKeyword, getByID } = require("batoto.js");

// Configuration for APIs
const API_CONFIG = {
  // Jikan (MyAnimeList unofficial API) - No auth required
  jikan: {
    baseUrl: 'https://api.jikan.moe/v4',
    rateLimit: 1000, // 1 second delay
    enabled: true
  },
  
  // Kitsu API - Public API, no auth required for basic searches
  kitsu: {
    baseUrl: 'https://kitsu.io/api/edge',
    rateLimit: 1000,
    enabled: true
  },
  
  // MangaVerse API (RapidAPI) - Requires API key
  mangaverse: {
    baseUrl: 'https://mangaverse-api.p.rapidapi.com',
    rateLimit: 2000, // 2 second delay
    enabled: false, // Disabled by default - requires API key
    apiKey: process.env.RAPIDAPI_KEY || 'your-rapidapi-key-here'
  },
  
  // Manga Hook API - Free API (currently unavailable)
  mangahook: {
    baseUrl: 'https://mangahook.com/api',
    rateLimit: 1000,
    enabled: false // Disabled - domain not found
  },
  
  // Mangapedia - Check if available
  mangapedia: {
    baseUrl: 'https://api.mangapedia.com',
    rateLimit: 1000,
    enabled: false // Disabled by default - may not be available
  }
};

// Jikan API (MyAnimeList unofficial)
async function searchJikan(title) {
  try {
    console.log(`    🎌 Searching Jikan (MAL) for: ${title}`);
    const response = await axios.get(`${API_CONFIG.jikan.baseUrl}/manga`, {
      params: {
        q: title,
        limit: 1
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.chapters || 0;
      console.log(`    ✅ Jikan (MAL): ${chapterCount} chapters`);
      return {
        title: manga.title,
        chapters: chapterCount,
        source: 'jikan'
      };
    }
    return null;
  } catch (error) {
    console.error(`    ❌ Jikan error: ${error.message}`);
    return null;
  }
}

// Kitsu API
async function searchKitsu(title) {
  try {
    console.log(`    🎯 Searching Kitsu for: ${title}`);
    const response = await axios.get(`${API_CONFIG.kitsu.baseUrl}/manga`, {
      params: {
        'filter[text]': title,
        'page[limit]': 1
      },
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.attributes.chapterCount || 0;
      console.log(`    ✅ Kitsu: ${chapterCount} chapters`);
      return {
        title: manga.attributes.canonicalTitle,
        chapters: chapterCount,
        source: 'kitsu'
      };
    }
    return null;
  } catch (error) {
    console.error(`    ❌ Kitsu error: ${error.message}`);
    return null;
  }
}

// MangaVerse API (RapidAPI)
async function searchMangaVerse(title) {
  if (!API_CONFIG.mangaverse.enabled || !API_CONFIG.mangaverse.apiKey || API_CONFIG.mangaverse.apiKey === 'your-rapidapi-key-here') {
    console.log(`    ⚠️ MangaVerse API disabled (requires API key)`);
    return null;
  }

  try {
    console.log(`    🌍 Searching MangaVerse for: ${title}`);
    const response = await axios.get(`${API_CONFIG.mangaverse.baseUrl}/manga/search`, {
      params: {
        q: title
      },
      headers: {
        'X-RapidAPI-Key': API_CONFIG.mangaverse.apiKey,
        'X-RapidAPI-Host': 'mangaverse-api.p.rapidapi.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.chapters?.length || 0;
      console.log(`    ✅ MangaVerse: ${chapterCount} chapters`);
      return {
        title: manga.title,
        chapters: chapterCount,
        source: 'mangaverse'
      };
    }
    return null;
  } catch (error) {
    console.error(`    ❌ MangaVerse error: ${error.message}`);
    return null;
  }
}

// Manga Hook API
async function searchMangaHook(title) {
  try {
    console.log(`    🎣 Searching Manga Hook for: ${title}`);
    const response = await axios.get(`${API_CONFIG.mangahook.baseUrl}/manga/search`, {
      params: {
        query: title
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.chapters?.length || 0;
      console.log(`    ✅ Manga Hook: ${chapterCount} chapters`);
      return {
        title: manga.title,
        chapters: chapterCount,
        source: 'mangahook'
      };
    }
    return null;
  } catch (error) {
    console.error(`    ❌ Manga Hook error: ${error.message}`);
    return null;
  }
}

// AniList GraphQL query (existing)
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
    console.log(`    📊 Searching AniList for: ${title}`);
    const response = await axios.post('https://graphql.anilist.co', {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (response.data.data.Media && response.data.data.Media.chapters) {
      const chapterCount = response.data.data.Media.chapters;
      console.log(`    ✅ AniList: ${chapterCount} chapters`);
      return {
        title: response.data.data.Media.title.romaji || response.data.data.Media.title.english,
        chapters: chapterCount,
        source: 'anilist'
      };
    }
    return null;
  } catch (error) {
    console.error(`    ❌ AniList error: ${error.message}`);
    if (error.response?.data?.errors?.[0]?.message?.includes('Too Many Requests')) {
      console.log('    ⏳ AniList rate limit hit. Waiting 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    return null;
  }
}

// MangaDex API (existing)
async function searchMangaDex(title) {
  try {
    console.log(`    📚 Searching MangaDex for: ${title}`);
    const response = await axios.get(`https://api.mangadex.org/manga`, {
      params: {
        title: title,
        limit: 1
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data.result === 'ok' && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.attributes.lastChapter ? parseInt(manga.attributes.lastChapter, 10) : 0;
      console.log(`    ✅ MangaDex: ${chapterCount} chapters`);
      return {
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        chapters: chapterCount,
        source: 'mangadex'
      };
    }
    return null;
  } catch (error) {
    console.error(`    ❌ MangaDex error: ${error.message}`);
    return null;
  }
}

// bato.to API (existing)
async function searchBatoTo(title) {
  try {
    console.log(`    🔍 Searching bato.to for: ${title}`);
    const search = await searchByKeyword(title, 1);
    
    if (!search.valid || search.results.length === 0) {
      return null;
    }

    const topResult = search.results[0];
    const manga = await getByID(topResult.id);
    
    if (!manga.valid) {
      return null;
    }

    const chapterCount = manga.chapters ? manga.chapters.length : 0;
    console.log(`    ✅ bato.to: ${chapterCount} chapters`);
    return {
      title: manga.title,
      chapters: chapterCount,
      source: 'batoto'
    };
  } catch (error) {
    console.error(`    ❌ bato.to error: ${error.message}`);
    return null;
  }
}

// Get the most accurate chapter count from all sources
async function getAccurateChapterCountAllSources(seriesName, currentCount = 0) {
  const searchTitles = [
    seriesName,
    seriesName.replace(/ The (Final Years|First Years|Investigation|Slave Arc|National Tournament|Family Portrait|Way of the Sword|Part \d+)/g, '').trim(),
    seriesName.replace(/ Part \d+$/g, '').trim()
  ].filter(Boolean);

  const results = [];
  let finalCount = currentCount;
  let source = 'current';

  // Search all enabled sources
  const searchFunctions = [
    { name: 'jikan', func: searchJikan, enabled: API_CONFIG.jikan.enabled },
    { name: 'kitsu', func: searchKitsu, enabled: API_CONFIG.kitsu.enabled },
    { name: 'anilist', func: searchAniList, enabled: true },
    { name: 'mangadex', func: searchMangaDex, enabled: true },
    { name: 'batoto', func: searchBatoTo, enabled: true },
    { name: 'mangaverse', func: searchMangaVerse, enabled: API_CONFIG.mangaverse.enabled },
    { name: 'mangahook', func: searchMangaHook, enabled: API_CONFIG.mangahook.enabled }
  ];

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

  // Determine the most accurate count
  if (results.length > 0) {
    const counts = results.map(r => r.chapters).filter(count => count > 0);
    
    if (counts.length > 0) {
      // Use median for stability, or most frequent value
      counts.sort((a, b) => a - b);
      const medianIndex = Math.floor(counts.length / 2);
      finalCount = counts[medianIndex];
      
      // Find the source that provided the median count
      const medianResult = results.find(r => r.chapters === finalCount);
      source = medianResult ? medianResult.source : 'median';
      
      console.log(`    🎯 Final count: ${finalCount} chapters (source: ${source})`);
      console.log(`    📊 Sources found: ${results.map(r => `${r.source}:${r.chapters}`).join(', ')}`);
    } else {
      console.log(`    ⚠️ No valid chapter counts found, keeping current: ${currentCount} chapters`);
    }
  } else {
    console.log(`    ⚠️ No external data found, keeping current: ${currentCount} chapters`);
  }

  return {
    count: finalCount,
    source: source,
    sources: results.reduce((acc, result) => {
      acc[result.source] = result.chapters;
      return acc;
    }, {})
  };
}

async function verifyAllChapterCountsAllSources() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple'));

  console.log(`🔍 Verifying chapter counts for ${seriesFolders.length} series using ALL sources...\n`);
  console.log(`📡 Enabled APIs: ${Object.entries(API_CONFIG).filter(([key, config]) => config.enabled).map(([key]) => key).join(', ')}\n`);

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
      
      // Get accurate count from all sources
      const result = await getAccurateChapterCountAllSources(seriesName, currentCount);
      
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
      errorSeries++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE CHAPTER COUNT VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalSeries}`);
  console.log(`🆕 Series Updated: ${updatedSeries}`);
  console.log(`✅ Series Unchanged: ${unchangedSeries}`);
  console.log(`❌ Series with Errors: ${errorSeries}`);
  console.log(`✅ Success Rate: ${(((updatedSeries + unchangedSeries) / totalSeries) * 100).toFixed(1)}%`);
  console.log(`📡 APIs Used: ${Object.entries(API_CONFIG).filter(([key, config]) => config.enabled).map(([key]) => key).join(', ')}`);
  
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

verifyAllChapterCountsAllSources();
