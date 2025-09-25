import { NextRequest, NextResponse } from 'next/server';

// GET /api/dexi/test - Simple test endpoint
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'DEXI test endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
}

// POST /api/dexi/test - Test POST endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'DEXI test POST working',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Test POST failed' },
      { status: 500 }
    );
  }
}
