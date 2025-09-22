import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { seriesId, updateChapters = true, updateMetadata = false } = await request.json();

    if (!seriesId) {
      return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
    }

    const seriesDir = path.join(process.cwd(), 'series');
    
    // Find the series folder by ID or title
    let seriesFolder = null;
    let seriesName = null;
    
    if (fs.existsSync(seriesDir)) {
      const folders = fs.readdirSync(seriesDir);
      for (const folder of folders) {
        const folderPath = path.join(seriesDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
          const metadataPath = path.join(folderPath, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            if (metadata.mangaMDId === seriesId || metadata.title === seriesId) {
              seriesFolder = folderPath;
              seriesName = folder;
              break;
            }
          }
        }
      }
    }

    if (!seriesFolder) {
      return NextResponse.json({ error: 'Series not found in local folders' }, { status: 404 });
    }

    const results = {
      seriesName,
      updates: {
        metadata: null,
        chapters: null,
        cover: null
      },
      errors: []
    };

    // For now, just update the timestamp and show what would be updated
    try {
      const metadataPath = path.join(seriesFolder, 'metadata.json');
      const currentMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      const updatedMetadata = {
        ...currentMetadata,
        lastChecked: new Date().toISOString(),
        updateStatus: 'Ready for update'
      };

      fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));
      results.updates.metadata = 'Updated timestamp - ready for MangaDex integration';
    } catch (error) {
      results.errors.push(`Metadata update failed: ${error}`);
    }

    // Update README.md with update info
    try {
      const readmePath = path.join(seriesFolder, 'README.md');
      const readmeContent = `# ${results.seriesName}

## Update Status
- **Last Checked**: ${new Date().toISOString()}
- **Status**: Ready for MangaDex integration
- **Update Chapters**: ${updateChapters ? 'Yes' : 'No'}
- **Update Metadata**: ${updateMetadata ? 'Yes' : 'No'}

## Next Steps
To enable full updates, the MangaDex API integration needs to be properly configured.

---
*Last updated: ${new Date().toISOString()}*
`;

      fs.writeFileSync(readmePath, readmeContent);
    } catch (error) {
      results.errors.push(`README update failed: ${error}`);
    }

    return NextResponse.json({
      success: true,
      message: `Series "${seriesName}" prepared for updates`,
      ...results
    });

  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check series status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');

    if (!seriesId) {
      return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
    }

    const seriesDir = path.join(process.cwd(), 'series');
    
    // Find the series folder
    let seriesFolder = null;
    let seriesName = null;
    
    if (fs.existsSync(seriesDir)) {
      const folders = fs.readdirSync(seriesDir);
      for (const folder of folders) {
        const folderPath = path.join(seriesDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
          const metadataPath = path.join(folderPath, 'metadata.json');
          if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            if (metadata.mangaMDId === seriesId || metadata.title === seriesId) {
              seriesFolder = folderPath;
              seriesName = folder;
              break;
            }
          }
        }
      }
    }

    if (!seriesFolder) {
      return NextResponse.json({ error: 'Series not found in local folders' }, { status: 404 });
    }

    // Read current data
    const metadataPath = path.join(seriesFolder, 'metadata.json');
    const chaptersPath = path.join(seriesFolder, 'chapters.json');
    const coverPath = path.join(seriesFolder, 'cover.jpg');
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    let chapters = [];
    if (fs.existsSync(chaptersPath)) {
      chapters = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
    }

    return NextResponse.json({
      seriesName,
      metadata: {
        title: metadata.title,
        mangaMDId: metadata.mangaMDId,
        lastUpdated: metadata.updatedAt || metadata.createdAt,
        lastChecked: metadata.lastChecked
      },
      currentChapters: chapters.length,
      hasCover: fs.existsSync(coverPath),
      status: 'Ready for MangaDex integration',
      lastChecked: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking series:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
