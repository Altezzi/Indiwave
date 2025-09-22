import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET comments for a series
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");

    if (!seriesId) {
      return NextResponse.json(
        { error: "Series ID is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        seriesId: seriesId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name || "Anonymous",
      userImage: comment.user.image,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { seriesId, content } = await request.json();

    if (!seriesId || !content) {
      return NextResponse.json(
        { error: "Series ID and content are required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Check if series exists (you might want to verify this against your comics data)
    // For now, we'll assume it exists

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        seriesId: seriesId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const formattedComment = {
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name || "Anonymous",
      userImage: comment.user.image,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    };

    return NextResponse.json({ comment: formattedComment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
