import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function publishExistingManga() {
  try {
    console.log('🚀 Publishing all existing imported manga...');
    
    // Update all imported manga to be published
    const result = await prisma.series.updateMany({
      where: { 
        isImported: true,
        isPublished: false 
      },
      data: { 
        isPublished: true 
      }
    });
    
    console.log(`✅ Published ${result.count} existing manga!`);
    
    // Also publish all chapters
    const chapterResult = await prisma.chapter.updateMany({
      where: { 
        isPublished: false 
      },
      data: { 
        isPublished: true 
      }
    });
    
    console.log(`✅ Published ${chapterResult.count} existing chapters!`);
    
    // Get final counts
    const totalPublished = await prisma.series.count({
      where: { isPublished: true }
    });
    
    const totalChapters = await prisma.chapter.count({
      where: { isPublished: true }
    });
    
    console.log('\n📊 Final Library Status:');
    console.log(`   📚 Total published series: ${totalPublished}`);
    console.log(`   📄 Total published chapters: ${totalChapters}`);
    console.log('\n🌐 All manga are now available in your public library!');
    
  } catch (error) {
    console.error('❌ Error publishing manga:', error);
  } finally {
    await prisma.$disconnect();
  }
}

publishExistingManga();
