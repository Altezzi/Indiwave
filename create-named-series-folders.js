import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configuration
const MAX_MANGA_TO_IMPORT = 50; // Start with fewer to test

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');
if (!fs.existsSync(SERIES_DIR)) {
  fs.mkdirSync(SERIES_DIR, { recursive: true });
  console.log('📁 Created series directory:', SERIES_DIR);
}

// Popular manga titles to import
const POPULAR_MANGA = [
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
  'Mushoku Tensei',
  'The Eminence in Shadow',
  'Reincarnated as a Sword'
];

class NamedSeriesFolderCreator {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.importedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
    this.errors = [];
    this.downloadedCovers = 0;
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-series-creator/1.0.0',
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
    searchParams.append('limit', '50');
    searchParams.append('translatedLanguage[]', 'en');
    searchParams.append('order[chapter]', 'asc');

    const url = `${this.baseUrl}/chapter?${searchParams.toString()}`;
    return await this.fetchWithRetry(url);
  }

  // FIXED: Better title extraction
  getBestTitle(manga) {
    console.log('🔍 Extracting title from:', JSON.stringify(manga.attributes?.title, null, 2));
    
    if (!manga.attributes?.title) {
      console.log('❌ No title found in manga attributes');
      return 'Unknown Title';
    }
    
    const title = manga.attributes.title;
    
    if (typeof title === 'string') {
      console.log('✅ String title found:', title);
      return title;
    }
    
    if (typeof title === 'object') {
      // Try different language options
      const extractedTitle = title.en || title.ja || title.ja_ro || Object.values(title)[0];
      console.log('✅ Object title extracted:', extractedTitle);
      return extractedTitle || 'Unknown Title';
    }
    
    console.log('❌ Unknown title format');
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

  // Download cover and save to series folder
  async downloadCover(seriesFolder, mangaId, coverUrl, retryCount = 0) {
    if (!coverUrl || !mangaId) {
      return { success: false, error: 'Manga ID or cover URL is missing.' };
    }

    const filename = 'cover.jpg';
    const localPath = path.join(seriesFolder, filename);

    // Check if file already exists
    if (fs.existsSync(localPath)) {
      return { success: true, localPath: filename };
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
      return { success: true, localPath: filename };
    } catch (error) {
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.downloadCover(seriesFolder, mangaId, coverUrl, retryCount + 1);
      }
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

  // Create series folder structure with proper naming
  async createSeriesFolder(title, mangaData, chapters, mangaId) {
    // Clean title for folder name - remove invalid characters
    const cleanTitle = title
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();
    
    const seriesFolder = path.join(SERIES_DIR, cleanTitle);
    
    console.log(`📁 Creating folder: ${cleanTitle}`);
    
    // Create series folder
    if (!fs.existsSync(seriesFolder)) {
      fs.mkdirSync(seriesFolder, { recursive: true });
    }

    // Download cover
    const coverUrl = this.getCoverUrl(mangaData);
    let coverFilename = 'cover.jpg';
    if (coverUrl) {
      console.log(`🖼️ Downloading cover: ${coverUrl}`);
      const downloadResult = await this.downloadCover(seriesFolder, mangaId, coverUrl);
      if (downloadResult.success) {
        coverFilename = downloadResult.localPath;
        console.log(`✅ Cover downloaded: ${coverFilename}`);
      } else {
        console.log(`⚠️ Cover download failed: ${downloadResult.error}`);
      }
    }

    // Create metadata.json
    const metadata = {
      title: title,
      mangaMDId: mangaId,
      description: this.getBestDescription(mangaData),
      authors: this.getAuthorsAndArtists(mangaData).authors,
      artists: this.getAuthorsAndArtists(mangaData).artists,
      tags: this.getAllTags(mangaData),
      status: mangaData.attributes?.status || 'ongoing',
      year: mangaData.attributes?.year || null,
      contentRating: mangaData.attributes?.contentRating || 'safe',
      coverImage: coverFilename,
      totalChapters: chapters.length,
      createdAt: new Date().toISOString(),
      source: 'MangaDex'
    };

    fs.writeFileSync(
      path.join(seriesFolder, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Create chapters.json
    const chaptersData = chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter || 'Unknown'}`,
      chapterNumber: chapter.attributes.chapter ? parseFloat(chapter.attributes.chapter) : 0,
      pages: chapter.attributes.pages || 0,
      translatedLanguage: chapter.attributes.translatedLanguage || 'en',
      publishAt: chapter.attributes.publishAt,
      readUrl: `https://mangadex.org/chapter/${chapter.id}`
    }));

    fs.writeFileSync(
      path.join(seriesFolder, 'chapters.json'),
      JSON.stringify(chaptersData, null, 2)
    );

    // Create README.md
    const readme = `# ${title}

## Description
${metadata.description || 'No description available.'}

## Details
- **Authors**: ${metadata.authors.join(', ') || 'Unknown'}
- **Artists**: ${metadata.artists.join(', ') || 'Unknown'}
- **Status**: ${metadata.status}
- **Year**: ${metadata.year || 'Unknown'}
- **Content Rating**: ${metadata.contentRating}
- **Total Chapters**: ${metadata.totalChapters}

## Tags
${metadata.tags.map(tag => `- ${tag}`).join('\n')}

## Chapters
${chaptersData.map(ch => `- **${ch.title}** (${ch.chapterNumber}) - [Read on MangaDex](${ch.readUrl})`).join('\n')}

## Files
- \`cover.jpg\` - Series cover image
- \`metadata.json\` - Complete series metadata
- \`chapters.json\` - Chapter information and reading links
- \`README.md\` - This file

---
*Generated by IndiWave Series Creator*
`;

    fs.writeFileSync(path.join(seriesFolder, 'README.md'), readme);

    return seriesFolder;
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
      
      console.log(`📖 Found manga with ID: ${mangaId}`);

      // Get full manga details
      const mangaData = await this.getMangaById(mangaId);
      
      // Extract title with better debugging
      const extractedTitle = this.getBestTitle(mangaData);
      console.log(`📝 Extracted title: "${extractedTitle}"`);

      // Check if series folder already exists
      const cleanTitle = extractedTitle
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\s+/g, ' ')
        .trim();
      
      const seriesFolder = path.join(SERIES_DIR, cleanTitle);
      
      if (fs.existsSync(seriesFolder)) {
        console.log(`⏭️ Series folder already exists, skipping: ${cleanTitle}`);
        this.skippedCount++;
        return false;
      }

      // Get chapters
      console.log(`📄 Fetching chapters for ${extractedTitle}...`);
      const chaptersResult = await this.getMangaChapters(mangaId);
      const chapters = chaptersResult.data || [];
      console.log(`📚 Found ${chapters.length} chapters`);

      // Create series folder with all metadata
      const createdFolder = await this.createSeriesFolder(
        extractedTitle,
        mangaData,
        chapters,
        mangaId
      );

      this.importedCount++;
      console.log(`🎉 Successfully created series folder: ${createdFolder}`);
      console.log(`   📁 Cover: ${path.join(createdFolder, 'cover.jpg')}`);
      console.log(`   📄 Metadata: ${path.join(createdFolder, 'metadata.json')}`);
      console.log(`   📚 Chapters: ${path.join(createdFolder, 'chapters.json')}`);
      console.log(`   📖 README: ${path.join(createdFolder, 'README.md')}`);
      
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to import ${title}:`, error);
      this.errors.push(`${title}: ${error.message}`);
      this.errorCount++;
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting NAMED SERIES FOLDER creation...');
    console.log(`📚 Will attempt to create folders for ${POPULAR_MANGA.length} popular manga titles`);
    console.log(`⚙️ Configuration: Max ${MAX_MANGA_TO_IMPORT} manga`);
    console.log(`📁 Series folders will be created in: ${SERIES_DIR}`);
    console.log(`🖥️ Each folder will contain: cover.jpg, metadata.json, chapters.json, README.md`);
    
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

    console.log('\n🎊 NAMED SERIES FOLDER creation completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Created: ${this.importedCount} series folders`);
    console.log(`   ⏭️ Skipped: ${this.skippedCount} series folders`);
    console.log(`   ❌ Errors: ${this.errorCount} series`);
    console.log(`   🖼️ Covers downloaded: ${this.downloadedCovers}`);
    console.log(`   📚 Total processed: ${this.importedCount + this.skippedCount + this.errorCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
      if (this.errors.length > 10) {
        console.log(`   ... and ${this.errors.length - 10} more errors`);
      }
    }
    
    console.log('\n🎨 Series folders created in your GitHub IndiWave project!');
    console.log('📁 Each series now has its own named folder with:');
    console.log('   - cover.jpg (cover art)');
    console.log('   - metadata.json (all series info)');
    console.log('   - chapters.json (chapter list with reading links)');
    console.log('   - README.md (human-readable info)');
  }
}

// Main execution
async function main() {
  const creator = new NamedSeriesFolderCreator();
  await creator.run();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('💥 Series folder creation failed:', error);
  process.exit(1);
});
