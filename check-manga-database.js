import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMangaDatabase() {
  try {
    console.log('🔍 Checking current manga database state...\n');
    
    // Check series count
    const seriesCount = await prisma.series.count();
    console.log(`📚 Total Series: ${seriesCount}`);
    
    // Check chapters count
    const chaptersCount = await prisma.chapter.count();
    console.log(`📄 Total Chapters: ${chaptersCount}`);
    
    // Check imported vs non-imported series
    const importedSeries = await prisma.series.count({
      where: { isImported: true }
    });
    const nonImportedSeries = await prisma.series.count({
      where: { isImported: false }
    });
    console.log(`📥 Imported Series: ${importedSeries}`);
    console.log(`✍️  User-Created Series: ${nonImportedSeries}`);
    
    // Check series with covers
    const seriesWithCovers = await prisma.series.count({
      where: {
        coverImage: { not: '/placeholder.svg' }
      }
    });
    console.log(`🖼️  Series with Covers: ${seriesWithCovers}`);
    
    // Check series with descriptions
    const seriesWithDescriptions = await prisma.series.count({
      where: {
        description: { not: null },
        description: { not: '' }
      }
    });
    console.log(`📝 Series with Descriptions: ${seriesWithDescriptions}`);
    
    // Check series with MangaMD IDs
    const seriesWithMangaMD = await prisma.series.count({
      where: {
        mangaMDId: { not: null }
      }
    });
    console.log(`🔗 Series with MangaMD IDs: ${seriesWithMangaMD}`);
    
    // Check user URLs
    const userUrlsCount = await prisma.userUrl.count();
    console.log(`🔗 User URLs: ${userUrlsCount}`);
    
    // Show some sample series
    console.log('\n📋 Sample Series:');
    const sampleSeries = await prisma.series.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        coverImage: true,
        isImported: true,
        mangaMDId: true,
        mangaMDStatus: true,
        _count: {
          select: {
            chapters: true
          }
        }
      }
    });
    
    sampleSeries.forEach((series, index) => {
      console.log(`   ${index + 1}. ${series.title}`);
      console.log(`      - ID: ${series.id}`);
      console.log(`      - Imported: ${series.isImported ? 'Yes' : 'No'}`);
      console.log(`      - MangaMD ID: ${series.mangaMDId || 'None'}`);
      console.log(`      - Status: ${series.mangaMDStatus || 'N/A'}`);
      console.log(`      - Chapters: ${series._count.chapters}`);
      console.log(`      - Cover: ${series.coverImage === '/placeholder.svg' ? 'Placeholder' : 'Custom'}`);
      console.log('');
    });
    
    // Check for any errors in the data
    console.log('🔍 Data Quality Check:');
    
    // Series without titles
    const seriesWithoutTitles = await prisma.series.count({
      where: {
        OR: [
          { title: null },
          { title: '' }
        ]
      }
    });
    console.log(`   - Series without titles: ${seriesWithoutTitles}`);
    
    // Chapters without series (this query might not work with current schema)
    try {
      const orphanedChapters = await prisma.chapter.count({
        where: {
          seriesId: null
        }
      });
      console.log(`   - Orphaned chapters: ${orphanedChapters}`);
    } catch (error) {
      console.log(`   - Orphaned chapters: Unable to check (schema issue)`);
    }
    
    // User URLs without series
    const orphanedUrls = await prisma.userUrl.count({
      where: {
        seriesId: null
      }
    });
    console.log(`   - Orphaned user URLs: ${orphanedUrls}`);
    
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkMangaDatabase();
