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

    // Get user's followed manga with latest chapter info
    const followedManga = await prisma.libraryEntry.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        series: {
          include: {
            chapters: {
              orderBy: {
                chapterNumber: 'desc'
              },
              take: 1, // Get only the latest chapter
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
        createdAt: 'desc' // Most recently followed first
      },
      take: 10 // Limit to 10 followed manga for the home page
    });

    // Transform the data to include latest chapter info
    const followedMangaWithLatest = followedManga.map(entry => {
      const latestChapter = entry.series.chapters[0];
      
      return {
        id: entry.series.id,
        title: entry.series.title,
        coverImage: entry.series.coverImage,
        description: entry.series.description,
        tags: entry.series.tags,
        author: entry.series.authors,
        artist: entry.series.artists,
        year: entry.series.year,
        mangaMDStatus: entry.series.mangaMDStatus,
        isImported: entry.series.isImported,
        followedAt: entry.createdAt,
        latestChapter: latestChapter ? {
          id: latestChapter.id,
          title: latestChapter.title,
          chapterNumber: latestChapter.chapterNumber,
          mangaMDChapterTitle: latestChapter.mangaMDChapterTitle,
          mangaMDChapterNumber: latestChapter.mangaMDChapterNumber,
          createdAt: latestChapter.createdAt,
          mangaMDPublishAt: latestChapter.mangaMDPublishAt,
        } : null
      };
    });

    return NextResponse.json({ 
      followedManga: followedMangaWithLatest 
    });

  } catch (error) {
    console.error("Error fetching followed manga:", error);
    return NextResponse.json(
      { error: "Failed to fetch followed manga" },
      { status: 500 }
    );
  }
}
