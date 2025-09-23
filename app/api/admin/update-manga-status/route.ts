import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mangaId, isPublished, isImported } = await request.json();

    if (!mangaId) {
      return NextResponse.json({ error: 'Manga ID is required' }, { status: 400 });
    }

    // Update manga status
    const updatedManga = await prisma.series.update({
      where: { id: mangaId },
      data: {
        ...(isPublished !== undefined && { isPublished }),
        ...(isImported !== undefined && { isImported })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Manga status updated successfully',
      manga: {
        id: updatedManga.id,
        title: updatedManga.title,
        isPublished: updatedManga.isPublished,
        isImported: updatedManga.isImported
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'publish-all') {
      // Publish all imported manga
      const result = await prisma.series.updateMany({
        where: { isImported: true },
        data: { isPublished: true }
      });

      return NextResponse.json({
        success: true,
        message: `Published ${result.count} manga`,
        count: result.count
      });
    }

    if (action === 'unpublish-all') {
      // Unpublish all manga
      const result = await prisma.series.updateMany({
        where: { isImported: true },
        data: { isPublished: false }
      });

      return NextResponse.json({
        success: true,
        message: `Unpublished ${result.count} manga`,
        count: result.count
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error in manga status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
