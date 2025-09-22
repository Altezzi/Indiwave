import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk'; // Admin user ID

// Popular manga titles to import
const POPULAR_MANGA = [
  'One Piece',
  'Naruto',
  'Dragon Ball',
  'Attack on Titan',
  'Demon Slayer',
  'My Hero Academia',
  'One Punch Man',
  'Death Note',
  'Fullmetal Alchemist',
  'Bleach',
  'Tokyo Ghoul',
  'Hunter x Hunter',
  'Jujutsu Kaisen',
  'Chainsaw Man',
  'Spy x Family'
];

class SimpleMangaImporter {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.importedCount = 0;
    this.errors = [];
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave/1.0.0',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async searchManga(query) {
    const searchParams = new URLSearchParams();
    searchParams.append('title', query);
    searchParams.append('limit', '5');
    searchParams.append('contentRating[]', 'safe');
    searchParams.append('contentRating[]', 'suggestive');
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');

    const url = `${this.baseUrl}/manga?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  async getMangaById(mangaId) {
    const searchParams = new URLSearchParams();
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

  async getMangaChapters(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('manga', mangaId);
    searchParams.append('limit', '50');
    searchParams.append('translatedLanguage[]', 'en');
    searchParams.append('order[chapter]', 'asc');

    const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  getBestTitle(manga) {
    if (!manga.attributes?.title) return 'Unknown Title';
    
    if (typeof manga.attributes.title === 'string') {
      return manga.attributes.title;
    }
    
    if (typeof manga.attributes.title === 'object') {
      return manga.attributes.title.en || 
             manga.attributes.title.ja || 
             Object.values(manga.attributes.title)[0] || 
             'Unknown Title';
    }
    
    return 'Unknown Title';
  }

  getBestDescription(manga) {
    if (!manga.attributes?.description) return '';
    
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
    
    if (!manga.relationships) {
      return { authors, artists };
    }
    
    manga.relationships.forEach(rel => {
      if (rel.type === 'author' && rel.attributes?.name) {
        authors.push(rel.attributes.name);
      } else if (rel.type === 'artist' && rel.attributes?.name) {
        artists.push(rel.attributes.name);
      }
    });
    
    return { authors, artists };
  }

  getAllTags(manga) {
    if (!manga.attributes?.tags) return [];
    return manga.attributes.tags.map(tag => 
      tag.attributes.name.en || tag.attributes.name.ja || 'Unknown Tag'
    );
  }

  getCoverUrl(cover) {
    if (!cover.attributes?.fileName) return null;
    const baseUrl = 'https://uploads.mangadex.org/covers';
    return `${baseUrl}/${cover.id}/${cover.attributes.fileName}.512.jpg`;
  }

  async importManga(title) {
    try {
      console.log(`🔍 Searching for: ${title}`);
      
      // Search for manga
      const searchResult = await this.searchManga(title);
      
      if (!searchResult.data || searchResult.data.length === 0) {
        console.log(`❌ No results found for: ${title}`);
        return false;
      }

      // Get the first result
      const manga = searchResult.data[0];
      const mangaId = manga.id;
      
      console.log(`📖 Found: ${this.getBestTitle(manga)} (${mangaId})`);

      // Get full manga details
      const mangaData = await this.getMangaById(mangaId);
      const coversData = await this.getMangaCovers(mangaId);
      
      // Extract data
      const fullTitle = this.getBestTitle(mangaData);
      const description = this.getBestDescription(mangaData);
      const { authors, artists } = this.getAuthorsAndArtists(mangaData);
      const allTags = this.getAllTags(mangaData);
      
      // Get cover image URL
      let coverImageUrl = '/placeholder.svg';
      if (coversData.data && coversData.data.length > 0) {
        const coverUrl = this.getCoverUrl(coversData.data[0]);
        if (coverUrl) {
          coverImageUrl = coverUrl;
        }
      }

      // Create the series
      const series = await prisma.series.create({
        data: {
          title: fullTitle,
          description,
          coverImage: coverImageUrl,
          isPublished: true,
          isImported: true,
          creatorId: CREATOR_ID,
          mangaMDId: mangaId,
          mangaMDTitle: fullTitle,
          mangaMDStatus: mangaData.attributes?.status || 'ongoing',
          mangaMDYear: mangaData.attributes?.year || null,
          contentRating: mangaData.attributes?.contentRating || 'safe',
          tags: JSON.stringify(allTags),
          authors: JSON.stringify(authors),
          artists: JSON.stringify(artists),
          altTitles: JSON.stringify(mangaData.attributes?.altTitles || []),
        },
      });

      console.log(`✅ Created series: ${fullTitle}`);

      // Get chapters
      console.log(`📄 Fetching chapters for ${fullTitle}...`);
      const chaptersResult = await this.getMangaChapters(mangaId);
      const chapters = chaptersResult.data || [];
      console.log(`📚 Found ${chapters.length} chapters`);
      
      // Create chapters (metadata only)
      let chapterCount = 0;
      for (const chapterData of chapters) {
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
          console.error(`❌ Error creating chapter:`, chapterError);
        }
      }
      console.log(`📖 Created ${chapterCount} chapters`);

      // Create MangaDex reading site entry
      await prisma.userUrl.create({
        data: {
          url: `https://mangadex.org/title/${mangaId}`,
          label: 'MangaDex',
          seriesId: series.id,
          userId: CREATOR_ID,
        },
      });

      this.importedCount++;
      console.log(`🎉 Successfully imported: ${fullTitle} (${chapterCount} chapters)`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to import ${title}:`, error);
      this.errors.push(`${title}: ${error.message}`);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting import of popular manga...');
    console.log(`📚 Will attempt to import ${POPULAR_MANGA.length} popular manga titles`);
    
    for (const title of POPULAR_MANGA) {
      await this.importManga(title);
      
      // Add delay between imports to be respectful to the API
      console.log('⏳ Waiting 2 seconds before next import...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎊 Import completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Imported: ${this.importedCount} manga`);
    console.log(`   ❌ Errors: ${this.errors.length} manga`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n🎨 Next steps:');
    console.log('   1. Check your library page to see the imported manga');
    console.log('   2. All manga have covers, descriptions, and chapter metadata');
    console.log('   3. Chapter content is empty (as requested)');
  }
}

// Main execution
async function main() {
  const importer = new SimpleMangaImporter();
  await importer.run();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('💥 Import process failed:', error);
  process.exit(1);
});
