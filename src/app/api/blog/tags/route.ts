import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog/tags - Public blog tags listing
export async function GET() {
  try {
    const tags = await prisma.blogTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  status: 'PUBLISHED',
                  publishedAt: { lte: new Date() },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog tags' },
      { status: 500 }
    );
  }
}
