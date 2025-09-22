import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MangaMDService } from '../../../../lib/mangaMD';

export async function POST(request: NextRequest) {
  try {
    const { updateChapters = true, updateMetadata = false, delayMs = 1000 } = await request.json();

    const mangaMD = new MangaMDService();
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
      updated: 0,
      errors: 0,
      seriesResults: [] as any[]
    };

    // Process each series with delay to avoid rate limiting
    for (let i = 0; i < folders.length; i++) {
      const folderName = folders[i];
      const seriesPath = path.join(seriesDir, folderName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      if (!fs.existsSync(metadataPath)) {
        results.seriesResults.push({
          seriesName: folderName,
          status: 'skipped',
          reason: 'No metadata.json found'
        });
        continue;
      }

      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const seriesId = metadata.mangaMDId;

        if (!seriesId) {
          results.seriesResults.push({
            seriesName: folderName,
            status: 'skipped',
            reason: 'No mangaMDId found'
          });
          continue;
        }

        console.log(`Updating series ${i + 1}/${folders.length}: ${folderName}`);

        // Fetch latest data from MangaDex
        const mangaData = await mangaMD.getMangaById(seriesId);
        if (!mangaData) {
          results.seriesResults.push({
            seriesName: folderName,
            status: 'error',
            reason: 'Could not fetch data from MangaDex'
          });
          results.errors++;
          continue;
        }

        const seriesResult = {
          seriesName: folderName,
          status: 'success',
          updates: {
            metadata: null,
            chapters: null,
            cover: null
          },
          errors: []
        };

        // Update metadata if requested
        if (updateMetadata) {
          try {
            const updatedMetadata = {
              ...metadata,
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
            seriesResult.updates.metadata = 'Updated successfully';
          } catch (error) {
            seriesResult.errors.push(`Metadata update failed: ${error}`);
          }
        }

        // Update chapters if requested
        if (updateChapters) {
          try {
            const chaptersData = await mangaMD.getChapters(seriesId);
            const chaptersPath = path.join(seriesPath, 'chapters.json');
            
            // Read current chapters
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
              seriesResult.updates.chapters = `Added ${newChapters.length} new chapters`;
            } else {
              seriesResult.updates.chapters = 'No new chapters found';
            }
          } catch (error) {
            seriesResult.errors.push(`Chapters update failed: ${error}`);
          }
        }

        // Update cover if it doesn't exist
        const coverPath = path.join(seriesPath, 'cover.jpg');
        if (!fs.existsSync(coverPath)) {
          try {
            const coverUrl = mangaData.coverImage;
            if (coverUrl) {
              const response = await fetch(coverUrl);
              if (response.ok) {
                const coverBuffer = await response.arrayBuffer();
                fs.writeFileSync(coverPath, Buffer.from(coverBuffer));
                seriesResult.updates.cover = 'Downloaded successfully';
              }
            }
          } catch (error) {
            seriesResult.errors.push(`Cover update failed: ${error}`);
          }
        }

        // Update README.md
        try {
          const readmePath = path.join(seriesPath, 'README.md');
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
${seriesResult.updates.chapters || 'Check chapters.json for chapter list'}

---
*Last updated: ${new Date().toISOString()}*
`;

          fs.writeFileSync(readmePath, readmeContent);
        } catch (error) {
          seriesResult.errors.push(`README update failed: ${error}`);
        }

        if (seriesResult.errors.length > 0) {
          seriesResult.status = 'partial';
        }

        results.seriesResults.push(seriesResult);
        results.updated++;

        // Add delay between requests to avoid rate limiting
        if (i < folders.length - 1 && delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }

      } catch (error) {
        results.seriesResults.push({
          seriesName: folderName,
          status: 'error',
          reason: error.message
        });
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk update completed. ${results.updated} series updated, ${results.errors} errors.`,
      ...results,
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in bulk update:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check all series for updates without applying them
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const delayMs = parseInt(searchParams.get('delayMs') || '1000');

    const mangaMD = new MangaMDService();
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
      checked: 0,
      errors: 0,
      seriesWithUpdates: 0,
      seriesResults: [] as any[]
    };

    // Check each series
    for (let i = 0; i < folders.length; i++) {
      const folderName = folders[i];
      const seriesPath = path.join(seriesDir, folderName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      if (!fs.existsSync(metadataPath)) {
        results.seriesResults.push({
          seriesName: folderName,
          status: 'skipped',
          reason: 'No metadata.json found'
        });
        continue;
      }

      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        const seriesId = metadata.mangaMDId;

        if (!seriesId) {
          results.seriesResults.push({
            seriesName: folderName,
            status: 'skipped',
            reason: 'No mangaMDId found'
          });
          continue;
        }

        console.log(`Checking series ${i + 1}/${folders.length}: ${folderName}`);

        // Fetch latest data from MangaDex
        const mangaData = await mangaMD.getMangaById(seriesId);
        if (!mangaData) {
          results.seriesResults.push({
            seriesName: folderName,
            status: 'error',
            reason: 'Could not fetch data from MangaDex'
          });
          results.errors++;
          continue;
        }

        // Check for new chapters
        const chaptersData = await mangaMD.getChapters(seriesId);
        const chaptersPath = path.join(seriesPath, 'chapters.json');
        
        let currentChapters = [];
        if (fs.existsSync(chaptersPath)) {
          currentChapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
        }

        const currentChapterNumbers = new Set(currentChapters.map(ch => ch.chapterNumber));
        const newChapters = chaptersData.filter(ch => !currentChapterNumbers.has(ch.chapterNumber));

        const seriesResult = {
          seriesName: folderName,
          currentChapters: currentChapters.length,
          totalChapters: chaptersData.length,
          newChapters: newChapters.length,
          hasUpdates: newChapters.length > 0,
          newChaptersList: newChapters.map(ch => ({
            chapterNumber: ch.chapterNumber,
            title: ch.title
          }))
        };

        if (newChapters.length > 0) {
          results.seriesWithUpdates++;
        }

        results.seriesResults.push(seriesResult);
        results.checked++;

        // Add delay between requests
        if (i < folders.length - 1 && delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }

      } catch (error) {
        results.seriesResults.push({
          seriesName: folderName,
          status: 'error',
          reason: error.message
        });
        results.errors++;
      }
    }

    return NextResponse.json({
      ...results,
      checkedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking all series:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
