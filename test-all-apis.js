// Test all manga APIs with a sample search
const axios = require('axios');
const { searchByKeyword, getByID } = require("batoto.js");

async function testAllAPIs() {
  const testTitle = "Naruto";
  console.log(`🧪 Testing all APIs with: "${testTitle}"\n`);

  // Test Jikan (MyAnimeList unofficial)
  console.log('1. Testing Jikan (MyAnimeList unofficial)...');
  try {
    const response = await axios.get('https://api.jikan.moe/v4/manga', {
      params: { q: testTitle, limit: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      console.log(`✅ Jikan: Found "${manga.title}" - ${manga.chapters || 'Unknown'} chapters`);
    } else {
      console.log('❌ Jikan: No results found');
    }
  } catch (error) {
    console.log(`❌ Jikan: Error - ${error.message}`);
  }

  // Test Kitsu
  console.log('\n2. Testing Kitsu...');
  try {
    const response = await axios.get('https://kitsu.io/api/edge/manga', {
      params: { 'filter[text]': testTitle, 'page[limit]': 1 },
      headers: { 
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      console.log(`✅ Kitsu: Found "${manga.attributes.canonicalTitle}" - ${manga.attributes.chapterCount || 'Unknown'} chapters`);
    } else {
      console.log('❌ Kitsu: No results found');
    }
  } catch (error) {
    console.log(`❌ Kitsu: Error - ${error.message}`);
  }

  // Test AniList
  console.log('\n3. Testing AniList...');
  try {
    const query = `
      query ($search: String) {
        Media (search: $search, type: MANGA) {
          title { romaji english }
          chapters
        }
      }
    `;
    const response = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { search: testTitle }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.data.Media) {
      const manga = response.data.data.Media;
      const title = manga.title.romaji || manga.title.english;
      console.log(`✅ AniList: Found "${title}" - ${manga.chapters || 'Unknown'} chapters`);
    } else {
      console.log('❌ AniList: No results found');
    }
  } catch (error) {
    console.log(`❌ AniList: Error - ${error.message}`);
  }

  // Test MangaDex
  console.log('\n4. Testing MangaDex...');
  try {
    const response = await axios.get('https://api.mangadex.org/manga', {
      params: { title: testTitle, limit: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    if (response.data.result === 'ok' && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
      const chapters = manga.attributes.lastChapter || 'Unknown';
      console.log(`✅ MangaDex: Found "${title}" - ${chapters} chapters`);
    } else {
      console.log('❌ MangaDex: No results found');
    }
  } catch (error) {
    console.log(`❌ MangaDex: Error - ${error.message}`);
  }

  // Test bato.to
  console.log('\n5. Testing bato.to...');
  try {
    const search = await searchByKeyword(testTitle, 1);
    
    if (search.valid && search.results.length > 0) {
      const topResult = search.results[0];
      const manga = await getByID(topResult.id);
      
      if (manga.valid) {
        const chapterCount = manga.chapters ? manga.chapters.length : 0;
        console.log(`✅ bato.to: Found "${manga.title}" - ${chapterCount} chapters`);
      } else {
        console.log('❌ bato.to: Error retrieving manga details');
      }
    } else {
      console.log('❌ bato.to: No results found');
    }
  } catch (error) {
    console.log(`❌ bato.to: Error - ${error.message}`);
  }

  // Test Manga Hook
  console.log('\n6. Testing Manga Hook...');
  try {
    const response = await axios.get('https://mangahook.com/api/manga/search', {
      params: { query: testTitle },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      const manga = response.data.data[0];
      const chapterCount = manga.chapters ? manga.chapters.length : 0;
      console.log(`✅ Manga Hook: Found "${manga.title}" - ${chapterCount} chapters`);
    } else {
      console.log('❌ Manga Hook: No results found');
    }
  } catch (error) {
    console.log(`❌ Manga Hook: Error - ${error.message}`);
  }

  console.log('\n🎯 API Testing Complete!');
}

testAllAPIs();

