import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/series-manager/[seriesName]/seasons - List all seasons for a series
export async function GET(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const seasonsPath = path.join(process.cwd(), 'series', seriesName, 'seasons');

    if (!fs.existsSync(seasonsPath)) {
      return NextResponse.json({
        success: true,
        seasons: []
      });
    }

    const seasonFolders = fs.readdirSync(seasonsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    const seasonsWithDetails = seasonFolders.map(seasonName => {
      const seasonPath = path.join(seasonsPath, seasonName);
      
      // Check for season metadata
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

      return {
        seasonName,
        metadata,
        episodes: episodes.length,
        episodeFiles: episodes
      };
    });

    return NextResponse.json({
      success: true,
      seasons: seasonsWithDetails,
      total: seasonsWithDetails.length
    });

  } catch (error) {
    console.error('Error listing seasons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list seasons' },
      { status: 500 }
    );
  }
}

// POST /api/series-manager/[seriesName]/seasons - Create a new season
export async function POST(
  request: NextRequest,
  { params }: { params: { seriesName: string } }
) {
  try {
    const { seriesName } = params;
    const body = await request.json();
    const { seasonName, title, description } = body;

    if (!seasonName) {
      return NextResponse.json(
        { success: false, error: 'Season name is required' },
        { status: 400 }
      );
    }

    const seriesPath = path.join(process.cwd(), 'series', seriesName);
    const seasonsPath = path.join(seriesPath, 'seasons');
    const newSeasonPath = path.join(seasonsPath, seasonName);

    // Check if series exists
    if (!fs.existsSync(seriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series not found' },
        { status: 404 }
      );
    }

    // Create seasons directory if it doesn't exist
    if (!fs.existsSync(seasonsPath)) {
      fs.mkdirSync(seasonsPath, { recursive: true });
    }

    // Check if season already exists
    if (fs.existsSync(newSeasonPath)) {
      return NextResponse.json(
        { success: false, error: 'Season already exists' },
        { status: 400 }
      );
    }

    // Create season folder
    fs.mkdirSync(newSeasonPath, { recursive: true });

    // Create season metadata
    const metadata = {
      seasonName,
      title: title || seasonName,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(newSeasonPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: 'Season created successfully',
      season: {
        seasonName,
        metadata,
        episodes: 0
      }
    });

  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create season' },
      { status: 500 }
    );
  }
}
