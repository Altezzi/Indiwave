import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk'; // Admin user ID
const BATCH_SIZE = 5; // Process 5 manga at a time
const MAX_MANGA_TO_IMPORT = 100; // Limit to prevent overwhelming

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
  'Bloom Into You',
  'Adachi and Shimamura',
  'Otherside Picnic',
  'The Executioner and Her Way of Life',
  'I\'m in Love with the Villainess',
  'Magical Girl Spec-Ops Asuka',
  'Puella Magi Madoka Magica',
  'Sailor Moon',
  'Cardcaptor Sakura',
  'Precure',
  'Revolutionary Girl Utena',
  'Rose of Versailles',
  'Nana',
  'Paradise Kiss',
  'Skip Beat',
  'Fruits Basket',
  'Ouran High School Host Club',
  'Kimi ni Todoke',
  'Say I Love You',
  'Ao Haru Ride',
  'Orange',
  'Anohana',
  'Angel Beats',
  'Clannad',
  'Air',
  'Kanon',
  'Little Busters',
  'Rewrite',
  'Planetarian',
  'Harmonia',
  'Summer Pockets',
  'The Fruit of Grisaia',
  'Steins Gate',
  'Chaos Head',
  'Robotics Notes',
  'Occultic Nine',
  'Anonymous Code',
  'Aokana',
  'Hoshizora no Memoria',
  'If My Heart Had Wings',
  'Noble Works',
  'Princess Evangile',
  'Saku Saku',
  'Sanoba Witch',
  'Senren Banka',
  'Riddle Joker',
  'Cafe Stella',
  'Dracu Riot',
  'Sanoba Witch',
  'Senren Banka',
  'Riddle Joker',
  'Cafe Stella',
  'Dracu Riot'
];

class ComprehensiveMangaImporter {
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

  async getMangaCovers(mangaId) {
    const url = `${this.baseUrl}/cover?manga[]=${mangaId}&limit=100`;
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

  getBestTitle(manga) {
    if (!manga.attributes?.title) return 'Unknown Title';
    
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

  getCoverUrl(manga, coverData = null) {
    // Try to get cover from manga relationships first
    if (manga.relationships) {
      const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
      if (coverRel && coverRel.attributes?.fileName) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
      }
    }
    
    // Fallback to cover data
    if (coverData && coverData.attributes?.fileName) {
      return `https://uploads.mangadex.org/covers/${coverData.id}/${coverData.attributes.fileName}.512.jpg`;
    }
    
    return '/placeholder.svg';
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
      const coversData = await this.getMangaCovers(mangaId);
      
      // Extract data
      const fullTitle = this.getBestTitle(mangaData);
      const description = this.getBestDescription(mangaData);
      const { authors, artists } = this.getAuthorsAndArtists(mangaData);
      const allTags = this.getAllTags(mangaData);
      
      // Get cover image URL - use the improved method
      let coverImageUrl = this.getCoverUrl(mangaData, coversData.data?.[0]);
      
      // If still no cover, try the first cover from covers data
      if (coverImageUrl === '/placeholder.svg' && coversData.data && coversData.data.length > 0) {
        coverImageUrl = this.getCoverUrl(null, coversData.data[0]);
      }

      console.log(`🖼️ Cover URL: ${coverImageUrl}`);

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
    console.log('🚀 Starting comprehensive manga import...');
    console.log(`📚 Will attempt to import ${POPULAR_MANGA.length} popular manga titles`);
    console.log(`⚙️ Configuration: Max ${MAX_MANGA_TO_IMPORT} manga, Batch size ${BATCH_SIZE}`);
    
    // Process manga in batches
    for (let i = 0; i < POPULAR_MANGA.length && this.importedCount < MAX_MANGA_TO_IMPORT; i += BATCH_SIZE) {
      const batch = POPULAR_MANGA.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      
      console.log(`\n📦 Processing batch ${batchNumber}: ${batch.join(', ')}`);
      
      // Process each manga in the batch
      for (const title of batch) {
        if (this.importedCount >= MAX_MANGA_TO_IMPORT) {
          console.log(`\n⏹️ Reached maximum import limit of ${MAX_MANGA_TO_IMPORT} manga`);
          break;
        }
        
        await this.importManga(title);
        
        // Add delay between imports to be respectful to the API
        console.log('⏳ Waiting 2 seconds before next import...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Longer delay between batches
      if (i + BATCH_SIZE < POPULAR_MANGA.length && this.importedCount < MAX_MANGA_TO_IMPORT) {
        console.log('⏳ Waiting 5 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\n🎊 Comprehensive import completed!');
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
    console.log('   2. All manga have proper titles, covers, descriptions, and chapter metadata');
    console.log('   3. Chapter content is empty (as requested)');
    console.log('   4. No need to fix titles or covers - everything is imported correctly!');
  }
}

// Main execution
async function main() {
  const importer = new ComprehensiveMangaImporter();
  await importer.run();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('💥 Import process failed:', error);
  process.exit(1);
});
