import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    platform: 'vercel',
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'unknown',
    version: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
  });
}

export async function POST() {
  // Health check endpoint for Vercel
  return NextResponse.json({
    healthy: true,
    timestamp: new Date().toISOString()
  });
}

