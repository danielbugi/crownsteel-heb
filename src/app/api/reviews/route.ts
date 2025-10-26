// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { startPerformanceTracking } from '@/lib/track-performance';

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/reviews', 'GET');

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status') || 'APPROVED';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    if (!productId) {
      trackEnd(400);
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          status: status as any,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          productId,
          status: status as any,
        },
      }),
    ]);

    trackEnd(200);
    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit a new review
export async function POST(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/reviews', 'POST');

  try {
    const session = await auth();

    if (!session || !session.user) {
      trackEnd(401);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: validatedData.productId,
        },
      },
    });

    if (existingReview) {
      trackEnd(400);
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user purchased this product (verified purchase)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: validatedData.productId,
        order: {
          userId: session.user.id,
          status: {
            in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'],
          },
        },
      },
    });

    // Create review
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        verified: !!hasPurchased,
        status: 'PENDING', // Reviews need admin approval
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Update product rating stats
    await updateProductRatingStats(validatedData.productId);

    trackEnd(201);
    return NextResponse.json(
      {
        review,
        message:
          'Review submitted successfully. It will be visible after approval.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      trackEnd(400);
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// Helper function to update product rating statistics
async function updateProductRatingStats(productId: string) {
  const stats = await prisma.review.aggregate({
    where: {
      productId,
      status: 'APPROVED',
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: stats._avg.rating || 0,
      reviewCount: stats._count.rating,
    },
  });
}
