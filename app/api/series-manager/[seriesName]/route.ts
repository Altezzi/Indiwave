import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/series-manager/[seriesName] - Get specific series details
export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const seriesPath = path.join(process.cwd(), 'series', seriesName);

    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    // Read metadata
    const metadataPath = path.join(seriesPath, 'metadata.json');
    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        console.error(`Error reading metadata for ${seriesName}:`, error);
      }
    }

    // Get volumes
    const volumesPath = path.join(seriesPath, 'volumes');
    const volumes = fs.existsSync(volumesPath)
      ? fs.readdirSync(volumesPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .sort()
      : [];

    // Get seasons
    const seasonsPath = path.join(seriesPath, 'seasons');
    const seasons = fs.existsSync(seasonsPath)
      ? fs.readdirSync(seasonsPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
          .sort()
      : [];

    return NextResponse.json({
      success: true,
      series: {
        folderName: seriesName,
        metadata,
        volumes,
        seasons
      }
    });

  } catch (error) {
    console.error('Error getting series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get series' },
      { status: 500 }
    );
  }
}

// PUT /api/series-manager/[seriesName] - Update series metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const body = await request.json();
    
    const seriesPath = path.join(process.cwd(), 'series', seriesName);

    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    const metadataPath = path.join(seriesPath, 'metadata.json');
    
    // Read existing metadata
    let existingMetadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        existingMetadata = JSON.parse(metadataContent);
      } catch (error) {
        console.error(`Error reading existing metadata for ${seriesName}:`, error);
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
      message: 'Series metadata updated successfully',
      metadata: updatedMetadata
    });

  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update series' },
      { status: 500 }
    );
  }
}

// DELETE /api/series-manager/[seriesName] - Delete series
export async function DELETE(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const seriesPath = path.join(process.cwd(), 'series', seriesName);

    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    // Remove the entire series folder
    fs.rmSync(seriesPath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: 'Series deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete series' },
      { status: 500 }
    );
  }
}
