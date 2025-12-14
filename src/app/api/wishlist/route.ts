// src/app/api/wishlist/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { cache, withCache } from '@/lib/cache';

// GET - Get user's wishlist with product details
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cache user's wishlist for 5 minutes
    const wishlist = await withCache(
      `wishlist:${session.user.id}`,
      () =>
        prisma.wishlist.findMany({
          where: { userId: session.user.id },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      5 // 5 minutes TTL
    );

    // Serialize the wishlist items manually to avoid serializeProduct issues
    const serializedWishlist = wishlist.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice
          ? Number(item.product.comparePrice)
          : null,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
      },
    }));

    return NextResponse.json({ items: serializedWishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear user's wishlist cache
    cache.delete(`wishlist:${session.user.id}`);

    // בדוק אם המשתמש קיים בבסיס הנתונים
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: 'Session expired. Please sign in again.',
          code: 'STALE_SESSION',
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Already in wishlist' },
        { status: 200 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    // Serialize the created item
    const serializedItem = {
      ...wishlistItem,
      product: {
        ...wishlistItem.product,
        price: Number(wishlistItem.product.price),
        comparePrice: wishlistItem.product.comparePrice
          ? Number(wishlistItem.product.comparePrice)
          : null,
        createdAt: wishlistItem.product.createdAt.toISOString(),
        updatedAt: wishlistItem.product.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(
      {
        message: 'Added to wishlist',
        item: serializedItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('💥 Error adding to wishlist:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: 'Failed to add to wishlist',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
