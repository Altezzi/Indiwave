import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') ?? '';
    const page = Number(searchParams.get('page') ?? 1);
    const pageSize = Number(searchParams.get('pageSize') ?? 24);

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { tags: { contains: q, mode: 'insensitive' } },
            { authors: { contains: q, mode: 'insensitive' } }
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.series.findMany({
        where: {
          ...where,
          isPublished: true // Only show published series
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { chapters: true }
          }
        }
      }),
      prisma.series.count({ 
        where: {
          ...where,
          isPublished: true
        }
      }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}
