import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enhanced MangaDex API client for massive imports
class ComprehensiveMangaDexAPI {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.requestCount = 0;
    this.startTime = Date.now();
  }

  async fetchWithRateLimit(url, retries = 3) {
    // More aggressive rate limiting for massive imports
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.requestCount++;
    if (this.requestCount % 100 === 0) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      console.log(`📊 API Stats: ${this.requestCount} requests in ${elapsed.toFixed(1)}s (${(this.requestCount/elapsed).toFixed(1)} req/s)`);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url);
        
        if (response.status === 429) {
          console.log(`⏳ Rate limited, waiting 2 seconds... (attempt ${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        return JSON.parse(text);
      } catch (error) {
        if (attempt === retries) throw error;
        console.log(`⚠️ Request failed, retrying... (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  async getAllManga(limit = 100, offset = 0) {
    const url = `${this.baseUrl}/manga?limit=${limit}&offset=${offset}`;
    return await this.fetchWithRateLimit(url);
  }

  async getMangaById(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('includes[]', 'manga');
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    const url = `${this.baseUrl}/manga/${mangaId}?${searchParams.toString()}`;
    return await this.fetchWithRateLimit(url);
  }

  async getMangaCovers(mangaId) {
    const url = `${this.baseUrl}/cover?manga[]=${mangaId}&limit=100`;
    return await this.fetchWithRateLimit(url);
  }

  async getAllMangaChapters(mangaId) {
    const allChapters = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const searchParams = new URLSearchParams();
      searchParams.append('manga', mangaId);
      searchParams.append('limit', limit.toString());
      searchParams.append('offset', offset.toString());
      searchParams.append('translatedLanguage[]', 'en');
      searchParams.append('order[chapter]', 'asc');

      const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
      const result = await this.fetchWithRateLimit(url);
      
      if (result.result !== 'ok') {
        throw new Error(`MangaDex API error: ${result.result}`);
      }

      allChapters.push(...result.data);
      
      if (result.data.length < limit || allChapters.length >= result.total) {
        hasMore = false;
      } else {
        offset += limit;
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

const mangaAPI = new ComprehensiveMangaDexAPI();

async function comprehensiveBulkImport() {
  try {
    console.log('🚀 Starting COMPREHENSIVE bulk import of ALL manga from MangaDex...');
    console.log('⚠️  This will import THOUSANDS of manga and may take HOURS to complete!');
    
    // Configuration
    const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk'; // Admin user ID
    const BATCH_SIZE = 20; // Process 20 manga at a time for database operations
    const API_BATCH_SIZE = 100; // MangaDex API limit per request
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    let totalMangaFound = 0;
    
    console.log(`📊 Configuration: Database batch size ${BATCH_SIZE}, API batch size ${API_BATCH_SIZE}`);
    
    // First, get the total count of manga available
    console.log('🔍 Getting total manga count from MangaDex...');
    const initialBatch = await mangaAPI.getAllManga(API_BATCH_SIZE, 0);
    totalMangaFound = initialBatch.total;
    console.log(`📚 Total manga available on MangaDex: ${totalMangaFound}`);
    
    // Process manga in batches
    let offset = 0;
    let hasMore = true;
    let batchNumber = 1;
    
    while (hasMore && offset < totalMangaFound) {
      console.log(`\n📦 Processing API batch ${batchNumber}: manga ${offset + 1} to ${Math.min(offset + API_BATCH_SIZE, totalMangaFound)}`);
      
      // Get manga batch from MangaDex
      const mangaBatch = await mangaAPI.getAllManga(API_BATCH_SIZE, offset);
      
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

            // Get full manga details
            const mangaData = await mangaAPI.getMangaById(manga.id);
            const coversData = await mangaAPI.getMangaCovers(manga.id);
            
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

            // Create the series
            const series = await prisma.series.create({
              data: {
                title,
                description,
                coverImage: coverImageUrl,
                isPublished: false, // Imported as unpublished for curation
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
            const allChapters = await mangaAPI.getAllMangaChapters(manga.id);
            console.log(`📚 Found ${allChapters.length} chapters`);
            
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
                console.error(`❌ Error creating chapter for ${title}:`, chapterError);
                errors.push(`Error creating chapter for ${title}: ${chapterError.message}`);
                errorCount++;
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

            importedCount++;
            console.log(`🎉 Successfully imported: ${title} (${chapterCount} chapters)`);
            
            // Progress update every 10 manga
            if (importedCount % 10 === 0) {
              const progress = ((offset + i + 1) / totalMangaFound * 100).toFixed(1);
              console.log(`\n📊 Progress: ${progress}% (${importedCount} imported, ${skippedCount} skipped, ${errorCount} errors)`);
            }
            
          } catch (importError) {
            console.error(`❌ Failed to import manga ${manga.id}:`, importError);
            errors.push(`Failed to import manga ${manga.id}: ${importError.message}`);
            errorCount++;
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

    console.log('\n🎊 COMPREHENSIVE bulk import completed!');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Imported: ${importedCount} manga`);
    console.log(`   ⏭️  Skipped: ${skippedCount} manga`);
    console.log(`   ❌ Errors: ${errorCount} manga`);
    console.log(`   📚 Total processed: ${importedCount + skippedCount + errorCount}`);
    console.log(`   🎯 Total available: ${totalMangaFound}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.slice(0, 20).forEach(err => console.log(`   - ${err}`));
      if (errors.length > 20) {
        console.log(`   ... and ${errors.length - 20} more errors`);
      }
    }
    
    console.log('\n🎨 Next steps:');
    console.log('   1. Use the Manga Curation page to review imported manga');
    console.log('   2. Publish manga you want in the public library');
    console.log('   3. Delete manga you don\'t want');

  } catch (error) {
    console.error('💥 Fatal error during comprehensive bulk import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Start the comprehensive import
comprehensiveBulkImport();
