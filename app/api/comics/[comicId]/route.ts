import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { comicId: string } }
) {
  try {
    const { comicId } = params;

    // First, try to find in series folders
    const seriesDir = path.join(process.cwd(), 'series');
    let comicFromFolder = null;

    if (fs.existsSync(seriesDir)) {
      const seriesFolders = fs.readdirSync(seriesDir)
        .filter(item => {
          const itemPath = path.join(seriesDir, item);
          return fs.statSync(itemPath).isDirectory();
        });

      for (const folderName of seriesFolders) {
        const seriesFolder = path.join(seriesDir, folderName);
        const metadataPath = path.join(seriesFolder, 'metadata.json');
        const chaptersPath = path.join(seriesFolder, 'chapters.json');
        
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            
            // Check if this is the comic we're looking for
            if (metadata.mangaMDId === comicId || folderName === comicId) {
              // Read chapters if available
              let chapters = [];
              if (fs.existsSync(chaptersPath)) {
                chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
              }

              // Transform to comic format
              comicFromFolder = {
                id: metadata.mangaMDId || folderName,
                title: metadata.title,
                series: metadata.title,
                description: metadata.description || '',
              cover: `/api/series-covers/${encodeURIComponent(folderName)}/cover.jpg`,
              coverImage: `/api/series-covers/${encodeURIComponent(folderName)}/cover.jpg`,
                author: metadata.authors?.[0] || '',
                artist: metadata.artists?.[0] || '',
                authors: metadata.authors || [],
                artists: metadata.artists || [],
                year: metadata.year || new Date().getFullYear(),
                tags: metadata.tags || [],
                mangaMDStatus: metadata.status || 'ongoing',
                isImported: true,
                contentRating: metadata.contentRating || 'safe',
                creator: {
                  id: 'system',
                  name: 'System Import',
                  username: 'system'
                },
                chapters: chapters.map((chapter: any) => ({
                  id: chapter.id,
                  title: chapter.title,
                  chapterNumber: chapter.chapterNumber || 0,
                  pages: chapter.pages || 0,
                })),
                libraryCount: 0,
                createdAt: metadata.createdAt || new Date().toISOString(),
                updatedAt: metadata.updatedAt || new Date().toISOString(),
              };
              break;
            }
          } catch (error) {
            console.warn(`Error reading metadata for ${folderName}:`, error);
          }
        }
      }
    }

    // If found in series folder, return it
    if (comicFromFolder) {
      return NextResponse.json({
        comic: comicFromFolder
      });
    }

    // Check static comics file
    const comicsJsonPath = path.join(process.cwd(), 'data', 'comics.json');
    try {
      const comicsData = fs.readFileSync(comicsJsonPath, 'utf8');
      const parsedData = JSON.parse(comicsData);
      const staticComics = Array.isArray(parsedData) ? parsedData : parsedData.comics || [];
      
      const staticComic = staticComics.find((comic: any) => 
        comic.id === comicId || comic.mangaMDId === comicId
      );
      
      if (staticComic) {
        return NextResponse.json({
          comic: staticComic
        });
      }
    } catch (error) {
      console.warn('Could not read static comics file:', error);
    }

    // Comic not found
    return NextResponse.json(
      { error: 'Comic not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching comic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
