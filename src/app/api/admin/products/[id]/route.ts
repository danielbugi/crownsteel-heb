// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Convert Decimal to number
    const productData = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() ?? null,
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
  { params }: { params: { id: string } }
) {
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
    } = body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
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

    const product = await prisma.product.update({
      where: { id: params.id },
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
        inStock: inStock ?? true,
        featured: featured ?? false,
        freeShipping: freeShipping ?? false,
        inventory: inventory ?? 0,
      },
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
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: params.id },
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
