import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log("Follow API: No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { seriesId, action } = await request.json();
    console.log("Follow API: Received request", { userId: session.user.id, seriesId, action });

    if (!seriesId || !action) {
      console.log("Follow API: Missing seriesId or action");
      return NextResponse.json({ error: "Missing seriesId or action" }, { status: 400 });
    }

    const followsPath = path.join(process.cwd(), 'data', 'follows.json');
    console.log("Follow API: Using follows path:", followsPath);
    
    // Read existing follows data
    let followsData: Record<string, string[]> = {};
    if (fs.existsSync(followsPath)) {
      const followsContent = fs.readFileSync(followsPath, 'utf-8');
      followsData = JSON.parse(followsContent);
      console.log("Follow API: Loaded existing data:", followsData);
    } else {
      console.log("Follow API: Follows file does not exist, creating new");
    }

    // Initialize user's follow list if it doesn't exist
    if (!followsData[session.user.id]) {
      followsData[session.user.id] = [];
      console.log("Follow API: Initialized new user follow list");
    }

    if (action === "follow") {
      // Check if already following
      if (followsData[session.user.id].includes(seriesId)) {
        console.log("Follow API: User already following series");
        return NextResponse.json({ message: "Already following this series" });
      }

      // Add to follow list
      followsData[session.user.id].push(seriesId);
      console.log("Follow API: Added series to follow list:", followsData[session.user.id]);
      
      // Save updated data
      fs.writeFileSync(followsPath, JSON.stringify(followsData, null, 2));
      console.log("Follow API: Saved updated data to file");

      return NextResponse.json({ message: "Successfully followed series" });
    } 
    else if (action === "unfollow") {
      // Remove from follow list
      followsData[session.user.id] = followsData[session.user.id].filter(id => id !== seriesId);
      console.log("Follow API: Removed series from follow list:", followsData[session.user.id]);
      
      // Save updated data
      fs.writeFileSync(followsPath, JSON.stringify(followsData, null, 2));
      console.log("Follow API: Saved updated data to file");

      return NextResponse.json({ message: "Successfully unfollowed series" });
    } 
    else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in follow API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}