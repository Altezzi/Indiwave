import fs from 'fs';
import path from 'path';

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');
if (!fs.existsSync(SERIES_DIR)) {
  fs.mkdirSync(SERIES_DIR, { recursive: true });
  console.log('📁 Created series directory:', SERIES_DIR);
}

// Simple list of popular manga with their actual titles
const MANGA_LIST = [
  { search: 'One Piece', title: 'One Piece' },
  { search: 'Naruto', title: 'Naruto' },
  { search: 'Dragon Ball', title: 'Dragon Ball' },
  { search: 'Bleach', title: 'Bleach' },
  { search: 'Hunter x Hunter', title: 'Hunter x Hunter' },
  { search: 'My Hero Academia', title: 'My Hero Academia' },
  { search: 'Demon Slayer', title: 'Demon Slayer: Kimetsu no Yaiba' },
  { search: 'Jujutsu Kaisen', title: 'Jujutsu Kaisen' },
  { search: 'Chainsaw Man', title: 'Chainsaw Man' },
  { search: 'Black Clover', title: 'Black Clover' },
  { search: 'One Punch Man', title: 'One Punch Man' },
  { search: 'Attack on Titan', title: 'Attack on Titan' },
  { search: 'Death Note', title: 'Death Note' },
  { search: 'Fullmetal Alchemist', title: 'Fullmetal Alchemist' },
  { search: 'Fairy Tail', title: 'Fairy Tail' },
  { search: 'Sword Art Online', title: 'Sword Art Online' },
  { search: 'The Promised Neverland', title: 'The Promised Neverland' },
  { search: 'Dr. Stone', title: 'Dr. Stone' },
  { search: 'Fire Force', title: 'Fire Force' },
  { search: 'Mob Psycho 100', title: 'Mob Psycho 100' },
  { search: 'Re:Zero', title: 'Re:Zero - Starting Life in Another World' },
  { search: 'Konosuba', title: 'Kono Subarashii Sekai ni Shukufuku wo!' },
  { search: 'Overlord', title: 'Overlord' },
  { search: 'That Time I Got Reincarnated as a Slime', title: 'That Time I Got Reincarnated as a Slime' },
  { search: 'The Rising of the Shield Hero', title: 'The Rising of the Shield Hero' },
  { search: 'No Game No Life', title: 'No Game No Life' },
  { search: 'Steins Gate', title: 'Steins;Gate' },
  { search: 'Tokyo Ghoul', title: 'Tokyo Ghoul' },
  { search: 'Parasyte', title: 'Parasyte' },
  { search: 'Ajin', title: 'Ajin' },
  { search: 'Inuyasha', title: 'Inuyasha' },
  { search: 'Rurouni Kenshin', title: 'Rurouni Kenshin' },
  { search: 'Yu Yu Hakusho', title: 'Yu Yu Hakusho' },
  { search: 'Gintama', title: 'Gintama' },
  { search: 'JoJo\'s Bizarre Adventure', title: 'JoJo\'s Bizarre Adventure' },
  { search: 'D.Gray-man', title: 'D.Gray-man' },
  { search: 'Blue Exorcist', title: 'Blue Exorcist' },
  { search: 'Soul Eater', title: 'Soul Eater' },
  { search: 'Fire Punch', title: 'Fire Punch' },
  { search: 'Hell\'s Paradise', title: 'Hell\'s Paradise' },
  { search: 'Kaiju No. 8', title: 'Kaiju No. 8' },
  { search: 'Undead Unluck', title: 'Undead Unluck' },
  { search: 'Mashle', title: 'Mashle: Magic and Muscles' },
  { search: 'Sakamoto Days', title: 'Sakamoto Days' },
  { search: 'The Elusive Samurai', title: 'The Elusive Samurai' },
  { search: 'Witch Watch', title: 'Witch Watch' },
  { search: 'Me & Roboco', title: 'Me & Roboco' },
  { search: 'Mushoku Tensei', title: 'Mushoku Tensei: Jobless Reincarnation' },
  { search: 'The Eminence in Shadow', title: 'The Eminence in Shadow' },
  { search: 'Reincarnated as a Sword', title: 'Reincarnated as a Sword' }
];

