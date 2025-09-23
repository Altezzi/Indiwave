import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Auto-import triggered - scanning series folder...');
    
    const seriesPath = path.join(process.cwd(), 'series');
    
    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Series folder not found' 
      }, { status: 404 });
    }

    const seriesFolders = fs.readdirSync(seriesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📁 Found ${seriesFolders.length} series folders`);

    let importedCount = 0;
    let updatedCount = 0;
    let errors = [];

    for (const folderName of seriesFolders) {
      try {
        const folderPath = path.join(seriesPath, folderName);
        const metadataPath = path.join(folderPath, 'metadata.json');
        const chaptersPath = path.join(folderPath, 'chapters.json');

        if (!fs.existsSync(metadataPath) || !fs.existsSync(chaptersPath)) {
          console.log(`⚠️ Skipping ${folderName} - missing metadata or chapters files`);
          continue;
        }

        // Read metadata
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);

        // Read chapters
        const chaptersContent = fs.readFileSync(chaptersPath, 'utf-8');
        const chapters = JSON.parse(chaptersContent);

        // Check if series already exists
        const existingSeries = await prisma.series.findFirst({
          where: {
            OR: [
              { title: metadata.title },
              { mangaMDId: metadata.id }
            ]
          }
        });

        if (existingSeries) {
          // Update existing series
          await prisma.series.update({
            where: { id: existingSeries.id },
            data: {
              title: metadata.title,
              description: metadata.description || '',
              coverImage: metadata.coverImage || '/placeholder-cover.jpg',
              mangaMDId: metadata.id,
              mangaMDStatus: metadata.status || 'ongoing',
              contentRating: metadata.contentRating || 'safe',
              tags: JSON.stringify(metadata.tags || []),
              authors: JSON.stringify(metadata.authors || []),
              artists: JSON.stringify(metadata.artists || []),
              isImported: true,
              isPublished: true, // Auto-publish new imports
              updatedAt: new Date()
            }
          });

          // Update chapters
          await prisma.chapter.deleteMany({
            where: { seriesId: existingSeries.id }
          });

          for (const chapter of chapters) {
            await prisma.chapter.create({
              data: {
                title: chapter.title || `Chapter ${chapter.chapterNumber}`,
                chapterNumber: chapter.chapterNumber || 0,
                seriesId: existingSeries.id,
                pages: JSON.stringify(chapter.pages || []),
                isPublished: true
              }
            });
          }

          updatedCount++;
          console.log(`✅ Updated series: ${metadata.title}`);
        } else {
          // Create new series
          const newSeries = await prisma.series.create({
            data: {
              title: metadata.title,
              description: metadata.description || '',
              coverImage: metadata.coverImage || '/placeholder-cover.jpg',
              mangaMDId: metadata.id,
              mangaMDStatus: metadata.status || 'ongoing',
              contentRating: metadata.contentRating || 'safe',
              tags: JSON.stringify(metadata.tags || []),
              authors: JSON.stringify(metadata.authors || []),
              artists: JSON.stringify(metadata.artists || []),
              isImported: true,
              isPublished: true, // Auto-publish new imports
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });

          // Create chapters
          for (const chapter of chapters) {
            await prisma.chapter.create({
              data: {
                title: chapter.title || `Chapter ${chapter.chapterNumber}`,
                chapterNumber: chapter.chapterNumber || 0,
                seriesId: newSeries.id,
                pages: JSON.stringify(chapter.pages || []),
                isPublished: true
              }
            });
          }

          importedCount++;
          console.log(`🆕 Imported new series: ${metadata.title}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${folderName}:`, error);
        errors.push({ folder: folderName, error: error.message });
      }
    }

    console.log(`🎉 Auto-import completed: ${importedCount} new, ${updatedCount} updated, ${errors.length} errors`);

    return NextResponse.json({
      success: true,
      imported: importedCount,
      updated: updatedCount,
      errors: errors.length,
      total: seriesFolders.length,
      message: `Auto-import completed: ${importedCount} new series, ${updatedCount} updated`
    });

  } catch (error) {
    console.error('❌ Auto-import failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Auto-import endpoint ready',
    usage: 'POST to trigger auto-import'
  });
}
