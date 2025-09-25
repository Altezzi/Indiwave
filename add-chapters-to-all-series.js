// Add chapters folder to all series and populate with numbered chapter folders
const fs = require('fs');
const path = require('path');

async function searchAniList(title) {
  try {
    const query = `
      query ($search: String) {
        Media(search: $search, type: MANGA) {
          id
          title {
            romaji
            english
            native
          }
          description
          startDate {
            year
          }
          status
          genres
          tags {
            name
          }
          coverImage {
            large
            medium
          }
          chapters
          volumes
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { search: title }
      })
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.Media) {
      return {
        id: data.data.Media.id,
        title: data.data.Media.title.english || data.data.Media.title.romaji,
        description: data.data.Media.description,
        year: data.data.Media.startDate.year,
        status: data.data.Media.status,
        genres: data.data.Media.genres,
        tags: data.data.Media.tags.map(tag => tag.name),
        coverImage: data.data.Media.coverImage.large,
        chapters: data.data.Media.chapters,
        volumes: data.data.Media.volumes
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error searching AniList:', error);
    return null;
  }
}

async function searchMangaDex(title) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== 'ok') {
      throw new Error('Invalid response from MangaDex');
    }

    return data.data.map((manga) => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description?.en || manga.attributes.description,
      year: manga.attributes.year,
      status: manga.attributes.status,
      tags: manga.attributes.tags?.map(tag => tag.attributes.name.en) || []
    }));

  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return null;
  }
}

async function getMangaDexChapterCount(mangaId) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/aggregate?translatedLanguage[]=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== 'ok') {
      throw new Error('Invalid response from MangaDex');
    }

    // Count chapters from aggregate data
    let chapterCount = 0;
    if (data.volumes) {
      Object.values(data.volumes).forEach(volume => {
        if (volume.chapters) {
          chapterCount += Object.keys(volume.chapters).length;
        }
      });
    }

    return chapterCount;
  } catch (error) {
    console.error('Error getting MangaDex chapter count:', error);
    return null;
  }
}

async function addChaptersToAllSeries() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple') && !name.includes('One Piece Real'));

  console.log(`🔍 Adding chapters to ${seriesFolders.length} series...\n`);

  let totalSeries = 0;
  let seriesWithChapters = 0;
  let seriesUpdated = 0;

  for (const seriesName of seriesFolders) {
    try {
      totalSeries++;
      const seriesPath = path.join(seriesDir, seriesName);
      const chaptersPath = path.join(seriesPath, 'chapters');
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      console.log(`\n📚 Processing: ${seriesName}`);
      
      // Check if chapters folder already exists
      if (fs.existsSync(chaptersPath)) {
        const existingChapters = fs.readdirSync(chaptersPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);
        
        console.log(`  ✅ Chapters folder exists with ${existingChapters.length} chapters`);
        seriesWithChapters++;
        continue;
      }

      // Create chapters folder
      fs.mkdirSync(chaptersPath, { recursive: true });
      console.log(`  📁 Created chapters folder`);

      // Try to get chapter count from AniList first
      const cleanSeriesName = seriesName.replace(/ The (Final Years|First Years|Investigation)$/, '');
      let chapterCount = null;
      let source = '';

      try {
        console.log(`  📊 Searching AniList for: ${cleanSeriesName}`);
        const anilistResult = await searchAniList(cleanSeriesName);
        
        if (anilistResult && anilistResult.chapters) {
          chapterCount = anilistResult.chapters;
          source = 'anilist';
          console.log(`  ✅ AniList: ${chapterCount} chapters found`);
        }
      } catch (error) {
        console.log(`  ❌ AniList error: ${error.message}`);
      }

      // If no chapter count from AniList, try MangaDex
      if (!chapterCount) {
        try {
          console.log(`  📚 Searching MangaDex for: ${cleanSeriesName}`);
          const mangaDexResults = await searchMangaDex(cleanSeriesName);
          
          if (mangaDexResults && mangaDexResults.length > 0) {
            const mangaDexId = mangaDexResults[0].id;
            const mangaDexChapterCount = await getMangaDexChapterCount(mangaDexId);
            
            if (mangaDexChapterCount && mangaDexChapterCount > 0) {
              chapterCount = mangaDexChapterCount;
              source = 'mangadex';
              console.log(`  ✅ MangaDex: ${chapterCount} chapters found`);
            }
          }
        } catch (error) {
          console.log(`  ❌ MangaDex error: ${error.message}`);
        }
      }

      // If still no chapter count, use a default based on series type
      if (!chapterCount) {
        // Default chapter counts based on series type
        if (seriesName.includes('One Piece') || seriesName.includes('Naruto') || seriesName.includes('Dragon Ball')) {
          chapterCount = 1000; // Long-running series
        } else if (seriesName.includes('The ') && seriesName.includes('The Final Years')) {
          chapterCount = 50; // Final arcs
        } else if (seriesName.includes('The ') && seriesName.includes('The First Years')) {
          chapterCount = 100; // Early arcs
        } else if (seriesName.includes('The Investigation')) {
          chapterCount = 25; // Investigation arcs
        } else {
          chapterCount = 200; // Default for most series
        }
        source = 'default';
        console.log(`  📝 Using default: ${chapterCount} chapters (${source})`);
      }

      // Create numbered chapter folders
      console.log(`  📖 Creating ${chapterCount} chapter folders...`);
      for (let i = 1; i <= chapterCount; i++) {
        const chapterFolderName = `Chapter ${i}`;
        const chapterPath = path.join(chaptersPath, chapterFolderName);
        
        if (!fs.existsSync(chapterPath)) {
          fs.mkdirSync(chapterPath, { recursive: true });
          
          // Create a placeholder file to ensure the folder exists
          const placeholderPath = path.join(chapterPath, '.gitkeep');
          fs.writeFileSync(placeholderPath, '');
        }
      }

      // Update metadata.json with chapter information
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      }

      metadata.totalChapters = chapterCount;
      metadata.chapterSource = source;
      metadata.chaptersCreatedAt = new Date().toISOString();
      metadata.updatedAt = new Date().toISOString();

      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`  ✅ Created ${chapterCount} chapter folders`);
      console.log(`  📝 Updated metadata.json with chapter info`);
      console.log(`  🎯 Source: ${source}`);
      
      seriesWithChapters++;
      seriesUpdated++;

      // Small delay to avoid overwhelming the APIs
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 CHAPTER CREATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series Processed: ${totalSeries}`);
  console.log(`📁 Series with Chapters: ${seriesWithChapters}`);
  console.log(`🆕 Series Updated: ${seriesUpdated}`);
  console.log(`✅ Success Rate: ${((seriesWithChapters / totalSeries) * 100).toFixed(1)}%`);
  
  return {
    totalSeries,
    seriesWithChapters,
    seriesUpdated
  };
}

addChaptersToAllSeries();
