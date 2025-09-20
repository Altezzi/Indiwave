import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeImported = searchParams.get('includeImported') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch series from database (both user-created and imported)
    const series = await prisma.series.findMany({
      where: {
        isPublished: true,
        ...(includeImported ? {} : { isImported: false })
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        chapters: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
          },
          orderBy: { chapterNumber: 'asc' }
        },
        _count: {
          select: {
            libraryEntries: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

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

    // Transform database series to comic format
    const dbComics = series.map(series => ({
      id: series.id,
      title: series.title,
      series: series.title, // For compatibility with existing components
      description: series.description,
      cover: series.coverImage,
      coverImage: series.coverImage,
      author: series.authors ? JSON.parse(series.authors)[0] : undefined,
      artist: series.artists ? JSON.parse(series.artists)[0] : undefined,
      authors: series.authors,
      artists: series.artists,
      year: series.mangaMDYear || new Date(series.createdAt).getFullYear(),
      tags: series.tags,
      mangaMDStatus: series.mangaMDStatus,
      isImported: series.isImported,
      contentRating: series.contentRating,
      creator: series.creator,
      chapters: series.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
      })),
      libraryCount: series._count.libraryEntries,
      createdAt: series.createdAt,
    }));

    // Combine database comics with static comics
    const allComics = [...dbComics, ...staticComics];

    // Sort by creation date (newest first)
    allComics.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({
      comics: allComics,
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
