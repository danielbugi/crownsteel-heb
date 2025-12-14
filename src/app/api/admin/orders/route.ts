// src/app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { withCache, cache } from '@/lib/cache';

export async function GET() {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    // Cache admin orders for 2 minutes
    const orders = await withCache(
      'admin:orders:all',
      () =>
        prisma.order.findMany({
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      2 // 2 minutes TTL (admin data needs to be relatively fresh)
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
