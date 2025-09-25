// Test the multi-source verification on a small sample of series
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { searchByKeyword, getByID } = require("batoto.js");

// Configuration for APIs
const API_CONFIG = {
  jikan: {
    baseUrl: 'https://api.jikan.moe/v4',
    rateLimit: 1000,
    enabled: true
  },
  kitsu: {
    baseUrl: 'https://kitsu.io/api/edge',
    rateLimit: 1000,
    enabled: true
  },
  mangaverse: {
    baseUrl: 'https://mangaverse-api.p.rapidapi.com',
    rateLimit: 2000,
    enabled: false,
    apiKey: 'your-rapidapi-key-here'
  },
  mangahook: {
    baseUrl: 'https://mangahook.com/api',
    rateLimit: 1000,
    enabled: false
  }
};

// API search functions (simplified versions)
async function searchJikan(title) {
  try {
    const response = await axios.get(`${API_CONFIG.jikan.baseUrl}/manga`, {
      params: { q: title, limit: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      return { title: manga.title, chapters: manga.chapters || 0, source: 'jikan' };
    }
    return null;
  } catch (error) {
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
      return { title: manga.attributes.canonicalTitle, chapters: manga.attributes.chapterCount || 0, source: 'kitsu' };
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function searchAniList(title) {
  const query = `query ($search: String) { Media (search: $search, type: MANGA) { title { romaji english } chapters } }`;
  try {
    const response = await axios.post('https://graphql.anilist.co', {
      query, variables: { search: title }
    }, { headers: { 'Content-Type': 'application/json' } });
    if (response.data.data.Media && response.data.data.Media.chapters) {
      const manga = response.data.data.Media;
      return { title: manga.title.romaji || manga.title.english, chapters: manga.chapters, source: 'anilist' };
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function searchMangaDex(title) {
  try {
    const response = await axios.get(`https://api.mangadex.org/manga`, {
      params: { title: title, limit: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (response.data.result === 'ok' && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.attributes.lastChapter ? parseInt(manga.attributes.lastChapter, 10) : 0;
      return { title: manga.attributes.title.en || Object.values(manga.attributes.title)[0], chapters: chapterCount, source: 'mangadex' };
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function testSampleSeries() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple'))
    .slice(0, 5); // Test only first 5 series

  console.log(`🧪 Testing multi-source verification on ${seriesFolders.length} sample series...\n`);

  for (const seriesName of seriesFolders) {
    console.log(`\n📚 Testing: ${seriesName}`);
    
    const results = [];
    const searchTitles = [
      seriesName,
      seriesName.replace(/ The (Final Years|First Years|Investigation|Slave Arc|National Tournament|Family Portrait|Way of the Sword|Part \d+)/g, '').trim()
    ].filter(Boolean);

    // Test each API
    const searchFunctions = [
      { name: 'jikan', func: searchJikan, enabled: API_CONFIG.jikan.enabled },
      { name: 'kitsu', func: searchKitsu, enabled: API_CONFIG.kitsu.enabled },
      { name: 'anilist', func: searchAniList, enabled: true },
      { name: 'mangadex', func: searchMangaDex, enabled: true }
    ];

    for (const { name, func, enabled } of searchFunctions) {
      if (!enabled) continue;

      for (const searchTitle of [...new Set(searchTitles)]) {
        try {
          console.log(`    🔍 Searching ${name} for: ${searchTitle}`);
          const result = await func(searchTitle);
          if (result && result.chapters > 0) {
            results.push(result);
            console.log(`    ✅ ${name}: ${result.chapters} chapters`);
            break;
          } else {
            console.log(`    ❌ ${name}: No results`);
          }
        } catch (error) {
          console.log(`    ❌ ${name}: Error - ${error.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Show results summary
    if (results.length > 0) {
      const counts = results.map(r => r.chapters).filter(count => count > 0);
      counts.sort((a, b) => a - b);
      const medianIndex = Math.floor(counts.length / 2);
      const finalCount = counts[medianIndex];
      
      console.log(`    🎯 Sources found: ${results.map(r => `${r.source}:${r.chapters}`).join(', ')}`);
      console.log(`    📊 Final count: ${finalCount} chapters (median)`);
    } else {
      console.log(`    ⚠️ No results from any source`);
    }
  }

  console.log('\n✅ Sample testing complete!');
}

testSampleSeries();
