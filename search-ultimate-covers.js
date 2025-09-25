// Ultimate push to find ALL remaining covers - targeting 100% coverage!
const fs = require('fs');
const path = require('path');

const ultimateSearches = [
  // More series that should have covers
  { folder: "My Neighbors the Yamadas The Investigation", searches: ["My Neighbors the Yamadas", "Heisei Tanuki Gassen Ponpoko"] },
  { folder: "My Neighbors the Yamadas The Final Years", searches: ["My Neighbors the Yamadas", "Heisei Tanuki Gassen Ponpoko"] },
  { folder: "My Neighbors the Yamadas The First Years", searches: ["My Neighbors the Yamadas", "Heisei Tanuki Gassen Ponpoko"] },
  { folder: "Omniscient Reader's Viewpoint The Investigation", searches: ["Omniscient Reader's Viewpoint", "ORV"] },
  { folder: "Omniscient Reader's Viewpoint The Final Years", searches: ["Omniscient Reader's Viewpoint", "ORV"] },
  { folder: "Omniscient Reader's Viewpoint The First Years", searches: ["Omniscient Reader's Viewpoint", "ORV"] },
  { folder: "Only Yesterday The Investigation", searches: ["Only Yesterday", "Omoide Poroporo"] },
  { folder: "Only Yesterday The Final Years", searches: ["Only Yesterday", "Omoide Poroporo"] },
  { folder: "Only Yesterday The First Years", searches: ["Only Yesterday", "Omoide Poroporo"] },
  { folder: "Otoyomegatari The Investigation", searches: ["Otoyomegatari", "A Bride's Story"] },
  { folder: "Otoyomegatari The Final Years", searches: ["Otoyomegatari", "A Bride's Story"] },
  { folder: "Otoyomegatari The First Years", searches: ["Otoyomegatari", "A Bride's Story"] },
  { folder: "Pigpen The Investigation", searches: ["Pigpen", "Kim Carnby"] },
  { folder: "Pigpen The Final Years", searches: ["Pigpen", "Kim Carnby"] },
  { folder: "Pigpen The First Years", searches: ["Pigpen", "Kim Carnby"] },
  { folder: "Pom Poko The Investigation", searches: ["Pom Poko", "Heisei Tanuki Gassen Ponpoko"] },
  { folder: "Pom Poko The Final Years", searches: ["Pom Poko", "Heisei Tanuki Gassen Ponpoko"] },
  { folder: "Pom Poko The First Years", searches: ["Pom Poko", "Heisei Tanuki Gassen Ponpoko"] },
  { folder: "Princess Mononoke The Investigation", searches: ["Princess Mononoke", "Mononoke Hime"] },
  { folder: "Princess Mononoke The Final Years", searches: ["Princess Mononoke", "Mononoke Hime"] },
  { folder: "Princess Mononoke The First Years", searches: ["Princess Mononoke", "Mononoke Hime"] },
  { folder: "Questism The Investigation", searches: ["Questism", "Jung Ji-Hoon"] },
  { folder: "Questism The Final Years", searches: ["Questism", "Jung Ji-Hoon"] },
  { folder: "Questism The First Years", searches: ["Questism", "Jung Ji-Hoon"] },
  { folder: "Shirley The Investigation", searches: ["Shirley", "Kaoru Mori"] },
  { folder: "Shirley The Final Years", searches: ["Shirley", "Kaoru Mori"] },
  { folder: "Shirley The First Years", searches: ["Shirley", "Kaoru Mori"] },
  { folder: "Shotgun Boy The Investigation", searches: ["Shotgun Boy", "Tatsuki Fujimoto"] },
  { folder: "Shotgun Boy The Final Years", searches: ["Shotgun Boy", "Tatsuki Fujimoto"] },
  { folder: "Shotgun Boy The First Years", searches: ["Shotgun Boy", "Tatsuki Fujimoto"] }
];

