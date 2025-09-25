import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const chaptersCount = parseInt(formData.get('chaptersCount') as string);
    const tagsJson = formData.get('tags') as string;
    const readingLinksJson = formData.get('readingLinks') as string;
    const coverFile = formData.get('cover') as File;

    // Validate required fields
    if (!title || !description || !chaptersCount || !coverFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate chapters count
    if (chaptersCount < 1) {
      return NextResponse.json(
        { error: 'Chapter count must be at least 1' },
        { status: 400 }
      );
    }

    // Parse tags
    let tags = [];
    try {
      tags = JSON.parse(tagsJson || '[]');
    } catch (error) {
      tags = [];
    }

    // Parse reading links
    let readingLinks = [];
    try {
      readingLinks = JSON.parse(readingLinksJson || '[]');
    } catch (error) {
      readingLinks = [];
    }

    // Sanitize title for folder name
    const sanitizedTitle = title.replace(/[<>:"/\\|?*]/g, '').trim();
    if (!sanitizedTitle) {
      return NextResponse.json(
        { error: 'Invalid title format' },
        { status: 400 }
      );
    }

    // Check if series already exists
    const seriesDir = path.join(process.cwd(), 'series');
    const seriesFolder = path.join(seriesDir, sanitizedTitle);
    
    if (fs.existsSync(seriesFolder)) {
      return NextResponse.json(
        { error: 'Series already exists in the library' },
        { status: 409 }
      );
    }

    // Create series directory
    fs.mkdirSync(seriesFolder, { recursive: true });

    // Save cover image
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
    const coverExtension = path.extname(coverFile.name) || '.jpg';
    const coverPath = path.join(seriesFolder, `cover${coverExtension}`);
    fs.writeFileSync(coverPath, coverBuffer);

    // Create metadata.json
    const metadata = {
      title: title,
      description: description,
      author: "Unknown", // Will be filled by admin review
      artist: "Unknown", // Will be filled by admin review
      publisher: "Unknown", // Will be filled by admin review
      year: new Date().getFullYear(),
      tags: tags, // User-submitted tags
      contentRating: "safe", // Default, will be reviewed
      status: "ongoing", // Default, will be reviewed
      totalChapters: chaptersCount,
      chapterSource: "user_upload",
      chaptersCreatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapterSources: {
        user_upload: chaptersCount
      },
      chapterVerifiedAt: new Date().toISOString(),
      // User-submitted reading links
      userReadingLinks: readingLinks,
      // Upload metadata
      uploadedBy: "contributor", // TODO: Replace with actual user ID when auth is implemented
      uploadedAt: new Date().toISOString(),
      uploadStatus: "pending_review" // Will be reviewed by admin
    };

    const metadataPath = path.join(seriesFolder, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Create chapters folder structure
    const chaptersFolder = path.join(seriesFolder, 'chapters');
    fs.mkdirSync(chaptersFolder, { recursive: true });

    // Create chapter folders
    for (let i = 1; i <= chaptersCount; i++) {
      const chapterFolderName = `Chapter ${String(i).padStart(3, '0')}`;
      const chapterPath = path.join(chaptersFolder, chapterFolderName);
      fs.mkdirSync(chapterPath);
    }

    // Create volumes folder (empty for now)
    const volumesFolder = path.join(seriesFolder, 'volumes');
    fs.mkdirSync(volumesFolder, { recursive: true });

    // Create seasons folder (empty for now)
    const seasonsFolder = path.join(seriesFolder, 'seasons');
    fs.mkdirSync(seasonsFolder, { recursive: true });

    // Log the upload for admin review
    const uploadLog = {
      seriesTitle: title,
      uploadedBy: "contributor", // TODO: Replace with actual user ID
      uploadedAt: new Date().toISOString(),
      status: "pending_review",
      tags: tags,
      readingLinks: readingLinks,
      chaptersCount: chaptersCount
    };

    // Append to upload log (create if doesn't exist)
    const logPath = path.join(process.cwd(), 'upload-log.json');
    let uploadLogs = [];
    
    if (fs.existsSync(logPath)) {
      try {
        uploadLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      } catch (error) {
        uploadLogs = [];
      }
    }
    
    uploadLogs.push(uploadLog);
    fs.writeFileSync(logPath, JSON.stringify(uploadLogs, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Series uploaded successfully and is pending review',
      seriesTitle: title,
      seriesPath: sanitizedTitle,
      chaptersCreated: chaptersCount,
      tagsAdded: tags.length,
      readingLinksAdded: readingLinks.length
    });

  } catch (error) {
    console.error('Upload series error:', error);
    return NextResponse.json(
      { error: 'Failed to upload series' },
      { status: 500 }
    );
  }
}
