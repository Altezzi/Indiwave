import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // Get user's library entries (followed series)
    const libraryEntries = await prisma.libraryEntry.findMany({
      where: { userId },
      include: {
        series: {
          include: {
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
            },
            seasons: {
              where: { isPublished: true },
              orderBy: { seasonNumber: 'asc' },
              include: {
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
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Transform to manga format
    const followedManga = libraryEntries.map(entry => {
      const series = entry.series;
      const totalChapters = series.chapters.length + 
        series.seasons.reduce((total, season) => total + season.chapters.length, 0);

      return {
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
        totalChapters: totalChapters,
        totalSeasons: series.seasons.length,
        libraryCount: 1, // This user follows it
        userStatus: entry.status,
        userRating: entry.rating,
        userNotes: entry.notes,
        createdAt: series.createdAt,
        updatedAt: series.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: followedManga,
      pagination: {
        limit,
        offset,
        total: followedManga.length,
      }
    });

  } catch (error) {
    console.error('Error fetching followed manga:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
