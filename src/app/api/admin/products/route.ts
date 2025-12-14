// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { startPerformanceTracking } from '@/lib/track-performance';

export async function GET(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/admin/products', 'GET');

  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    trackEnd(401);
    return authCheck.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');

    // Build where clause
    const where: {
      OR?: Array<
        | { name: { contains: string; mode: 'insensitive' } }
        | { description: { contains: string; mode: 'insensitive' } }
        | { sku: { contains: string; mode: 'insensitive' } }
      >;
      categoryId?: string;
      featured?: boolean;
      inStock?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (inStock === 'true') {
      where.inStock = true;
    } else if (inStock === 'false') {
      where.inStock = false;
    }

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          comparePrice: true,
          image: true,
          images: true,
          inStock: true,
          featured: true,
          freeShipping: true,
          inventory: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          averageRating: true,
          reviewCount: true,
          sku: true,
          lowStockThreshold: true,
          reorderPoint: true,
          reorderQuantity: true,
          hasVariants: true,
          variantType: true,
          variantLabel: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Convert Decimal to number for all products
    const productsData = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
      averageRating: product.averageRating?.toNumber() ?? null,
    }));

    trackEnd(200);
    return NextResponse.json({
      products: productsData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching products:', error);
    }
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/admin/products', 'POST');

  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    trackEnd(401);
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      comparePrice,
      image,
      images,
      categoryId,
      inStock,
      featured,
      freeShipping,
      inventory,
      lowStockThreshold,
      reorderPoint,
      reorderQuantity,
      sku,
      hasVariants,
      variantType,
      variantLabel,
      variants,
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!slug) missingFields.push('slug');
    if (!price) missingFields.push('price');
    if (!categoryId) missingFields.push('categoryId');
    if (!image) missingFields.push('image');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product with variants in transaction
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          slug,
          description: description || null,
          price,
          comparePrice: comparePrice || null,
          image,
          images: images || [],
          categoryId,
          inStock: hasVariants ? true : (inStock ?? true),
          featured: featured ?? false,
          freeShipping: freeShipping ?? false,
          inventory: hasVariants ? 0 : (inventory ?? 0),
          lowStockThreshold: lowStockThreshold ?? 10,
          reorderPoint: reorderPoint ?? 20,
          reorderQuantity: reorderQuantity ?? 50,
          sku: sku || null,
          hasVariants: hasVariants ?? false,
          variantType: variantType || null,
          variantLabel: variantLabel || null,
        },
      });

      if (hasVariants && Array.isArray(variants) && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map(
            (
              variant: {
                name: string;
                sku: string;
                price?: number;
                priceAdjustment?: number;
                inventory?: number;
                inStock?: boolean;
                lowStockThreshold?: number;
                image?: string;
                sortOrder?: number;
                isDefault?: boolean;
              },
              index: number
            ) => ({
              productId: newProduct.id,
              name: variant.name,
              sku: variant.sku,
              price: variant.price || null,
              priceAdjustment: variant.priceAdjustment || null,
              inventory: variant.inventory ?? 0,
              inStock: variant.inStock ?? true,
              lowStockThreshold: variant.lowStockThreshold || null,
              image: variant.image || null,
              sortOrder: variant.sortOrder ?? index,
              isDefault: variant.isDefault ?? index === 0,
            })
          ),
        });
      }

      return newProduct;
    });

    const productData = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
    };

    trackEnd(201);
    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error creating product:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
