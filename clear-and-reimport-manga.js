import { PrismaClient } from '@prisma/client';
// We'll use the existing comprehensive import script instead
// import { mangaMDService } from './lib/mangaMD.js';

const prisma = new PrismaClient();

// Configuration
const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk'; // Admin user ID - update this to your admin user ID
const BATCH_SIZE = 10; // Process 10 manga at a time for database operations
const API_BATCH_SIZE = 50; // MangaDex API limit per request
const MAX_MANGA_TO_IMPORT = 1000; // Limit to prevent overwhelming the system

class MangaClearAndReimport {
  constructor() {
    this.importedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
    this.errors = [];
  }

  async clearAllMangaData() {
    console.log('🗑️  Clearing all existing manga data...');
    
    try {
      // Delete in order to respect foreign key constraints
      console.log('   - Deleting user URLs...');
      await prisma.userUrl.deleteMany({
        where: {
          seriesId: { not: null }
        }
      });

      console.log('   - Deleting comments...');
      await prisma.comment.deleteMany({
        where: {
          seriesId: { not: null }
        }
      });

      console.log('   - Deleting library entries...');
      await prisma.libraryEntry.deleteMany();

      console.log('   - Deleting ratings...');
      await prisma.rating.deleteMany();

      console.log('   - Deleting creator claims...');
      await prisma.creatorClaim.deleteMany();

      console.log('   - Deleting chapters...');
      await prisma.chapter.deleteMany();

      console.log('   - Deleting series...');
      await prisma.series.deleteMany();

      console.log('✅ All manga data cleared successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error clearing manga data:', error);
      return false;
    }
  }

