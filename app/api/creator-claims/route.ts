import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { seriesId, evidence } = await request.json()

    if (!seriesId || !evidence) {
      return NextResponse.json(
        { error: "Series ID and evidence are required" },
        { status: 400 }
      )
    }

    // Check if user already has a pending claim for this series
    const existingClaim = await prisma.creatorClaim.findFirst({
      where: {
        claimantId: session.user.id,
        seriesId: seriesId,
        status: "pending"
      }
    })

    if (existingClaim) {
      return NextResponse.json(
        { error: "You already have a pending claim for this series" },
        { status: 400 }
      )
    }

    // Create the claim
    const claim = await prisma.creatorClaim.create({
      data: {
        claimantId: session.user.id,
        seriesId: seriesId,
        evidence: evidence,
        status: "pending"
      },
      include: {
        series: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      message: "Creator claim submitted successfully",
      claim
    })

  } catch (error) {
    console.error("Error creating creator claim:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's own claims
    const claims = await prisma.creatorClaim.findMany({
      where: {
        claimantId: session.user.id
      },
      include: {
        series: {
          select: {
            title: true,
            coverImage: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ claims })

  } catch (error) {
    console.error("Error fetching user claims:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
