import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const season = await prisma.season.findUnique({
      where: { id },
      include: {
        series: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            description: true,
            authors: true,
            artists: true,
            tags: true,
            mangaMDStatus: true,
            contentRating: true
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
      }
    });

    if (!season) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Season not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: season
    });

  } catch (error) {
    console.error('Error fetching season:', error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, coverImage, isPublished } = body;

    // Check if season exists
    const existingSeason = await prisma.season.findUnique({
      where: { id }
    });

    if (!existingSeason) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Season not found'
        },
        { status: 404 }
      );
    }

    // Update the season
    const updatedSeason = await prisma.season.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPublished !== undefined && { isPublished })
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
      data: updatedSeason
    });

  } catch (error) {
    console.error('Error updating season:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if season exists
    const existingSeason = await prisma.season.findUnique({
      where: { id }
    });

    if (!existingSeason) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Season not found'
        },
        { status: 404 }
      );
    }

    // Delete the season (chapters will be deleted due to cascade)
    await prisma.season.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Season deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting season:', error);
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
