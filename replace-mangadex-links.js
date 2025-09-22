import { PrismaClient } from '@prisma/client';
import { publisherSourcesService } from './lib/publisherSources.ts';

const prisma = new PrismaClient();

async function replaceMangaDexLinks() {
  try {
    console.log('🔄 Replacing MangaDex links with publisher sources...');

    // Find all MangaDex links
    const mangaDexLinks = await prisma.userUrl.findMany({
      where: {
        label: 'MangaDex'
      }
    });

    console.log(`📚 Found ${mangaDexLinks.length} MangaDex links to replace`);

    let replacedCount = 0;
    let errorCount = 0;

    for (const link of mangaDexLinks) {
      try {
        // Get the series information
        const series = await prisma.series.findUnique({
          where: { id: link.seriesId }
        });
        
        if (!series) {
          console.log(`⚠️ Series not found for link ${link.id}, skipping`);
          continue;
        }
        
        console.log(`\n📖 Processing: ${series.title}`);
        
        // Get publisher sources for this series
        const title = series.title;
        const authors = series.authors ? JSON.parse(series.authors) : [];
        const publisherSources = await publisherSourcesService.getPublisherSources(title, authors);
        
        // Delete the MangaDex link
        await prisma.userUrl.delete({
          where: { id: link.id }
        });
        
        // Create new publisher source links
        for (const source of publisherSources) {
          await prisma.userUrl.create({
            data: {
              url: source.url,
              label: source.name,
              seriesId: link.seriesId,
              userId: link.userId,
            },
          });
        }
        
        console.log(`✅ Replaced with ${publisherSources.length} publisher sources`);
        replacedCount++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error processing link ${link.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Replacement complete!`);
    console.log(`✅ Successfully replaced: ${replacedCount} series`);
    console.log(`❌ Errors: ${errorCount} series`);

    // Show some examples of the new links
    console.log(`\n📋 Sample of new publisher source links:`);
    const sampleLinks = await prisma.userUrl.findMany({
      where: {
        label: {
          not: 'MangaDex'
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    for (const link of sampleLinks) {
      const series = await prisma.series.findUnique({
        where: { id: link.seriesId }
      });
      if (series) {
        console.log(`   📖 ${series.title}: ${link.label} - ${link.url}`);
      }
    }

  } catch (error) {
    console.error('❌ Error replacing MangaDex links:', error);
  } finally {
    await prisma.$disconnect();
  }
}

replaceMangaDexLinks();
