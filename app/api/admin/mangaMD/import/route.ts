import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mangaMDService } from '@/lib/mangaMD';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mangaMDId, creatorId } = await request.json();

    if (!mangaMDId || !creatorId) {
      return NextResponse.json(
        { error: 'MangaMD ID and creator ID are required' },
        { status: 400 }
      );
    }

    // Check if series already exists
    const existingSeries = await prisma.series.findUnique({
      where: { mangaMDId }
    });

    if (existingSeries) {
      return NextResponse.json(
        { error: 'Series with this MangaMD ID already exists' },
        { status: 409 }
      );
    }

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { id: creatorId }
    });

    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Fetch manga data from MangaDex
    const mangaData = await mangaMDService.getMangaById(mangaMDId);
    const coversData = await mangaMDService.getMangaCovers(mangaMDId);

    // Get the best title and description
    const title = mangaMDService.getBestTitle(mangaData);
    const description = mangaMDService.getBestDescription(mangaData);
    
    // Get authors and artists
    const { authors, artists } = mangaMDService.getAuthorsAndArtists(mangaData);
    
    // Get all tags
    const allTags = mangaMDService.getAllTags(mangaData);
    
    // Get cover image URL (use the first cover if available)
    let coverImageUrl = null;
    if (coversData.data.length > 0) {
      coverImageUrl = mangaMDService.getCoverUrl(coversData.data[0], 'large');
    }

    // Create the series in the database
    const series = await prisma.series.create({
      data: {
        title,
        description,
        coverImage: coverImageUrl,
        mangaMDId,
        mangaMDTitle: title,
        mangaMDStatus: mangaData.status,
        mangaMDYear: mangaData.year,
        contentRating: mangaData.contentRating,
        tags: JSON.stringify(allTags),
        authors: JSON.stringify(authors),
        artists: JSON.stringify(artists),
        altTitles: JSON.stringify(mangaData.altTitles || []),
        isImported: true,
        isPublished: true, // Auto-publish imported series
        creatorId,
      },
    });

    return NextResponse.json({
      success: true,
      series: {
        id: series.id,
        title: series.title,
        description: series.description,
        coverImage: series.coverImage,
        mangaMDId: series.mangaMDId,
        mangaMDStatus: series.mangaMDStatus,
        tags: allTags,
        authors,
        artists,
      }
    });

  } catch (error) {
    console.error('Error importing manga from MangaMD:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('MangaMD API error')) {
        return NextResponse.json(
          { error: 'Failed to fetch data from MangaMD API' },
          { status: 502 }
        );
      }
      if (error.message.includes('Failed to fetch manga')) {
        return NextResponse.json(
          { error: 'Manga not found on MangaMD' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
