import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enhanced MangaDex API client with better error handling
class RobustMangaDexAPI {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.requestCount = 0;
    this.startTime = Date.now();
    this.consecutiveErrors = 0;
    this.maxConsecutiveErrors = 5;
  }

  async fetchWithRetry(url, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Progressive rate limiting based on consecutive errors
        const baseDelay = 200;
        const errorDelay = this.consecutiveErrors * 1000;
        const delay = baseDelay + errorDelay;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        this.requestCount++;
        if (this.requestCount % 50 === 0) {
          const elapsed = (Date.now() - this.startTime) / 1000;
          console.log(`📊 API Stats: ${this.requestCount} requests in ${elapsed.toFixed(1)}s (${(this.requestCount/elapsed).toFixed(1)} req/s)`);
        }

        const response = await fetch(url, {
          timeout: 30000, // 30 second timeout
        });
        
        if (response.status === 429) {
          console.log(`⏳ Rate limited, waiting 5 seconds... (attempt ${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        const data = JSON.parse(text);
        
        // Reset consecutive errors on success
        this.consecutiveErrors = 0;
        return data;
        
      } catch (error) {
        this.consecutiveErrors++;
        console.log(`⚠️ Request failed (attempt ${attempt}/${retries}): ${error.message}`);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`⏳ Waiting ${backoffDelay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }

  async getAllManga(limit = 100, offset = 0) {
    const url = `${this.baseUrl}/manga?limit=${limit}&offset=${offset}`;
    return await this.fetchWithRetry(url);
  }

  async getMangaById(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('includes[]', 'manga');
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    const url = `${this.baseUrl}/manga/${mangaId}?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  async getMangaCovers(mangaId) {
    const url = `${this.baseUrl}/cover?manga[]=${mangaId}&limit=100`;
    return await this.fetchWithRetry(url);
  }

  async getAllMangaChapters(mangaId) {
    const allChapters = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;
    let consecutiveEmptyBatches = 0;

    while (hasMore && consecutiveEmptyBatches < 3) {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('manga', mangaId);
        searchParams.append('limit', limit.toString());
        searchParams.append('offset', offset.toString());
        searchParams.append('translatedLanguage[]', 'en');
        searchParams.append('order[chapter]', 'asc');

        const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
        const result = await this.fetchWithRetry(url);
        
        if (result.result !== 'ok') {
          throw new Error(`MangaDex API error: ${result.result}`);
        }

        if (result.data.length === 0) {
          consecutiveEmptyBatches++;
        } else {
          consecutiveEmptyBatches = 0;
        }

        allChapters.push(...result.data);
        
        if (result.data.length < limit || allChapters.length >= result.total) {
          hasMore = false;
        } else {
          offset += limit;
        }
      } catch (error) {
        console.log(`⚠️ Error fetching chapters for ${mangaId}: ${error.message}`);
        break;
      }
    }

    return allChapters;
  }

  getBestTitle(manga) {
    // Handle case where manga doesn't have attributes (from list API)
    if (!manga.attributes) {
      return 'Unknown Title';
    }
    
    if (!manga.attributes.title) return 'Unknown Title';
    
    if (typeof manga.attributes.title === 'string') {
      return manga.attributes.title;
    }
    
    if (typeof manga.attributes.title === 'object') {
      return manga.attributes.title.en || 
             manga.attributes.title.ja || 
             manga.attributes.title.ja_ro || 
             Object.values(manga.attributes.title)[0] || 
             'Unknown Title';
    }
    
    return 'Unknown Title';
  }

  getBestDescription(manga) {
    // Handle case where manga doesn't have attributes (from list API)
    if (!manga.attributes) {
      return '';
    }
    
    if (!manga.attributes.description) return '';
    
    if (typeof manga.attributes.description === 'string') {
      return manga.attributes.description;
    }
    
    if (typeof manga.attributes.description === 'object') {
      return manga.attributes.description.en || 
             manga.attributes.description.ja || 
             Object.values(manga.attributes.description)[0] || 
             '';
    }
    
    return '';
  }

  getAuthorsAndArtists(manga) {
    const authors = [];
    const artists = [];
    
    // Handle case where manga doesn't have relationships
    if (!manga.relationships) {
      return { authors, artists };
    }
    
    if (manga.relationships) {
      for (const rel of manga.relationships) {
        if (rel.type === 'author' && rel.attributes?.name) {
          authors.push(rel.attributes.name);
        } else if (rel.type === 'artist' && rel.attributes?.name) {
          artists.push(rel.attributes.name);
        }
      }
    }
    
    return { authors, artists };
  }

  getAllTags(manga) {
    // Handle case where manga doesn't have attributes
    if (!manga.attributes || !manga.attributes.tags) return [];
    return manga.attributes.tags.map(tag => tag.attributes.name.en || tag.attributes.name.ja || 'Unknown Tag');
  }

  getCoverUrl(cover, size = 'large') {
    if (!cover.attributes?.fileName) return null;
    const baseUrl = 'https://uploads.mangadex.org/covers';
    const fileName = cover.attributes.fileName;
    return `${baseUrl}/${cover.id}/${fileName}.${size}.jpg`;
  }
}

const mangaAPI = new RobustMangaDexAPI();

async function robustBulkImport() {
  try {
    console.log('🚀 Starting ROBUST bulk import of manga from MangaDex...');
    console.log('⚠️  This version has better error handling and recovery!');
    
    // Configuration - start smaller to test
    const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk';
    const BATCH_SIZE = 20; // Increased batch size for faster importing
    const API_BATCH_SIZE = 100; // Larger API batch size
    const MAX_MANGA_TO_IMPORT = 2000; // Import a large collection
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    let totalMangaFound = 0;
    
    console.log(`📊 Configuration: Database batch ${BATCH_SIZE}, API batch ${API_BATCH_SIZE}, Max manga ${MAX_MANGA_TO_IMPORT}`);
    
    // Get initial batch to check API connectivity
    console.log('🔍 Testing API connectivity...');
    const initialBatch = await mangaAPI.getAllManga(API_BATCH_SIZE, 0);
    totalMangaFound = Math.min(initialBatch.total, MAX_MANGA_TO_IMPORT);
    console.log(`📚 Will import up to ${totalMangaFound} manga (${initialBatch.total} total available)`);
    
    // Process manga in smaller, more manageable batches
    let offset = 0;
    let hasMore = true;
    let batchNumber = 1;
    
    while (hasMore && offset < totalMangaFound && importedCount < MAX_MANGA_TO_IMPORT) {
      console.log(`\n📦 Processing API batch ${batchNumber}: manga ${offset + 1} to ${Math.min(offset + API_BATCH_SIZE, totalMangaFound)}`);
      
      try {
        // Get manga batch from MangaDex
        const mangaBatch = await mangaAPI.getAllManga(API_BATCH_SIZE, offset);
        
        if (!mangaBatch.data || mangaBatch.data.length === 0) {
          console.log('📭 No more manga data received, stopping...');
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
            if (importedCount >= MAX_MANGA_TO_IMPORT) {
              console.log('🎯 Reached maximum import limit, stopping...');
              hasMore = false;
              break;
            }
            
            try {
              // Check if series already exists
              const existingSeries = await prisma.series.findUnique({
                where: { mangaMDId: manga.id }
              });

              if (existingSeries) {
                console.log(`⏭️ Series "${mangaAPI.getBestTitle(manga)}" already exists, skipping.`);
                skippedCount++;
                continue;
              }

              console.log(`📖 Processing: ${manga.id} - ${mangaAPI.getBestTitle(manga)}`);

              // Get full manga details with error handling
              let mangaResponse, coversData;
              try {
                mangaResponse = await mangaAPI.getMangaById(manga.id);
                coversData = await mangaAPI.getMangaCovers(manga.id);
              } catch (apiError) {
                console.log(`⚠️ Failed to get details for ${manga.id}: ${apiError.message}`);
                errors.push(`API error for ${manga.id}: ${apiError.message}`);
                errorCount++;
                continue;
              }
              
              // Extract manga data from response
              const mangaData = mangaResponse.data;
              
              // Extract data
              const title = mangaAPI.getBestTitle(mangaData);
              const description = mangaAPI.getBestDescription(mangaData);
              const { authors, artists } = mangaAPI.getAuthorsAndArtists(mangaData);
              const allTags = mangaAPI.getAllTags(mangaData);
              
              // Get cover image URL - try MangaDex first, fallback to placeholder
              let coverImageUrl = '/placeholder.svg';
              if (coversData.data && coversData.data.length > 0) {
                const mangaDexUrl = mangaAPI.getCoverUrl(coversData.data[0], 'large');
                if (mangaDexUrl) {
                  coverImageUrl = mangaDexUrl; // Store MangaDex URL for later processing
                }
              }

              // Create the series with error handling
              let series;
              try {
                series = await prisma.series.create({
                  data: {
                    title,
                    description,
                    coverImage: coverImageUrl,
                    isPublished: true, // Publish immediately so they show in library
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
              } catch (dbError) {
                console.log(`⚠️ Database error creating series ${manga.id}: ${dbError.message}`);
                errors.push(`DB error for ${manga.id}: ${dbError.message}`);
                errorCount++;
                continue;
              }

              console.log(`✅ Created series: ${title}`);

              // Get chapters with error handling
              let allChapters = [];
              try {
                console.log(`📄 Fetching chapters for ${title}...`);
                allChapters = await mangaAPI.getAllMangaChapters(manga.id);
                console.log(`📚 Found ${allChapters.length} chapters`);
              } catch (chapterError) {
                console.log(`⚠️ Failed to get chapters for ${manga.id}: ${chapterError.message}`);
                // Continue without chapters rather than failing completely
              }
              
              // Create chapters
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
                      pages: JSON.stringify([]),
                      isPublished: false,
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
                  console.log(`⚠️ Error creating chapter for ${title}: ${chapterError.message}`);
                  // Continue with other chapters
                }
              }
              console.log(`📖 Created ${chapterCount} chapters`);

              // Create MangaDex reading site entry
              try {
                await prisma.userUrl.create({
                  data: {
                    url: `https://mangadex.org/title/${manga.id}`,
                    label: 'MangaDex',
                    seriesId: series.id,
                    userId: CREATOR_ID,
                  },
                });
              } catch (urlError) {
                console.log(`⚠️ Error creating reading site for ${manga.id}: ${urlError.message}`);
                // Continue without reading site
              }

              importedCount++;
              console.log(`🎉 Successfully imported: ${title} (${chapterCount} chapters)`);
              
              // Progress update every 5 manga
              if (importedCount % 5 === 0) {
                const progress = ((offset + i + 1) / totalMangaFound * 100).toFixed(1);
                console.log(`\n📊 Progress: ${progress}% (${importedCount} imported, ${skippedCount} skipped, ${errorCount} errors)`);
              }
              
            } catch (importError) {
              console.log(`❌ Failed to import manga ${manga.id}: ${importError.message}`);
              errors.push(`Failed to import manga ${manga.id}: ${importError.message}`);
              errorCount++;
            }
          }
          
          // Small delay between database batches
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        offset += API_BATCH_SIZE;
        batchNumber++;
        
        // Longer delay between API batches
        console.log('⏳ Waiting 2 seconds before next API batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (batchError) {
        console.log(`❌ Error processing batch ${batchNumber}: ${batchError.message}`);
        errors.push(`Batch error ${batchNumber}: ${batchError.message}`);
        errorCount++;
        
        // Wait longer before retrying
        console.log('⏳ Waiting 10 seconds before retrying...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    console.log('\n🎊 ROBUST bulk import completed!');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Imported: ${importedCount} manga`);
    console.log(`   ⏭️  Skipped: ${skippedCount} manga`);
    console.log(`   ❌ Errors: ${errorCount} manga`);
    console.log(`   📚 Total processed: ${importedCount + skippedCount + errorCount}`);
    console.log(`   🎯 Target: ${totalMangaFound}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }
    
    console.log('\n🎨 Next steps:');
    console.log('   1. Use the Manga Curation page to review imported manga');
    console.log('   2. Publish manga you want in the public library');
    console.log('   3. Delete manga you don\'t want');

  } catch (error) {
    console.error('💥 Fatal error during robust bulk import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Start the robust import
robustBulkImport();
