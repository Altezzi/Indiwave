import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCoverUrls() {
  try {
    console.log('🧪 Testing cover URLs...');
    
    // Get some series with cover images
    const series = await prisma.series.findMany({
      take: 5,
      where: {
        coverImage: {
          not: null,
          not: '/placeholder.svg'
        }
      },
      select: {
        id: true,
        title: true,
        coverImage: true
      }
    });
    
    console.log(`\n📚 Testing ${series.length} cover URLs:`);
    
    for (const s of series) {
      console.log(`\n📖 ${s.title}`);
      console.log(`   URL: ${s.coverImage}`);
      
      try {
        const response = await fetch(s.coverImage, { method: 'HEAD' });
        if (response.ok) {
          console.log(`   ✅ Status: ${response.status} - Image accessible`);
        } else {
          console.log(`   ❌ Status: ${response.status} - Image not accessible`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Also check if there are any series with placeholder covers
    const placeholderCount = await prisma.series.count({
      where: {
        OR: [
          { coverImage: null },
          { coverImage: '/placeholder.svg' }
        ]
      }
    });
    
    const totalCount = await prisma.series.count();
    const withCovers = totalCount - placeholderCount;
    
    console.log(`\n📊 Cover Statistics:`);
    console.log(`   📚 Total series: ${totalCount}`);
    console.log(`   🖼️  With cover art: ${withCovers}`);
    console.log(`   ⚠️  With placeholders: ${placeholderCount}`);
    
  } catch (error) {
    console.error('❌ Error testing cover URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCoverUrls();
