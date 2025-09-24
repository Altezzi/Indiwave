import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null;
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause = seriesId ? { seriesId, isPublished: true } : { isPublished: true };

    const seasons = await prisma.season.findMany({
      where: whereClause,
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
        creator: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
      orderBy: [
        { seriesId: 'asc' },
        { seasonNumber: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: seasons,
      pagination: {
        limit,
        offset,
        total: seasons.length,
      }
    });

  } catch (error) {
    console.error('Error fetching seasons:', error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, seasonNumber, description, coverImage, seriesId, creatorId } = body;

    // Validate required fields
    if (!title || !seasonNumber || !seriesId || !creatorId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: title, seasonNumber, seriesId, creatorId'
        },
        { status: 400 }
      );
    }

    // Check if series exists
    const series = await prisma.series.findUnique({
      where: { id: seriesId }
    });

    if (!series) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Series not found'
        },
        { status: 404 }
      );
    }

    // Check if season number already exists for this series
    const existingSeason = await prisma.season.findUnique({
      where: {
        seriesId_seasonNumber: {
          seriesId,
          seasonNumber
        }
      }
    });

    if (existingSeason) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Season number already exists for this series'
        },
        { status: 409 }
      );
    }

    // Create the season
    const season = await prisma.season.create({
      data: {
        title,
        seasonNumber,
        description,
        coverImage,
        seriesId,
        creatorId,
        isPublished: false // Default to unpublished
      },
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
      }
    });

    return NextResponse.json({
      success: true,
      data: season
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating season:', error);
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
