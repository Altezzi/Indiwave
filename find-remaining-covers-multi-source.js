// Find covers for the remaining 44 series using multi-source search (AniList + MangaDex + MangaUpdates)
const fs = require('fs');
const path = require('path');

// The 44 remaining series without covers
const remainingSeries = [
  "Kiki's Delivery Service The Final Years",
  "Kiki's Delivery Service The First Years", 
  "Kiki's Delivery Service The Investigation",
  "My Neighbor Totoro",
  "My Neighbor Totoro The Final Years",
  "My Neighbor Totoro The First Years",
  "My Neighbor Totoro The Investigation",
  "Paprika",
  "Perfect Blue",
  "Puni Puni Poemy",
  "Solo Leveling The Final Years",
  "Solo Leveling The First Years",
  "Spirited Away The Final Years",
  "Spirited Away The First Years",
  "Summer Wars The Final Years",
  "Summer Wars The First Years",
  "Texhnolyze",
  "The Ancient Magus' Bride The Final Years",
  "The Ancient Magus' Bride The First Years",
  "The Beginning After the End The Final Years",
  "The Beginning After the End The First Years",
  "The Boy and the Beast The Final Years",
  "The Boy and the Beast The First Years",
  "The Misfit of Demon King Academy The Final Years",
  "The Misfit of Demon King Academy The First Years",
  "The Place Promised in Our Early Days The Final Years",
  "The Place Promised in Our Early Days The First Years",
  "The Secret World of Arrietty The Final Years",
  "The Secret World of Arrietty The First Years",
  "The Secret World of Arrietty The Investigation",
  "The Twelve Kingdoms",
  "Unordinary The Investigation",
  "Vinland Saga The First Years",
  "Viral Hit The Final Years",
  "Viral Hit The First Years",
  "Weak Hero The Final Years",
  "Weak Hero The First Years",
  "Wind Breaker The Final Years",
  "Wind Breaker The First Years",
  "Witch Hat Atelier The Final Years",
  "Witch Hat Atelier The First Years",
  "Witch Hat Atelier The Investigation",
  "Wolf Children The First Years",
  "Wolf Children The Investigation"
];

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
          externalLinks {
            site
            url
          }
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
        externalLinks: data.data.Media.externalLinks
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

async function downloadAniListCover(coverUrl, seriesPath, title) {
  try {
    if (!coverUrl) return null;

    const response = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download cover: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension
    let extension = 'jpg';
    const contentType = response.headers.get('content-type');
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
    console.error('Error downloading AniList cover art:', error);
    return null;
  }
}

async function findCoversForRemainingSeries() {
  for (const seriesName of remainingSeries) {
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

      let coverImageName = null;
      let sources = [];

      // Create search terms - try original title and simplified versions
      const searchTerms = [
        seriesName,
        seriesName.replace(/ The (Final Years|First Years|Investigation)$/, ''), // Remove arc suffixes
        seriesName.replace(/ The (Final Years|First Years|Investigation)$/, '').replace(/ The /, ' '), // Simplify
      ];

      // Search AniList first
      for (const searchTerm of searchTerms) {
        try {
          console.log(`  📊 Searching AniList for: ${searchTerm}`);
          const aniListResult = await searchAniList(searchTerm);
          
          if (aniListResult) {
            sources.push('anilist');
            console.log(`  ✅ Found AniList entry: ${aniListResult.title} (ID: ${aniListResult.id})`);
            
            // Try to download cover from AniList
            if (aniListResult.coverImage) {
              const coverResult = await downloadAniListCover(aniListResult.coverImage, seriesPath, seriesName);
              if (coverResult) {
                coverImageName = coverResult.filename;
                console.log(`  🎨 Downloaded AniList cover: ${coverImageName} (${Math.round(coverResult.size / 1024)}KB)`);
                break; // Success, stop searching
              }
            }
          }
        } catch (error) {
          console.error(`  ❌ Error with AniList search for ${searchTerm}: ${error.message}`);
        }
        
        // Small delay between searches
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Search MangaDex if AniList didn't work
      if (!coverImageName) {
        for (const searchTerm of searchTerms) {
          try {
            console.log(`  📚 Searching MangaDex for: ${searchTerm}`);
            const mangaDexResults = await searchMangaDex(searchTerm);
            
            if (mangaDexResults && mangaDexResults.length > 0) {
              const foundManga = mangaDexResults[0];
              sources.push('mangadex');
              console.log(`  ✅ Found MangaDex entry: ${foundManga.title} (ID: ${foundManga.id})`);
              
              // Download cover from MangaDex
              const coverResult = await downloadMangaDexCover(foundManga.id, seriesPath, seriesName);
              if (coverResult) {
                coverImageName = coverResult.filename;
                console.log(`  🎨 Downloaded MangaDex cover: ${coverImageName} (${Math.round(coverResult.size / 1024)}KB)`);
                break; // Success, stop searching
              }
            }
          } catch (error) {
            console.error(`  ❌ Error with MangaDex search for ${searchTerm}: ${error.message}`);
          }
          
          // Small delay between searches
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Update metadata.json if we found a cover
      if (coverImageName) {
        const metadataPath = path.join(seriesPath, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            metadata.coverImage = coverImageName;
            metadata.sources = [...new Set([...(metadata.sources || []), ...sources])]; // Merge sources
            metadata.updatedAt = new Date().toISOString();
            
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
            console.log(`  📝 Updated metadata.json with cover info from: ${sources.join(', ')}`);
          } catch (error) {
            console.log(`  ❌ Error updating metadata: ${error.message}`);
          }
        }
        
        console.log(`  ✅ Successfully added cover for: ${seriesName}`);
      } else {
        console.log(`  ❌ No cover found for: ${seriesName}`);
      }
      
      // Small delay to avoid overwhelming the servers
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }
}

findCoversForRemainingSeries();
