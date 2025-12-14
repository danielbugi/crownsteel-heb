// src/app/api/admin/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

// GET - Fetch inventory overview with alerts
export async function GET(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause based on filter
    const where: { inventory?: number | { gt: number } } = {};

    switch (filter) {
      case 'out':
        where.inventory = 0;
        break;
      case 'in-stock':
        where.inventory = { gt: 0 };
        break;
      // For 'low' and 'all', we'll filter after fetching
    }

    // Fetch products with inventory data
    const [allProductsData, alerts] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          inventoryAlerts: {
            where: { acknowledged: false },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              stockReservations: {
                where: { status: 'ACTIVE' },
              },
            },
          },
        },
        orderBy: { inventory: 'asc' },
      }),
      prisma.inventoryAlert.count({
        where: { acknowledged: false },
      }),
    ]);

    // Filter for low stock products (inventory <= lowStockThreshold)
    let allProducts = allProductsData;
    if (filter === 'low') {
      allProducts = allProducts.filter(
        (product) =>
          product.inventory <= product.lowStockThreshold &&
          product.inventory > 0
      );
    }

    // Apply pagination manually
    const total = allProducts.length;
    const products = allProducts.slice(skip, skip + limit);

    // Calculate reserved quantities
    const productsWithReservations = await Promise.all(
      products.map(async (product) => {
        const reserved = await prisma.stockReservation.aggregate({
          where: {
            productId: product.id,
            status: 'ACTIVE',
          },
          _sum: { quantity: true },
        });

        return {
          ...product,
          price: product.price.toNumber(),
          comparePrice: product.comparePrice?.toNumber() ?? null,
          averageRating: product.averageRating?.toNumber() ?? null,
          reservedQuantity: reserved._sum.quantity || 0,
          availableQuantity: product.inventory - (reserved._sum.quantity || 0),
        };
      })
    );

    return NextResponse.json({
      products: productsWithReservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalProducts: await prisma.product.count(),
        lowStockProducts: (
          await prisma.product.findMany({
            select: { inventory: true, lowStockThreshold: true },
          })
        ).filter((p) => p.inventory <= p.lowStockThreshold && p.inventory > 0)
          .length,
        outOfStockProducts: await prisma.product.count({
          where: { inventory: 0 },
        }),
        activeAlerts: alerts,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST - Adjust inventory
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { productId, quantity, type, reason } = body;

    if (!productId || quantity === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const previousQty = product.inventory;
    const newQty = previousQty + quantity;

    if (newQty < 0) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      );
    }

    // Update product inventory and create log
    const [updatedProduct, inventoryLog] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          inventory: newQty,
          inStock: newQty > 0,
        },
      }),
      prisma.inventoryLog.create({
        data: {
          productId,
          type,
          quantity,
          reason,
          previousQty,
          newQty,
          createdBy: authCheck.session?.user?.id,
        },
      }),
    ]);

    // Check if we need to create alerts
    if (newQty <= product.lowStockThreshold && newQty > 0) {
      await prisma.inventoryAlert.create({
        data: {
          productId,
          type: 'LOW_STOCK',
          threshold: product.lowStockThreshold,
          message: `${product.name} is running low (${newQty} units remaining)`,
        },
      });
    } else if (newQty === 0) {
      await prisma.inventoryAlert.create({
        data: {
          productId,
          type: 'OUT_OF_STOCK',
          message: `${product.name} is out of stock`,
        },
      });
    }

    return NextResponse.json({
      product: {
        ...updatedProduct,
        price: updatedProduct.price.toNumber(),
        comparePrice: updatedProduct.comparePrice?.toNumber() ?? null,
      },
      log: inventoryLog,
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json(
      { error: 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
