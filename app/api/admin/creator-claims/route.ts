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

    if (!user || !["ADMIN", "SENIOR_MOD", "REVIEWER"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Get all creator claims with related data
    const claims = await prisma.creatorClaim.findMany({
      include: {
        claimant: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          }
        },
        series: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ claims })

  } catch (error) {
    console.error("Error fetching creator claims:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
      select: { role: true, id: true }
    })

    if (!user || !["ADMIN", "SENIOR_MOD", "REVIEWER"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const { claimId, action, notes } = await request.json()

    if (!claimId || !action) {
      return NextResponse.json(
        { error: "Claim ID and action are required" },
        { status: 400 }
      )
    }

    // Get the claim
    const claim = await prisma.creatorClaim.findUnique({
      where: { id: claimId },
      include: {
        claimant: true,
        series: true
      }
    })

    if (!claim) {
      return NextResponse.json(
        { error: "Claim not found" },
        { status: 404 }
      )
    }

    // Update the claim status
    const updatedClaim = await prisma.creatorClaim.update({
      where: { id: claimId },
      data: {
        status: action,
        notes: notes || null,
      }
    })

    // If approved, update the series creator
    if (action === "approved") {
      await prisma.series.update({
        where: { id: claim.seriesId },
        data: {
          creatorId: claim.claimantId
        }
      })

      // Update user to be a creator
      await prisma.user.update({
        where: { id: claim.claimantId },
        data: {
          isCreator: true,
          role: "CREATOR"
        }
      })
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "creator_claim_review",
        target: claimId,
        details: JSON.stringify({
          action,
          claimantEmail: claim.claimant.email,
          seriesTitle: claim.series.title,
          notes
        })
      }
    })

    return NextResponse.json({
      message: `Claim ${action} successfully`,
      claim: updatedClaim
    })

  } catch (error) {
    console.error("Error processing creator claim:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

