import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog/posts/[slug] - Get single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: {
        slug: slug,
        status: 'PUBLISHED',
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                nameEn: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
