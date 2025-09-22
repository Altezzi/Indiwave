import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Define the structure for imported series data
interface ImportedSeries {
  title: string;
  description?: string;
  coverUrl?: string;
  year?: number;
  status?: string;
  tags?: string[];
  authors?: string[];
  artists?: string[];
  altTitles?: string[];
  externalId?: string;
  source?: string; // e.g., "mangadex", "mangakakalot", etc.
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user has admin/senior mod permissions
  if (!session?.user?.id || !["ADMIN", "SENIOR_MOD"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { series, source } = await request.json();

    if (!series || !Array.isArray(series)) {
      return NextResponse.json({ error: "Invalid series data" }, { status: 400 });
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[]
    };

    for (const seriesData of series) {
      try {
        // Check if series already exists by external ID or title
        const existingSeries = await prisma.series.findFirst({
          where: {
            OR: [
              { mangaMDId: seriesData.externalId },
              { title: seriesData.title }
            ]
          }
        });

        if (existingSeries) {
          results.skipped++;
          results.details.push({
            title: seriesData.title,
            status: "skipped",
            reason: "Already exists"
          });
          continue;
        }

        // Download cover image if provided
        let coverImagePath = null;
        if (seriesData.coverUrl) {
          try {
            coverImagePath = await downloadCoverImage(seriesData.coverUrl, seriesData.title);
          } catch (error) {
            console.warn(`Failed to download cover for ${seriesData.title}:`, error);
          }
        }

        // Create the series
        const newSeries = await prisma.series.create({
          data: {
            title: seriesData.title,
            description: seriesData.description || "",
            coverImage: coverImagePath,
            mangaMDId: seriesData.externalId,
            mangaMDTitle: seriesData.title,
            mangaMDStatus: seriesData.status || "unknown",
            mangaMDYear: seriesData.year,
            tags: seriesData.tags ? JSON.stringify(seriesData.tags) : null,
            authors: seriesData.authors ? JSON.stringify(seriesData.authors) : null,
            artists: seriesData.artists ? JSON.stringify(seriesData.artists) : null,
            altTitles: seriesData.altTitles ? JSON.stringify(seriesData.altTitles) : null,
            isImported: true,
            isPublished: true,
            creatorId: session.user.id // Set the admin as the creator
          }
        });

        results.imported++;
        results.details.push({
          title: seriesData.title,
          status: "imported",
          id: newSeries.id
        });

        // Log the import action
        await prisma.auditLog.create({
          data: {
            action: "series_import",
            target: newSeries.id,
            details: JSON.stringify({
              source,
              title: seriesData.title,
              externalId: seriesData.externalId
            }),
            actorId: session.user.id
          }
        });

      } catch (error) {
        results.errors++;
        results.details.push({
          title: seriesData.title,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        });
        console.error(`Error importing series ${seriesData.title}:`, error);
      }
    }

    return NextResponse.json({
      message: "Import completed",
      results
    }, { status: 200 });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import series" },
      { status: 500 }
    );
  }
}

// Function to download and save cover images
async function downloadCoverImage(imageUrl: string, seriesTitle: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";
    
    // Create a safe filename
    const safeTitle = seriesTitle
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase()
      .substring(0, 50);
    
    const filename = `${safeTitle}_cover.${extension}`;
    const filepath = `/covers/${filename}`;

    // In a real implementation, you'd save this to your file storage
    // For now, we'll just return the original URL
    // TODO: Implement actual file storage (AWS S3, local filesystem, etc.)
    
    return imageUrl; // Placeholder - return original URL for now
  } catch (error) {
    throw new Error(`Failed to download cover image: ${error}`);
  }
}
