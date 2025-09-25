// Focus on main series that should definitely have real covers (no placeholders!)
const fs = require('fs');
const path = require('path');

const mainSeriesToFix = [
  { folder: "Bayonetta", search: "Bayonetta" },
  { folder: "Berserk The Black Swordsman Arc", search: "Berserk" },
  { folder: "Berserk The Conviction Arc", search: "Berserk" },
  { folder: "Berserk The Fantasia Arc", search: "Berserk" },
  { folder: "Berserk The Golden Age Arc", search: "Berserk" },
  { folder: "Berserk The Millennium Falcon Arc", search: "Berserk" },
  { folder: "Chainsaw Man The First Years", search: "Chainsaw Man" },
  { folder: "Doraemon The Investigation", search: "Doraemon" },
  { folder: "Detective Conan The Final Years", search: "Detective Conan" },
  { folder: "Detective Conan The First Years", search: "Detective Conan" },
  { folder: "My Neighbor Totoro", search: "My Neighbor Totoro" },
  { folder: "Kiki's Delivery Service", search: "Kiki's Delivery Service" },
  { folder: "Ponyo", search: "Ponyo" },
  { folder: "The Twelve Kingdoms", search: "The Twelve Kingdoms" },
  { folder: "Texhnolyze", search: "Texhnolyze" },
  { folder: "RuriDragon", search: "RuriDragon" },
  { folder: "Niji-iro Togarashi", search: "Niji-iro Togarashi" },
  { folder: "Puni Puni Poemy", search: "Puni Puni Poemy" },
  { folder: "Perfect Blue", search: "Perfect Blue" },
  { folder: "Paprika", search: "Paprika" }
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

async function findRealCovers() {
  for (const { folder: seriesName, search: searchTerm } of mainSeriesToFix) {
    try {
      console.log(`\n🔍 Processing: ${seriesName} (searching for: ${searchTerm})`);
      
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

      // Search for the series
      const searchResults = await searchMangaDex(searchTerm);
      
      if (!searchResults || searchResults.length === 0) {
        console.log(`❌ No MangaDex results found for: ${searchTerm}`);
        continue;
      }

      // Find the best match (not doujinshi, not spin-off if possible)
      let bestMatch = searchResults.find(manga => 
        !manga.title.toLowerCase().includes('doujinshi') &&
        !manga.title.toLowerCase().includes('spin-off') &&
        !manga.title.toLowerCase().includes('anthology')
      ) || searchResults[0];

      console.log(`✅ Found MangaDex entry: ${bestMatch.title} (ID: ${bestMatch.id})`);
      
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
            metadata.source = 'mangadex'; // Mark as real source
            
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

findRealCovers();
