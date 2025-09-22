import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's followed manga with their latest chapters
    const followedManga = await prisma.libraryEntry.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        series: {
          include: {
            chapters: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 3, // Get the 3 most recent chapters
              select: {
                id: true,
                title: true,
                chapterNumber: true,
                createdAt: true,
                mangaMDChapterTitle: true,
                mangaMDChapterNumber: true,
                mangaMDPublishAt: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to include latest chapters
    const latestChapters = followedManga.flatMap(entry => {
      return entry.series.chapters.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        mangaMDChapterTitle: chapter.mangaMDChapterTitle,
        mangaMDChapterNumber: chapter.mangaMDChapterNumber,
        createdAt: chapter.createdAt,
        mangaMDPublishAt: chapter.mangaMDPublishAt,
        series: {
          id: entry.series.id,
          title: entry.series.title,
          coverImage: entry.series.coverImage,
          description: entry.series.description,
          tags: entry.series.tags,
          author: entry.series.authors,
          artist: entry.series.artists,
          year: entry.series.year,
          mangaMDStatus: entry.series.mangaMDStatus,
        }
      }));
    });

    // Sort by creation date (newest first) and limit to 10
    const sortedChapters = latestChapters
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return NextResponse.json({ 
      latestChapters: sortedChapters 
    });

  } catch (error) {
    console.error("Error fetching latest chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest chapters" },
      { status: 500 }
    );
  }
}
