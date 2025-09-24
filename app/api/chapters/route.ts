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
    const seriesId = searchParams.get('seriesId');

    // Build query conditions
    const where: any = {
      isPublished: true
    };

    if (seriesId) {
      where.seriesId = seriesId;
    }

    // Fetch chapters from database
    const chapters = await prisma.chapter.findMany({
      where,
      take: limit || undefined,
      skip: offset,
      include: {
        series: {
          select: {
            id: true,
            title: true,
            coverImage: true
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
      orderBy: [
        { series: { title: 'asc' } },
        { chapterNumber: 'asc' }
      ]
    });

    // Transform to chapter format
    const chapterData = chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      chapterNumber: chapter.chapterNumber,
      pages: chapter.pages ? chapter.pages.split(',').length : 0,
      isPublished: chapter.isPublished,
      series: {
        id: chapter.series.id,
        title: chapter.series.title,
        coverImage: chapter.series.coverImage
      },
      creator: {
        id: chapter.creator.id,
        name: chapter.creator.name || 'Unknown',
        username: chapter.creator.username || 'unknown'
      },
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
      mangaMDChapterTitle: chapter.mangaMDChapterTitle,
      mangaMDChapterNumber: chapter.mangaMDChapterNumber,
      mangaMDPages: chapter.mangaMDPages
    }));

    return NextResponse.json({
      success: true,
      data: chapterData,
      pagination: {
        limit,
        offset,
        total: chapterData.length,
      }
    });

  } catch (error) {
    console.error('Error fetching chapters from database:', error);
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
