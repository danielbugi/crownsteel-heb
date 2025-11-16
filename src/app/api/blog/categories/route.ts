import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog/categories - Public blog categories listing
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}
