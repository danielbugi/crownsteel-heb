import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startPerformanceTracking } from '@/lib/track-performance';

export async function GET() {
  const trackEnd = startPerformanceTracking('/api/categories', 'GET');

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

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
    console.error('Error fetching categories:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
