import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple one-at-a-time MangaDex API client
class OneByOneMangaDexAPI {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.requestCount = 0;
  }

  async fetchWithDelay(url) {
    // Simple delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.requestCount++;
    console.log(`📡 API Request #${this.requestCount}: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    return JSON.parse(text);
  }

  async getMangaList(limit = 1, offset = 0) {
    const url = `${this.baseUrl}/manga?limit=${limit}&offset=${offset}`;
    return await this.fetchWithDelay(url);
  }

  async getMangaDetails(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('includes[]', 'manga');
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    const url = `${this.baseUrl}/manga/${mangaId}?${searchParams.toString()}`;
    return await this.fetchWithDelay(url);
  }

  async getMangaCovers(mangaId) {
    const url = `${this.baseUrl}/cover?manga[]=${mangaId}&limit=100`;
    return await this.fetchWithDelay(url);
  }

  async getMangaChapters(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('manga', mangaId);
    searchParams.append('limit', '100');
    searchParams.append('offset', '0');
    searchParams.append('translatedLanguage[]', 'en');
    searchParams.append('order[chapter]', 'asc');

    const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
    return await this.fetchWithDelay(url);
  }

  getBestTitle(manga) {
    if (!manga || !manga.attributes) return 'Unknown Title';
    
    const title = manga.attributes.title;
    if (!title) return 'Unknown Title';
    
    if (typeof title === 'string') {
      return title;
    }
    
    if (typeof title === 'object') {
      return title.en || title.ja || title.ja_ro || Object.values(title)[0] || 'Unknown Title';
    }
    
    return 'Unknown Title';
  }

  getBestDescription(manga) {
    if (!manga || !manga.attributes) return '';
    
    const description = manga.attributes.description;
    if (!description) return '';
    
    if (typeof description === 'string') {
      return description;
    }
    
    if (typeof description === 'object') {
      return description.en || description.ja || Object.values(description)[0] || '';
    }
    
    return '';
  }

  getAuthorsAndArtists(manga) {
    const authors = [];
    const artists = [];
    
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
    if (!manga || !manga.attributes || !manga.attributes.tags) return [];
    return manga.attributes.tags.map(tag => tag.attributes.name.en || tag.attributes.name.ja || 'Unknown Tag');
  }

  getCoverUrl(cover, size = 'large') {
    if (!cover || !cover.attributes?.fileName) return null;
    const baseUrl = 'https://uploads.mangadex.org/covers';
    const fileName = cover.attributes.fileName;
    return `${baseUrl}/${cover.id}/${fileName}.${size}.jpg`;
  }
}

const mangaAPI = new OneByOneMangaDexAPI();

async function importOneManga(mangaId, creatorId) {
  try {
    console.log(`\n📖 Starting import for manga: ${mangaId}`);
    
    // Check if already exists
    const existingSeries = await prisma.series.findUnique({
      where: { mangaMDId: mangaId }
    });

    if (existingSeries) {
      console.log(`⏭️ Manga already exists: ${existingSeries.title}`);
      return { success: true, skipped: true, title: existingSeries.title };
    }

    // Get manga details
    console.log('📡 Fetching manga details...');
    const mangaData = await mangaAPI.getMangaDetails(mangaId);
    
    if (!mangaData || !mangaData.data) {
      throw new Error('No manga data received');
    }

    const manga = mangaData.data;
    const title = mangaAPI.getBestTitle(manga);
    console.log(`📚 Title: ${title}`);

    // Get covers
    console.log('🖼️ Fetching cover art...');
    const coversData = await mangaAPI.getMangaCovers(mangaId);
    
    // Get authors and artists
    const { authors, artists } = mangaAPI.getAuthorsAndArtists(manga);
    const allTags = mangaAPI.getAllTags(manga);
    const description = mangaAPI.getBestDescription(manga);
    
    // Get cover image URL
    let coverImageUrl = null;
    if (coversData.data && coversData.data.length > 0) {
      coverImageUrl = mangaAPI.getCoverUrl(coversData.data[0], 'large');
    }

    // Create the series
    console.log('💾 Creating series in database...');
    const series = await prisma.series.create({
      data: {
        title,
        description,
        coverImage: coverImageUrl || '/placeholder.svg',
        isPublished: false,
        isImported: true,
        creatorId: creatorId,
        mangaMDId: mangaId,
        mangaMDTitle: title,
        mangaMDStatus: manga.attributes.status || 'unknown',
        mangaMDYear: manga.attributes.year || null,
        contentRating: manga.attributes.contentRating || 'safe',
        tags: JSON.stringify(allTags),
        authors: JSON.stringify(authors),
        artists: JSON.stringify(artists),
        altTitles: JSON.stringify(manga.attributes.altTitles || []),
      },
    });

    console.log(`✅ Created series: ${title}`);

    // Get chapters
    console.log('📄 Fetching chapters...');
    const chaptersData = await mangaAPI.getMangaChapters(mangaId);
    
    let chapterCount = 0;
    if (chaptersData.data && chaptersData.data.length > 0) {
      console.log(`📚 Found ${chaptersData.data.length} chapters`);
      
      for (const chapterData of chaptersData.data) {
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
              creatorId: creatorId,
              mangaMDChapterId: chapterData.id,
              mangaMDChapterTitle: chapterTitle,
              mangaMDChapterNumber: chapterNumber,
              mangaMDPages: chapterData.attributes.pages || 0,
              mangaMDTranslatedLanguage: chapterData.attributes.translatedLanguage || 'en',
              mangaMDPublishAt: new Date(chapterData.attributes.publishAt || Date.now()),
            },
          });
          chapterCount++;
        } catch (chapterError) {
          console.log(`⚠️ Error creating chapter: ${chapterError.message}`);
        }
      }
    } else {
      console.log('📚 No chapters found');
    }

    // Create MangaDex reading site entry
    console.log('🔗 Creating reading site link...');
    await prisma.userUrl.create({
      data: {
        url: `https://mangadex.org/title/${mangaId}`,
        label: 'MangaDex',
        seriesId: series.id,
        userId: creatorId,
      },
    });

    console.log(`🎉 Successfully imported: ${title} (${chapterCount} chapters)`);
    return { success: true, title, chapterCount };

  } catch (error) {
    console.log(`❌ Failed to import manga ${mangaId}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function oneByOneImport() {
  try {
    console.log('🚀 Starting ONE-BY-ONE import from MangaDex...');
    console.log('📝 This will import manga one at a time until each succeeds');
    
    const CREATOR_ID = 'your-admin-1';
    const MAX_MANGA = 100; // Start with 100 manga
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let offset = 0;
    
    console.log(`📊 Will import up to ${MAX_MANGA} manga`);
    
    while (importedCount < MAX_MANGA) {
      try {
        console.log(`\n🔍 Fetching manga list (offset: ${offset})...`);
        const mangaList = await mangaAPI.getMangaList(1, offset);
        
        if (!mangaList.data || mangaList.data.length === 0) {
          console.log('📭 No more manga found, stopping...');
          break;
        }
        
        const manga = mangaList.data[0];
        const mangaId = manga.id;
        
        console.log(`\n🎯 Processing manga ${importedCount + 1}/${MAX_MANGA}: ${mangaId}`);
        
        const result = await importOneManga(mangaId, CREATOR_ID);
        
        if (result.success) {
          if (result.skipped) {
            skippedCount++;
            console.log(`⏭️ Skipped (already exists): ${result.title}`);
          } else {
            importedCount++;
            console.log(`✅ Imported: ${result.title} (${result.chapterCount} chapters)`);
          }
        } else {
          errorCount++;
          console.log(`❌ Error: ${result.error}`);
        }
        
        offset++;
        
        // Progress update
        console.log(`\n📊 Progress: ${importedCount} imported, ${skippedCount} skipped, ${errorCount} errors`);
        
        // Small delay between manga
        console.log('⏳ Waiting 2 seconds before next manga...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ Error in main loop: ${error.message}`);
        errorCount++;
        offset++;
        
        // Wait longer on error
        console.log('⏳ Waiting 5 seconds before retrying...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\n🎊 ONE-BY-ONE import completed!');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Imported: ${importedCount} manga`);
    console.log(`   ⏭️  Skipped: ${skippedCount} manga`);
    console.log(`   ❌ Errors: ${errorCount} manga`);
    console.log(`   📚 Total processed: ${importedCount + skippedCount + errorCount}`);
    
    console.log('\n🎨 Next steps:');
    console.log('   1. Use the Manga Curation page to review imported manga');
    console.log('   2. Publish manga you want in the public library');
    console.log('   3. Run this script again to import more manga');

  } catch (error) {
    console.error('💥 Fatal error during one-by-one import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Start the one-by-one import
oneByOneImport();
