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

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");

    if (!seriesId) {
      return NextResponse.json({ error: "Series ID is required" }, { status: 400 });
    }

    const followEntry = await prisma.libraryEntry.findFirst({
      where: {
        userId: session.user.id,
        seriesId: seriesId,
      },
    });

    return NextResponse.json({
      isFollowing: !!followEntry
    });

  } catch (error) {
    console.error("Error fetching follow status:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow status" },
      { status: 500 }
    );
  }
}
