import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followsPath = path.join(process.cwd(), 'data', 'follows.json');
    
    // Read existing follows data
    let followsData: Record<string, string[]> = {};
    if (fs.existsSync(followsPath)) {
      const followsContent = fs.readFileSync(followsPath, 'utf-8');
      followsData = JSON.parse(followsContent);
    }

    // Get user's followed series
    const userFollows = followsData[session.user.id] || [];

    return NextResponse.json({ 
      followedSeries: userFollows,
      count: userFollows.length
    });
  } catch (error) {
    console.error("Error in followed-series API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
