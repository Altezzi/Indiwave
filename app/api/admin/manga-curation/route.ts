import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all imported manga with chapter counts
    const manga = await prisma.series.findMany({
      where: {
        isImported: true,
      },
      include: {
        _count: {
          select: {
            chapters: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      manga: manga.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        coverImage: m.coverImage,
        mangaMDId: m.mangaMDId,
        mangaMDStatus: m.mangaMDStatus,
        contentRating: m.contentRating,
        tags: m.tags,
        authors: m.authors,
        artists: m.artists,
        isPublished: m.isPublished,
        createdAt: m.createdAt,
        _count: m._count,
      }))
    });

  } catch (error) {
    console.error('Error fetching manga for curation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