class SimpleSeriesCreator {
  constructor() {
    this.baseUrl = 'https://api.mangadex.org';
    this.createdCount = 0;
    this.errors = [];
  }

  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'indiwave-simple-creator/1.0.0',
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

  // Simple title extraction
  getBestTitle(manga) {
    if (!manga.attributes?.title) {
      return 'Unknown Title';
    }
    
    const title = manga.attributes.title;
    
    if (typeof title === 'string') {
      return title;
    }
    
    if (typeof title === 'object') {
      return title.en || title.ja || Object.values(title)[0] || 'Unknown Title';
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

  // Download cover and save to series folder
  async downloadCover(seriesFolder, mangaId, coverUrl) {
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
      
      return { success: true, localPath: filename };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create series folder with proper naming
  async createSeriesFolder(mangaInfo, mangaData, chapters, mangaId) {
    // Use the predefined title to ensure proper naming
    const title = mangaInfo.title;
    const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').trim();
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
      console.log(`🖼️ Downloading cover...`);
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

  async createMangaSeries(mangaInfo) {
    try {
      console.log(`\n🔍 Searching for: ${mangaInfo.search}`);
      
      const searchResult = await this.searchManga(mangaInfo.search);
      
      if (!searchResult.data || searchResult.data.length === 0) {
        console.log(`❌ No results found for: ${mangaInfo.search}`);
        return false;
      }

      const manga = searchResult.data[0];
      const mangaId = manga.id;
      
      console.log(`📖 Found manga with ID: ${mangaId}`);

      // Get full manga details
      const mangaData = await this.getMangaById(mangaId);
      
      // Get chapters
      console.log(`📄 Fetching chapters...`);
      const chaptersResult = await this.getMangaChapters(mangaId);
      const chapters = chaptersResult.data || [];
      console.log(`📚 Found ${chapters.length} chapters`);

      // Create series folder with predefined title
      const createdFolder = await this.createSeriesFolder(
        mangaInfo,
        mangaData,
        chapters,
        mangaId
      );

      this.createdCount++;
      console.log(`🎉 Successfully created series folder: ${createdFolder}`);
      
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to create ${mangaInfo.search}:`, error);
      this.errors.push(`${mangaInfo.search}: ${error.message}`);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting SIMPLE SERIES FOLDER creation...');
    console.log(`📚 Will create folders for ${MANGA_LIST.length} popular manga titles`);
    console.log(`📁 Series folders will be created in: ${SERIES_DIR}`);
    console.log(`🖥️ Each folder will contain: cover.jpg, metadata.json, chapters.json, README.md`);
    
    for (const mangaInfo of MANGA_LIST) {
      await this.createMangaSeries(mangaInfo);
      
      // Add delay between imports to be respectful to the API
      console.log('⏳ Waiting 3 seconds before next series...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n🎊 SIMPLE SERIES FOLDER creation completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Created: ${this.createdCount} series folders`);
    console.log(`   ❌ Errors: ${this.errors.length} series`);
    console.log(`   📚 Total processed: ${this.createdCount + this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n🎨 Series folders created in your GitHub IndiWave project!');
    console.log('📁 Each series now has its own properly named folder with:');
    console.log('   - cover.jpg (cover art)');
    console.log('   - metadata.json (all series info)');
    console.log('   - chapters.json (chapter list with reading links)');
    console.log('   - README.md (human-readable info)');
  }
}

// Main execution
async function main() {
  const creator = new SimpleSeriesCreator();
  await creator.run();
}

main().catch((error) => {
  console.error('💥 Series folder creation failed:', error);
  process.exit(1);
});
