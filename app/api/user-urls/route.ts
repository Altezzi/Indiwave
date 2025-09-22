import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get("chapterId");
  const seriesId = searchParams.get("seriesId");

  if (!chapterId && !seriesId) {
    return NextResponse.json({ error: "Chapter ID or Series ID is required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userUrls = await prisma.userUrl.findMany({
      where: {
        ...(chapterId && { chapterId }),
        ...(seriesId && { seriesId }),
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json({ userUrls }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch user URLs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chapterId, seriesId, url, label } = await request.json();

    if ((!chapterId && !seriesId) || !url || !label) {
      return NextResponse.json(
        { error: "Chapter ID or Series ID, URL, and label are required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check if user exists in database, create if not
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      // Create user if they don't exist
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.name || "",
          image: session.user.image || "",
          accountId: Math.floor(Math.random() * 1000000), // Generate a random account ID
        },
      });
    }

    const userUrl = await prisma.userUrl.create({
      data: {
        ...(chapterId && { chapterId }),
        ...(seriesId && { seriesId }),
        userId: session.user.id,
        url,
        label,
      },
    });

    return NextResponse.json({ userUrl }, { status: 201 });
  } catch (error) {
    console.error("Error creating user URL:", error);
    return NextResponse.json(
      { error: "Failed to create user URL" },
      { status: 500 }
    );
  }
}
