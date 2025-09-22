import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAllCoverUrls() {
  try {
    console.log('🔧 Fixing all cover URLs in database...');
    
    // Get all series with MangaDex IDs and cover images
    const series = await prisma.series.findMany({
      where: {
        mangaMDId: {
          not: null
        },
        coverImage: {
          not: null,
          not: '/placeholder.svg'
        }
      },
      select: {
        id: true,
        title: true,
        mangaMDId: true,
        coverImage: true
      }
    });
    
    console.log(`📚 Found ${series.length} series to fix`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const s of series) {
      try {
        console.log(`\n📖 Fixing: ${s.title}`);
        
        // Fetch covers from MangaDex API
        const coverApiUrl = `https://api.mangadex.org/cover?manga[]=${s.mangaMDId}&limit=100`;
        const response = await fetch(coverApiUrl);
        const data = await response.json();
        
        if (data.result === 'ok' && data.data.length > 0) {
          const cover = data.data[0];
          const correctUrl = `https://uploads.mangadex.org/covers/${s.mangaMDId}/${cover.attributes.fileName}`;
          
          // Test if the URL works
          const testResponse = await fetch(correctUrl);
          if (testResponse.ok) {
            // Update the database
            await prisma.series.update({
              where: { id: s.id },
              data: { coverImage: correctUrl }
            });
            
            console.log(`   ✅ Fixed: ${correctUrl}`);
            fixedCount++;
          } else {
            console.log(`   ❌ URL not accessible: ${testResponse.status}`);
            errorCount++;
          }
        } else {
          console.log(`   ❌ No covers found in API`);
          errorCount++;
        }
        
        // Add a small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Cover URL fix completed!`);
    console.log(`   ✅ Fixed: ${fixedCount} series`);
    console.log(`   ❌ Errors: ${errorCount} series`);
    
    // Test a few fixed URLs
    console.log('\n🧪 Testing fixed URLs...');
    const testSeries = await prisma.series.findMany({
      take: 3,
      where: {
        coverImage: {
          not: null,
          not: '/placeholder.svg'
        }
      },
      select: {
        title: true,
        coverImage: true
      }
    });
    
    for (const s of testSeries) {
      try {
        const response = await fetch(s.coverImage);
        if (response.ok) {
          console.log(`   ✅ ${s.title}: Working (${response.status})`);
        } else {
          console.log(`   ❌ ${s.title}: Not working (${response.status})`);
        }
      } catch (error) {
        console.log(`   ❌ ${s.title}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing cover URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllCoverUrls();
