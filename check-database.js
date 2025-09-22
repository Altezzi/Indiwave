import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking your database...');
    
    // Count total series
    const totalSeries = await prisma.series.count();
    console.log(`📚 Total series in database: ${totalSeries}`);
    
    // Count imported series
    const importedSeries = await prisma.series.count({
      where: { isImported: true }
    });
    console.log(`📥 Imported series: ${importedSeries}`);
    
    // Count published series
    const publishedSeries = await prisma.series.count({
      where: { isPublished: true }
    });
    console.log(`✅ Published series: ${publishedSeries}`);
    
    // Count unpublished series
    const unpublishedSeries = await prisma.series.count({
      where: { isPublished: false }
    });
    console.log(`⏸️ Unpublished series: ${unpublishedSeries}`);
    
    // Count total chapters
    const totalChapters = await prisma.chapter.count();
    console.log(`📄 Total chapters: ${totalChapters}`);
    
    // Get some sample imported series
    const sampleSeries = await prisma.series.findMany({
      where: { isImported: true },
      take: 5,
      select: {
        id: true,
        title: true,
        mangaMDId: true,
        isPublished: true,
        _count: {
          select: { chapters: true }
        }
      }
    });
    
    console.log('\n📋 Sample imported series:');
    sampleSeries.forEach(series => {
      console.log(`   - ${series.title} (${series._count.chapters} chapters) - ${series.isPublished ? 'Published' : 'Unpublished'}`);
    });
    
    // Check for series without chapters
    const seriesWithoutChapters = await prisma.series.findMany({
      where: { 
        isImported: true,
        chapters: {
          none: {}
        }
      },
      take: 5,
      select: {
        id: true,
        title: true,
        mangaMDId: true
      }
    });
    
    if (seriesWithoutChapters.length > 0) {
      console.log('\n⚠️ Series without chapters:');
      seriesWithoutChapters.forEach(series => {
        console.log(`   - ${series.title} (${series.mangaMDId})`);
      });
    }
    
    console.log('\n💡 Recommendations:');
    if (importedSeries > 0) {
      console.log('   1. You already have imported manga! Use the Manga Curation page to review them.');
      console.log('   2. You can publish the ones you want in your public library.');
      console.log('   3. If you want to import more, we should start from a higher offset.');
    } else {
      console.log('   1. No imported manga found. Ready to start importing!');
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
