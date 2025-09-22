import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { comicId: string } }
) {
  try {
    const { comicId } = params;

    // First, try to find in series folders
    const seriesDir = path.join(process.cwd(), 'series');
    let comicFromFolder = null;

    if (fs.existsSync(seriesDir)) {
      const seriesFolders = fs.readdirSync(seriesDir)
        .filter(item => {
          const itemPath = path.join(seriesDir, item);
          return fs.statSync(itemPath).isDirectory();
        });

      for (const folderName of seriesFolders) {
        const seriesFolder = path.join(seriesDir, folderName);
        const metadataPath = path.join(seriesFolder, 'metadata.json');
        const chaptersPath = path.join(seriesFolder, 'chapters.json');
        
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            
            // Check if this is the comic we're looking for
            if (metadata.mangaMDId === comicId || folderName === comicId) {
              // Read chapters if available
              let chapters = [];
              if (fs.existsSync(chaptersPath)) {
                chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
              }

              // Transform to comic format
              comicFromFolder = {
                id: metadata.mangaMDId || folderName,
                title: metadata.title,
                series: metadata.title,
                description: metadata.description || '',
                cover: metadata.coverImage || '',
                coverImage: metadata.coverImage || '',
                author: metadata.authors?.[0] || '',
                artist: metadata.artists?.[0] || '',
                authors: metadata.authors || [],
                artists: metadata.artists || [],
                year: metadata.year || new Date().getFullYear(),
                tags: metadata.tags || [],
                mangaMDStatus: metadata.status || 'ongoing',
                isImported: true,
                contentRating: metadata.contentRating || 'safe',
                creator: {
                  id: 'system',
                  name: 'System Import',
                  username: 'system'
                },
                chapters: chapters.map((chapter: any) => ({
                  id: chapter.id,
                  title: chapter.title,
                  chapterNumber: chapter.chapterNumber || 0,
                  pages: chapter.pages || 0,
                })),
                libraryCount: 0,
                createdAt: metadata.createdAt || new Date().toISOString(),
                updatedAt: metadata.updatedAt || new Date().toISOString(),
              };
              break;
            }
          } catch (error) {
            console.warn(`Error reading metadata for ${folderName}:`, error);
          }
        }
      }
    }

    // If found in series folder, return it
    if (comicFromFolder) {
      return NextResponse.json({
        comic: comicFromFolder
      });
    }

    // Otherwise, try to find in database
    const series = await prisma.series.findFirst({
      where: {
        OR: [
          { id: comicId },
          { mangaMDId: comicId }
        ],
        isPublished: true
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          }
        },
        chapters: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            pages: true,
          },
          orderBy: { chapterNumber: 'asc' }
        },
        _count: {
          select: {
            libraryEntries: true,
          }
        }
      }
    });

    if (!series) {
      return NextResponse.json(
        { error: 'Comic not found' },
        { status: 404 }
      );
    }

    // Transform database series to comic format
    const comic = {
      id: series.id,
      title: series.title,
      series: series.title,
      description: series.description,
      cover: series.coverImage,
      coverImage: series.coverImage,
      author: series.authors ? (() => {
        try { return JSON.parse(series.authors)[0]; } catch { return undefined; }
      })() : undefined,
      artist: series.artists ? (() => {
        try { return JSON.parse(series.artists)[0]; } catch { return undefined; }
      })() : undefined,
      authors: series.authors,
      artists: series.artists,
      year: series.mangaMDYear || new Date(series.createdAt).getFullYear(),
      tags: series.tags ? (() => {
        try { return JSON.parse(series.tags); } catch { return []; }
      })() : [],
      mangaMDStatus: series.mangaMDStatus,
      isImported: series.isImported,
      contentRating: series.contentRating,
      creator: series.creator,
      chapters: series.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        pages: chapter.pages ? (() => {
          try { return JSON.parse(chapter.pages); } catch { return []; }
        })() : [],
      })),
      libraryCount: series._count.libraryEntries,
      createdAt: series.createdAt,
    };

    return NextResponse.json({
      comic
    });

  } catch (error) {
    console.error('Error fetching comic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
