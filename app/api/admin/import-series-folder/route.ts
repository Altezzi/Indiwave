import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folderName = searchParams.get('folder');
    const importAll = searchParams.get('all') === 'true';

    // Find admin user to use as creator
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true }
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'No admin user found' }, { status: 500 });
    }

    const seriesDir = path.join(process.cwd(), 'series');
    
    if (!fs.existsSync(seriesDir)) {
      return NextResponse.json({ error: 'Series directory not found' }, { status: 404 });
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[]
    };

    if (importAll) {
      // Import all series folders
      const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const folder of seriesFolders) {
        try {
          const result = await importSeriesFromFolder(folder, adminUser.id, seriesDir);
          results.details.push(result);
          
          if (result.success) {
            results.imported++;
          } else if (result.skipped) {
            results.skipped++;
          } else {
            results.errors++;
          }
        } catch (error) {
          console.error(`Error importing ${folder}:`, error);
          results.errors++;
          results.details.push({
            folder,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    } else if (folderName) {
      // Import specific folder
      const result = await importSeriesFromFolder(folderName, adminUser.id, seriesDir);
      results.details.push(result);
      
      if (result.success) {
        results.imported++;
      } else if (result.skipped) {
        results.skipped++;
      } else {
        results.errors++;
      }
    } else {
      return NextResponse.json({ error: 'Either folder name or all=true parameter required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${results.imported} imported, ${results.skipped} skipped, ${results.errors} errors`,
      results
    });

  } catch (error) {
    console.error('Error in import-series-folder API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function importSeriesFromFolder(folderName: string, creatorId: string, seriesDir: string) {
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
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// GET endpoint to list available series folders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seriesDir = path.join(process.cwd(), 'series');
    
    if (!fs.existsSync(seriesDir)) {
      return NextResponse.json({ error: 'Series directory not found' }, { status: 404 });
    }

    const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const seriesInfo = [];

    for (const folder of seriesFolders) {
      const metadataPath = path.join(seriesDir, folder, 'metadata.json');
      const chaptersPath = path.join(seriesDir, folder, 'chapters.json');
      
      let metadata = null;
      let hasChapters = false;
      
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent);
        } catch (error) {
          console.error(`Error reading metadata for ${folder}:`, error);
        }
      }
      
      if (fs.existsSync(chaptersPath)) {
        hasChapters = true;
      }

      // Check if already imported
      const existingSeries = metadata ? await prisma.series.findFirst({
        where: {
          OR: [
            { mangaMDId: metadata.mangaMDId },
            { title: metadata.title }
          ]
        },
        select: { id: true, title: true, isImported: true }
      }) : null;

      seriesInfo.push({
        folder,
        metadata: metadata ? {
          title: metadata.title,
          mangaMDId: metadata.mangaMDId,
          status: metadata.status,
          year: metadata.year,
          authors: metadata.authors,
          tags: metadata.tags
        } : null,
        hasChapters,
        isImported: !!existingSeries,
        existingSeriesId: existingSeries?.id || null
      });
    }

    return NextResponse.json({
      success: true,
      series: seriesInfo,
      total: seriesInfo.length,
      imported: seriesInfo.filter(s => s.isImported).length,
      notImported: seriesInfo.filter(s => !s.isImported).length
    });

  } catch (error) {
    console.error('Error listing series folders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
