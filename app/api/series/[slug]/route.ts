import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    console.log('Series API called with slug:', params.slug);
    
    const series = await prisma.series.findFirst({
      where: { 
        id: params.slug, // Use ID directly since we don't have slug field
        isPublished: true
      },
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
            createdAt: true,
            mangaMDChapterTitle: true,
            mangaMDChapterNumber: true,
            mangaMDPages: true
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
    });
    
    if (!series) {
      return new NextResponse('Series not found', { status: 404 });
    }

    // Transform to comic format for compatibility
    const comic = {
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
        createdAt: chapter.createdAt,
        mangaMDChapterTitle: chapter.mangaMDChapterTitle,
        mangaMDChapterNumber: chapter.mangaMDChapterNumber,
        mangaMDPages: chapter.mangaMDPages
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
    };
    
    return NextResponse.json({
      success: true,
      comic: comic
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch series',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
