// Search for remaining covers - focusing on main series that should have covers
const fs = require('fs');
const path = require('path');

const remainingSearches = [
  // Main series that should definitely have covers
  { folder: "Bastard The Investigation", searches: ["Bastard", "Sweet Home"] },
  { folder: "Belle The Investigation", searches: ["Belle", "Mamoru Hosoda"] },
  { folder: "Billy Bat The First Years", searches: ["Billy Bat", "Naoki Urasawa"] },
  { folder: "Biomega The Investigation", searches: ["Biomega", "Tsutomu Nihei"] },
  { folder: "Dorohedoro The Investigation", searches: ["Dorohedoro", "Q Hayashida"] },
  { folder: "Eleceed The Investigation", searches: ["Eleceed", "Jung Ji-Hoon"] },
  { folder: "Emma The Investigation", searches: ["Emma", "Kaoru Mori"] },
  { folder: "Fire Punch The Investigation", searches: ["Fire Punch", "Tatsuki Fujimoto"] },
  { folder: "Fire Punch The Final Years", searches: ["Fire Punch", "Tatsuki Fujimoto"] },
  { folder: "Fire Punch The First Years", searches: ["Fire Punch", "Tatsuki Fujimoto"] },
  { folder: "Flawed Almighty The Investigation", searches: ["Flawed Almighty", "Kim Carnby"] },
  { folder: "Flawed Almighty The Final Years", searches: ["Flawed Almighty", "Kim Carnby"] },
  { folder: "Flawed Almighty The First Years", searches: ["Flawed Almighty", "Kim Carnby"] },
  { folder: "Goodbye, Eri The Investigation", searches: ["Goodbye Eri", "Tatsuki Fujimoto"] },
  { folder: "Goodbye, Eri The Final Years", searches: ["Goodbye Eri", "Tatsuki Fujimoto"] },
  { folder: "Goodbye, Eri The First Years", searches: ["Goodbye Eri", "Tatsuki Fujimoto"] },
  { folder: "How to Fight The Final Years", searches: ["How to Fight", "Jung Ji-Hoon"] },
  { folder: "Kiki's Delivery Service The Investigation", searches: ["Kiki's Delivery Service", "Majo no Takkyuubin"] },
  { folder: "Kiki's Delivery Service The Final Years", searches: ["Kiki's Delivery Service", "Majo no Takkyuubin"] },
  { folder: "Kiki's Delivery Service The First Years", searches: ["Kiki's Delivery Service", "Majo no Takkyuubin"] },
  { folder: "Howl's Moving Castle The Investigation", searches: ["Howl's Moving Castle", "Hayao Miyazaki"] },
  { folder: "Howl's Moving Castle The Final Years", searches: ["Howl's Moving Castle", "Hayao Miyazaki"] },
  { folder: "Howl's Moving Castle The First Years", searches: ["Howl's Moving Castle", "Hayao Miyazaki"] },
  { folder: "From Up on Poppy Hill The Investigation", searches: ["From Up on Poppy Hill", "Chizuru Takahashi"] },
  { folder: "From Up on Poppy Hill The Final Years", searches: ["From Up on Poppy Hill", "Chizuru Takahashi"] },
  { folder: "From Up on Poppy Hill The First Years", searches: ["From Up on Poppy Hill", "Chizuru Takahashi"] },
  { folder: "Grave of the Fireflies The Investigation", searches: ["Grave of the Fireflies", "Akiyuki Nosaka"] },
  { folder: "Grave of the Fireflies The Final Years", searches: ["Grave of the Fireflies", "Akiyuki Nosaka"] },
  { folder: "Grave of the Fireflies The First Years", searches: ["Grave of the Fireflies", "Akiyuki Nosaka"] },
  { folder: "Children Who Chase Lost Voices The Investigation", searches: ["Children Who Chase Lost Voices", "Makoto Shinkai"] },
  { folder: "Children Who Chase Lost Voices The Final Years", searches: ["Children Who Chase Lost Voices", "Makoto Shinkai"] },
  { folder: "Children Who Chase Lost Voices The First Years", searches: ["Children Who Chase Lost Voices", "Makoto Shinkai"] },
  { folder: "Castle in the Sky The Investigation", searches: ["Castle in the Sky", "Hayao Miyazaki"] },
  { folder: "Castle in the Sky The Final Years", searches: ["Castle in the Sky", "Hayao Miyazaki"] },
  { folder: "Castle in the Sky The First Years", searches: ["Castle in the Sky", "Hayao Miyazaki"] },
  { folder: "5 Centimeters Per Second The Investigation", searches: ["5 Centimeters Per Second", "Makoto Shinkai"] },
  { folder: "5 Centimeters Per Second The Final Years", searches: ["5 Centimeters Per Second", "Makoto Shinkai"] },
  { folder: "5 Centimeters Per Second The First Years", searches: ["5 Centimeters Per Second", "Makoto Shinkai"] },
  { folder: "A Bride's Story The Investigation", searches: ["A Bride's Story", "Kaoru Mori"] },
  { folder: "A Bride's Story The Final Years", searches: ["A Bride's Story", "Kaoru Mori"] },
  { folder: "A Bride's Story The First Years", searches: ["A Bride's Story", "Kaoru Mori"] },
  { folder: "20th Century Boys The First Years", searches: ["20th Century Boys", "Naoki Urasawa"] },
  { folder: "Astro Boy The First Years", searches: ["Astro Boy", "Osamu Tezuka"] }
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

async function findRemainingCovers() {
  for (const { folder: seriesName, searches } of remainingSearches) {
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

findRemainingCovers();
