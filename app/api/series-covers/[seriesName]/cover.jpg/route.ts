import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const seriesName = decodeURIComponent(params.seriesName);
    
    // Try .jpg, .jpeg, and .png extensions
    const coverPathJpg = path.join(process.cwd(), 'series', seriesName, 'cover.jpg');
    const coverPathJpeg = path.join(process.cwd(), 'series', seriesName, 'cover.jpeg');
    const coverPathPng = path.join(process.cwd(), 'series', seriesName, 'cover.png');
    
    let coverPath = '';
    let contentType = 'image/jpeg';
    
    if (fs.existsSync(coverPathJpg)) {
      coverPath = coverPathJpg;
      contentType = 'image/jpeg';
    } else if (fs.existsSync(coverPathJpeg)) {
      coverPath = coverPathJpeg;
      contentType = 'image/jpeg';
    } else if (fs.existsSync(coverPathPng)) {
      coverPath = coverPathPng;
      contentType = 'image/png';
    } else {
      // Return a default placeholder image (SVG)
      const placeholderSvg = `
        <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="400" fill="#f0f0f0"/>
          <text x="150" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">
            No Cover Available
          </text>
          <text x="150" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#999">
            ${seriesName}
          </text>
        </svg>
      `;
      
      return new NextResponse(placeholderSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Read the cover image
    const coverBuffer = fs.readFileSync(coverPath);
    
    // Return the image with appropriate headers
    return new NextResponse(coverBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving cover:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
