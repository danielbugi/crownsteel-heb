import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startPerformanceTracking } from '@/lib/track-performance';

export async function GET() {
  const trackEnd = startPerformanceTracking('/api/admin/stats', 'GET');

  try {
    const [totalProducts, totalOrders, totalUsers, totalCategories] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count(),
        prisma.category.count(),
      ]);

    trackEnd(200);
    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
