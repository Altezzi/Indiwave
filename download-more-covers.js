// Try to get covers for more series, including some that might need alternative approaches
const fs = require('fs');
const path = require('path');

// More series to try to get covers for
const seriesToFix = [
  "Metal Gear Solid",
  "Bayonetta", 
  "Demon Slayer Rengoku",
  "Naruto Sakura's Story",
  "Tokyo Ghoul Joker",
  "Vinland Saga Slave Arc",
  "Dragon Ball The Path to Power",
  "Dragon Ball Z Battle of Gods",
  "Fullmetal Alchemist The Conqueror of Shamballa",
  "Fullmetal Alchemist The Sacred Star of Milos",
  "Fullmetal Alchemist The Promise Day",
  "Fullmetal Alchemist The First Attack",
  "Fullmetal Alchemist The Ties That Bind",
  "Bleach Can't Fear Your Own World",
  "Bleach DiamondDust Rebellion", 
  "Bleach We Do Knot Always Love You",
  "One Piece Film Gold",
  "One Piece Red",
  "One Piece Stampede",
  "One Punch Man Road to Hero",
  "Hunter x Hunter Kurapika's Memories"
];

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

async function updateMissingCovers() {
  for (const seriesName of seriesToFix) {
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

      // Search for the manga
      const searchResults = await searchMangaDex(seriesName);
      
      if (!searchResults || searchResults.length === 0) {
        console.log(`❌ No MangaDex results found for: ${seriesName}`);
        continue;
      }

      // Use the first (most relevant) result
      const manga = searchResults[0];
      console.log(`✅ Found MangaDex entry: ${manga.title} (ID: ${manga.id})`);
      
      // Download the cover art
      const coverResult = await downloadMangaDexCover(manga.id, seriesPath, seriesName);
      if (coverResult) {
        console.log(`🎨 Downloaded cover: ${coverResult.filename} (${Math.round(coverResult.size / 1024)}KB)`);
        
        // Update metadata.json
        const metadataPath = path.join(seriesPath, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            metadata.coverImage = coverResult.filename;
            metadata.mangaDexId = manga.id;
            metadata.updatedAt = new Date().toISOString();
            
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            console.log(`📝 Updated metadata.json`);
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

updateMissingCovers();
