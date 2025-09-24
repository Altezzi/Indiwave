import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get latest chapters from all series
    const latestChapters = await prisma.chapter.findMany({
      where: { isPublished: true },
      include: {
        series: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            authors: true,
            artists: true
          }
        },
        season: {
          select: {
            id: true,
            title: true,
            seasonNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Transform to manga format
    const manga = latestChapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      series: chapter.series?.title || 'Unknown Series',
      seriesId: chapter.series?.id,
      seasonId: chapter.season?.id,
      seasonTitle: chapter.season?.title,
      seasonNumber: chapter.season?.seasonNumber,
      chapterNumber: chapter.chapterNumber,
      coverImage: chapter.series?.coverImage || '/placeholder-cover.jpg',
      authors: chapter.series?.authors || '',
      artists: chapter.series?.artists || '',
      pages: chapter.pages ? chapter.pages.split(',').length : 0,
      createdAt: chapter.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: manga
    });

  } catch (error) {
    console.error('Error fetching latest manga:', error);
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
