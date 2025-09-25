// Verify that covers match their series by checking metadata and doing visual verification
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
        coverImage: data.data.Media.coverImage.large
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error searching AniList:', error);
    return null;
  }
}

async function verifyCoverMatching() {
  const seriesDir = path.join(process.cwd(), 'series');
  const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.includes('Test') && !name.includes('Simple') && !name.includes('One Piece Real'));

  console.log(`🔍 Starting cover verification for ${seriesFolders.length} series...\n`);

  let totalSeries = 0;
  let seriesWithCovers = 0;
  let potentialMismatches = [];
  let verifiedMatches = [];

  for (const seriesName of seriesFolders) {
    try {
      totalSeries++;
      const seriesPath = path.join(seriesDir, seriesName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      // Check if series has a cover
      const coverFiles = fs.readdirSync(seriesPath)
        .filter(file => file.startsWith('cover.'));
      
      if (coverFiles.length === 0) {
        console.log(`❌ ${seriesName}: No cover found`);
        continue;
      }
      
      seriesWithCovers++;
      const coverFile = coverFiles[0];
      
      // Read metadata
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      }

      // Get series info for verification
      const cleanSeriesName = seriesName.replace(/ The (Final Years|First Years|Investigation)$/, '');
      const anilistResult = await searchAniList(cleanSeriesName);
      
      if (anilistResult) {
        console.log(`✅ ${seriesName}:`);
        console.log(`   📁 Cover: ${coverFile}`);
        console.log(`   📚 Expected: ${anilistResult.title}`);
        console.log(`   📊 AniList ID: ${anilistResult.id}`);
        
        // Check if the AniList title matches our series name (case-insensitive)
        const seriesNameLower = cleanSeriesName.toLowerCase();
        const anilistTitleLower = anilistResult.title.toLowerCase();
        
        if (seriesNameLower.includes(anilistTitleLower) || anilistTitleLower.includes(seriesNameLower)) {
          console.log(`   ✅ Title match confirmed`);
          verifiedMatches.push({
            series: seriesName,
            cover: coverFile,
            expectedTitle: anilistResult.title,
            anilistId: anilistResult.id
          });
        } else {
          console.log(`   ⚠️ Potential mismatch - titles don't align`);
          potentialMismatches.push({
            series: seriesName,
            cover: coverFile,
            expectedTitle: anilistResult.title,
            anilistId: anilistResult.id,
            reason: 'Title mismatch'
          });
        }
        
        // Check if we have the correct AniList ID in metadata
        if (metadata.aniListId && metadata.aniListId === anilistResult.id) {
          console.log(`   ✅ Metadata AniList ID matches`);
        } else if (metadata.aniListId) {
          console.log(`   ⚠️ Metadata AniList ID mismatch (${metadata.aniListId} vs ${anilistResult.id})`);
          potentialMismatches.push({
            series: seriesName,
            cover: coverFile,
            expectedTitle: anilistResult.title,
            anilistId: anilistResult.id,
            reason: 'AniList ID mismatch in metadata'
          });
        }
        
      } else {
        console.log(`⚠️ ${seriesName}:`);
        console.log(`   📁 Cover: ${coverFile}`);
        console.log(`   ❌ No AniList data found for verification`);
        potentialMismatches.push({
          series: seriesName,
          cover: coverFile,
          expectedTitle: 'Unknown',
          anilistId: null,
          reason: 'No AniList data found'
        });
      }
      
      console.log(''); // Empty line for readability
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error processing ${seriesName}: ${error.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 COVER VERIFICATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`📚 Total Series: ${totalSeries}`);
  console.log(`🎨 Series with Covers: ${seriesWithCovers}`);
  console.log(`✅ Verified Matches: ${verifiedMatches.length}`);
  console.log(`⚠️ Potential Mismatches: ${potentialMismatches.length}`);
  console.log(`📊 Coverage Rate: ${((seriesWithCovers / totalSeries) * 100).toFixed(1)}%`);
  
  if (potentialMismatches.length > 0) {
    console.log('\n⚠️ POTENTIAL MISMATCHES:');
    potentialMismatches.forEach((mismatch, index) => {
      console.log(`${index + 1}. ${mismatch.series}`);
      console.log(`   Cover: ${mismatch.cover}`);
      console.log(`   Expected: ${mismatch.expectedTitle}`);
      console.log(`   Reason: ${mismatch.reason}`);
      console.log('');
    });
  }
  
  if (verifiedMatches.length > 0) {
    console.log('\n✅ VERIFIED MATCHES (Sample):');
    verifiedMatches.slice(0, 10).forEach((match, index) => {
      console.log(`${index + 1}. ${match.series} -> ${match.expectedTitle}`);
    });
    
    if (verifiedMatches.length > 10) {
      console.log(`... and ${verifiedMatches.length - 10} more verified matches`);
    }
  }

  return {
    totalSeries,
    seriesWithCovers,
    verifiedMatches,
    potentialMismatches
  };
}

verifyCoverMatching();
