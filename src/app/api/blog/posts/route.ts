import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BlogStatus } from '@prisma/client';

// Dynamic route to handle query parameters
export const dynamic = 'force-dynamic';

// GET /api/blog/posts - Public blog posts listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const categoryId = searchParams.get('categoryId');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: {
      status: BlogStatus;
      publishedAt: { lte: Date };
      categoryId?: string;
      featured?: boolean;
      tags?: {
        some: {
          tag: {
            slug: string;
          };
        };
      };
      OR?: Array<
        | { title: { contains: string; mode: 'insensitive' } }
        | { excerpt: { contains: string; mode: 'insensitive' } }
      >;
    } = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    };

    if (categoryId) where.categoryId = categoryId;
    if (featured === 'true') where.featured = true;
    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          readTime: true,
          views: true,
          featured: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
