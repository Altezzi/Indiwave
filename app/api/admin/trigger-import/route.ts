import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Manual import trigger requested');
    
    // Trigger the auto-import endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/auto-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Import triggered successfully',
        data: result
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Import failed'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Failed to trigger import:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Import trigger endpoint ready',
    usage: 'POST to trigger manual import'
  });
}
