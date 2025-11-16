import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/blog/posts - List all blog posts (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
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

// POST /api/admin/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      keywords,
      featuredImage,
      images,
      status,
      categoryId,
      featured,
      tags,
      publishedAt,
      readTime,
    } = body;

    // Create the post
    const post = await prisma.blogPost.create({
      data: {
        title,
        titleEn,
        slug,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        keywords: keywords || [],
        featuredImage,
        images: images || [],
        status: status || 'DRAFT',
        categoryId,
        featured: featured || false,
        authorId: session.user.id,
        authorName: session.user.name || session.user.email,
        publishedAt:
          status === 'PUBLISHED' && publishedAt
            ? new Date(publishedAt)
            : status === 'PUBLISHED'
              ? new Date()
              : null,
        readTime,
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add tags if provided
    if (tags && tags.length > 0) {
      await prisma.blogPostTag.createMany({
        data: tags.map((tagId: string) => ({
          postId: post.id,
          tagId,
        })),
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
