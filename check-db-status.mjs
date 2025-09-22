import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseStatus() {
  try {
    const totalManga = await prisma.series.count();
    const publishedManga = await prisma.series.count({
      where: { isPublished: true }
    });
    const withCovers = await prisma.series.count({
      where: { 
        coverImage: {
          startsWith: '/covers/'
        }
      }
    });
    const withMangaDexIds = await prisma.series.count({
      where: {
        mangaMDId: {
          not: null
        }
      }
    });

    console.log('📊 Database Status:');
    console.log(`   Total manga: ${totalManga}`);
    console.log(`   Published manga: ${publishedManga}`);
    console.log(`   With local covers: ${withCovers}`);
    console.log(`   With MangaDex IDs: ${withMangaDexIds}`);
    
    // Show some recent manga
    const recentManga = await prisma.series.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        coverImage: true,
        isPublished: true
      }
    });

    console.log('\n📚 Recent manga:');
    recentManga.forEach(manga => {
      const coverStatus = manga.coverImage?.startsWith('/covers/') ? '✅ Local' : 
                         manga.coverImage?.startsWith('https://') ? '🌐 URL' : 
                         manga.coverImage === '/placeholder.svg' ? '🖼️ Placeholder' : '❌ No cover';
      console.log(`   ${manga.title} (${coverStatus})`);
    });

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();
