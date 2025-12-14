import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startPerformanceTracking } from '@/lib/track-performance';
import { withCache } from '@/lib/cache';

// ISR: Revalidate categories every 10 minutes (stable data)
export const revalidate = 600;

export async function GET() {
  const trackEnd = startPerformanceTracking('/api/categories', 'GET');

  try {
    // Cache categories for 10 minutes (they don't change often)
    const categories = await withCache(
      'categories:all',
      () =>
        prisma.category.findMany({
          orderBy: {
            name: 'asc',
          },
          include: {
            _count: {
              select: { products: true },
            },
          },
        }),
      10 // 10 minutes TTL
    );

    // Map categories to include product count
    const localizedCategories = categories.map((category) => {
      return {
        ...category,
        name: category.name,
      };
    });

    trackEnd(200);
    return NextResponse.json(localizedCategories);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching categories:', error);
    }
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
