// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
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
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameHe: { contains: search, mode: 'insensitive' } },
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
        include: {
          category: true,
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const {
      name,
      nameEn,
      nameHe,
      slug,
      description,
      descriptionEn,
      descriptionHe,
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
      variantLabelHe,
      variants,
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!nameEn) missingFields.push('nameEn');
    if (!nameHe) missingFields.push('nameHe');
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
          name: name || nameEn,
          nameEn,
          nameHe,
          slug,
          description: description || descriptionEn,
          descriptionEn,
          descriptionHe,
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
          variantLabelHe: variantLabelHe || null,
        },
      });

      if (hasVariants && Array.isArray(variants) && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((variant: any, index: number) => ({
            productId: newProduct.id,
            name: variant.name,
            nameEn: variant.nameEn || variant.name,
            nameHe: variant.nameHe || null,
            sku: variant.sku,
            price: variant.price || null,
            priceAdjustment: variant.priceAdjustment || null,
            inventory: variant.inventory ?? 0,
            inStock: variant.inStock ?? true,
            lowStockThreshold: variant.lowStockThreshold || null,
            image: variant.image || null,
            sortOrder: variant.sortOrder ?? index,
            isDefault: variant.isDefault ?? index === 0,
          })),
        });
      }

      return newProduct;
    });

    const productData = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
