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

    const searchParams = request.nextUrl.searchParams;
    const seriesId = searchParams.get("seriesId");

    if (!seriesId) {
      return NextResponse.json({ error: "Series ID is required" }, { status: 400 });
    }

    const rating = await prisma.rating.findFirst({
      where: {
        userId: session.user.id,
        seriesId: seriesId,
      },
      select: {
        rating: true,
      },
    });

    return NextResponse.json({
      rating: rating?.rating || null
    });

  } catch (error) {
    console.error("Error fetching user rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { seriesId, rating } = await request.json();

    if (!seriesId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating data" }, { status: 400 });
    }

    // Upsert the rating (update if exists, create if not)
    await prisma.rating.upsert({
      where: {
        userId_seriesId: {
          userId: session.user.id,
          seriesId: seriesId,
        },
      },
      update: {
        rating: rating,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        seriesId: seriesId,
        rating: rating,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}
