import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// POST /api/dexi/mangadex - Import manga from MangaDex with cover art
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mangaId, coverUrl } = body;

    if (!mangaId) {
      return NextResponse.json(
        { success: false, error: 'MangaDex ID is required' },
        { status: 400 }
      );
    }

    // Fetch manga data from MangaDex API
    const mangaData = await fetchMangaFromMangaDex(mangaId);
    
    if (!mangaData) {
      return NextResponse.json(
        { success: false, error: 'Manga not found on MangaDex' },
        { status: 404 }
      );
    }

    // Sanitize folder name
    const sanitizedFolderName = mangaData.title.en
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const seriesDir = path.join(process.cwd(), 'series');
    const newSeriesPath = path.join(seriesDir, sanitizedFolderName);

    // Check if series already exists
    if (fs.existsSync(newSeriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series already exists' },
        { status: 400 }
      );
    }

    // Create series folder structure
    fs.mkdirSync(newSeriesPath, { recursive: true });
    fs.mkdirSync(path.join(newSeriesPath, 'volumes'), { recursive: true });
    fs.mkdirSync(path.join(newSeriesPath, 'seasons'), { recursive: true });

    let coverImageName = null;

    // Handle cover art
    const coverImageUrl = coverUrl || mangaData.coverUrl;
    if (coverImageUrl) {
      try {
        const coverResult = await downloadCoverArt(coverImageUrl, newSeriesPath, mangaData.title.en);
        coverImageName = coverResult.filename;
      } catch (error) {
        console.error('Error downloading cover art:', error);
      }
    }

    // Extract data from MangaDex response
    const authors = mangaData.authors?.map(author => author.name).join(', ') || '';
    const artists = mangaData.artists?.map(artist => artist.name).join(', ') || '';
    const tags = mangaData.tags?.map(tag => tag.name.en).join(', ') || '';
    const altTitles = Object.values(mangaData.altTitles || {}).flat().join(', ');

    // Create metadata.json
    const metadata = {
      title: mangaData.title.en,
      description: mangaData.description?.en || '',
      author: authors,
      artist: artists,
      publisher: 'MangaDex',
      publisherLinks: [`https://mangadex.org/title/${mangaId}`],
      tags: tags.split(', ').filter(Boolean),
      contentRating: mangaData.contentRating || 'safe',
      altTitles: altTitles.split(', ').filter(Boolean),
      coverImage: coverImageName,
      source: 'mangadex',
      mangaDexId: mangaId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(newSeriesPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Create database entry
    const dbSeries = await prisma.series.create({
      data: {
        title: mangaData.title.en,
        description: mangaData.description?.en || '',
        coverImage: coverImageName,
        contentRating: mangaData.contentRating || 'safe',
        tags: JSON.stringify(metadata.tags),
        authors: authors,
        artists: artists,
        altTitles: JSON.stringify(metadata.altTitles),
        creatorId: 'system',
        isPublished: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Manga imported successfully from MangaDex via DEXI',
      series: {
        folderName: sanitizedFolderName,
        metadata,
        coverImage: coverImageName,
        id: dbSeries.id,
        source: 'mangadex'
      }
    });

  } catch (error) {
    console.error('Error importing manga from MangaDex:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import manga from MangaDex' },
      { status: 500 }
    );
  }
}

// GET /api/dexi/mangadex - Search manga on MangaDex
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '20';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search MangaDex
    const searchResults = await searchMangaDex(query, parseInt(limit));

    return NextResponse.json({
      success: true,
      results: searchResults,
      total: searchResults.length
    });

  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search MangaDex' },
      { status: 500 }
    );
  }
}

// Helper function to fetch manga from MangaDex
async function fetchMangaFromMangaDex(mangaId: string) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=author&includes[]=artist&includes[]=cover_art`);
    
    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result !== 'ok') {
      throw new Error('Invalid manga data from MangaDex');
    }

    const manga = data.data;
    
    // Get cover art URL
    const coverRelationship = data.data.relationships?.find(rel => rel.type === 'cover_art');
    let coverUrl = null;
    
    if (coverRelationship) {
      try {
        const coverResponse = await fetch(`https://api.mangadex.org/cover/${coverRelationship.id}`);
        const coverData = await coverResponse.json();
        
        if (coverData.result === 'ok') {
          const fileName = coverData.data.attributes.fileName;
          coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
        }
      } catch (error) {
        console.error('Error fetching cover art:', error);
      }
    }

    return {
      title: manga.attributes.title,
      description: manga.attributes.description,
      authors: data.data.relationships?.filter(rel => rel.type === 'author') || [],
      artists: data.data.relationships?.filter(rel => rel.type === 'artist') || [],
      tags: manga.attributes.tags || [],
      altTitles: manga.attributes.altTitles || {},
      contentRating: manga.attributes.contentRating,
      coverUrl
    };

  } catch (error) {
    console.error('Error fetching from MangaDex:', error);
    return null;
  }
}

// Helper function to search MangaDex
async function searchMangaDex(query: string, limit: number) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=${limit}&includes[]=cover_art`);
    
    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result !== 'ok') {
      throw new Error('Invalid search data from MangaDex');
    }

    const results = data.data.map(manga => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description?.en || '',
      status: manga.attributes.status,
      year: manga.attributes.year,
      contentRating: manga.attributes.contentRating,
      // Note: You'd need to fetch cover art separately for each result
    }));

    return results;

  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return [];
  }
}

// Helper function to download cover art
async function downloadCoverArt(url: string, seriesPath: string, title: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch cover art: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension
    let extension = 'jpg';
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('png')) {
      extension = 'png';
    } else if (contentType?.includes('webp')) {
      extension = 'webp';
    }

    const filename = `cover.${extension}`;
    const filePath = path.join(seriesPath, filename);

    fs.writeFileSync(filePath, buffer);

    return {
      path: filePath,
      filename: filename,
      size: buffer.length
    };

  } catch (error) {
    console.error('Error downloading cover art:', error);
    throw error;
  }
}

