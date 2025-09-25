import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seriesId = searchParams.get("seriesId");

    if (!seriesId) {
      return NextResponse.json({ error: "Series ID is required" }, { status: 400 });
    }

    const ratings = await prisma.rating.findMany({
      where: {
        seriesId: seriesId,
      },
      select: {
        rating: true,
      },
    });

    if (ratings.length === 0) {
      return NextResponse.json({
        averageRating: null,
        totalRatings: 0
      });
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = Math.round((totalRating / ratings.length) * 10) / 10; // Round to 1 decimal place

    return NextResponse.json({
      averageRating: averageRating,
      totalRatings: ratings.length
    });

  } catch (error) {
    console.error("Error fetching community rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch community rating" },
      { status: 500 }
    );
  }
}
