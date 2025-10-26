// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    const lang = searchParams.get('lang') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { nameEn: { contains: query, mode: 'insensitive' } },
        { nameHe: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { descriptionEn: { contains: query, mode: 'insensitive' } },
        { descriptionHe: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.inStock = true;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder as Prisma.SortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder as Prisma.SortOrder;
    } else {
      orderBy.createdAt = sortOrder as Prisma.SortOrder;
    }

    // Execute query with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Localize and serialize
    const localizedProducts = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() || null,
      averageRating: product.averageRating?.toNumber() || null,
      name:
        lang === 'he' && product.nameHe
          ? product.nameHe
          : product.nameEn || product.name,
      description:
        lang === 'he' && product.descriptionHe
          ? product.descriptionHe
          : product.descriptionEn || product.description,
      category: {
        ...product.category,
        name:
          lang === 'he' && product.category.nameHe
            ? product.category.nameHe
            : product.category.nameEn || product.category.name,
      },
    }));

    // ← ADDED: Track performance (success)
    const duration = Date.now() - startTime;
    prisma.performanceMetric
      .create({
        data: {
          endpoint: '/api/search',
          method: 'GET',
          duration,
          status: 200,
          timestamp: new Date(),
        },
      })
      .catch(console.error);

    return NextResponse.json({
      products: localizedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      query,
    });
  } catch (error) {
    console.error('Search error:', error);

    // ← ADDED: Track performance (error)
    const duration = Date.now() - startTime;
    prisma.performanceMetric
      .create({
        data: {
          endpoint: '/api/search',
          method: 'GET',
          duration,
          status: 500,
          timestamp: new Date(),
        },
      })
      .catch(console.error);

    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
