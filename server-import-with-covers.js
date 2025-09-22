import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configuration
const CREATOR_ID = 'cmfujyjpr0000n6owza2pkamk'; // Admin user ID
const MAX_MANGA_TO_IMPORT = 100; // Increase for server import
const BATCH_SIZE = 5; // Process 5 at a time for server stability

// Create covers directory if it doesn't exist
const COVERS_DIR = path.join(process.cwd(), 'public', 'covers');
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
  console.log('📁 Created covers directory:', COVERS_DIR);
}

// Comprehensive list of popular manga for server import
const POPULAR_MANGA = [
  // Shounen Jump Classics
  'One Piece',
  'Naruto',
  'Dragon Ball',
  'Bleach',
  'Hunter x Hunter',
  'My Hero Academia',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'Chainsaw Man',
  'Black Clover',
  'One Punch Man',
  'Attack on Titan',
  'Death Note',
  'Fullmetal Alchemist',
  
  // Popular Shounen
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
  
  // Romance & Slice of Life
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
  
  // Action & Adventure
  'Tokyo Ghoul',
  'Parasyte',
  'Ajin',
  'Inuyasha',
  'Rurouni Kenshin',
  'Yu Yu Hakusho',
  'Gintama',
  'JoJo\'s Bizarre Adventure',
  'D.Gray-man',
  'Blue Exorcist',
  'Soul Eater',
  'Fire Punch',
  'Hell\'s Paradise',
  'Kaiju No. 8',
  'Undead Unluck',
  'Mashle',
  'Sakamoto Days',
  'The Elusive Samurai',
  'Witch Watch',
  'Me & Roboco',
  
  // Isekai & Fantasy
  'Mushoku Tensei',
  'The Eminence in Shadow',
  'Reincarnated as a Sword',
  'So I\'m a Spider, So What?',
  'The World\'s Finest Assassin',
  'How a Realist Hero Rebuilt the Kingdom',
  'The Saint\'s Magic Power is Omnipotent',
  'By the Grace of the Gods',
  'Kuma Kuma Kuma Bear',
  'I\'ve Been Killing Slimes for 300 Years',
  
  // Comedy & Slice of Life
  'Nichijou',
  'Lucky Star',
  'Azumanga Daioh',
  'K-On!',
  'Hyouka',
  'The Melancholy of Haruhi Suzumiya',
  'Lucky Star',
  'Working!!',
  'Servant x Service',
  'Gekkan Shoujo Nozaki-kun',
  
  // Psychological & Thriller
  'Monster',
  'Death Note',
  'Psycho-Pass',
  'Erased',
  'The Promised Neverland',
  'Made in Abyss',
  'Land of the Lustrous',
  'Houseki no Kuni',
  'Dorohedoro',
  'Chainsaw Man',
  
  // Sports
  'Haikyuu!!',
  'Kuroko\'s Basketball',
  'Slam Dunk',
  'Eyeshield 21',
  'Ace of Diamond',
  'Yowamushi Pedal',
  'Free!',
  'Run with the Wind',
  'Blue Lock',
  'Ao Ashi'
];

class ServerImportWithCovers {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.importedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
    this.errors = [];
    this.downloadedCovers = 0;
    this.failedDownloads = 0;
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-server/1.0.0',
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

  getBestTitle(manga) {
    if (!manga.attributes?.title) {
      return 'Unknown Title';
    }
    
    const title = manga.attributes.title;
    
    if (typeof title === 'string') {
      return title;
    }
    
    if (typeof title === 'object') {
      const extractedTitle = title.en || title.ja || Object.values(title)[0];
      return extractedTitle || 'Unknown Title';
    }
    
    return 'Unknown Title';
  }

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

