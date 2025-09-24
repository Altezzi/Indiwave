import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getSeriesFromDatabase() {
  try {
    const series = await prisma.series.findMany({
      where: { isPublished: true },
      include: {
        chapters: {
          select: {
            id: true,
            title: true,
            chapterNumber: true,
            pages: true,
            isPublished: true,
            createdAt: true
          },
          orderBy: {
            chapterNumber: 'asc'
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform to comic format for compatibility
    return series.map(series => ({
      id: series.id,
      title: series.title,
      series: series.title,
      description: series.description || '',
      cover: series.coverImage || '/placeholder-cover.jpg',
      coverImage: series.coverImage || '/placeholder-cover.jpg',
      author: series.authors || '',
      artist: series.artists || '',
      authors: series.authors ? [series.authors] : [],
      artists: series.artists ? [series.artists] : [],
      year: series.mangaMDYear || new Date().getFullYear(),
      tags: series.tags ? series.tags.split(',').map(tag => tag.trim()) : [],
      mangaMDStatus: series.mangaMDStatus || 'ongoing',
      status: series.mangaMDStatus || 'ongoing',
      isImported: series.isImported,
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
      totalChapters: series.chapters.length,
      libraryCount: 0,
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching series from database:', error);
    return [];
  }
}
