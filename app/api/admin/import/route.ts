import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mangaMDService } from "@/lib/mangaMD";
import { legalSourcesService } from "@/lib/legalSources";
import { publisherSourcesService } from "@/lib/publisherSources";
import fs from 'fs';
import path from 'path';

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
  publisher?: string;
  contentRating?: string;
  totalChapters?: number;
  genres?: string[];
  themes?: string[];
  formats?: string[];
}

// Enhanced interface for comprehensive manga data
interface ComprehensiveMangaData {
  title: string;
  description: string;
  coverUrl: string;
  year?: number;
  status: string;
  tags: string[];
  authors: string[];
  artists: string[];
  altTitles: string[];
  externalId: string;
  source: string;
  publisher?: string;
  contentRating: string;
  totalChapters?: number;
  genres: string[];
  themes: string[];
  formats: string[];
  publisherSources?: any[];
}

// Function to fetch comprehensive manga data from multiple sources
async function fetchComprehensiveMangaData(seriesData: ImportedSeries): Promise<ComprehensiveMangaData> {
  let comprehensiveData: ComprehensiveMangaData = {
    title: seriesData.title,
    description: seriesData.description || "",
    coverUrl: seriesData.coverUrl || "",
    year: seriesData.year,
    status: seriesData.status || "unknown",
    tags: seriesData.tags || [],
    authors: seriesData.authors || [],
    artists: seriesData.artists || [],
    altTitles: seriesData.altTitles || [],
    externalId: seriesData.externalId || "",
    source: seriesData.source || "manual",
    publisher: seriesData.publisher,
    contentRating: seriesData.contentRating || "safe",
    totalChapters: seriesData.totalChapters,
    genres: seriesData.genres || [],
    themes: seriesData.themes || [],
    formats: seriesData.formats || [],
    publisherSources: []
  };

  try {
    // Try to fetch additional data from MangaMD if we have an external ID
    if (seriesData.externalId && seriesData.source === "mangadex") {
      console.log(`Fetching comprehensive data from MangaMD for: ${seriesData.title}`);
      
      try {
        const mangaData = await mangaMDService.getMangaById(seriesData.externalId);
        const coversData = await mangaMDService.getMangaCovers(seriesData.externalId);
        
        // Enhance with MangaMD data
        comprehensiveData.description = mangaMDService.getBestDescription(mangaData) || comprehensiveData.description;
        comprehensiveData.status = mangaData.status || comprehensiveData.status;
        comprehensiveData.year = mangaData.year || comprehensiveData.year;
        comprehensiveData.contentRating = mangaData.contentRating || comprehensiveData.contentRating;
        
        // Get enhanced tags, authors, artists
        const { authors, artists } = mangaMDService.getAuthorsAndArtists(mangaData);
        const allTags = mangaMDService.getAllTags(mangaData);
        
        comprehensiveData.authors = authors.length > 0 ? authors : comprehensiveData.authors;
        comprehensiveData.artists = artists.length > 0 ? artists : comprehensiveData.artists;
        comprehensiveData.tags = allTags.length > 0 ? allTags : comprehensiveData.tags;
        
        // Get cover image
        if (coversData.data.length > 0) {
          comprehensiveData.coverUrl = mangaMDService.getCoverUrl(coversData.data[0], 'large') || comprehensiveData.coverUrl;
        }
        
        // Categorize tags into genres, themes, formats
        const categorizedTags = categorizeTags(allTags);
        comprehensiveData.genres = categorizedTags.genres;
        comprehensiveData.themes = categorizedTags.themes;
        comprehensiveData.formats = categorizedTags.formats;
        
        console.log(`Enhanced data from MangaMD for: ${seriesData.title}`);
      } catch (error) {
        console.warn(`Failed to fetch MangaMD data for ${seriesData.title}:`, error);
      }
    }

    // Try to fetch publisher information
    try {
      const publisherInfo = await publisherSourcesService.getPublisherSources(seriesData.title);
      if (publisherInfo && publisherInfo.publishers.length > 0) {
        comprehensiveData.publisherSources = publisherInfo.publishers;
        // Use the first official publisher as the main publisher
        const officialPublisher = publisherInfo.publishers.find(p => p.type === 'official');
        if (officialPublisher) {
          comprehensiveData.publisher = officialPublisher.name;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch publisher info for ${seriesData.title}:`, error);
    }

    // Try to fetch from legal sources if available
    if (seriesData.source === "legal") {
      try {
        const legalData = await legalSourcesService.fetchMangaMetadataFromLegalSource(
          seriesData.title, 
          seriesData.externalId || "default"
        );
        
        if (legalData) {
          comprehensiveData.description = legalData.description || comprehensiveData.description;
          comprehensiveData.coverUrl = legalData.coverImage || comprehensiveData.coverUrl;
          comprehensiveData.totalChapters = legalData.totalChapters || comprehensiveData.totalChapters;
          comprehensiveData.publisher = legalData.publisher || comprehensiveData.publisher;
          comprehensiveData.status = legalData.status || comprehensiveData.status;
          
          if (legalData.author) {
            comprehensiveData.authors = [legalData.author, ...comprehensiveData.authors.filter(a => a !== legalData.author)];
          }
          if (legalData.artist) {
            comprehensiveData.artists = [legalData.artist, ...comprehensiveData.artists.filter(a => a !== legalData.artist)];
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch legal source data for ${seriesData.title}:`, error);
      }
    }

  } catch (error) {
    console.warn(`Error fetching comprehensive data for ${seriesData.title}:`, error);
  }

  return comprehensiveData;
}

