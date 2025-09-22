import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');

// Create covers directory if it doesn't exist
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

class RobustMangaDexAPI {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.userAgent = 'indiwave/1.0.0';
    this.requestCount = 0;
    this.startTime = Date.now();
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        this.requestCount++;
        const response = await fetch(url, {
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Log API stats every 50 requests
        if (this.requestCount % 50 === 0) {
          const elapsed = (Date.now() - this.startTime) / 1000;
          const rate = this.requestCount / elapsed;
          console.log(`📊 API Stats: ${this.requestCount} requests in ${elapsed.toFixed(1)}s (${rate.toFixed(1)} req/s)`);
        }
        
        return data;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async getAllManga(limit = 100, offset = 0) {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', limit.toString());
    searchParams.append('offset', offset.toString());
    searchParams.append('translatedLanguage[]', 'en');
    searchParams.append('order[createdAt]', 'desc');
    searchParams.append('contentRating[]', 'safe');
    searchParams.append('contentRating[]', 'suggestive');
    searchParams.append('contentRating[]', 'erotica');
    searchParams.append('contentRating[]', 'pornographic');

    const url = `${this.baseUrl}/manga?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  async getMangaById(mangaId) {
    const url = `${this.baseUrl}/manga/${mangaId}?includes[]=author&includes[]=artist&includes[]=cover_art`;
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

    while (true) {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('limit', limit.toString());
        searchParams.append('offset', offset.toString());
        searchParams.append('translatedLanguage[]', 'en');
        searchParams.append('order[chapter]', 'asc');

        const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
        const result = await this.fetchWithRetry(url);
        
        if (result.result !== 'ok') {
          throw new Error(`MangaDex API error: ${result.result}`);
        }

        if (result.data && result.data.length > 0) {
          allChapters.push(...result.data);
          offset += limit;
        } else {
          break;
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
    if (!manga || !manga.attributes) {
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
    if (!manga || !manga.attributes || !manga.attributes.description) return '';
    
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
    if (!manga || !manga.relationships) {
      return { authors: [], artists: [] };
    }

    const authors = [];
    const artists = [];

    manga.relationships.forEach(rel => {
      if (rel.type === 'author') {
        authors.push(rel.attributes?.name || 'Unknown Author');
      } else if (rel.type === 'artist') {
        artists.push(rel.attributes?.name || 'Unknown Artist');
      }
    });

    return { authors, artists };
  }

  getAllTags(manga) {
    // Handle case where manga doesn't have attributes
    if (!manga || !manga.attributes || !manga.attributes.tags) return [];
    return manga.attributes.tags.map(tag => tag.attributes.name.en || tag.attributes.name.ja || 'Unknown Tag');
  }

  getCoverUrl(cover, size = 'large') {
    if (!cover.attributes?.fileName) return null;
    const baseUrl = 'https://mangadex.org/covers';
    const fileName = cover.attributes.fileName;
    return `${baseUrl}/${cover.id}/${fileName}.${size}.jpg`;
  }

  async downloadCover(mangaId, coverUrl, retryCount = 0) {
    if (!coverUrl || !mangaId) {
      return { success: false, error: 'Manga ID or cover URL is missing.' };
    }

    const filename = `${mangaId}.jpg`;
    const localPath = path.join(COVERS_DIR, filename);
    const publicPath = `/covers/${filename}`;

    try {
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
      return { success: true, localPath: publicPath };
    } catch (error) {
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.downloadCover(mangaId, coverUrl, retryCount + 1);
      }
      return { success: false, error: error.message };
    }
  }
}

const mangaAPI = new RobustMangaDexAPI();

async function robustBulkImportWithCovers() {
  try {
    console.log('🚀 Starting ROBUST bulk import with cover downloads...');
    console.log('⚠️  This version downloads covers during import!');
    
    // Configuration
    const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk';
    const BATCH_SIZE = 20;
    const API_BATCH_SIZE = 100;
    const MAX_MANGA_TO_IMPORT = 2000;
    
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
      
      const batch = await mangaAPI.getAllManga(API_BATCH_SIZE, offset);
      
      if (!batch.data || batch.data.length === 0) {
        hasMore = false;
        break;
      }
      
      console.log(`📥 Fetched ${batch.data.length} manga from MangaDex`);
      
      // Process in smaller database batches
      for (let i = 0; i < batch.data.length; i += BATCH_SIZE) {
        const dbBatch = batch.data.slice(i, i + BATCH_SIZE);
        console.log(`💾 Processing database batch ${Math.floor(i / BATCH_SIZE) + 1}: ${dbBatch.length} manga`);
        
        for (const manga of dbBatch) {
          try {
            // Check if already exists
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
            
            // Get cover image URL and download it
            let coverImageUrl = '/placeholder.svg';
            if (coversData.data && coversData.data.length > 0) {
              const mangaDexUrl = mangaAPI.getCoverUrl(coversData.data[0], 'large');
              if (mangaDexUrl) {
                console.log(`🖼️ Downloading cover for ${title}...`);
                const downloadResult = await mangaAPI.downloadCover(manga.id, mangaDexUrl);
                if (downloadResult.success) {
                  coverImageUrl = downloadResult.localPath;
                  console.log(`✅ Downloaded cover for ${title}`);
                } else {
                  console.log(`⚠️ Failed to download cover for ${title}: ${downloadResult.error}`);
                  coverImageUrl = '/placeholder.svg';
                }
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
                  isPublished: true,
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
              }
            }
            console.log(`📖 Created ${chapterCount} chapters`);

            // Create MangaDex reading site entry
            try {
              await prisma.userUrl.create({
                data: {
                  url: `https://mangadex.org/title/${manga.id}`,
                  label: 'Read on MangaDex',
                  seriesId: series.id,
                  userId: CREATOR_ID,
                },
              });
            } catch (urlError) {
              console.log(`⚠️ Error creating user URL for ${title}: ${urlError.message}`);
            }

            importedCount++;
            console.log(`🎉 Successfully imported: ${title} (${chapterCount} chapters)`);
            
            // Progress update every 5 manga
            if (importedCount % 5 === 0) {
              const progress = ((offset + i + 1) / totalMangaFound * 100).toFixed(1);
              console.log(`\n📊 Progress: ${progress}% (${importedCount} imported, ${skippedCount} skipped, ${errorCount} errors)`);
            }
            
          } catch (error) {
            console.log(`❌ Error processing ${manga.id}: ${error.message}`);
            errors.push(`Processing error for ${manga.id}: ${error.message}`);
            errorCount++;
          }
        }
      }
      
      offset += API_BATCH_SIZE;
      batchNumber++;
      
      // Add delay between API batches
      if (hasMore && offset < totalMangaFound) {
        console.log('⏳ Waiting 2 seconds before next API batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n🎉 Import process completed!');
    console.log(`📊 Final Statistics:`);
    console.log(`   ✅ Imported: ${importedCount} manga`);
    console.log(`   ⏭️ Skipped: ${skippedCount} manga`);
    console.log(`   ❌ Errors: ${errorCount} manga`);
    console.log(`   📚 Total processed: ${importedCount + skippedCount + errorCount} manga`);
    
    if (errors.length > 0) {
      console.log('\n📋 Errors:');
      errors.slice(0, 10).forEach(error => console.log(`   - ${error}`));
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }
    
  } catch (error) {
    console.error('❌ Import process failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

robustBulkImportWithCovers();
