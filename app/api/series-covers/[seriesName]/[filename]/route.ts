import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string; filename: string } }
) {
  try {
    const { seriesName, filename } = params;
    
    // Decode the series name
    const decodedSeriesName = decodeURIComponent(seriesName);
    
    // Try multiple possible locations for the cover
    const possiblePaths = [
      // Check in the series folder first
      path.join(process.cwd(), 'series', decodedSeriesName, filename),
      // Check in public/covers with series name
      path.join(process.cwd(), 'public', 'covers', `${decodedSeriesName}.jpg`),
      path.join(process.cwd(), 'public', 'covers', `${decodedSeriesName}.jpeg`),
      path.join(process.cwd(), 'public', 'covers', `${decodedSeriesName}.png`),
      // Check in public/covers with MangaDex ID pattern
      path.join(process.cwd(), 'public', 'covers', `series_${decodedSeriesName.toLowerCase().replace(/\s+/g, '')}.jpg`),
      path.join(process.cwd(), 'public', 'covers', `series_${decodedSeriesName.toLowerCase().replace(/\s+/g, '')}.jpeg`),
      path.join(process.cwd(), 'public', 'covers', `series_${decodedSeriesName.toLowerCase().replace(/\s+/g, '')}.png`),
    ];
    
    // Find the first existing cover file
    let coverPath = null;
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        coverPath = possiblePath;
        break;
      }
    }
    
    if (!coverPath) {
      // Return placeholder if no cover found
      const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.svg');
      if (fs.existsSync(placeholderPath)) {
        const placeholderBuffer = fs.readFileSync(placeholderPath);
        return new NextResponse(placeholderBuffer, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
      
      return new NextResponse('Cover not found', { status: 404 });
    }
    
    // Read the cover file
    const coverBuffer = fs.readFileSync(coverPath);
    
    // Determine content type based on file extension
    const ext = path.extname(coverPath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    
    return new NextResponse(coverBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
    
  } catch (error) {
    console.error('Error serving cover:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

