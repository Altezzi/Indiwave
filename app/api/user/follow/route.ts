import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { seriesId, action } = await request.json();

    if (!seriesId || !action || !["follow", "unfollow"].includes(action)) {
      return NextResponse.json({ error: "Invalid follow data" }, { status: 400 });
    }

    if (action === "follow") {
      // Check if already following
      const existingEntry = await prisma.libraryEntry.findFirst({
        where: {
          userId: session.user.id,
          seriesId: seriesId,
        },
      });

      if (!existingEntry) {
        // Create new follow entry
        await prisma.libraryEntry.create({
          data: {
            userId: session.user.id,
            seriesId: seriesId,
            status: "READING", // Default status
            rating: null,
            notes: null,
          },
        });
      }
    } else if (action === "unfollow") {
      // Remove follow entry
      await prisma.libraryEntry.deleteMany({
        where: {
          userId: session.user.id,
          seriesId: seriesId,
        },
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error following/unfollowing series:", error);
    return NextResponse.json(
      { error: "Failed to follow/unfollow series" },
      { status: 500 }
    );
  }
}
