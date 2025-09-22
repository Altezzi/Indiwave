import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');

    const seriesDir = path.join(process.cwd(), 'series');
    
    if (!fs.existsSync(seriesDir)) {
      return NextResponse.json({ error: 'Series directory not found' }, { status: 404 });
    }

    const folders = fs.readdirSync(seriesDir)
      .filter(item => {
        const itemPath = path.join(seriesDir, item);
        return fs.statSync(itemPath).isDirectory();
      });

    const results = {
      totalSeries: folders.length,
      series: [] as any[]
    };

    // Check each series folder
    for (const folderName of folders) {
      const seriesPath = path.join(seriesDir, folderName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      const chaptersPath = path.join(seriesPath, 'chapters.json');
      const coverPath = path.join(seriesPath, 'cover.jpg');
      const readmePath = path.join(seriesPath, 'README.md');
      
      const seriesInfo = {
        folderName,
        hasMetadata: fs.existsSync(metadataPath),
        hasChapters: fs.existsSync(chaptersPath),
        hasCover: fs.existsSync(coverPath),
        hasReadme: fs.existsSync(readmePath),
        metadata: null as any,
        chapterCount: 0
      };

      // Read metadata if it exists
      if (seriesInfo.hasMetadata) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          seriesInfo.metadata = {
            title: metadata.title,
            mangaMDId: metadata.mangaMDId,
            lastUpdated: metadata.updatedAt || metadata.createdAt
          };
        } catch (error) {
          seriesInfo.metadata = { error: 'Could not parse metadata' };
        }
      }

      // Count chapters if chapters.json exists
      if (seriesInfo.hasChapters) {
        try {
          const chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
          seriesInfo.chapterCount = Array.isArray(chapters) ? chapters.length : 0;
        } catch (error) {
          seriesInfo.chapterCount = 0;
        }
      }

      results.series.push(seriesInfo);
    }

    return NextResponse.json({
      success: true,
      ...results,
      checkedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking series:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
