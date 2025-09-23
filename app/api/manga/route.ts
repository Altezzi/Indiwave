import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Manga API called - fetching from database...');
    
    const mangaFromDB = await prisma.series.findMany({
      where: { 
        isImported: true, 
        isPublished: true 
      },
      include: { 
        _count: { 
          select: { chapters: true } 
        } 
      },
      orderBy: { title: 'asc' }
    });

    console.log(`📊 Found ${mangaFromDB.length} manga in database`);
    console.log(`📊 Returning ${mangaFromDB.length} manga to client`);

    const response = NextResponse.json(mangaFromDB);
    
    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching manga from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manga' },
      { status: 500 }
    );
  }
}
