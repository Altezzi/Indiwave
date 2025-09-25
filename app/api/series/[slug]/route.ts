import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

type Params = { params: { slug: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    console.log('Series API called with slug:', params.slug);
    
    let series = await prisma.series.findFirst({
      where: { 
        id: params.slug, // Use ID directly since we don't have slug field
        isPublished: true
      },
      include: { 
        chapters: { 
          where: { isPublished: true },
          orderBy: { chapterNumber: 'asc' },
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            pages: true,
            isPublished: true,
            createdAt: true
          }
        },
        volumes: {
          where: { isPublished: true },
          orderBy: { volumeNumber: 'asc' },
          select: {
            id: true,
            title: true,
            volumeNumber: true,
            coverImage: true,
            description: true,
            createdAt: true,
            chapters: {
              where: { isPublished: true },
              orderBy: { chapterNumber: 'asc' },
              select: {
                id: true,
                title: true,
                chapterNumber: true,
                pages: true,
                isPublished: true,
                createdAt: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      },
    });
    
    // If not found in database, try to find in file system
    if (!series) {
      const seriesDir = path.join(process.cwd(), 'series');
      const seriesFolder = path.join(seriesDir, params.slug);
      
      if (fs.existsSync(seriesFolder)) {
        const metadataPath = path.join(seriesFolder, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            
            // Create a mock series object from file system data
            series = {
              id: params.slug,
              title: metadata.title || params.slug,
              description: metadata.description || '',
              coverImage: `/api/series-covers/${encodeURIComponent(params.slug)}/cover.jpg`,
              authors: metadata.author || '',
              artists: metadata.artist || '',
              year: metadata.year || new Date().getFullYear(),
              tags: metadata.tags ? metadata.tags.join(',') : '',
              status: metadata.status || 'ongoing',
              contentRating: metadata.contentRating || 'safe',
              creator: {
                id: 'system',
                name: 'System',
                username: 'system'
              },
              chapters: [],
              volumes: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              // Include user-submitted reading links
              userReadingLinks: metadata.userReadingLinks || []
            };
          } catch (error) {
            console.error('Error reading metadata from file system:', error);
            return new NextResponse('Series not found', { status: 404 });
          }
        } else {
          return new NextResponse('Series not found', { status: 404 });
        }
      } else {
        return new NextResponse('Series not found', { status: 404 });
      }
    }

    // Transform to comic format for compatibility
    const comic = {
      id: series.id,
      title: series.title,
      series: series.title,
      description: series.description || '',
      cover: series.coverImage || null,
      coverImage: series.coverImage || null,
      author: series.authors || '',
      artist: series.artists || '',
      authors: series.authors ? [series.authors] : [],
      artists: series.artists ? [series.artists] : [],
      year: series.year || new Date().getFullYear(),
      tags: series.tags ? series.tags.split(',').map(tag => tag.trim()) : [],
      status: series.status || 'ongoing',
      contentRating: series.contentRating || 'safe',
      creator: {
        id: series.creator.id,
        name: series.creator.name || 'Unknown',
        username: series.creator.username || 'unknown'
      },
      chapters: series.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        pages: chapter.pages ? chapter.pages.split(',').length : 0,
        isPublished: chapter.isPublished,
        createdAt: chapter.createdAt
      })),
      volumes: series.volumes.map(volume => ({
        id: volume.id,
        title: volume.title,
        volumeNumber: volume.volumeNumber,
        coverImage: volume.coverImage || null,
        description: volume.description || '',
        createdAt: volume.createdAt,
        chapters: volume.chapters.map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          chapterNumber: chapter.chapterNumber,
          pages: chapter.pages ? chapter.pages.split(',').length : 0,
          isPublished: chapter.isPublished,
          createdAt: chapter.createdAt
        })),
        totalChapters: volume.chapters.length
      })),
      totalChapters: series.chapters.length,
      totalVolumes: series.volumes.length,
      libraryCount: 0,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
      // Include user-submitted reading links
      userReadingLinks: (series as any).userReadingLinks || []
    };
    
    return NextResponse.json({
      success: true,
      comic: comic
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch series',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
