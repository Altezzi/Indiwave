import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { theme } = await request.json();
    
    if (!theme || !["default", "dark", "light"].includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    // Update user's theme preference
    await prisma.user.update({
      where: { id: session.user.id },
      data: { themePreference: theme }
    });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("Error saving theme preference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's theme preference
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { themePreference: true }
    });

    const theme = user?.themePreference || "default";
    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("Error getting theme preference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
