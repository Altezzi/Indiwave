import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ isFollowing: false });
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");

    if (!seriesId) {
      return NextResponse.json({ error: "Missing seriesId" }, { status: 400 });
    }

    const followsPath = path.join(process.cwd(), 'data', 'follows.json');
    
    // Read existing follows data
    let followsData: Record<string, string[]> = {};
    if (fs.existsSync(followsPath)) {
      const followsContent = fs.readFileSync(followsPath, 'utf-8');
      followsData = JSON.parse(followsContent);
    }

    // Check if user is following this series
    const userFollows = followsData[session.user.id] || [];
    const isFollowing = userFollows.includes(seriesId);

    return NextResponse.json({ 
      isFollowing 
    });
  } catch (error) {
    console.error("Error in follow-status API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}