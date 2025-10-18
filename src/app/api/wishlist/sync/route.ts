// src/app/api/wishlist/sync/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// POST - Sync guest wishlist with user's database wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items: guestItems } = await request.json();

    // Validate input
    if (!Array.isArray(guestItems)) {
      return NextResponse.json(
        { error: 'Invalid items format' },
        { status: 400 }
      );
    }

    // If no guest items, just return user's existing wishlist
    if (guestItems.length === 0) {
      const existingWishlist = await prisma.wishlist.findMany({
        where: { userId: session.user.id },
      });

      return NextResponse.json({
        items: existingWishlist.map((item) => item.productId),
        message: 'No items to sync',
      });
    }

    // Get user's existing wishlist from database
    const existingWishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
    });

    const existingProductIds = existingWishlist.map((item) => item.productId);

    // Find new items to add (items in guest list but not in user's DB)
    const newItems = guestItems.filter(
      (productId) => !existingProductIds.includes(productId)
    );

    // Verify all new items are valid products
    if (newItems.length > 0) {
      const validProducts = await prisma.product.findMany({
        where: {
          id: { in: newItems },
        },
        select: { id: true },
      });

      const validProductIds = validProducts.map((p) => p.id);
      const itemsToAdd = newItems.filter((id) => validProductIds.includes(id));

      // Add new items to database
      if (itemsToAdd.length > 0) {
        await prisma.wishlist.createMany({
          data: itemsToAdd.map((productId) => ({
            userId: session.user.id,
            productId,
          })),
          skipDuplicates: true, // Extra safety
        });
      }
    }

    // Get the complete merged wishlist
    const mergedWishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      items: mergedWishlist.map((item) => item.productId),
      message: `Synced successfully. Added ${newItems.length} new items.`,
      addedCount: newItems.length,
    });
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to sync wishlist' },
      { status: 500 }
    );
  }
}
