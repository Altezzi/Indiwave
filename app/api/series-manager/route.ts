import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// GET /api/series-manager - List all series with their metadata
export async function GET(request: NextRequest) {
  try {
    const seriesDir = path.join(process.cwd(), 'series');
    
    if (!fs.existsSync(seriesDir)) {
      return NextResponse.json({ series: [] });
    }

    const seriesFolders = fs.readdirSync(seriesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const seriesWithMetadata = [];

    for (const folderName of seriesFolders) {
      const seriesPath = path.join(seriesDir, folderName);
      const metadataPath = path.join(seriesPath, 'metadata.json');
      
      let metadata = {};
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataContent);
        } catch (error) {
          console.error(`Error reading metadata for ${folderName}:`, error);
        }
      }

      // Check for volumes and seasons folders
      const volumesPath = path.join(seriesPath, 'volumes');
      const seasonsPath = path.join(seriesPath, 'seasons');
      
      const volumes = fs.existsSync(volumesPath) 
        ? fs.readdirSync(volumesPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort()
        : [];
        
      const seasons = fs.existsSync(seasonsPath)
        ? fs.readdirSync(seasonsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort()
        : [];

      seriesWithMetadata.push({
        folderName,
        metadata,
        volumes,
        seasons,
        hasVolumes: volumes.length > 0,
        hasSeasons: seasons.length > 0
      });
    }

    return NextResponse.json({
      success: true,
      series: seriesWithMetadata,
      total: seriesWithMetadata.length
    });

  } catch (error) {
    console.error('Error listing series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list series' },
      { status: 500 }
    );
  }
}

// POST /api/series-manager - Create a new series with metadata
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      author,
      artist,
      publisher,
      publisherLinks = [],
      tags = [],
      contentRating = 'safe',
      altTitles = []
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Sanitize folder name (remove invalid characters)
    const sanitizedFolderName = title
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    const seriesDir = path.join(process.cwd(), 'series');
    const newSeriesPath = path.join(seriesDir, sanitizedFolderName);

    // Check if series already exists
    if (fs.existsSync(newSeriesPath)) {
      return NextResponse.json(
        { success: false, error: 'Series already exists' },
        { status: 400 }
      );
    }

    // Create series folder structure
    fs.mkdirSync(newSeriesPath, { recursive: true });
    fs.mkdirSync(path.join(newSeriesPath, 'volumes'), { recursive: true });
    fs.mkdirSync(path.join(newSeriesPath, 'seasons'), { recursive: true });

    // Create metadata.json
    const metadata = {
      title,
      description,
      author,
      artist,
      publisher,
      publisherLinks,
      tags,
      contentRating,
      altTitles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(newSeriesPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Create database entry to sync with local files
    const dbSeries = await prisma.series.create({
      data: {
        title,
        description,
        contentRating,
        tags: JSON.stringify(tags),
        authors: author,
        artists: artist,
        altTitles: JSON.stringify(altTitles),
        creatorId: 'system', // You'll need to get this from auth
        isPublished: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Series created successfully',
      series: {
        folderName: sanitizedFolderName,
        metadata,
        volumes: [],
        seasons: []
      }
    });

  } catch (error) {
    console.error('Error creating series:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create series' },
      { status: 500 }
    );
  }
}
