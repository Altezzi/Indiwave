// Test AniDB HTTP API for manga data
const axios = require('axios');

async function testAniDBAPI() {
  console.log('🧪 Testing AniDB HTTP API...\n');

  // Test different AniDB endpoints
  const testUrls = [
    'https://anidb.net/perl-bin/animedb.pl?show=anime&aid=1', // Direct page
    'https://anidb.net/api/', // API root
    'https://anidb.net/api/anime.xml?anime=1', // XML API example
    'https://anidb.net/api/anime.json?anime=1', // JSON API example
    'https://anidb.net/api/anime/search.xml?anime=naruto', // Search example
  ];

  for (const url of testUrls) {
    console.log(`🔍 Testing: ${url}`);
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Content-Type: ${response.headers['content-type']}`);
      
      if (response.data) {
        const dataStr = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        console.log(`📝 Content preview: ${dataStr.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
      }
    }
    console.log('');
  }

  // Test if we can find any JSON endpoints
  console.log('🔍 Testing potential JSON endpoints...');
  const jsonEndpoints = [
    'https://anidb.net/api/anime/search.json?anime=naruto',
    'https://anidb.net/api/manga/search.json?manga=naruto',
    'https://anidb.net/api/anime.json?anime=1',
    'https://anidb.net/api/manga.json?manga=1',
    'https://anidb.net/json/anime/search?q=naruto',
    'https://anidb.net/json/manga/search?q=naruto'
  ];

  for (const endpoint of jsonEndpoints) {
    console.log(`🔍 Testing: ${endpoint}`);
    try {
      const response = await axios.get(endpoint, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Content-Type: ${response.headers['content-type']}`);
      
      if (response.data && typeof response.data === 'object') {
        console.log(`📝 JSON Response: ${JSON.stringify(response.data, null, 2).substring(0, 300)}...`);
      } else {
        console.log(`📝 Response: ${response.data.toString().substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 AniDB API testing complete!');
}

testAniDBAPI();

