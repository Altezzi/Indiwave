import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MangaMDService } from '../../../../lib/mangaMD';

export async function POST(request: NextRequest) {
  try {
    const { seriesId, updateChapters = true, updateMetadata = false } = await request.json();

    if (!seriesId) {
      return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
    }

    const mangaMD = new MangaMDService();
    const seriesDir = path.join(process.cwd(), 'series');
    
    // Find the series folder by ID or title
    let seriesFolder = null;
    let seriesName = null;
    
    if (fs.existsSync(seriesDir)) {
      const folders = fs.readdirSync(seriesDir);
      for (const folder of folders) {
        const folderPath = path.join(seriesDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
          const metadataPath = path.join(folderPath, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            if (metadata.mangaMDId === seriesId || metadata.title === seriesId) {
              seriesFolder = folderPath;
              seriesName = folder;
              break;
            }
          }
        }
      }
    }

    if (!seriesFolder) {
      return NextResponse.json({ error: 'Series not found in local folders' }, { status: 404 });
    }

    const results = {
      seriesName,
      updates: {
        metadata: null,
        chapters: null,
        cover: null
      },
      errors: []
    };

    // Fetch latest data from MangaDex
    const mangaData = await mangaMD.getMangaById(seriesId);
    if (!mangaData) {
      return NextResponse.json({ error: 'Could not fetch data from MangaDex' }, { status: 404 });
    }

    // Update metadata if requested
    if (updateMetadata) {
      try {
        const metadataPath = path.join(seriesFolder, 'metadata.json');
        const currentMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        
        const updatedMetadata = {
          ...currentMetadata,
          title: mangaData.title,
          description: mangaData.description,
          authors: mangaData.authors,
          artists: mangaData.artists,
          tags: mangaData.tags,
          status: mangaData.status,
          year: mangaData.year,
          contentRating: mangaData.contentRating,
          updatedAt: new Date().toISOString()
        };

        fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));
        results.updates.metadata = 'Updated successfully';
      } catch (error) {
        results.errors.push(`Metadata update failed: ${error}`);
      }
    }

    // Update chapters if requested
    if (updateChapters) {
      try {
        const chaptersData = await mangaMD.getChapters(seriesId);
        const chaptersPath = path.join(seriesFolder, 'chapters.json');
        
        // Read current chapters to compare
        let currentChapters = [];
        if (fs.existsSync(chaptersPath)) {
          currentChapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
        }

        // Find new chapters
        const currentChapterNumbers = new Set(currentChapters.map(ch => ch.chapterNumber));
        const newChapters = chaptersData.filter(ch => !currentChapterNumbers.has(ch.chapterNumber));

        if (newChapters.length > 0) {
          const updatedChapters = [...currentChapters, ...newChapters]
            .sort((a, b) => a.chapterNumber - b.chapterNumber);

          fs.writeFileSync(chaptersPath, JSON.stringify(updatedChapters, null, 2));
          results.updates.chapters = `Added ${newChapters.length} new chapters`;
        } else {
          results.updates.chapters = 'No new chapters found';
        }
      } catch (error) {
        results.errors.push(`Chapters update failed: ${error}`);
      }
    }

    // Update cover if it doesn't exist or is outdated
    const coverPath = path.join(seriesFolder, 'cover.jpg');
    if (!fs.existsSync(coverPath) || updateMetadata) {
      try {
        const coverUrl = mangaData.coverImage;
        if (coverUrl) {
          const response = await fetch(coverUrl);
          if (response.ok) {
            const coverBuffer = await response.arrayBuffer();
            fs.writeFileSync(coverPath, Buffer.from(coverBuffer));
            results.updates.cover = 'Updated successfully';
          }
        }
      } catch (error) {
        results.errors.push(`Cover update failed: ${error}`);
      }
    }

    // Update README.md
    try {
      const readmePath = path.join(seriesFolder, 'README.md');
      const readmeContent = `# ${mangaData.title}

## Description
${mangaData.description}

## Details
- **Author(s)**: ${mangaData.authors?.join(', ') || 'Unknown'}
- **Artist(s)**: ${mangaData.artists?.join(', ') || 'Unknown'}
- **Year**: ${mangaData.year || 'Unknown'}
- **Status**: ${mangaData.status || 'Unknown'}
- **Content Rating**: ${mangaData.contentRating || 'Unknown'}

## Tags
${mangaData.tags?.map(tag => `- ${tag}`).join('\n') || 'None'}

## Chapters
${results.updates.chapters || 'Check chapters.json for chapter list'}

---
*Last updated: ${new Date().toISOString()}*
`;

      fs.writeFileSync(readmePath, readmeContent);
    } catch (error) {
      results.errors.push(`README update failed: ${error}`);
    }

    return NextResponse.json({
      success: true,
      message: `Series "${seriesName}" updated successfully`,
      ...results
    });

  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check for updates without applying them
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');

    if (!seriesId) {
      return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
    }

    const mangaMD = new MangaMDService();
    const seriesDir = path.join(process.cwd(), 'series');
    
    // Find the series folder
    let seriesFolder = null;
    let seriesName = null;
    
    if (fs.existsSync(seriesDir)) {
      const folders = fs.readdirSync(seriesDir);
      for (const folder of folders) {
        const folderPath = path.join(seriesDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
          const metadataPath = path.join(folderPath, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            if (metadata.mangaMDId === seriesId || metadata.title === seriesId) {
              seriesFolder = folderPath;
              seriesName = folder;
              break;
            }
          }
        }
      }
    }

    if (!seriesFolder) {
      return NextResponse.json({ error: 'Series not found in local folders' }, { status: 404 });
    }

    // Fetch latest data from MangaDex
    const mangaData = await mangaMD.getMangaById(seriesId);
    if (!mangaData) {
      return NextResponse.json({ error: 'Could not fetch data from MangaDex' }, { status: 404 });
    }

    // Check for new chapters
    const chaptersData = await mangaMD.getChapters(seriesId);
    const chaptersPath = path.join(seriesFolder, 'chapters.json');
    
    let currentChapters = [];
    if (fs.existsSync(chaptersPath)) {
      currentChapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
    }

    const currentChapterNumbers = new Set(currentChapters.map(ch => ch.chapterNumber));
    const newChapters = chaptersData.filter(ch => !currentChapterNumbers.has(ch.chapterNumber));

    return NextResponse.json({
      seriesName,
      currentChapters: currentChapters.length,
      totalChapters: chaptersData.length,
      newChapters: newChapters.length,
      newChaptersList: newChapters.map(ch => ({
        chapterNumber: ch.chapterNumber,
        title: ch.title
      })),
      lastChecked: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking series updates:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