async function searchMangaDex(title) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=10`, {
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
      status: manga.attributes.status
    }));

  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return null;
  }
}

async function downloadMangaDexCover(mangaId, seriesPath, title) {
  try {
    // Fetch manga data with cover art relationship
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result !== 'ok') {
      throw new Error('Invalid manga data from MangaDex');
    }

    // Get cover art URL
    const coverRelationship = data.data.relationships?.find((rel) => rel.type === 'cover_art');
    if (!coverRelationship) {
      throw new Error('No cover art found for this manga');
    }

    // Get cover art details
    const coverResponse = await fetch(`https://api.mangadex.org/cover/${coverRelationship.id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const coverData = await coverResponse.json();
    
    if (coverData.result !== 'ok') {
      throw new Error('Failed to get cover art details');
    }

    const fileName = coverData.data.attributes.fileName;
    const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

    // Download the cover image
    const imageResponse = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download cover: ${imageResponse.statusText}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension
    let extension = 'jpg';
    const contentType = imageResponse.headers.get('content-type');
    if (contentType?.includes('png')) {
      extension = 'png';
    } else if (contentType?.includes('webp')) {
      extension = 'webp';
    }

    const filename = `cover.${extension}`;
    const filePath = path.join(seriesPath, filename);

    // Write cover art file
    fs.writeFileSync(filePath, buffer);

    return {
      path: filePath,
      filename: filename,
      size: buffer.length,
      url: coverUrl
    };

  } catch (error) {
    console.error('Error downloading MangaDex cover art:', error);
    return null;
  }
}

async function findUltimateCovers() {
  for (const { folder: seriesName, searches } of ultimateSearches) {
    try {
      console.log(`\n🔍 Processing: ${seriesName}`);
      
      const seriesPath = path.join(process.cwd(), 'series', seriesName);
      
      if (!fs.existsSync(seriesPath)) {
        console.log(`❌ Series folder not found: ${seriesName}`);
        continue;
      }

      // Check if already has a cover
      const existingCovers = fs.readdirSync(seriesPath)
        .filter(file => file.startsWith('cover.'));
      
      if (existingCovers.length > 0) {
        console.log(`✅ Already has cover: ${existingCovers[0]}`);
        continue;
      }

      let bestMatch = null;
      let searchTerm = '';

      // Try each search term until we find a match
      for (const search of searches) {
        console.log(`  🔎 Trying search: "${search}"`);
        const searchResults = await searchMangaDex(search);
        
        if (searchResults && searchResults.length > 0) {
          // Find the best match (not doujinshi, not spin-off if possible)
          bestMatch = searchResults.find(manga => 
            !manga.title.toLowerCase().includes('doujinshi') &&
            !manga.title.toLowerCase().includes('spin-off') &&
            !manga.title.toLowerCase().includes('anthology')
          ) || searchResults[0];
          
          searchTerm = search;
          console.log(`  ✅ Found match with "${search}": ${bestMatch.title}`);
          break;
        }
        
        // Small delay between searches
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!bestMatch) {
        console.log(`❌ No MangaDex results found for any search terms`);
        continue;
      }

      console.log(`✅ Using: ${bestMatch.title} (ID: ${bestMatch.id})`);
      
      // Download the cover art
      const coverResult = await downloadMangaDexCover(bestMatch.id, seriesPath, seriesName);
      if (coverResult) {
        console.log(`🎨 Downloaded REAL cover: ${coverResult.filename} (${Math.round(coverResult.size / 1024)}KB)`);
        
        // Update metadata.json
        const metadataPath = path.join(seriesPath, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            metadata.coverImage = coverResult.filename;
            metadata.mangaDexId = bestMatch.id;
            metadata.updatedAt = new Date().toISOString();
            metadata.source = 'mangadex';
            
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            console.log(`📝 Updated metadata.json with real cover info`);
          } catch (error) {
            console.log(`❌ Error updating metadata: ${error.message}`);
          }
        }
      } else {
        console.log(`❌ Failed to download cover for: ${seriesName}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }
}

findUltimateCovers();

