// Direct import script that uses Prisma to import manga from series folder
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importMangaDirect() {
  console.log('🚀 Starting direct manga import...\n');

  try {
    // Find admin user to use as creator
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true }
    });

    if (!adminUser) {
      console.error('❌ No admin user found! Please create an admin user first.');
      return;
    }

    console.log(`✅ Using admin user: ${adminUser.email} (${adminUser.name})`);

    const seriesDir = path.join(process.cwd(), 'series');
    
    if (!fs.existsSync(seriesDir)) {
      console.error('❌ Series directory not found:', seriesDir);
      return;
    }

    console.log(`✅ Series directory found: ${seriesDir}`);

    const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📚 Found ${seriesFolders.length} series folders`);

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      details: []
    };

    for (const folderName of seriesFolders) {
      try {
        console.log(`\n📖 Processing: ${folderName}`);
        
        const result = await importSeriesFromFolder(folderName, adminUser.id, seriesDir);
        results.details.push(result);
        
        if (result.success) {
          results.imported++;
          console.log(`   ✅ ${result.message}`);
        } else if (result.skipped) {
          results.skipped++;
          console.log(`   ⏭️  ${result.message}`);
        } else {
          results.errors++;
          console.log(`   ❌ ${result.error}`);
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${folderName}:`, error.message);
        results.errors++;
        results.details.push({
          folder: folderName,
          success: false,
          error: error.message
        });
      }
    }

    console.log('\n🎉 Import completed!');
    console.log(`   Imported: ${results.imported}`);
    console.log(`   Skipped: ${results.skipped}`);
    console.log(`   Errors: ${results.errors}`);

    // Show summary
    if (results.imported > 0) {
      console.log('\n✅ Successfully imported series:');
      results.details.filter(d => d.success).forEach(detail => {
        console.log(`   - ${detail.title} (${detail.chaptersImported} chapters)`);
      });
    }

    if (results.skipped > 0) {
      console.log('\n⏭️  Skipped series (already imported):');
      results.details.filter(d => d.skipped).forEach(detail => {
        console.log(`   - ${detail.folder}`);
      });
    }

    if (results.errors > 0) {
      console.log('\n❌ Failed series:');
      results.details.filter(d => !d.success && !d.skipped).forEach(detail => {
        console.log(`   - ${detail.folder}: ${detail.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importSeriesFromFolder(folderName, creatorId, seriesDir) {
  const folderPath = path.join(seriesDir, folderName);
  const metadataPath = path.join(folderPath, 'metadata.json');
  const chaptersPath = path.join(folderPath, 'chapters.json');

  // Check if metadata exists
  if (!fs.existsSync(metadataPath)) {
    return {
      folder: folderName,
      success: false,
      skipped: false,
      error: 'No metadata.json found'
    };
  }

  try {
    // Read metadata
    const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    // Check if series already exists
    const existingSeries = await prisma.series.findFirst({
      where: {
        OR: [
          { mangaMDId: metadata.mangaMDId },
          { title: metadata.title }
        ]
      }
    });

    if (existingSeries) {
      return {
        folder: folderName,
        success: false,
        skipped: true,
        message: `Series already exists: ${metadata.title}`
      };
    }

    // Create series
    const series = await prisma.series.create({
      data: {
        title: metadata.title,
        description: metadata.description || '',
        coverImage: metadata.coverImage || null,
        mangaMDId: metadata.mangaMDId || null,
        mangaMDTitle: metadata.title,
        mangaMDStatus: metadata.status || 'ongoing',
        mangaMDYear: metadata.year || null,
        contentRating: metadata.contentRating || 'safe',
        tags: JSON.stringify(metadata.tags || []),
        authors: JSON.stringify(metadata.authors || []),
        artists: JSON.stringify(metadata.artists || []),
        altTitles: JSON.stringify(metadata.altTitles || []),
        isImported: true,
        isPublished: true, // Auto-publish imported series
        creatorId: creatorId
      }
    });

    // Import chapters if they exist
    let chaptersImported = 0;
    if (fs.existsSync(chaptersPath)) {
      try {
        const chaptersContent = fs.readFileSync(chaptersPath, 'utf-8');
        const chapters = JSON.parse(chaptersContent);

        for (const chapterData of chapters) {
          await prisma.chapter.create({
            data: {
              title: chapterData.title || `Chapter ${chapterData.chapterNumber || chaptersImported + 1}`,
              chapterNumber: chapterData.chapterNumber || chaptersImported + 1,
              pages: JSON.stringify(chapterData.pages || []),
              isPublished: true,
              seriesId: series.id,
              creatorId: creatorId,
              mangaMDChapterId: chapterData.id || null,
              mangaMDChapterTitle: chapterData.title || null,
              mangaMDChapterNumber: chapterData.chapterNumber || null,
              mangaMDPages: chapterData.pages ? chapterData.pages.length : null,
              mangaMDTranslatedLanguage: chapterData.translatedLanguage || 'en',
              mangaMDPublishAt: chapterData.publishAt ? new Date(chapterData.publishAt) : null
            }
          });
          chaptersImported++;
        }
      } catch (chapterError) {
        console.error(`Error importing chapters for ${folderName}:`, chapterError);
      }
    }

    return {
      folder: folderName,
      success: true,
      skipped: false,
      seriesId: series.id,
      title: metadata.title,
      chaptersImported,
      message: `Successfully imported ${metadata.title} with ${chaptersImported} chapters`
    };

  } catch (error) {
    console.error(`Error importing series ${folderName}:`, error);
    return {
      folder: folderName,
      success: false,
      skipped: false,
      error: error.message
    };
  }
}

// Run the import
importMangaDirect();