// Function to categorize tags into genres, themes, and formats
function categorizeTags(tags: string[]): { genres: string[], themes: string[], formats: string[] } {
  const genres: string[] = [];
  const themes: string[] = [];
  const formats: string[] = [];

  const genreKeywords = ['action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 'mystery', 'romance', 'sci-fi', 'slice of life', 'sports', 'supernatural', 'thriller'];
  const themeKeywords = ['school', 'work', 'family', 'friendship', 'love', 'war', 'crime', 'medical', 'historical', 'psychological', 'philosophical', 'political'];
  const formatKeywords = ['oneshot', 'doujinshi', 'manhwa', 'manhua', 'webtoon', '4-koma', 'anthology'];

  tags.forEach(tag => {
    const lowerTag = tag.toLowerCase();
    
    if (genreKeywords.some(keyword => lowerTag.includes(keyword))) {
      genres.push(tag);
    } else if (themeKeywords.some(keyword => lowerTag.includes(keyword))) {
      themes.push(tag);
    } else if (formatKeywords.some(keyword => lowerTag.includes(keyword))) {
      formats.push(tag);
    } else {
      // Default to theme if not categorized
      themes.push(tag);
    }
  });

  return { genres, themes, formats };
}

// Function to create a safe folder name
function createSafeFolderName(title: string): string {
  return title
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to create manga folder structure and store metadata
async function createMangaFolderAndMetadata(comprehensiveData: ComprehensiveMangaData): Promise<string> {
  const seriesDir = path.join(process.cwd(), 'series');
  const safeTitle = createSafeFolderName(comprehensiveData.title);
  const mangaFolderPath = path.join(seriesDir, safeTitle);

  try {
    // Create the manga folder if it doesn't exist
    if (!fs.existsSync(mangaFolderPath)) {
      fs.mkdirSync(mangaFolderPath, { recursive: true });
      console.log(`Created folder: ${mangaFolderPath}`);
    }

    // Download and save cover image
    let coverImagePath = null;
    if (comprehensiveData.coverUrl) {
      try {
        coverImagePath = await downloadAndSaveCoverImage(comprehensiveData.coverUrl, mangaFolderPath, comprehensiveData.title);
      } catch (error) {
        console.warn(`Failed to download cover for ${comprehensiveData.title}:`, error);
      }
    }

    // Create comprehensive metadata object
    const metadata = {
      title: comprehensiveData.title,
      mangaMDId: comprehensiveData.externalId,
      description: comprehensiveData.description,
      authors: comprehensiveData.authors,
      artists: comprehensiveData.artists,
      tags: comprehensiveData.tags,
      status: comprehensiveData.status,
      year: comprehensiveData.year,
      contentRating: comprehensiveData.contentRating,
      coverImage: coverImagePath ? path.basename(coverImagePath) : null,
      totalChapters: comprehensiveData.totalChapters,
      publisher: comprehensiveData.publisher,
      genres: comprehensiveData.genres,
      themes: comprehensiveData.themes,
      formats: comprehensiveData.formats,
      publisherSources: comprehensiveData.publisherSources,
      altTitles: comprehensiveData.altTitles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: comprehensiveData.source,
      folderPath: mangaFolderPath
    };

    // Save metadata.json file
    const metadataPath = path.join(mangaFolderPath, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Saved metadata: ${metadataPath}`);

    // Create chapters.json file (empty for now)
    const chaptersPath = path.join(mangaFolderPath, 'chapters.json');
    if (!fs.existsSync(chaptersPath)) {
      fs.writeFileSync(chaptersPath, JSON.stringify([], null, 2));
    }

    // Create README.md file
    const readmePath = path.join(mangaFolderPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      const readmeContent = `# ${comprehensiveData.title}

${comprehensiveData.description}

## Details
- **Authors**: ${comprehensiveData.authors.join(', ')}
- **Artists**: ${comprehensiveData.artists.join(', ')}
- **Status**: ${comprehensiveData.status}
- **Year**: ${comprehensiveData.year || 'Unknown'}
- **Content Rating**: ${comprehensiveData.contentRating}
- **Publisher**: ${comprehensiveData.publisher || 'Unknown'}
- **Total Chapters**: ${comprehensiveData.totalChapters || 'Unknown'}

## Tags
${comprehensiveData.tags.map(tag => `- ${tag}`).join('\n')}

## Genres
${comprehensiveData.genres.map(genre => `- ${genre}`).join('\n')}

## Themes
${comprehensiveData.themes.map(theme => `- ${theme}`).join('\n')}

## Formats
${comprehensiveData.formats.map(format => `- ${format}`).join('\n')}

## Publisher Sources
${comprehensiveData.publisherSources?.map(source => `- [${source.name}](${source.url}) - ${source.type}`).join('\n') || 'None available'}

---
*Imported on ${new Date().toISOString()}*
`;
      fs.writeFileSync(readmePath, readmeContent);
    }

    return mangaFolderPath;

  } catch (error) {
    console.error(`Error creating folder structure for ${comprehensiveData.title}:`, error);
    throw error;
  }
}

// Enhanced function to download and save cover images to manga folders
async function downloadAndSaveCoverImage(imageUrl: string, mangaFolderPath: string, seriesTitle: string): Promise<string> {
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
    
    const filename = `cover.${extension}`;
    const filepath = path.join(mangaFolderPath, filename);

    // Save the image to the manga folder
    fs.writeFileSync(filepath, Buffer.from(imageBuffer));
    console.log(`Saved cover image: ${filepath}`);

    return filepath;
  } catch (error) {
    throw new Error(`Failed to download cover image: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user has admin/senior mod permissions
  if (!session?.user?.id || !["ADMIN", "SENIOR_MOD"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { series, source, fetchComprehensive = true } = await request.json();

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

        // Fetch comprehensive data from multiple sources if enabled
        let finalSeriesData = seriesData;
        if (fetchComprehensive) {
          console.log(`Fetching comprehensive data for: ${seriesData.title}`);
          finalSeriesData = await fetchComprehensiveMangaData(seriesData);
        }

        // Create manga folder structure and store metadata files
        let mangaFolderPath = null;
        if (fetchComprehensive) {
          try {
            mangaFolderPath = await createMangaFolderAndMetadata(finalSeriesData);
            console.log(`Created folder structure for: ${finalSeriesData.title}`);
          } catch (error) {
            console.warn(`Failed to create folder structure for ${finalSeriesData.title}:`, error);
          }
        }

        // Create the series with comprehensive data
        const newSeries = await prisma.series.create({
          data: {
            title: finalSeriesData.title,
            description: finalSeriesData.description || "",
            coverImage: mangaFolderPath ? path.join(mangaFolderPath, 'cover.jpg') : null,
            mangaMDId: finalSeriesData.externalId,
            mangaMDTitle: finalSeriesData.title,
            mangaMDStatus: finalSeriesData.status || "unknown",
            mangaMDYear: finalSeriesData.year,
            tags: finalSeriesData.tags ? JSON.stringify(finalSeriesData.tags) : null,
            authors: finalSeriesData.authors ? JSON.stringify(finalSeriesData.authors) : null,
            artists: finalSeriesData.artists ? JSON.stringify(finalSeriesData.artists) : null,
            altTitles: finalSeriesData.altTitles ? JSON.stringify(finalSeriesData.altTitles) : null,
            isImported: true,
            isPublished: true,
            creatorId: session.user.id // Set the admin as the creator
          }
        });

        // Store additional comprehensive data if available
        if (fetchComprehensive && 'publisherSources' in finalSeriesData) {
          // Store publisher sources and additional metadata
          // This could be stored in a separate table or as JSON in the series record
          console.log(`Stored comprehensive data for ${finalSeriesData.title}:`, {
            genres: finalSeriesData.genres?.length || 0,
            themes: finalSeriesData.themes?.length || 0,
            formats: finalSeriesData.formats?.length || 0,
            publisherSources: finalSeriesData.publisherSources?.length || 0,
            totalChapters: finalSeriesData.totalChapters,
            publisher: finalSeriesData.publisher
          });
        }

        results.imported++;
        results.details.push({
          title: finalSeriesData.title,
          status: "imported",
          id: newSeries.id,
          folderPath: mangaFolderPath,
          comprehensiveData: fetchComprehensive ? {
            genres: finalSeriesData.genres?.length || 0,
            themes: finalSeriesData.themes?.length || 0,
            formats: finalSeriesData.formats?.length || 0,
            publisherSources: finalSeriesData.publisherSources?.length || 0,
            totalChapters: finalSeriesData.totalChapters,
            publisher: finalSeriesData.publisher,
            folderCreated: !!mangaFolderPath
          } : undefined
        });

        // Log the import action
        await prisma.auditLog.create({
          data: {
            action: "series_import",
            target: newSeries.id,
            details: JSON.stringify({
              source: finalSeriesData.source,
              title: finalSeriesData.title,
              externalId: finalSeriesData.externalId,
              comprehensiveData: fetchComprehensive,
              dataSources: finalSeriesData.source === "mangadex" ? ["mangadex", "publisher_sources"] : ["manual", "publisher_sources"]
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
      results,
      comprehensiveDataEnabled: fetchComprehensive
    }, { status: 200 });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import series" },
      { status: 500 }
    );
  }
}

// GET endpoint for searching manga from multiple sources
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check if user has admin/senior mod permissions
  if (!session?.user?.id || !["ADMIN", "SENIOR_MOD"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const source = searchParams.get('source') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const results: any[] = [];

    // Search from MangaMD if requested
    if (source === 'all' || source === 'mangadex') {
      try {
        console.log(`Searching MangaMD for: ${query}`);
        const mangaMDResults = await mangaMDService.searchManga(query, limit, 0);
        
        if (mangaMDResults.success && mangaMDResults.data) {
          results.push(...mangaMDResults.data.map((manga: any) => ({
            id: manga.id,
            title: manga.title,
            description: manga.description,
            coverUrl: manga.coverUrl,
            status: manga.status,
            year: manga.year,
            contentRating: manga.contentRating,
            authors: manga.authors,
            artists: manga.artists,
            tags: manga.tags,
            altTitles: manga.altTitles,
            source: 'mangadex',
            externalId: manga.id
          })));
        }
      } catch (error) {
        console.warn(`Failed to search MangaMD:`, error);
      }
    }

    // Search from legal sources if requested
    if (source === 'all' || source === 'legal') {
      try {
        console.log(`Searching legal sources for: ${query}`);
        // This would need to be implemented in legalSourcesService
        // const legalResults = await legalSourcesService.searchManga(query, limit);
        // results.push(...legalResults);
      } catch (error) {
        console.warn(`Failed to search legal sources:`, error);
      }
    }

    // Get publisher information for found results
    for (const result of results) {
      try {
        const publisherInfo = await publisherSourcesService.getPublisherSources(result.title);
        if (publisherInfo && publisherInfo.publishers.length > 0) {
          result.publisherSources = publisherInfo.publishers;
          const officialPublisher = publisherInfo.publishers.find(p => p.type === 'official');
          if (officialPublisher) {
            result.publisher = officialPublisher.name;
          }
        }
      } catch (error) {
        console.warn(`Failed to get publisher info for ${result.title}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      sources: source === 'all' ? ['mangadex', 'legal', 'publisher_sources'] : [source]
    }, { status: 200 });

  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search manga" },
      { status: 500 }
    );
  }
}