  // Server-optimized cover download
  async downloadCover(mangaId, coverUrl, retryCount = 0) {
    if (!coverUrl || !mangaId) {
      return { success: false, error: 'Manga ID or cover URL is missing.' };
    }

    const filename = `${mangaId}.jpg`;
    const localPath = path.join(COVERS_DIR, filename);
    const publicPath = `/covers/${filename}`;

    // Check if file already exists
    if (fs.existsSync(localPath)) {
      return { success: true, localPath: publicPath };
    }

    try {
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://mangadex.org/',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
      
      this.downloadedCovers++;
      return { success: true, localPath: publicPath };
    } catch (error) {
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.downloadCover(mangaId, coverUrl, retryCount + 1);
      }
      this.failedDownloads++;
      return { success: false, error: error.message };
    }
  }

  getCoverUrl(manga) {
    if (!manga.relationships) {
      return null;
    }

    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (!coverRel || !coverRel.attributes?.fileName) {
      return null;
    }

    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
  }

  async importManga(title) {
    try {
      console.log(`\n🔍 Searching for: ${title}`);
      
      const searchResult = await this.searchManga(title);
      
      if (!searchResult.data || searchResult.data.length === 0) {
        console.log(`❌ No results found for: ${title}`);
        return false;
      }

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
      
      // Extract data
      const fullTitle = this.getBestTitle(mangaData);
      const description = this.getBestDescription(mangaData);
      const { authors, artists } = this.getAuthorsAndArtists(mangaData);
      const allTags = this.getAllTags(mangaData);
      
      // Download cover
      let coverImageUrl = '/placeholder.svg';
      const coverUrl = this.getCoverUrl(mangaData);
      
      if (coverUrl) {
        const downloadResult = await this.downloadCover(mangaId, coverUrl);
        
        if (downloadResult.success) {
          coverImageUrl = downloadResult.localPath;
          console.log(`✅ Cover downloaded: ${coverImageUrl}`);
        } else {
          console.log(`⚠️ Cover download failed: ${downloadResult.error}`);
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
      const chaptersResult = await this.getMangaChapters(mangaId);
      const chapters = chaptersResult.data || [];
      
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
              pages: JSON.stringify([]),
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
    console.log('🚀 Starting SERVER import with local cover downloads...');
    console.log(`📚 Will attempt to import ${POPULAR_MANGA.length} popular manga titles`);
    console.log(`⚙️ Configuration: Max ${MAX_MANGA_TO_IMPORT} manga, Batch size ${BATCH_SIZE}`);
    console.log(`📁 Covers will be saved to: ${COVERS_DIR}`);
    console.log(`🖥️ Optimized for server deployment`);
    
    // Process manga in batches for server stability
    for (let i = 0; i < POPULAR_MANGA.length && this.importedCount < MAX_MANGA_TO_IMPORT; i += BATCH_SIZE) {
      const batch = POPULAR_MANGA.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      
      console.log(`\n📦 Processing batch ${batchNumber}: ${batch.join(', ')}`);
      
      for (const title of batch) {
        if (this.importedCount >= MAX_MANGA_TO_IMPORT) {
          break;
        }
        
        await this.importManga(title);
        
        // Shorter delay for server efficiency
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Progress update
      console.log(`\n📊 Batch ${batchNumber} completed. Progress: ${this.importedCount} imported, ${this.skippedCount} skipped, ${this.errorCount} errors`);
      
      // Longer delay between batches
      if (i + BATCH_SIZE < POPULAR_MANGA.length && this.importedCount < MAX_MANGA_TO_IMPORT) {
        console.log('⏳ Waiting 5 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\n🎊 SERVER import completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Imported: ${this.importedCount} manga`);
    console.log(`   ⏭️ Skipped: ${this.skippedCount} manga`);
    console.log(`   ❌ Errors: ${this.errorCount} manga`);
    console.log(`   🖼️ Covers downloaded: ${this.downloadedCovers}`);
    console.log(`   ❌ Cover failures: ${this.failedDownloads}`);
    console.log(`   📚 Total processed: ${this.importedCount + this.skippedCount + this.errorCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
      if (this.errors.length > 10) {
        console.log(`   ... and ${this.errors.length - 10} more errors`);
      }
    }
    
    console.log('\n🎨 Next steps for server deployment:');
    console.log('   1. Commit the covers to Git: git add public/covers/ && git commit -m "Add manga covers"');
    console.log('   2. Push to your repository: git push');
    console.log('   3. Deploy your application with the covers included');
    console.log('   4. All manga will have local covers for fast loading!');
  }
}

// Main execution
async function main() {
  const importer = new ServerImportWithCovers();
  await importer.run();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('💥 Server import process failed:', error);
  process.exit(1);
});
