import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST /api/dexi/real-covers - Get real manga covers from MangaDex
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seriesName, mangaId } = body;

    if (!seriesName || !mangaId) {
      return NextResponse.json(
        { success: false, error: 'Series name and MangaDex ID are required' },
        { status: 400 }
      );
    }

    const seriesPath = path.join(process.cwd(), 'series', seriesName);

    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    // Fetch manga data from MangaDex API
    const mangaData = await fetchMangaFromMangaDex(mangaId);
    
    if (!mangaData) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch manga data from MangaDex' },
        { status: 404 }
      );
    }

    // Get cover art URL
    const coverUrl = mangaData.coverUrl;
    
    if (!coverUrl) {
      return NextResponse.json(
        { success: false, error: 'No cover art found for this manga' },
        { status: 404 }
      );
    }

    // Download and save the cover art
    try {
      const response = await fetch(coverUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
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

      // Remove existing cover files
      const existingCovers = fs.readdirSync(seriesPath)
        .filter(file => file.startsWith('cover.'));
      for (const coverFile of existingCovers) {
        fs.unlinkSync(path.join(seriesPath, coverFile));
      }

      // Write new cover file
      fs.writeFileSync(filePath, buffer);

      // Update metadata.json
      const metadataPath = path.join(seriesPath, 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          metadata.coverImage = filename;
          metadata.mangaDexId = mangaId;
          metadata.updatedAt = new Date().toISOString();
          
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        } catch (error) {
          console.error('Error updating metadata:', error);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Real manga cover downloaded successfully',
        coverImage: filename,
        mangaTitle: mangaData.title,
        coverUrl: coverUrl,
        fileSize: buffer.length
      });

    } catch (error) {
      console.error('Error downloading cover art:', error);
      return NextResponse.json(
        { success: false, error: `Failed to download cover: ${error.message}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error getting real cover:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get real cover' },
      { status: 500 }
    );
  }
}

// Helper function to fetch manga from MangaDex
async function fetchMangaFromMangaDex(mangaId: string) {
  try {
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

    const manga = data.data;
    
    // Get cover art URL
    const coverRelationship = data.data.relationships?.find(rel => rel.type === 'cover_art');
    let coverUrl = null;
    
    if (coverRelationship) {
      try {
        const coverResponse = await fetch(`https://api.mangadex.org/cover/${coverRelationship.id}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const coverData = await coverResponse.json();
        
        if (coverData.result === 'ok') {
          const fileName = coverData.data.attributes.fileName;
          coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
        }
      } catch (error) {
        console.error('Error fetching cover art details:', error);
      }
    }

    return {
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      coverUrl
    };

  } catch (error) {
    console.error('Error fetching from MangaDex:', error);
    return null;
  }
}
