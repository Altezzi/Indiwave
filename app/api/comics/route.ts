import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Fetch series from database
    let seriesFromDatabase: any[] = [];
    try {
      const dbSeries = await prisma.series.findMany({
        where: { 
          isPublished: true,
          seasonNumber: null // Only show main series, not seasons
        },
        include: {
          chapters: {
            select: {
              id: true,
              title: true,
              chapterNumber: true,
              pages: true,
              isPublished: true,
              createdAt: true
            },
            orderBy: {
              chapterNumber: 'asc'
            }
          },
          seasons: {
            where: { isPublished: true },
            orderBy: { seasonNumber: 'asc' },
            select: {
              id: true,
              title: true,
              seasonNumber: true,
              coverImage: true,
              description: true,
              createdAt: true,
              chapters: {
                where: { isPublished: true },
                orderBy: { chapterNumber: 'asc' },
                select: {
                  id: true,
                  title: true,
                  chapterNumber: true,
                  pages: true,
                  isPublished: true,
                  createdAt: true
                }
              }
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Transform database series to comic format
      seriesFromDatabase = dbSeries.map(series => ({
        id: series.id,
        title: series.title,
        series: series.title,
        description: series.description || '',
        cover: series.coverImage || '/placeholder-cover.jpg',
        coverImage: series.coverImage || '/placeholder-cover.jpg',
        author: series.authors || '',
        artist: series.artists || '',
        authors: series.authors ? [series.authors] : [],
        artists: series.artists ? [series.artists] : [],
        year: series.mangaMDYear || new Date().getFullYear(),
        tags: series.tags ? series.tags.split(',').map(tag => tag.trim()) : [],
        mangaMDStatus: series.mangaMDStatus || 'ongoing',
        status: series.mangaMDStatus || 'ongoing',
        isImported: series.isImported,
        contentRating: series.contentRating || 'safe',
        creator: {
          id: series.creator.id,
          name: series.creator.name || 'Unknown',
          username: series.creator.username || 'unknown'
        },
        chapters: series.chapters.map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          pages: chapter.pages ? chapter.pages.split(',').length : 0,
          isPublished: chapter.isPublished,
          createdAt: chapter.createdAt
        })),
        seasons: series.seasons.map(season => ({
          id: season.id,
          title: season.title,
          seasonNumber: season.seasonNumber,
          coverImage: season.coverImage || '/placeholder-cover.jpg',
          description: season.description || '',
          createdAt: season.createdAt,
          chapters: season.chapters.map(chapter => ({
            id: chapter.id,
            title: chapter.title,
            chapterNumber: chapter.chapterNumber,
            pages: chapter.pages ? chapter.pages.split(',').length : 0,
            isPublished: chapter.isPublished,
            createdAt: chapter.createdAt
          })),
          totalChapters: season.chapters.length
        })),
        totalChapters: series.chapters.length,
        totalSeasons: series.seasons.length,
        libraryCount: 0,
        createdAt: series.createdAt,
        updatedAt: series.updatedAt,
      }));
    } catch (dbError) {
      console.warn('Error fetching series from database:', dbError);
    }

    // Use database series if available, otherwise fall back to file-based
    let allComics = seriesFromDatabase.length > 0 ? seriesFromDatabase : [...staticComics, ...seriesFromFolders];

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
  } finally {
    await prisma.$disconnect();
  }
}