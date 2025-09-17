import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  USER: 0,
  CREATOR: 1,
  REVIEWER: 2,
  UPLOAD_TEAM: 3,
  MODERATOR: 4,
  SENIOR_MOD: 5,
  ADMIN: 6,
} as const

type UserRole = keyof typeof ROLE_HIERARCHY

function canManageRole(actorRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole]
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get the actor's user data
    const actor = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!actor) {
      return NextResponse.json(
        { error: "Actor not found" },
        { status: 404 }
      )
    }

    // Check if actor has permission to manage roles
    if (!["SENIOR_MOD", "ADMIN"].includes(actor.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const { role } = await request.json()

    if (!role || !Object.keys(ROLE_HIERARCHY).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, role: true, email: true, name: true }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      )
    }

    // Check if actor can manage this role
    if (!canManageRole(actor.role as UserRole, role as UserRole)) {
      return NextResponse.json(
        { error: "Cannot assign role equal to or higher than your own" },
        { status: 403 }
      )
    }

    // Prevent self-role changes
    if (actor.id === targetUser.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 403 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        isCreator: true,
        createdAt: true,
      }
    })

    // Log the role change
    await prisma.auditLog.create({
      data: {
        actorId: actor.id,
        action: "role_change",
        target: targetUser.id,
        details: JSON.stringify({
          oldRole: targetUser.role,
          newRole: role,
          targetUserEmail: targetUser.email,
        })
      }
    })

    return NextResponse.json({
      message: "Role updated successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("Role update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
