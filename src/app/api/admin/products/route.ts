// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET() {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to number for all products
    const productsData = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
    }));

    return NextResponse.json(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check admin authorization
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
      // Create base product
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
          // NEW: Variant fields
          hasVariants: hasVariants ?? false,
          variantType,
          variantLabel,
          variantLabelHe,
        },
      });

      // Create variants if provided
      if (hasVariants && variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((variant: any, index: number) => ({
            productId: newProduct.id,
            name: variant.name,
            nameEn: variant.nameEn || variant.name,
            nameHe: variant.nameHe,
            sku: variant.sku,
            price: variant.price || null,
            priceAdjustment: variant.priceAdjustment || null,
            inventory: variant.inventory || 0,
            inStock: variant.inStock ?? true,
            lowStockThreshold: variant.lowStockThreshold || 10,
            image: variant.image || null,
            sortOrder: variant.sortOrder ?? index,
            isDefault: variant.isDefault ?? index === 0,
          })),
        });
      }

      return newProduct;
    });

    // Convert Decimal to number
    const productData = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
    };

    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
