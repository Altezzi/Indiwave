import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST /api/dexi/update-covers - Update cover art for existing series
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seriesName, coverUrl, removePlaceholder } = body;

    if (!seriesName) {
      return NextResponse.json(
        { success: false, error: 'Series name is required' },
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

    let result = { message: '', coverImage: null };

    // Remove placeholder covers if requested
    if (removePlaceholder) {
      const existingCovers = fs.readdirSync(seriesPath)
        .filter(file => file.startsWith('cover.'));
      
      for (const coverFile of existingCovers) {
        fs.unlinkSync(path.join(seriesPath, coverFile));
      }
      
      result.message = 'Placeholder covers removed';
    }

    // Download new cover if URL provided
    if (coverUrl) {
      try {
        const response = await fetch(coverUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
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
          result.coverImage = filename;
          result.message += (result.message ? '; ' : '') + 'New cover downloaded';
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('Error downloading cover:', error);
        result.message += (result.message ? '; ' : '') + `Failed to download cover: ${error.message}`;
      }
    }

    // Update metadata.json
    const metadataPath = path.join(seriesPath, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        metadata.coverImage = result.coverImage || null;
        metadata.updatedAt = new Date().toISOString();
        
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      } catch (error) {
        console.error('Error updating metadata:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'Cover updated successfully',
      coverImage: result.coverImage
    });

  } catch (error) {
    console.error('Error updating cover:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cover' },
      { status: 500 }
    );
  }
}

// GET /api/dexi/update-covers - Get cover art suggestions for popular manga
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'suggestions') {
      // Provide some popular manga cover URLs (these are example URLs - you'd replace with real ones)
      const suggestions = {
        'One Piece': 'https://example.com/one-piece-cover.jpg',
        'Naruto': 'https://example.com/naruto-cover.jpg',
        'Dragon Ball': 'https://example.com/dragon-ball-cover.jpg',
        'Demon Slayer': 'https://example.com/demon-slayer-cover.jpg',
        'My Hero Academia': 'https://example.com/mha-cover.jpg',
        'Jujutsu Kaisen': 'https://example.com/jjk-cover.jpg'
      };

      return NextResponse.json({
        success: true,
        message: 'Cover art suggestions',
        suggestions,
        note: 'Replace these URLs with actual manga cover art URLs from official sources'
      });
    }

    // Default: list all series and their cover status
    const seriesDir = path.join(process.cwd(), 'series');
    const series = [];

    if (fs.existsSync(seriesDir)) {
      const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const folderName of seriesFolders) {
        const metadataPath = path.join(seriesDir, folderName, 'metadata.json');
        let metadata = {};
        
        if (fs.existsSync(metadataPath)) {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        }

        const coverFiles = fs.readdirSync(path.join(seriesDir, folderName))
          .filter(file => file.startsWith('cover.'));

        series.push({
          folderName,
          title: metadata.title || folderName,
          hasCover: coverFiles.length > 0,
          coverImage: metadata.coverImage,
          needsRealCover: coverFiles.length > 0 && metadata.source === 'manual'
        });
      }
    }

    return NextResponse.json({
      success: true,
      series,
      total: series.length,
      message: 'Use POST to update covers with real manga cover art URLs'
    });

  } catch (error) {
    console.error('Error getting cover suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cover suggestions' },
      { status: 500 }
    );
  }
}

