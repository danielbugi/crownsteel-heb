// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeProducts } from '@/lib/serialize';
import { cache } from '@/lib/cache';
import { Prisma } from '@prisma/client';

// POST - Get multiple products by IDs (for guest wishlist)
export async function POST(request: NextRequest) {
  const startTime = Date.now(); // ← ADDED: Start timer

  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        name: true,
        nameEn: true,
        nameHe: true,
        slug: true,
        description: true,
        descriptionEn: true,
        descriptionHe: true,
        price: true,
        comparePrice: true,
        image: true,
        images: true,
        inStock: true,
        featured: true,
        freeShipping: true,
        inventory: true,
        averageRating: true,
        reviewCount: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameHe: true,
            slug: true,
          },
        },
        variants: {
          where: { inStock: true },
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameHe: true,
            sku: true,
            price: true,
            priceAdjustment: true,
            inventory: true,
            inStock: true,
            image: true,
            sortOrder: true,
            isDefault: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serializedProducts = serializeProducts(products as any);

    // ← ADDED: Track performance
    const duration = Date.now() - startTime;
    prisma.performanceMetric
      .create({
        data: {
          endpoint: '/api/products',
          method: 'POST',
          duration,
          status: 200,
          timestamp: new Date(),
        },
      })
      .catch(console.error);

    return NextResponse.json({ products: serializedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);

    // ← ADDED: Track error
    const duration = Date.now() - startTime;
    prisma.performanceMetric
      .create({
        data: {
          endpoint: '/api/products',
          method: 'POST',
          duration,
          status: 500,
          timestamp: new Date(),
        },
      })
      .catch(console.error);

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now(); // ← ADDED: Start timer

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'featured';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filter parameters
    const metal = searchParams.get('metal');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Generate cache key
    const cacheKey =
      cache.keys.products(
        page,
        limit,
        category || undefined,
        featured === 'true' || undefined
      ) + `-sort-${sort}`;

    // Try to get cached data first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      const duration = Date.now() - startTime;
      prisma.performanceMetric
        .create({
          data: {
            endpoint: '/api/products',
            method: 'GET',
            duration,
            status: 200,
            timestamp: new Date(),
          },
        })
        .catch(console.error);

      return NextResponse.json(cachedResult);
    }

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Apply filters
    // Metal filter - you'll need to add a 'metal' field to your Product model
    // For now, this will filter by product name/description containing the metal type
    if (metal) {
      where.OR = [
        { name: { contains: metal, mode: 'insensitive' } },
        { nameEn: { contains: metal, mode: 'insensitive' } },
        { nameHe: { contains: metal, mode: 'insensitive' } },
        { description: { contains: metal, mode: 'insensitive' } },
        { descriptionEn: { contains: metal, mode: 'insensitive' } },
        { descriptionHe: { contains: metal, mode: 'insensitive' } },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Build orderBy clause based on sort parameter
    let orderBy:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = { createdAt: 'desc' };

    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'featured':
      default:
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          nameEn: true,
          nameHe: true,
          slug: true,
          description: true,
          descriptionEn: true,
          descriptionHe: true,
          price: true,
          comparePrice: true,
          image: true,
          images: true,
          inStock: true,
          featured: true,
          freeShipping: true,
          inventory: true,
          averageRating: true,
          reviewCount: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              nameHe: true,
              slug: true,
            },
          },
          // Only load variants if product has variants and they're in stock
          variants: {
            where: { inStock: true },
            select: {
              id: true,
              name: true,
              nameEn: true,
              nameHe: true,
              sku: true,
              price: true,
              priceAdjustment: true,
              inventory: true,
              inStock: true,
              image: true,
              sortOrder: true,
              isDefault: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serializedProducts = serializeProducts(products as any);

    const result = {
      products: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    // Cache the result for 2 minutes
    cache.set(cacheKey, result, 2);

    // ← ADDED: Track performance
    const duration = Date.now() - startTime;
    prisma.performanceMetric
      .create({
        data: {
          endpoint: '/api/products',
          method: 'GET',
          duration,
          status: 200,
          timestamp: new Date(),
        },
      })
      .catch(console.error);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);

    // ← ADDED: Track error
    const duration = Date.now() - startTime;
    prisma.performanceMetric
      .create({
        data: {
          endpoint: '/api/products',
          method: 'GET',
          duration,
          status: 500,
          timestamp: new Date(),
        },
      })
      .catch(console.error);

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
