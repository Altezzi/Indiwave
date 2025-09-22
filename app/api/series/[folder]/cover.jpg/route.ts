import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string } }
) {
  try {
    const folderName = decodeURIComponent(params.folder);
    const coverPath = path.join(process.cwd(), 'series', folderName, 'cover.jpg');
    
    // Check if cover file exists
    if (!fs.existsSync(coverPath)) {
      return new NextResponse('Cover not found', { status: 404 });
    }
    
    // Read the cover file
    const coverBuffer = fs.readFileSync(coverPath);
    
    // Return the image with proper headers
    return new NextResponse(coverBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving cover image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
