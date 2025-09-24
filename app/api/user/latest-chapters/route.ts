import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // Get user's library entries to find followed series
    const libraryEntries = await prisma.libraryEntry.findMany({
      where: { userId },
      include: {
        series: {
          include: {
            chapters: {
              where: { isPublished: true },
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                title: true,
                chapterNumber: true,
                pages: true,
                createdAt: true
              }
            },
            seasons: {
              include: {
                chapters: {
                  where: { isPublished: true },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                  select: {
                    id: true,
                    title: true,
                    chapterNumber: true,
                    pages: true,
                    createdAt: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Collect latest chapters from followed series
    const latestChapters = [];
    
    for (const entry of libraryEntries) {
      const series = entry.series;
      
      // Add latest chapter from main series
      if (series.chapters.length > 0) {
        latestChapters.push({
          id: series.chapters[0].id,
          title: series.chapters[0].title,
          series: series.title,
          seriesId: series.id,
          chapterNumber: series.chapters[0].chapterNumber,
          coverImage: series.coverImage || '/placeholder-cover.jpg',
          pages: series.chapters[0].pages ? series.chapters[0].pages.split(',').length : 0,
          createdAt: series.chapters[0].createdAt,
          isFromSeason: false
        });
      }
      
      // Add latest chapters from seasons
      for (const season of series.seasons) {
        if (season.chapters.length > 0) {
          latestChapters.push({
            id: season.chapters[0].id,
            title: season.chapters[0].title,
            series: series.title,
            seriesId: series.id,
            seasonId: season.id,
            seasonTitle: season.title,
            seasonNumber: season.seasonNumber,
            chapterNumber: season.chapters[0].chapterNumber,
            coverImage: series.coverImage || '/placeholder-cover.jpg',
            pages: season.chapters[0].pages ? season.chapters[0].pages.split(',').length : 0,
            createdAt: season.chapters[0].createdAt,
            isFromSeason: true
          });
        }
      }
    }

    // Sort by creation date and limit results
    latestChapters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const limitedChapters = latestChapters.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedChapters
    });

  } catch (error) {
    console.error('Error fetching user latest chapters:', error);
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
