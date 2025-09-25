// Final push to find more covers - targeting remaining series
const fs = require('fs');
const path = require('path');

const finalPushSearches = [
  // More series that should have covers
  { folder: "Kimba the White Lion The Investigation", searches: ["Kimba the White Lion", "Jungle Taitei"] },
  { folder: "Kimba the White Lion The Final Years", searches: ["Kimba the White Lion", "Jungle Taitei"] },
  { folder: "Kimba the White Lion The First Years", searches: ["Kimba the White Lion", "Jungle Taitei"] },
  { folder: "Knights of Sidonia The Investigation", searches: ["Knights of Sidonia", "Sidonia no Kishi"] },
  { folder: "Knights of Sidonia The Final Years", searches: ["Knights of Sidonia", "Sidonia no Kishi"] },
  { folder: "Knights of Sidonia The First Years", searches: ["Knights of Sidonia", "Sidonia no Kishi"] },
  { folder: "Little Witch Academia The Investigation", searches: ["Little Witch Academia", "LWA"] },
  { folder: "Little Witch Academia The Final Years", searches: ["Little Witch Academia", "LWA"] },
  { folder: "Little Witch Academia The First Years", searches: ["Little Witch Academia", "LWA"] },
  { folder: "Look Back The Investigation", searches: ["Look Back", "Tatsuki Fujimoto"] },
  { folder: "Look Back The Final Years", searches: ["Look Back", "Tatsuki Fujimoto"] },
  { folder: "Look Back The First Years", searches: ["Look Back", "Tatsuki Fujimoto"] },
  { folder: "Lookism The Investigation", searches: ["Lookism", "Park Taejun"] },
  { folder: "Lookism The Final Years", searches: ["Lookism", "Park Taejun"] },
  { folder: "Lookism The First Years", searches: ["Lookism", "Park Taejun"] },
  { folder: "Lupin III The Investigation", searches: ["Lupin III", "Arsene Lupin III"] },
  { folder: "Lupin III The Final Years", searches: ["Lupin III", "Arsene Lupin III"] },
  { folder: "Lupin III The First Years", searches: ["Lupin III", "Arsene Lupin III"] },
  { folder: "Manager Kim The Investigation", searches: ["Manager Kim", "Jung Ji-Hoon"] },
  { folder: "Manager Kim The Final Years", searches: ["Manager Kim", "Jung Ji-Hoon"] },
  { folder: "Manager Kim The First Years", searches: ["Manager Kim", "Jung Ji-Hoon"] },
  { folder: "Master Keaton The First Years", searches: ["Master Keaton", "Naoki Urasawa"] },
  { folder: "Mercenary Enrollment The Investigation", searches: ["Mercenary Enrollment", "YC"] },
  { folder: "Mercenary Enrollment The Final Years", searches: ["Mercenary Enrollment", "YC"] },
  { folder: "Mercenary Enrollment The First Years", searches: ["Mercenary Enrollment", "YC"] },
  { folder: "Metropolis The Investigation", searches: ["Metropolis", "Osamu Tezuka"] },
  { folder: "Mirai The Investigation", searches: ["Mirai", "Mamoru Hosoda"] },
  { folder: "My Life as a Loser The Investigation", searches: ["My Life as a Loser", "Kim Carnby"] },
  { folder: "My Life as a Loser The Final Years", searches: ["My Life as a Loser", "Kim Carnby"] },
  { folder: "My Life as a Loser The First Years", searches: ["My Life as a Loser", "Kim Carnby"] },
  { folder: "My Neighbor Totoro The Investigation", searches: ["My Neighbor Totoro", "Tonari no Totoro"] },
  { folder: "My Neighbor Totoro The Final Years", searches: ["My Neighbor Totoro", "Tonari no Totoro"] },
  { folder: "My Neighbor Totoro The First Years", searches: ["My Neighbor Totoro", "Tonari no Totoro"] }
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

async function findFinalPushCovers() {
  for (const { folder: seriesName, searches } of finalPushSearches) {
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

findFinalPushCovers();
