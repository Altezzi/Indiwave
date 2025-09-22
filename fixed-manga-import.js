import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk'; // Admin user ID
const MAX_MANGA_TO_IMPORT = 50; // Limit to prevent overwhelming

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
  'Spy x Family',
  'Black Clover',
  'Fairy Tail',
  'Sword Art Online',
  'The Promised Neverland',
  'Dr. Stone',
  'Fire Force',
  'Mob Psycho 100',
  'Re:Zero',
  'Konosuba',
  'Overlord',
  'That Time I Got Reincarnated as a Slime',
  'The Rising of the Shield Hero',
  'No Game No Life',
  'Steins Gate',
  'Your Name',
  'Weathering With You',
  'A Silent Voice',
  'Your Lie in April',
  'Clannad',
  'Toradora',
  'Golden Time',
  'Nisekoi',
  'Love Hina',
  'Rent a Girlfriend',
  'Kaguya-sama: Love is War',
  'Horimiya',
  'Wotakoi',
  'My Dress-Up Darling',
  'More than a Married Couple',
  'The Quintessential Quintuplets',
  'We Never Learn',
  'Domestic Girlfriend',
  'Scum\'s Wish',
  'Citrus',
  'Bloom Into You'
];

class FixedMangaImporter {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.importedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
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
    searchParams.append('limit', '10');
    searchParams.append('contentRating[]', 'safe');
    searchParams.append('contentRating[]', 'suggestive');
    searchParams.append('includes[]', 'cover_art');
    searchParams.append('includes[]', 'author');
    searchParams.append('includes[]', 'artist');
    searchParams.append('order[relevance]', 'desc');

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

  async getMangaChapters(mangaId) {
    const searchParams = new URLSearchParams();
    searchParams.append('manga', mangaId);
    searchParams.append('limit', '100');
    searchParams.append('translatedLanguage[]', 'en');
    searchParams.append('order[chapter]', 'asc');

    const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  // FIXED: Proper title extraction
  getBestTitle(manga) {
    if (!manga.attributes?.title) {
      console.log('❌ No title found in manga attributes');
      return 'Unknown Title';
    }
    
    const title = manga.attributes.title;
    console.log('🔍 Title structure:', JSON.stringify(title, null, 2));
    
    if (typeof title === 'string') {
      return title;
    }
    
    if (typeof title === 'object') {
      // Try English first, then Japanese, then any other language
      const extractedTitle = title.en || title.ja || Object.values(title)[0];
      console.log('✅ Extracted title:', extractedTitle);
      return extractedTitle || 'Unknown Title';
    }
    
    return 'Unknown Title';
  }

  // FIXED: Proper description extraction
  getBestDescription(manga) {
    if (!manga.attributes?.description) return '';
    
    const description = manga.attributes.description;
    
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

  // FIXED: Proper cover URL extraction
  getCoverUrl(manga) {
    if (!manga.relationships) {
      console.log('❌ No relationships found for cover');
      return '/placeholder.svg';
    }

    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (!coverRel || !coverRel.attributes?.fileName) {
      console.log('❌ No cover relationship or filename found');
      return '/placeholder.svg';
    }

    const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
    console.log('✅ Cover URL:', coverUrl);
    return coverUrl;
  }

  async importManga(title) {
    try {
      console.log(`\n🔍 Searching for: ${title}`);
      
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

      // Check if already exists
      const existingSeries = await prisma.series.findUnique({
        where: { mangaMDId: mangaId }
      });

      if (existingSeries) {
        console.log(`⏭️ Series already exists, skipping: ${this.getBestTitle(manga)}`);
        this.skippedCount++;
        return false;
      }

      // Get full manga details
      const mangaData = await this.getMangaById(mangaId);
      
      // Extract data with proper methods
      const fullTitle = this.getBestTitle(mangaData);
      const description = this.getBestDescription(mangaData);
      const { authors, artists } = this.getAuthorsAndArtists(mangaData);
      const allTags = this.getAllTags(mangaData);
      
      // Get cover image URL
      const coverImageUrl = this.getCoverUrl(mangaData);

      console.log(`🖼️ Final cover URL: ${coverImageUrl}`);

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
      this.errorCount++;
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting FIXED manga import...');
    console.log(`📚 Will attempt to import ${POPULAR_MANGA.length} popular manga titles`);
    console.log(`⚙️ Configuration: Max ${MAX_MANGA_TO_IMPORT} manga`);
    
    for (const title of POPULAR_MANGA) {
      if (this.importedCount >= MAX_MANGA_TO_IMPORT) {
        console.log(`\n⏹️ Reached maximum import limit of ${MAX_MANGA_TO_IMPORT} manga`);
        break;
      }
      
      await this.importManga(title);
      
      // Add delay between imports to be respectful to the API
      console.log('⏳ Waiting 3 seconds before next import...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n🎊 FIXED import completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Imported: ${this.importedCount} manga`);
    console.log(`   ⏭️ Skipped: ${this.skippedCount} manga`);
    console.log(`   ❌ Errors: ${this.errorCount} manga`);
    console.log(`   📚 Total processed: ${this.importedCount + this.skippedCount + this.errorCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n🎨 Next steps:');
    console.log('   1. Check your library page to see the imported manga');
    console.log('   2. All manga should have proper titles, covers, descriptions, and chapter metadata');
    console.log('   3. Chapter content is empty (as requested)');
    console.log('   4. Titles and covers should be correct from the start!');
  }
}

// Main execution
async function main() {
  const importer = new FixedMangaImporter();
  await importer.run();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('💥 Import process failed:', error);
  process.exit(1);
});
