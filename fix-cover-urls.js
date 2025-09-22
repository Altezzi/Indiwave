import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCoverUrls() {
  try {
    console.log('🔧 Fixing cover URLs in database...');
    
    // Get all series with cover images
    const series = await prisma.series.findMany({
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
    
    console.log(`📚 Found ${series.length} series with cover images to fix`);
    
    let fixedCount = 0;
    
    for (const s of series) {
      if (s.coverImage && s.coverImage.includes('.jpg.large.jpg')) {
        // Fix the URL by removing the duplicate .jpg
        const fixedUrl = s.coverImage.replace('.jpg.large.jpg', '.large.jpg');
        
        await prisma.series.update({
          where: { id: s.id },
          data: { coverImage: fixedUrl }
        });
        
        console.log(`✅ Fixed: ${s.title}`);
        console.log(`   Old: ${s.coverImage}`);
        console.log(`   New: ${fixedUrl}`);
        fixedCount++;
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} cover URLs!`);
    
    // Test a few URLs to make sure they work
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
      console.log(`📖 ${s.title}: ${s.coverImage}`);
    }
    
  } catch (error) {
    console.error('❌ Error fixing cover URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCoverUrls();
