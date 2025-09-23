import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { series: string } }
) {
  try {
    const seriesName = decodeURIComponent(params.series);
    const seriesDir = path.join(process.cwd(), 'series', seriesName);
    const metadataPath = path.join(seriesDir, 'metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      return new NextResponse('Series not found', { status: 404 });
    }
    
    const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    
    const coverPath = path.join(seriesDir, metadata.coverImage);
    
    if (!fs.existsSync(coverPath)) {
      return new NextResponse('Cover image not found', { status: 404 });
    }
    
    const imageBuffer = fs.readFileSync(coverPath);
    const ext = path.extname(metadata.coverImage).toLowerCase();
    
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.webp') contentType = 'image/webp';
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error) {
    console.error('Error serving cover image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
