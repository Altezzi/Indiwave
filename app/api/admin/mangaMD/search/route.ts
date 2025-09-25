import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mangaMDService } from '@/lib/mangaMD';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt:', { user: session?.user?.email, role: session?.user?.role });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('Search request:', { query, limit, offset });

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search MangaDex
    console.log('Calling mangaMDService.searchManga...');
    const searchResults = await mangaMDService.searchManga(query, limit, offset);
    console.log('Search results received:', { total: searchResults.total, dataLength: searchResults.data.length });

    // Transform the results to include only necessary data
    const transformedResults = searchResults.data.map(manga => {
      // Debug: log the full manga object structure
      console.log('Full manga object:', JSON.stringify(manga, null, 2));
      
      const title = mangaMDService.getBestTitle(manga);
      const description = mangaMDService.getBestDescription(manga);
      const { authors, artists } = mangaMDService.getAuthorsAndArtists(manga);
      const allTags = mangaMDService.getAllTags(manga);
      const coverUrl = mangaMDService.getCoverUrlFromManga(manga);

      return {
        id: manga.id,
        title,
        description,
        status: manga.status,
        year: manga.year,
        contentRating: manga.contentRating,
        authors,
        artists,
        tags: allTags,
        altTitles: manga.altTitles || [],
        coverUrl,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedResults,
      pagination: {
        limit: searchResults.limit,
        offset: searchResults.offset,
        total: searchResults.total,
      }
    });

  } catch (error) {
    console.error('Error searching MangaMD:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('MangaMD API error')) {
        return NextResponse.json(
          { error: 'Failed to search MangaMD API' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
