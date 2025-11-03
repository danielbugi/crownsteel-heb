// src/app/api/wishlist/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Get user's wishlist with product details
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

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
    console.log('🔄 Wishlist POST request started');

    const session = await auth();
    console.log('👤 Full session:', JSON.stringify(session, null, 2));
    console.log('👤 User ID:', session?.user?.id);

    if (!session?.user?.id) {
      console.log('❌ Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // בדוק אם המשתמש קיים בבסיס הנתונים
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    console.log('🔍 User exists in DB:', !!existingUser);
    if (!existingUser) {
      console.log('❌ User not found in database with ID:', session.user.id);
      console.log('🔄 This usually means stale session. User should re-login.');
      return NextResponse.json(
        {
          error: 'Session expired. Please sign in again.',
          code: 'STALE_SESSION',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📦 Request body:', body);

    const { productId } = body;

    if (!productId) {
      console.log('❌ Missing productId');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking if product exists:', productId);

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.log('❌ Product not found:', productId);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('✅ Product found:', product.name);

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
      console.log('⚠️ Already in wishlist');
      return NextResponse.json(
        { message: 'Already in wishlist' },
        { status: 200 }
      );
    }

    console.log('➕ Adding to wishlist...');

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

    console.log('✅ Added to wishlist successfully');

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
