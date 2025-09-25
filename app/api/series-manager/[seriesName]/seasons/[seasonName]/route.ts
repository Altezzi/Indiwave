import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// GET /api/series-manager/[seriesName]/seasons/[seasonName] - Get specific season details
export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string; seasonName: string } }
) {
  try {
    const { seriesName, seasonName } = params;
    const seasonPath = path.join(process.cwd(), 'series', seriesName, 'seasons', seasonName);

    if (!fs.existsSync(seasonPath)) {
      return NextResponse.json(
        { success: false, error: 'Season not found' },
        { status: 404 }
      );
    }

    // Read season metadata
    const metadataPath = path.join(seasonPath, 'metadata.json');
    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        console.error(`Error reading season metadata for ${seasonName}:`, error);
      }
    }

    // Get episodes in this season
    const episodes = fs.readdirSync(seasonPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json');

    const episodeDetails = episodes.map(episodeFile => {
      const episodePath = path.join(seasonPath, episodeFile);
      try {
        const episodeContent = fs.readFileSync(episodePath, 'utf-8');
        return JSON.parse(episodeContent);
      } catch (error) {
        console.error(`Error reading episode ${episodeFile}:`, error);
        return { filename: episodeFile, error: 'Failed to read' };
      }
    });

    return NextResponse.json({
      success: true,
      season: {
        seasonName,
        metadata,
        episodes: episodeDetails,
        totalEpisodes: episodeDetails.length
      }
    });

  } catch (error) {
    console.error('Error getting season:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get season' },
      { status: 500 }
    );
  }
}

// PUT /api/series-manager/[seriesName]/seasons/[seasonName] - Update season metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { seriesName: string; seasonName: string } }
) {
  try {
    const { seriesName, seasonName } = params;
    const body = await request.json();
    
    const seasonPath = path.join(process.cwd(), 'series', seriesName, 'seasons', seasonName);

    if (!fs.existsSync(seasonPath)) {
      return NextResponse.json(
        { success: false, error: 'Season not found' },
        { status: 404 }
      );
    }

    const metadataPath = path.join(seasonPath, 'metadata.json');
    
    // Read existing metadata
    let existingMetadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        existingMetadata = JSON.parse(metadataContent);
      } catch (error) {
        console.error(`Error reading existing metadata for ${seasonName}:`, error);
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
      message: 'Season metadata updated successfully',
      metadata: updatedMetadata
    });

  } catch (error) {
    console.error('Error updating season:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update season' },
      { status: 500 }
    );
  }
}

// DELETE /api/series-manager/[seriesName]/seasons/[seasonName] - Delete season
export async function DELETE(
  request: NextRequest,
  { params }: { params: { seriesName: string; seasonName: string } }
) {
  try {
    const { seriesName, seasonName } = params;
    const seasonPath = path.join(process.cwd(), 'series', seriesName, 'seasons', seasonName);

    if (!fs.existsSync(seasonPath)) {
      return NextResponse.json(
        { success: false, error: 'Season not found' },
        { status: 404 }
      );
    }

    // Remove the entire season folder
    fs.rmSync(seasonPath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: 'Season deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting season:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete season' },
      { status: 500 }
    );
  }
}
