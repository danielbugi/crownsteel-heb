// src/app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// DELETE - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if user owns the review or is admin
    const userRole = (session.user as any).role;
    if (review.userId !== session.user.id && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: params.id },
    });

    // Update product rating stats
    await updateProductRatingStats(review.productId);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

// PATCH - Update review (helpful count or admin approval)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, status } = body;

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Handle helpful vote
    if (action === 'helpful') {
      const updatedReview = await prisma.review.update({
        where: { id: params.id },
        data: {
          helpful: review.helpful + 1,
        },
      });

      return NextResponse.json({ review: updatedReview });
    }

    // Handle admin approval/rejection
    if (status) {
      const userRole = (session.user as any).role;
      if (userRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const updatedReview = await prisma.review.update({
        where: { id: params.id },
        data: { status },
      });

      // Update product rating stats if approved/rejected
      await updateProductRatingStats(review.productId);

      return NextResponse.json({ review: updatedReview });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// Helper function
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
