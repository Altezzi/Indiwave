import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, label } = await request.json();

    if (!url || !label) {
      return NextResponse.json(
        { error: "URL and label are required" },
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

    // Check if the URL belongs to the current user
    const existingUrl = await prisma.userUrl.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingUrl) {
      return NextResponse.json(
        { error: "URL not found or access denied" },
        { status: 404 }
      );
    }

    const userUrl = await prisma.userUrl.update({
      where: { id: params.id },
      data: { url, label },
    });

    return NextResponse.json({ userUrl }, { status: 200 });
  } catch (error) {
    console.error("Error updating user URL:", error);
    return NextResponse.json(
      { error: "Failed to update user URL" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if the URL belongs to the current user
    const existingUrl = await prisma.userUrl.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingUrl) {
      return NextResponse.json(
        { error: "URL not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.userUrl.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "URL deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user URL:", error);
    return NextResponse.json(
      { error: "Failed to delete user URL" },
      { status: 500 }
    );
  }
}
