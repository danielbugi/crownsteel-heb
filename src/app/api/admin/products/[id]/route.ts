// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Convert Decimal to number
    const productData = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
      variants: product.variants.map((v) => ({
        ...v,
        price: v.price?.toNumber() ?? null,
        priceAdjustment: v.priceAdjustment?.toNumber() ?? null,
      })),
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const { id } = await params;

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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update product with variants in transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update base product
      const updatedProduct = await tx.product.update({
        where: { id },
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
          lowStockThreshold:
            lowStockThreshold ?? existingProduct.lowStockThreshold,
          reorderPoint: reorderPoint ?? existingProduct.reorderPoint,
          reorderQuantity: reorderQuantity ?? existingProduct.reorderQuantity,
          sku: sku ?? existingProduct.sku,
          // Variant fields
          hasVariants: hasVariants ?? false,
          variantType,
          variantLabel,
        },
      });

      // Handle variants
      if (hasVariants && variants) {
        // Delete existing variants
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });

        // Create new variants
        if (variants.length > 0) {
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
                productId: id,
                name: variant.name,
                sku: variant.sku,
                price: variant.price || null,
                priceAdjustment: variant.priceAdjustment || null,
                inventory: variant.inventory || 0,
                inStock: variant.inStock ?? true,
                lowStockThreshold: variant.lowStockThreshold || 10,
                image: variant.image || null,
                sortOrder: variant.sortOrder ?? index,
                isDefault: variant.isDefault ?? index === 0,
              })
            ),
          });
        }
      } else {
        // If hasVariants is false, delete all variants
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });
      }

      return updatedProduct;
    });

    // Convert Decimal to number
    const productData = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const { id } = await params;

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
