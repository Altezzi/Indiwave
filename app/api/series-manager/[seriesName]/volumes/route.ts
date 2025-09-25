import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/series-manager/[seriesName]/volumes - List all volumes for a series
export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const volumesPath = path.join(process.cwd(), 'series', seriesName, 'volumes');

    if (!fs.existsSync(volumesPath)) {
      return NextResponse.json({
        success: true,
        volumes: []
      });
    }

    const volumeFolders = fs.readdirSync(volumesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    const volumesWithDetails = volumeFolders.map(volumeName => {
      const volumePath = path.join(volumesPath, volumeName);
      
      // Check for volume metadata
      const metadataPath = path.join(volumePath, 'metadata.json');
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent);
        } catch (error) {
          console.error(`Error reading volume metadata for ${volumeName}:`, error);
        }
      }

      // Get chapters in this volume
      const chapters = fs.readdirSync(volumePath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)
        .filter(file => file.endsWith('.json') && file !== 'metadata.json');

      return {
        volumeName,
        metadata,
        chapters: chapters.length,
        chapterFiles: chapters
      };
    });

    return NextResponse.json({
      success: true,
      volumes: volumesWithDetails,
      total: volumesWithDetails.length
    });

  } catch (error) {
    console.error('Error listing volumes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list volumes' },
      { status: 500 }
    );
  }
}

// POST /api/series-manager/[seriesName]/volumes - Create a new volume
export async function POST(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const body = await request.json();
    const { volumeName, title, description } = body;

    if (!volumeName) {
      return NextResponse.json(
        { success: false, error: 'Volume name is required' },
        { status: 400 }
      );
    }

    const seriesPath = path.join(process.cwd(), 'series', seriesName);
    const volumesPath = path.join(seriesPath, 'volumes');
    const newVolumePath = path.join(volumesPath, volumeName);

    // Check if series exists
    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    // Create volumes directory if it doesn't exist
    if (!fs.existsSync(volumesPath)) {
      fs.mkdirSync(volumesPath, { recursive: true });
    }

    // Check if volume already exists
    if (fs.existsSync(newVolumePath)) {
      return NextResponse.json(
        { success: false, error: 'Volume already exists' },
        { status: 400 }
      );
    }

    // Create volume folder
    fs.mkdirSync(newVolumePath, { recursive: true });

    // Create volume metadata
    const metadata = {
      volumeName,
      title: title || volumeName,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(newVolumePath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: 'Volume created successfully',
      volume: {
        volumeName,
        metadata,
        chapters: 0
      }
    });

  } catch (error) {
    console.error('Error creating volume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create volume' },
      { status: 500 }
    );
  }
}
