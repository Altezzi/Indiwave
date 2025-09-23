import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface MangaMetadata {
  title: string;
  mangaMDId: string;
  description: string;
  authors: string[];
  artists: string[];
  tags: string[];
  status: string;
  year: number;
  contentRating: string;
  coverImage: string;
  totalChapters: number;
  createdAt: string;
  updatedAt: string;
  source: string;
}

interface MangaSeries {
  id: string;
  title: string;
  description: string;
  authors: string[];
  artists: string[];
  tags: string[];
  status: string;
  year: number;
  contentRating: string;
  coverImage: string;
  totalChapters: number;
  createdAt: string;
  updatedAt: string;
  source: string;
  coverUrl: string;
}

export async function GET() {
  try {
    console.log('🔍 Manga API called - fetching from database...');
    
    // Get all imported manga from database
    const mangaFromDB = await prisma.series.findMany({
      where: {
        isImported: true,
        isPublished: true
      },
      include: {
        _count: {
          select: {
            chapters: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      },
      take: undefined // Explicitly remove any limits
    });

    console.log(`📊 Found ${mangaFromDB.length} manga in database`);

    const mangaList: MangaSeries[] = mangaFromDB.map(series => {
      // Parse JSON fields
      const authors = series.authors ? JSON.parse(series.authors) : [];
      const artists = series.artists ? JSON.parse(series.artists) : [];
      const tags = series.tags ? JSON.parse(series.tags) : [];
      const altTitles = series.altTitles ? JSON.parse(series.altTitles) : [];

      return {
        id: series.id,
        title: series.title,
        description: series.description || '',
        authors: authors,
        artists: artists,
        tags: tags,
        status: series.mangaMDStatus || 'ongoing',
        year: series.mangaMDYear || new Date(series.createdAt).getFullYear(),
        contentRating: series.contentRating || 'safe',
        coverImage: series.coverImage || '',
        totalChapters: series._count.chapters,
        createdAt: series.createdAt.toISOString(),
        updatedAt: series.updatedAt.toISOString(),
        source: 'MangaDex',
        coverUrl: series.coverImage ? `/api/series/${encodeURIComponent(series.title)}/cover.jpg` : '/placeholder-cover.jpg'
      };
    });

    console.log(`📊 Returning ${mangaList.length} manga to client`);

    const response = NextResponse.json({
      success: true,
      data: mangaList,
      total: mangaList.length
    });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('Error fetching manga data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manga data' },
      { status: 500 }
    );
  }
}
