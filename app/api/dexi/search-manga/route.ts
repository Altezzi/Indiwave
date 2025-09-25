import { NextRequest, NextResponse } from 'next/server';

// GET /api/dexi/search-manga - Search for manga on MangaDex
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search MangaDex for the manga
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=5`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== 'ok') {
      throw new Error('Invalid response from MangaDex');
    }

    const mangaList = data.data.map((manga: any) => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description?.en || manga.attributes.description,
      year: manga.attributes.year,
      status: manga.attributes.status,
      tags: manga.attributes.tags?.map((tag: any) => tag.attributes.name.en) || []
    }));

    return NextResponse.json({
      success: true,
      manga: mangaList
    });

  } catch (error) {
    console.error('Error searching manga:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search manga' },
      { status: 500 }
    );
  }
}
