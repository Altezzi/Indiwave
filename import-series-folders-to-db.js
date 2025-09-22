import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Create main series directory
const SERIES_DIR = path.join(process.cwd(), 'series');

class SeriesFolderImporter {
  constructor() {
    this.importedCount = 0;
    this.updatedCount = 0;
    this.skippedCount = 0;
    this.errors = [];
  }

  async importSeriesFromFolder(seriesFolder) {
    const seriesName = path.basename(seriesFolder);
    const metadataPath = path.join(seriesFolder, 'metadata.json');
    const chaptersPath = path.join(seriesFolder, 'chapters.json');
    
    if (!fs.existsSync(metadataPath)) {
      console.log(`⚠️ No metadata.json found for ${seriesName}`);
      return false;
    }

    try {
      // Read metadata
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      // Read chapters if available
      let chapters = [];
      if (fs.existsSync(chaptersPath)) {
        chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
      }

      console.log(`📖 Importing ${seriesName}...`);
      console.log(`   📝 Title: ${metadata.title}`);
      console.log(`   📖 Description: ${metadata.description ? 'Yes' : 'No'} (${metadata.description?.length || 0} chars)`);
      console.log(`   👥 Authors: ${metadata.authors?.length || 0}`);
      console.log(`   🎨 Artists: ${metadata.artists?.length || 0}`);
      console.log(`   🏷️ Tags: ${metadata.tags?.length || 0}`);
      console.log(`   📚 Chapters: ${chapters.length}`);

      // Check if series already exists in database
      const existingSeries = await prisma.series.findFirst({
        where: {
          OR: [
            { mangaMDId: metadata.mangaMDId },
            { title: metadata.title }
          ]
        }
      });

      if (existingSeries) {
        // Update existing series
        await prisma.series.update({
          where: { id: existingSeries.id },
          data: {
            title: metadata.title,
            mangaMDId: metadata.mangaMDId,
            mangaMDTitle: metadata.title,
            description: metadata.description || '',
            coverImage: metadata.coverImage || '',
            tags: metadata.tags || [],
            authors: metadata.authors || [],
            artists: metadata.artists || [],
            altTitles: [],
            status: metadata.status || 'ongoing',
            year: metadata.year,
            contentRating: metadata.contentRating || 'safe',
            updatedAt: new Date()
          }
        });

        // Update chapters
        if (chapters.length > 0) {
          // Delete existing chapters
          await prisma.chapter.deleteMany({
            where: { seriesId: existingSeries.id }
          });

          // Add new chapters
          for (const chapter of chapters) {
            await prisma.chapter.create({
              data: {
                title: chapter.title || `Chapter ${chapter.chapterNumber || 'Unknown'}`,
                chapterNumber: chapter.chapterNumber || 0,
                pages: chapter.pages || 0,
                mangaMDId: chapter.id,
                mangaMDTitle: chapter.title || `Chapter ${chapter.chapterNumber || 'Unknown'}`,
                translatedLanguage: chapter.translatedLanguage || 'en',
                publishAt: chapter.publishAt ? new Date(chapter.publishAt) : null,
                seriesId: existingSeries.id
              }
            });
          }
        }

        this.updatedCount++;
        console.log(`✅ Updated existing series: ${seriesName}`);
      } else {
        // Create new series
        const newSeries = await prisma.series.create({
          data: {
            title: metadata.title,
            mangaMDId: metadata.mangaMDId,
            mangaMDTitle: metadata.title,
            description: metadata.description || '',
            coverImage: metadata.coverImage || '',
            tags: metadata.tags || [],
            authors: metadata.authors || [],
            artists: metadata.artists || [],
            altTitles: [],
            status: metadata.status || 'ongoing',
            year: metadata.year,
            contentRating: metadata.contentRating || 'safe'
          }
        });

        // Add chapters
        if (chapters.length > 0) {
          for (const chapter of chapters) {
            await prisma.chapter.create({
              data: {
                title: chapter.title || `Chapter ${chapter.chapterNumber || 'Unknown'}`,
                chapterNumber: chapter.chapterNumber || 0,
                pages: chapter.pages || 0,
                mangaMDId: chapter.id,
                mangaMDTitle: chapter.title || `Chapter ${chapter.chapterNumber || 'Unknown'}`,
                translatedLanguage: chapter.translatedLanguage || 'en',
                publishAt: chapter.publishAt ? new Date(chapter.publishAt) : null,
                seriesId: newSeries.id
              }
            });
          }
        }

        this.importedCount++;
        console.log(`✅ Created new series: ${seriesName}`);
      }
      
      return true;
      
    } catch (error) {
      console.log(`❌ Error importing ${seriesName}: ${error.message}`);
      this.errors.push(`${seriesName}: ${error.message}`);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting SERIES FOLDER IMPORT to database...');
    console.log(`📁 Looking in: ${SERIES_DIR}`);
    
    if (!fs.existsSync(SERIES_DIR)) {
      console.log('❌ Series directory does not exist!');
      return;
    }

    const seriesFolders = fs.readdirSync(SERIES_DIR)
      .filter(item => {
        const itemPath = path.join(SERIES_DIR, item);
        return fs.statSync(itemPath).isDirectory();
      });

    console.log(`📚 Found ${seriesFolders.length} series folders`);

    for (const folderName of seriesFolders) {
      const seriesFolder = path.join(SERIES_DIR, folderName);
      await this.importSeriesFromFolder(seriesFolder);
    }

    console.log('\n🎊 SERIES FOLDER IMPORT completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Imported: ${this.importedCount} new series`);
    console.log(`   🔄 Updated: ${this.updatedCount} existing series`);
    console.log(`   ❌ Errors: ${this.errors.length} series`);
    console.log(`   📚 Total processed: ${seriesFolders.length} series`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    }
    
    console.log('\n🎨 Database now contains all series metadata from folders!');
    console.log('📁 Your library will now display data from the series folders instead of MangaDex API');
  }
}

// Main execution
async function main() {
  const importer = new SeriesFolderImporter();
  await importer.run();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('💥 Series folder import failed:', error);
  process.exit(1);
});
