import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST /api/dexi - Import manga/manhwa with automatic cover art (DEXI Import System)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      author,
      artist,
      publisher,
      coverImageUrl,
      publisherLinks = [],
      tags = [],
      contentRating = 'safe',
      altTitles = [],
      source = 'manual', // manual, mangadex, etc.
      autoSearchCovers = true // New option to automatically search for covers
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Sanitize folder name
    const sanitizedFolderName = title
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

    let coverImagePath = null;
    let coverImageName = null;
    let mangaDexId = null;

    // Try to find and download cover art automatically
    if (autoSearchCovers) {
      try {
        console.log(`🔍 Searching MangaDex for: ${title}`);
        const searchResult = await searchMangaDex(title);
        
        if (searchResult && searchResult.length > 0) {
          // Use the first (most relevant) result
          const manga = searchResult[0];
          mangaDexId = manga.id;
          
          console.log(`✅ Found MangaDex entry: ${manga.title} (ID: ${mangaDexId})`);
          
          // Download the cover art
          const coverResult = await downloadMangaDexCover(mangaDexId, newSeriesPath, title);
          if (coverResult) {
            coverImagePath = coverResult.path;
            coverImageName = coverResult.filename;
            console.log(`🎨 Downloaded cover art: ${coverImageName}`);
          }
        } else {
          console.log(`⚠️ No MangaDex results found for: ${title}`);
        }
      } catch (error) {
        console.error('Error with automatic cover search:', error);
      }
    }

    // Fallback to provided cover URL if auto-search failed
    if (!coverImageName && coverImageUrl) {
      try {
        console.log(`🖼️ Using provided cover URL: ${coverImageUrl}`);
        const coverResult = await downloadCoverArt(coverImageUrl, newSeriesPath, title);
        coverImagePath = coverResult.path;
        coverImageName = coverResult.filename;
      } catch (error) {
        console.error('Error downloading provided cover art:', error);
        // Continue without cover art rather than failing
      }
    }

    // Create metadata.json
    const metadata = {
      title,
      description,
      author,
      artist,
      publisher,
      publisherLinks,
      tags,
      contentRating,
      altTitles,
      coverImage: coverImageName, // Store local filename, not URL
      source,
      mangaDexId, // Store MangaDex ID if found
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(newSeriesPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // TODO: Create database entry when ready
    // const dbSeries = await prisma.series.create({...});

    return NextResponse.json({
      success: true,
      message: 'Series imported successfully via DEXI with automatic cover art',
      series: {
        folderName: sanitizedFolderName,
        metadata,
        coverImage: coverImageName,
        mangaDexId,
        autoSearchUsed: autoSearchCovers && !!mangaDexId,
        id: 'temp-id' // Will be replaced with actual DB ID
      }
    });

  } catch (error) {
    console.error('Error importing series via DEXI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import series via DEXI' },
      { status: 500 }
    );
  }
}

// GET /api/dexi - List imported series or get DEXI status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        dexi: {
          name: 'DEXI Import System',
          version: '1.0.0',
          status: 'active',
          description: 'Manga/Manhwa import system with cover art management'
        }
      });
    }

    // List all series imported via DEXI
    const seriesDir = path.join(process.cwd(), 'series');
    const series = [];

    if (fs.existsSync(seriesDir)) {
      const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const folderName of seriesFolders) {
        const metadataPath = path.join(seriesDir, folderName, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            series.push({
              folderName,
              title: metadata.title,
              source: metadata.source || 'unknown',
              hasCover: !!metadata.coverImage,
              createdAt: metadata.createdAt
            });
          } catch (error) {
            console.error(`Error reading metadata for ${folderName}:`, error);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      dexi: {
        importedSeries: series,
        total: series.length
      }
    });

  } catch (error) {
    console.error('Error getting DEXI data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get DEXI data' },
      { status: 500 }
    );
  }
}

// Helper function to search MangaDex for a manga title
async function searchMangaDex(title: string) {
  try {
    const response = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5`, {
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

    return data.data.map((manga: any) => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description?.en || manga.attributes.description,
      year: manga.attributes.year,
      status: manga.attributes.status,
      tags: manga.attributes.tags?.map((tag: any) => tag.attributes.name.en) || []
    }));

  } catch (error) {
    console.error('Error searching MangaDex:', error);
    return null;
  }
}

// Helper function to download cover art from MangaDex
async function downloadMangaDexCover(mangaId: string, seriesPath: string, title: string) {
  try {
    // Fetch manga data with cover art relationship
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MangaDex API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.result !== 'ok') {
      throw new Error('Invalid manga data from MangaDex');
    }

    // Get cover art URL
    const coverRelationship = data.data.relationships?.find((rel: any) => rel.type === 'cover_art');
    if (!coverRelationship) {
      throw new Error('No cover art found for this manga');
    }

    // Get cover art details
    const coverResponse = await fetch(`https://api.mangadex.org/cover/${coverRelationship.id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const coverData = await coverResponse.json();
    
    if (coverData.result !== 'ok') {
      throw new Error('Failed to get cover art details');
    }

    const fileName = coverData.data.attributes.fileName;
    const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

    // Download the cover image
    const imageResponse = await fetch(coverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download cover: ${imageResponse.statusText}`);
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension
    let extension = 'jpg';
    const contentType = imageResponse.headers.get('content-type');
    if (contentType?.includes('png')) {
      extension = 'png';
    } else if (contentType?.includes('webp')) {
      extension = 'webp';
    }

    const filename = `cover.${extension}`;
    const filePath = path.join(seriesPath, filename);

    // Write cover art file
    fs.writeFileSync(filePath, buffer);

    return {
      path: filePath,
      filename: filename,
      size: buffer.length,
      url: coverUrl
    };

  } catch (error) {
    console.error('Error downloading MangaDex cover art:', error);
    return null;
  }
}

// Helper function to download cover art from URL
async function downloadCoverArt(url: string, seriesPath: string, title: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch cover art: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine file extension from URL or content type
    let extension = 'jpg';
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('png')) {
      extension = 'png';
    } else if (contentType?.includes('webp')) {
      extension = 'webp';
    } else if (contentType?.includes('jpeg') || contentType?.includes('jpg')) {
      extension = 'jpg';
    }

    // Create safe filename
    const filename = `cover.${extension}`;
    const filePath = path.join(seriesPath, filename);

    // Write cover art file
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
