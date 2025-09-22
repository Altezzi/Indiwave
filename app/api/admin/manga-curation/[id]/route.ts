import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isPublished } = await request.json();

    // Update the series
    const updatedSeries = await prisma.series.update({
      where: { id: params.id },
      data: { isPublished },
    });

    // Also update all chapters to match the series status
    await prisma.chapter.updateMany({
      where: { seriesId: params.id },
      data: { isPublished },
    });

    return NextResponse.json({
      success: true,
      series: {
        id: updatedSeries.id,
        title: updatedSeries.title,
        isPublished: updatedSeries.isPublished,
      }
    });

  } catch (error) {
    console.error('Error updating manga status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the series (this will cascade delete chapters and related data)
    await prisma.series.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Manga deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting manga:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
