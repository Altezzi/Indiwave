// Final push for the remaining series - targeting 100% coverage!
const fs = require('fs');
const path = require('path');

const finalRemainingSearches = [
  // More series that should have covers
  { folder: "Spy x Family The Investigation", searches: ["Spy x Family", "Spy Family"] },
  { folder: "Spy x Family The Final Years", searches: ["Spy x Family", "Spy Family"] },
  { folder: "Spy x Family The First Years", searches: ["Spy x Family", "Spy Family"] },
  { folder: "Studio Ghibli Collection The Investigation", searches: ["Studio Ghibli", "Ghibli"] },
  { folder: "Studio Ghibli Collection The Final Years", searches: ["Studio Ghibli", "Ghibli"] },
  { folder: "Studio Ghibli Collection The First Years", searches: ["Studio Ghibli", "Ghibli"] },
  { folder: "Sweet Home The Investigation", searches: ["Sweet Home", "Kim Carnby"] },
  { folder: "Sweet Home The Final Years", searches: ["Sweet Home", "Kim Carnby"] },
  { folder: "Sweet Home The First Years", searches: ["Sweet Home", "Kim Carnby"] },
  { folder: "The Boy and the Heron The Investigation", searches: ["The Boy and the Heron", "Kimitachi wa Dou Ikiru ka"] },
  { folder: "The Boy and the Heron The Final Years", searches: ["The Boy and the Heron", "Kimitachi wa Dou Ikiru ka"] },
  { folder: "The Boy and the Heron The First Years", searches: ["The Boy and the Heron", "Kimitachi wa Dou Ikiru ka"] },
  { folder: "The Cat Returns The Investigation", searches: ["The Cat Returns", "Neko no Ongaeshi"] },
  { folder: "The Cat Returns The Final Years", searches: ["The Cat Returns", "Neko no Ongaeshi"] },
  { folder: "The Cat Returns The First Years", searches: ["The Cat Returns", "Neko no Ongaeshi"] },
  { folder: "The Disastrous Life of Saiki K The Investigation", searches: ["The Disastrous Life of Saiki K", "Saiki Kusuo no Psi-nan"] },
  { folder: "The Disastrous Life of Saiki K The Final Years", searches: ["The Disastrous Life of Saiki K", "Saiki Kusuo no Psi-nan"] },
  { folder: "The Disastrous Life of Saiki K The First Years", searches: ["The Disastrous Life of Saiki K", "Saiki Kusuo no Psi-nan"] },
  { folder: "The Eminence in Shadow The Investigation", searches: ["The Eminence in Shadow", "Kage no Jitsuryokusha ni Naritakute"] },
  { folder: "The Eminence in Shadow The Final Years", searches: ["The Eminence in Shadow", "Kage no Jitsuryokusha ni Naritakute"] },
  { folder: "The Eminence in Shadow The First Years", searches: ["The Eminence in Shadow", "Kage no Jitsuryokusha ni Naritakute"] },
  { folder: "The Garden of Words The Investigation", searches: ["The Garden of Words", "Kotonoha no Niwa"] },
  { folder: "The Garden of Words The Final Years", searches: ["The Garden of Words", "Kotonoha no Niwa"] },
  { folder: "The Garden of Words The First Years", searches: ["The Garden of Words", "Kotonoha no Niwa"] },
  { folder: "The Girl Who Leapt Through Time The Investigation", searches: ["The Girl Who Leapt Through Time", "Toki wo Kakeru Shoujo"] },
  { folder: "The Girl Who Leapt Through Time The Final Years", searches: ["The Girl Who Leapt Through Time", "Toki wo Kakeru Shoujo"] },
  { folder: "The Girl Who Leapt Through Time The First Years", searches: ["The Girl Who Leapt Through Time", "Toki wo Kakeru Shoujo"] },
  { folder: "The Promised Neverland The Investigation", searches: ["The Promised Neverland", "Yakusoku no Neverland"] },
  { folder: "The Promised Neverland The Final Years", searches: ["The Promised Neverland", "Yakusoku no Neverland"] },
  { folder: "The Promised Neverland The First Years", searches: ["The Promised Neverland", "Yakusoku no Neverland"] },
  { folder: "The Seven Deadly Sins The Investigation", searches: ["The Seven Deadly Sins", "Nanatsu no Taizai"] },
  { folder: "The Seven Deadly Sins The Final Years", searches: ["The Seven Deadly Sins", "Nanatsu no Taizai"] },
  { folder: "The Seven Deadly Sins The First Years", searches: ["The Seven Deadly Sins", "Nanatsu no Taizai"] },
  { folder: "The Tale of Princess Kaguya The Investigation", searches: ["The Tale of Princess Kaguya", "Kaguya-hime no Monogatari"] },
  { folder: "The Tale of Princess Kaguya The Final Years", searches: ["The Tale of Princess Kaguya", "Kaguya-hime no Monogatari"] },
  { folder: "The Tale of Princess Kaguya The First Years", searches: ["The Tale of Princess Kaguya", "Kaguya-hime no Monogatari"] },
  { folder: "The Wind Rises The Investigation", searches: ["The Wind Rises", "Kaze Tachinu"] },
  { folder: "The Wind Rises The Final Years", searches: ["The Wind Rises", "Kaze Tachinu"] },
  { folder: "The Wind Rises The First Years", searches: ["The Wind Rises", "Kaze Tachinu"] },
  { folder: "Tokyo Ghoul The Investigation", searches: ["Tokyo Ghoul", "Sui Ishida"] },
  { folder: "Tokyo Ghoul The Final Years", searches: ["Tokyo Ghoul", "Sui Ishida"] },
  { folder: "Tokyo Ghoul The First Years", searches: ["Tokyo Ghoul", "Sui Ishida"] },
  { folder: "Tower of God The Investigation", searches: ["Tower of God", "SIU"] },
  { folder: "Tower of God The Final Years", searches: ["Tower of God", "SIU"] },
  { folder: "Tower of God The First Years", searches: ["Tower of God", "SIU"] },
  { folder: "Uzumaki The Investigation", searches: ["Uzumaki", "Junji Ito"] },
  { folder: "Uzumaki The Final Years", searches: ["Uzumaki", "Junji Ito"] },
  { folder: "Uzumaki The First Years", searches: ["Uzumaki", "Junji Ito"] },
  { folder: "Weathering with You The Investigation", searches: ["Weathering with You", "Tenki no Ko"] },
  { folder: "Weathering with You The Final Years", searches: ["Weathering with You", "Tenki no Ko"] },
  { folder: "Weathering with You The First Years", searches: ["Weathering with You", "Tenki no Ko"] },
  { folder: "When Marnie Was There The Investigation", searches: ["When Marnie Was There", "Omoide no Marnie"] },
  { folder: "When Marnie Was There The Final Years", searches: ["When Marnie Was There", "Omoide no Marnie"] },
  { folder: "When Marnie Was There The First Years", searches: ["When Marnie Was There", "Omoide no Marnie"] },
  { folder: "Whisper of the Heart The Investigation", searches: ["Whisper of the Heart", "Mimi wo Sumaseba"] },
  { folder: "Whisper of the Heart The Final Years", searches: ["Whisper of the Heart", "Mimi wo Sumaseba"] },
  { folder: "Whisper of the Heart The First Years", searches: ["Whisper of the Heart", "Mimi wo Sumaseba"] },
  { folder: "Your Name The Investigation", searches: ["Your Name", "Kimi no Na wa"] },
  { folder: "Your Name The Final Years", searches: ["Your Name", "Kimi no Na wa"] },
  { folder: "Your Name The First Years", searches: ["Your Name", "Kimi no Na wa"] }
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

async function findFinalRemainingCovers() {
  for (const { folder: seriesName, searches } of finalRemainingSearches) {
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

findFinalRemainingCovers();
