import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFixManga() {
  try {
    console.log('🔍 Checking current manga data...\n');
    
    // Get all series
    const series = await prisma.series.findMany({
      select: {
        id: true,
        title: true,
        coverImage: true,
        mangaMDId: true,
        mangaMDTitle: true,
        _count: {
          select: {
            chapters: true
          }
        }
      }
    });
    
    console.log(`📚 Found ${series.length} series in database\n`);
    
    // Check each series
    series.forEach((s, index) => {
      console.log(`${index + 1}. ID: ${s.id}`);
      console.log(`   Title: "${s.title}"`);
      console.log(`   MangaMD Title: "${s.mangaMDTitle}"`);
      console.log(`   Cover: ${s.coverImage}`);
      console.log(`   MangaMD ID: ${s.mangaMDId}`);
      console.log(`   Chapters: ${s._count.chapters}`);
      console.log('');
    });
    
    // Check for issues
    const unknownTitles = series.filter(s => s.title === 'Unknown Title');
    const placeholderCovers = series.filter(s => s.coverImage === '/placeholder.svg');
    const nullCovers = series.filter(s => !s.coverImage);
    
    console.log('🔍 Issues found:');
    console.log(`   - Series with "Unknown Title": ${unknownTitles.length}`);
    console.log(`   - Series with placeholder covers: ${placeholderCovers.length}`);
    console.log(`   - Series with null covers: ${nullCovers.length}`);
    
    if (unknownTitles.length > 0 || placeholderCovers.length > 0 || nullCovers.length > 0) {
      console.log('\n🔧 Issues detected! Let me fix them...');
      
      // Fix titles and covers
      for (const s of series) {
        if (s.title === 'Unknown Title' || s.coverImage === '/placeholder.svg' || !s.coverImage) {
          console.log(`\n🔧 Fixing series: ${s.mangaMDId}`);
          
          // Get fresh data from MangaDex
          try {
            const response = await fetch(`https://api.mangadex.org/manga/${s.mangaMDId}?includes[]=cover_art&includes[]=author&includes[]=artist`);
            const mangaData = await response.json();
            
            if (mangaData.result === 'ok' && mangaData.data) {
              const manga = mangaData.data;
              
              // Extract proper title
              let properTitle = 'Unknown Title';
              if (manga.attributes?.title) {
                if (typeof manga.attributes.title === 'string') {
                  properTitle = manga.attributes.title;
                } else if (typeof manga.attributes.title === 'object') {
                  properTitle = manga.attributes.title.en || 
                               manga.attributes.title.ja || 
                               Object.values(manga.attributes.title)[0] || 
                               'Unknown Title';
                }
              }
              
              // Get cover URL
              let coverUrl = '/placeholder.svg';
              if (manga.relationships) {
                const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
                if (coverRel && coverRel.attributes?.fileName) {
                  coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
                }
              }
              
              // Update the series
              await prisma.series.update({
                where: { id: s.id },
                data: {
                  title: properTitle,
                  coverImage: coverUrl,
                  mangaMDTitle: properTitle
                }
              });
              
              console.log(`   ✅ Updated: "${properTitle}"`);
              console.log(`   🖼️  Cover: ${coverUrl}`);
              
            } else {
              console.log(`   ❌ Failed to fetch data for ${s.mangaMDId}`);
            }
            
          } catch (error) {
            console.log(`   ❌ Error fixing ${s.mangaMDId}: ${error.message}`);
          }
          
          // Add delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log('\n✅ Fixes completed!');
    } else {
      console.log('\n✅ No issues found - all manga have proper titles and covers!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixManga();
