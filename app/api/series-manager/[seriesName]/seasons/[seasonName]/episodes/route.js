import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../../../../lib/prisma';

// GET /api/series-manager/[seriesName]/seasons/[seasonName]/episodes - List all episodes in season
export async function GET(request, { params }) {
  try {
    const { seriesName, seasonName } = params;
    const seasonPath = path.join(process.cwd(), 'series', seriesName, 'seasons', seasonName);

    if (!fs.existsSync(seasonPath)) {
      return NextResponse.json(
        { success: false, error: 'Season not found' },
        { status: 404 }
      );
    }

    // Get all episode files
    const episodeFiles = fs.readdirSync(seasonPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json')
      .sort();

    const episodes = episodeFiles.map(episodeFile => {
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
      episodes,
      total: episodes.length
    });

  } catch (error) {
    console.error('Error listing episodes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list episodes' },
      { status: 500 }
    );
  }
}

// POST /api/series-manager/[seriesName]/seasons/[seasonName]/episodes - Add new episode
export async function POST(request, { params }) {
  try {
    const { seriesName, seasonName } = params;
    const body = await request.json();
    const { episodeNumber, title, duration, description } = body;

    if (!episodeNumber || !title) {
      return NextResponse.json(
        { success: false, error: 'Episode number and title are required' },
        { status: 400 }
      );
    }

    const seasonPath = path.join(process.cwd(), 'series', seriesName, 'seasons', seasonName);

    if (!fs.existsSync(seasonPath)) {
      return NextResponse.json(
        { success: false, error: 'Season not found' },
        { status: 404 }
      );
    }

    // Create episode filename
    const episodeFileName = `episode-${episodeNumber.toString().padStart(3, '0')}.json`;
    const episodePath = path.join(seasonPath, episodeFileName);

    // Check if episode already exists
    if (fs.existsSync(episodePath)) {
      return NextResponse.json(
        { success: false, error: 'Episode already exists' },
        { status: 400 }
      );
    }

    // Create episode data
    const episodeData = {
      episodeNumber: parseInt(episodeNumber),
      title,
      duration: duration || '',
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Write episode file
    fs.writeFileSync(
      episodePath,
      JSON.stringify(episodeData, null, 2)
    );

    // Create database entry (using Chapter model for episodes)
    const dbEpisode = await prisma.chapter.create({
      data: {
        title,
        chapterNumber: parseInt(episodeNumber),
        creatorId: 'system', // You'll need to get this from auth
        isPublished: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Episode created successfully',
      episode: {
        ...episodeData,
        id: dbEpisode.id,
        filename: episodeFileName
      }
    });

  } catch (error) {
    console.error('Error creating episode:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create episode' },
      { status: 500 }
    );
  }
}
