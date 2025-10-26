import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startPerformanceTracking } from '@/lib/track-performance';

export async function GET(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/categories', 'GET');

  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';

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

    // Map categories to use correct language, with fallbacks
    const localizedCategories = categories.map((category) => {
      let displayName = category.name; // Default fallback

      if (lang === 'he' && category.nameHe) {
        displayName = category.nameHe;
      } else if (lang === 'en' && category.nameEn) {
        displayName = category.nameEn;
      } else if (category.nameEn) {
        displayName = category.nameEn;
      }

      return {
        ...category,
        name: displayName,
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
