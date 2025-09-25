import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const logPath = path.join(process.cwd(), 'upload-log.json');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({
        success: true,
        uploads: []
      });
    }

    const uploadLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    
    // Filter for pending reviews
    const pendingUploads = uploadLogs.filter((upload: any) => 
      upload.status === 'pending_review'
    );

    return NextResponse.json({
      success: true,
      uploads: pendingUploads
    });

  } catch (error) {
    console.error('Error fetching upload queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upload queue' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { seriesTitle, action } = await request.json();
    
    if (!seriesTitle || !action) {
      return NextResponse.json(
        { error: 'Missing seriesTitle or action' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const logPath = path.join(process.cwd(), 'upload-log.json');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json(
        { error: 'No upload logs found' },
        { status: 404 }
      );
    }

    const uploadLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    
    // Find and update the upload
    const uploadIndex = uploadLogs.findIndex((upload: any) => 
      upload.seriesTitle === seriesTitle && upload.status === 'pending_review'
    );

    if (uploadIndex === -1) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    // Update status
    uploadLogs[uploadIndex].status = action === 'approve' ? 'approved' : 'rejected';
    uploadLogs[uploadIndex].reviewedAt = new Date().toISOString();
    uploadLogs[uploadIndex].reviewedBy = 'admin'; // TODO: Replace with actual admin user ID

    // If rejected, remove the series folder
    if (action === 'reject') {
      const seriesDir = path.join(process.cwd(), 'series');
      const seriesFolder = path.join(seriesDir, seriesTitle);
      
      if (fs.existsSync(seriesFolder)) {
        fs.rmSync(seriesFolder, { recursive: true, force: true });
      }
    }

    // Save updated logs
    fs.writeFileSync(logPath, JSON.stringify(uploadLogs, null, 2));

    return NextResponse.json({
      success: true,
      message: `Series ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      seriesTitle,
      action
    });

  } catch (error) {
    console.error('Error processing upload review:', error);
    return NextResponse.json(
      { error: 'Failed to process upload review' },
      { status: 500 }
    );
  }
}

