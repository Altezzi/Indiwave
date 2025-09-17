import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has admin or senior mod privileges
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (!user || !["ADMIN", "SENIOR_MOD"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Get platform statistics
    const [
      totalUsers,
      totalCreators,
      totalSeries,
      totalComments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isCreator: true } }),
      prisma.series.count(),
      prisma.comment.count(),
    ])

    return NextResponse.json({
      totalUsers,
      totalCreators,
      totalSeries,
      totalComments,
    })

  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
