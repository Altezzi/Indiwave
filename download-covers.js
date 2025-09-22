import { PrismaClient } from '@prisma/client';
import { CoverDownloader } from './lib/coverDownloader.ts';

const prisma = new PrismaClient();

async function downloadAllCovers() {
  try {
    console.log('🖼️ Starting cover download process...');
    
    // Get all manga with MangaDex cover URLs
    const mangaWithCovers = await prisma.series.findMany({
      where: {
        coverImage: {
          startsWith: 'https://uploads.mangadex.org'
        }
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        mangaMDId: true
      }
    });

    console.log(`📚 Found ${mangaWithCovers.length} manga with MangaDex covers`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < mangaWithCovers.length; i++) {
      const manga = mangaWithCovers[i];
      const progress = ((i + 1) / mangaWithCovers.length * 100).toFixed(1);
      
      console.log(`\n📖 [${i + 1}/${mangaWithCovers.length}] (${progress}%) Processing: ${manga.title}`);
      
      if (!manga.mangaMDId) {
        console.log(`⚠️ No MangaDex ID for ${manga.title}, skipping`);
        errorCount++;
        continue;
      }

      // Check if we already have a local cover
      if (CoverDownloader.hasLocalCover(manga.mangaMDId)) {
        console.log(`✅ Local cover already exists for ${manga.title}`);
        
        // Update database to use local path
        const localPath = CoverDownloader.getLocalCoverPath(manga.mangaMDId);
        await prisma.series.update({
          where: { id: manga.id },
          data: { coverImage: localPath }
        });
        
        successCount++;
        continue;
      }

      // Download the cover
      const result = await CoverDownloader.downloadCover(manga.mangaMDId, manga.coverImage);
      
      if (result.success) {
        console.log(`✅ Downloaded cover for ${manga.title}`);
        
        // Update database to use local path
        await prisma.series.update({
          where: { id: manga.id },
          data: { coverImage: result.localPath }
        });
        
        successCount++;
      } else {
        console.log(`❌ Failed to download cover for ${manga.title}: ${result.error}`);
        errorCount++;
        errors.push(`${manga.title}: ${result.error}`);
      }

      // Add a small delay to be respectful to MangaDex servers
      if (i < mangaWithCovers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n🎉 Cover download process completed!');
    console.log(`✅ Successfully downloaded: ${successCount} covers`);
    console.log(`❌ Failed downloads: ${errorCount} covers`);
    
    if (errors.length > 0) {
      console.log('\n📋 Errors:');
      errors.forEach(error => console.log(`  - ${error}`));
    }

    // Show final statistics
    const totalManga = await prisma.series.count();
    const mangaWithLocalCovers = await prisma.series.count({
      where: {
        coverImage: {
          startsWith: '/covers/'
        }
      }
    });
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`   Total manga: ${totalManga}`);
    console.log(`   With local covers: ${mangaWithLocalCovers}`);
    console.log(`   With MangaDex URLs: ${totalManga - mangaWithLocalCovers}`);

  } catch (error) {
    console.error('💥 Error in cover download process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

downloadAllCovers();
