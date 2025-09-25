import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST /api/dexi/covers - Upload or update cover art for a series
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const seriesName = formData.get('seriesName') as string;
    const coverFile = formData.get('coverFile') as File;
    const coverUrl = formData.get('coverUrl') as string;

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

    let coverImageName = null;

    // Handle file upload
    if (coverFile) {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Determine file extension
      const extension = coverFile.name.split('.').pop() || 'jpg';
      const filename = `cover.${extension}`;
      const filePath = path.join(seriesPath, filename);

      fs.writeFileSync(filePath, buffer);
      coverImageName = filename;
    }
    // Handle URL download
    else if (coverUrl) {
      try {
        const response = await fetch(coverUrl);
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
          coverImageName = filename;
        }
      } catch (error) {
        console.error('Error downloading cover:', error);
      }
    }

    // Update metadata.json if cover was successfully added
    if (coverImageName) {
      const metadataPath = path.join(seriesPath, 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          metadata.coverImage = coverImageName;
          metadata.updatedAt = new Date().toISOString();
          
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
        } catch (error) {
          console.error('Error updating metadata:', error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cover art updated successfully',
      coverImage: coverImageName
    });

  } catch (error) {
    console.error('Error updating cover art:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cover art' },
      { status: 500 }
    );
  }
}

// GET /api/dexi/covers - Get cover art suggestions or list current covers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seriesName = searchParams.get('seriesName');

    if (seriesName) {
      // Get cover for specific series
      const seriesPath = path.join(process.cwd(), 'series', seriesName);
      if (fs.existsSync(seriesPath)) {
        const metadataPath = path.join(seriesPath, 'metadata.json');
        let metadata = {};
        
        if (fs.existsSync(metadataPath)) {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        }

        // Check for cover files
        const coverFiles = fs.readdirSync(seriesPath)
          .filter(file => file.startsWith('cover.'))
          .map(file => ({
            filename: file,
            path: `/series/${seriesName}/${file}`,
            size: fs.statSync(path.join(seriesPath, file)).size
          }));

        return NextResponse.json({
          success: true,
          series: seriesName,
          metadata,
          covers: coverFiles
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Series not found' },
          { status: 404 }
        );
      }
    } else {
      // List all series with their cover status
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
            coverFiles,
            coverImage: metadata.coverImage
          });
        }
      }

      return NextResponse.json({
        success: true,
        series,
        total: series.length
      });
    }

  } catch (error) {
    console.error('Error getting cover info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cover info' },
      { status: 500 }
    );
  }
}