  async importMangaMetadata() {
    console.log('🚀 Starting comprehensive manga metadata import...');
    console.log(`📊 Configuration: Max ${MAX_MANGA_TO_IMPORT} manga, API batch ${API_BATCH_SIZE}, DB batch ${BATCH_SIZE}`);
    
    try {
      // Get initial batch to check API connectivity and get total count
      console.log('🔍 Testing API connectivity and getting manga count...');
      const searchResult = await mangaMDService.searchManga('', API_BATCH_SIZE, 0);
      const totalMangaFound = Math.min(searchResult.total, MAX_MANGA_TO_IMPORT);
      console.log(`📚 Will import up to ${totalMangaFound} manga (${searchResult.total} total available on MangaDex)`);
      
      // Process manga in batches
      let offset = 0;
      let hasMore = true;
      let batchNumber = 1;
      
      while (hasMore && offset < totalMangaFound && this.importedCount < MAX_MANGA_TO_IMPORT) {
        console.log(`\n📦 Processing API batch ${batchNumber}: manga ${offset + 1} to ${Math.min(offset + API_BATCH_SIZE, totalMangaFound)}`);
        
        // Get manga batch from MangaDex
        const mangaBatch = await mangaMDService.searchManga('', API_BATCH_SIZE, offset);
        
        if (!mangaBatch.data || mangaBatch.data.length === 0) {
          hasMore = false;
          break;
        }
        
        console.log(`📥 Fetched ${mangaBatch.data.length} manga from MangaDex`);
        
        // Process manga in smaller database batches
        for (let i = 0; i < mangaBatch.data.length; i += BATCH_SIZE) {
          const dbBatch = mangaBatch.data.slice(i, i + BATCH_SIZE);
          const dbBatchNumber = Math.floor(i / BATCH_SIZE) + 1;
          
          console.log(`\n💾 Processing database batch ${dbBatchNumber}: ${dbBatch.length} manga`);
          
          for (const manga of dbBatch) {
            try {
              console.log(`📖 Processing: ${manga.id} - ${mangaMDService.getBestTitle(manga)}`);

              // Get full manga details
              const mangaData = await mangaMDService.getMangaById(manga.id);
              const coversData = await mangaMDService.getMangaCovers(manga.id);
              
              // Extract data
              const title = mangaMDService.getBestTitle(mangaData);
              const description = mangaMDService.getBestDescription(mangaData);
              const { authors, artists } = mangaMDService.getAuthorsAndArtists(mangaData);
              const allTags = mangaMDService.getAllTags(mangaData);
              
              // Get cover image URL - use MangaDex CDN URL
              let coverImageUrl = '/placeholder.svg';
              if (coversData.data && coversData.data.length > 0) {
                const mangaDexUrl = mangaMDService.getCoverUrl(coversData.data[0], 'large');
                if (mangaDexUrl) {
                  coverImageUrl = mangaDexUrl;
                }
              }

              // Create the series
              const series = await prisma.series.create({
                data: {
                  title,
                  description,
                  coverImage: coverImageUrl,
                  isPublished: true, // Auto-publish imported series
                  isImported: true,
                  creatorId: CREATOR_ID,
                  mangaMDId: manga.id,
                  mangaMDTitle: title,
                  mangaMDStatus: mangaData.attributes?.status || 'ongoing',
                  mangaMDYear: mangaData.attributes?.year || null,
                  contentRating: mangaData.attributes?.contentRating || 'safe',
                  tags: JSON.stringify(allTags),
                  authors: JSON.stringify(authors),
                  artists: JSON.stringify(artists),
                  altTitles: JSON.stringify(mangaData.attributes?.altTitles || []),
                },
              });

              console.log(`✅ Created series: ${title}`);

              // Get all chapters for this manga
              console.log(`📄 Fetching chapters for ${title}...`);
              const allChapters = await mangaMDService.getAllMangaChapters(manga.id);
              console.log(`📚 Found ${allChapters.length} chapters`);
              
              // Create chapters (metadata only, no content)
              let chapterCount = 0;
              for (const chapterData of allChapters) {
                try {
                  const chapterNumber = chapterData.attributes.chapter ? 
                    parseFloat(chapterData.attributes.chapter) : 
                    0;
                  
                  const chapterTitle = chapterData.attributes.title || 
                    `Chapter ${chapterNumber}`;
                  
                  await prisma.chapter.create({
                    data: {
                      title: chapterTitle,
                      chapterNumber: chapterNumber,
                      pages: JSON.stringify([]), // Empty pages - no content
                      isPublished: true,
                      seriesId: series.id,
                      creatorId: CREATOR_ID,
                      mangaMDChapterId: chapterData.id,
                      mangaMDChapterTitle: chapterTitle,
                      mangaMDChapterNumber: chapterNumber,
                      mangaMDPages: chapterData.attributes.pages,
                      mangaMDTranslatedLanguage: chapterData.attributes.translatedLanguage,
                      mangaMDPublishAt: new Date(chapterData.attributes.publishAt),
                    },
                  });
                  chapterCount++;
                } catch (chapterError) {
                  console.error(`❌ Error creating chapter for ${title}:`, chapterError);
                  this.errors.push(`Error creating chapter for ${title}: ${chapterError.message}`);
                  this.errorCount++;
                }
              }
              console.log(`📖 Created ${chapterCount} chapters`);

              // Create MangaDex reading site entry
              await prisma.userUrl.create({
                data: {
                  url: `https://mangadex.org/title/${manga.id}`,
                  label: 'MangaDex',
                  seriesId: series.id,
                  userId: CREATOR_ID,
                },
              });

              this.importedCount++;
              console.log(`🎉 Successfully imported: ${title} (${chapterCount} chapters)`);
              
              // Progress update every 10 manga
              if (this.importedCount % 10 === 0) {
                const progress = ((offset + i + 1) / totalMangaFound * 100).toFixed(1);
                console.log(`\n📊 Progress: ${progress}% (${this.importedCount} imported, ${this.skippedCount} skipped, ${this.errorCount} errors)`);
              }
              
            } catch (importError) {
              console.error(`❌ Failed to import manga ${manga.id}:`, importError);
              this.errors.push(`Failed to import manga ${manga.id}: ${importError.message}`);
              this.errorCount++;
            }
          }
          
          // Small delay between database batches
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        offset += API_BATCH_SIZE;
        batchNumber++;
        
        // Longer delay between API batches to be respectful
        console.log('⏳ Waiting 3 seconds before next API batch...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      console.log('\n🎊 Manga metadata import completed!');
      console.log('📊 Final Summary:');
      console.log(`   ✅ Imported: ${this.importedCount} manga`);
      console.log(`   ⏭️  Skipped: ${this.skippedCount} manga`);
      console.log(`   ❌ Errors: ${this.errorCount} manga`);
      console.log(`   📚 Total processed: ${this.importedCount + this.skippedCount + this.errorCount}`);
      
      if (this.errors.length > 0) {
        console.log('\n❌ Errors encountered:');
        this.errors.slice(0, 20).forEach(err => console.log(`   - ${err}`));
        if (this.errors.length > 20) {
          console.log(`   ... and ${this.errors.length - 20} more errors`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('💥 Fatal error during manga import:', error);
      return false;
    }
  }

  async run() {
    console.log('🎯 Starting manga clear and reimport process...');
    console.log('⚠️  This will delete ALL existing manga data and reimport from MangaDex!');
    
    // Step 1: Clear all existing manga data
    const clearSuccess = await this.clearAllMangaData();
    if (!clearSuccess) {
      console.error('❌ Failed to clear existing data. Aborting.');
      return;
    }
    
    // Step 2: Import fresh manga metadata
    const importSuccess = await this.importMangaMetadata();
    if (!importSuccess) {
      console.error('❌ Failed to import manga metadata.');
      return;
    }
    
    console.log('\n🎉 Manga clear and reimport process completed successfully!');
    console.log('🎨 Next steps:');
    console.log('   1. Check your library page to see the imported manga');
    console.log('   2. All manga have covers, descriptions, and chapter metadata');
    console.log('   3. Chapter content is empty (as requested)');
    console.log('   4. Use the admin curation page to manage the imported content');
  }
}

// Main execution
async function main() {
  const importer = new MangaClearAndReimport();
  await importer.run();
  await prisma.$disconnect();
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the process
main().catch((error) => {
  console.error('💥 Main process failed:', error);
  process.exit(1);
});
