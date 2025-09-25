import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// GET /api/series-manager/[seriesName]/volumes/[volumeName] - Get specific volume details
export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string; volumeName: string } }
) {
  try {
    const { seriesName, volumeName } = params;
    const volumePath = path.join(process.cwd(), 'series', seriesName, 'volumes', volumeName);

    if (!fs.existsSync(volumePath)) {
      return NextResponse.json(
        { success: false, error: 'Volume not found' },
        { status: 404 }
      );
    }

    // Read volume metadata
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

    const chapterDetails = chapters.map(chapterFile => {
      const chapterPath = path.join(volumePath, chapterFile);
      try {
        const chapterContent = fs.readFileSync(chapterPath, 'utf-8');
        return JSON.parse(chapterContent);
      } catch (error) {
        console.error(`Error reading chapter ${chapterFile}:`, error);
        return { filename: chapterFile, error: 'Failed to read' };
      }
    });

    return NextResponse.json({
      success: true,
      volume: {
        volumeName,
        metadata,
        chapters: chapterDetails,
        totalChapters: chapterDetails.length
      }
    });

  } catch (error) {
    console.error('Error getting volume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get volume' },
      { status: 500 }
    );
  }
}

// PUT /api/series-manager/[seriesName]/volumes/[volumeName] - Update volume metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { seriesName: string; volumeName: string } }
) {
  try {
    const { seriesName, volumeName } = params;
    const body = await request.json();
    
    const volumePath = path.join(process.cwd(), 'series', seriesName, 'volumes', volumeName);

    if (!fs.existsSync(volumePath)) {
      return NextResponse.json(
        { success: false, error: 'Volume not found' },
        { status: 404 }
      );
    }

    const metadataPath = path.join(volumePath, 'metadata.json');
    
    // Read existing metadata
    let existingMetadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        existingMetadata = JSON.parse(metadataContent);
      } catch (error) {
        console.error(`Error reading existing metadata for ${volumeName}:`, error);
      }
    }

    // Update metadata
    const updatedMetadata = {
      ...existingMetadata,
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Write updated metadata
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(updatedMetadata, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: 'Volume metadata updated successfully',
      metadata: updatedMetadata
    });

  } catch (error) {
    console.error('Error updating volume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update volume' },
      { status: 500 }
    );
  }
}

// DELETE /api/series-manager/[seriesName]/volumes/[volumeName] - Delete volume
export async function DELETE(
  request: NextRequest,
  { params }: { params: { seriesName: string; volumeName: string } }
) {
  try {
    const { seriesName, volumeName } = params;
    const volumePath = path.join(process.cwd(), 'series', seriesName, 'volumes', volumeName);

    if (!fs.existsSync(volumePath)) {
      return NextResponse.json(
        { success: false, error: 'Volume not found' },
        { status: 404 }
      );
    }

    // Remove the entire volume folder
    fs.rmSync(volumePath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: 'Volume deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting volume:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete volume' },
      { status: 500 }
    );
  }
}
