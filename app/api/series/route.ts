import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null;
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch series from database
    const series = await prisma.series.findMany({
      take: limit || undefined,
      skip: offset,
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

    // Transform to comic format for compatibility
    const comics = series.map(series => ({
      id: series.id,
      title: series.title,
      series: series.title,
      description: series.description || '',
      cover: series.coverImage || null,
      coverImage: series.coverImage || null,
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
      totalChapters: series.chapters.length,
      libraryCount: 0,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: comics,
      pagination: {
        limit,
        offset,
        total: comics.length,
      }
    });

  } catch (error) {
    console.error('Error fetching series from database:', error);
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