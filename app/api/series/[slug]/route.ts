import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const series = await prisma.series.findFirst({
      where: { 
        OR: [
          { slug: params.slug },
          { id: params.slug } // Fallback for existing series without slugs
        ],
        isPublished: true
      },
      include: { 
        chapters: { 
          where: { isPublished: true },
          orderBy: { chapterNumber: 'asc' } 
        } 
      },
    });
    
    if (!series) {
      return new NextResponse('Series not found', { status: 404 });
    }
    
    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}
