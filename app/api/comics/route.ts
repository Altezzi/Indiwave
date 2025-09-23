import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null; // null means no limit
    const offset = parseInt(searchParams.get('offset') || '0');

    // Read series from series folders
    const seriesDir = path.join(process.cwd(), 'series');
    let seriesFromFolders: any[] = [];

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
            
            // Read chapters if available
            let chapters = [];
            if (fs.existsSync(chaptersPath)) {
              chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
            }

            // Transform to comic format
            const comic = {
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

            seriesFromFolders.push(comic);
          } catch (error) {
            console.warn(`Error reading metadata for ${folderName}:`, error);
          }
        }
      }
    }

    // No database series - purely file-based

    // Also get static comics from JSON file
    const comicsJsonPath = path.join(process.cwd(), 'data', 'comics.json');
    let staticComics: any[] = [];
    
    try {
      const comicsData = fs.readFileSync(comicsJsonPath, 'utf8');
      const parsedData = JSON.parse(comicsData);
      staticComics = Array.isArray(parsedData) ? parsedData : parsedData.comics || [];
    } catch (error) {
      console.warn('Could not read static comics file:', error);
    }

    // Combine all comics (purely file-based)
    let allComics = [...staticComics, ...seriesFromFolders];

    // Sort by creation date (newest first)
    allComics.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    // Apply pagination
    const paginatedComics = limit !== null 
      ? allComics.slice(offset, offset + limit)
      : allComics.slice(offset);

    return NextResponse.json({
      comics: paginatedComics,
      pagination: {
        limit,
        offset,
        total: allComics.length,
      }
    });

  } catch (error) {
    console.error('Error fetching comics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}