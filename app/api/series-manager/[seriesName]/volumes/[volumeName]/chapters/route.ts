import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// GET /api/series-manager/[seriesName]/volumes/[volumeName]/chapters - List all chapters in volume
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

    // Get all chapter files
    const chapterFiles = fs.readdirSync(volumePath, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json')
      .sort();

    const chapters = chapterFiles.map(chapterFile => {
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
      chapters,
      total: chapters.length
    });

  } catch (error) {
    console.error('Error listing chapters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list chapters' },
      { status: 500 }
    );
  }
}

// POST /api/series-manager/[seriesName]/volumes/[volumeName]/chapters - Add new chapter
export async function POST(
  request: NextRequest,
  { params }: { params: { seriesName: string; volumeName: string } }
) {
  try {
    const { seriesName, volumeName } = params;
    const body = await request.json();
    const { chapterNumber, title, pages, description } = body;

    if (!chapterNumber || !title) {
      return NextResponse.json(
        { success: false, error: 'Chapter number and title are required' },
        { status: 400 }
      );
    }

    const volumePath = path.join(process.cwd(), 'series', seriesName, 'volumes', volumeName);

    if (!fs.existsSync(volumePath)) {
      return NextResponse.json(
        { success: false, error: 'Volume not found' },
        { status: 404 }
      );
    }

    // Create chapter filename
    const chapterFileName = `chapter-${chapterNumber.toString().padStart(3, '0')}.json`;
    const chapterPath = path.join(volumePath, chapterFileName);

    // Check if chapter already exists
    if (fs.existsSync(chapterPath)) {
      return NextResponse.json(
        { success: false, error: 'Chapter already exists' },
        { status: 400 }
      );
    }

    // Create chapter data
    const chapterData = {
      chapterNumber: parseInt(chapterNumber),
      title,
      pages: pages || '',
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Write chapter file
    fs.writeFileSync(
      chapterPath,
      JSON.stringify(chapterData, null, 2)
    );

    // Create database entry
    const dbChapter = await prisma.chapter.create({
      data: {
        title,
        chapterNumber: parseInt(chapterNumber),
        pages: pages || '',
        creatorId: 'system', // You'll need to get this from auth
        isPublished: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Chapter created successfully',
      chapter: {
        ...chapterData,
        id: dbChapter.id,
        filename: chapterFileName
      }
    });

  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
}
