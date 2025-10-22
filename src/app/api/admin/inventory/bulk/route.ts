// src/app/api/admin/inventory/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

// POST - Bulk inventory update
export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid updates array' },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process each update
    for (const update of updates) {
      const { productId, sku, quantity, type, reason } = update;

      try {
        // Find product by ID or SKU
        const product = await prisma.product.findFirst({
          where: productId ? { id: productId } : { sku },
        });

        if (!product) {
          results.failed++;
          results.errors.push({
            productId,
            sku,
            error: 'Product not found',
          });
          continue;
        }

        const previousQty = product.inventory;
        const newQty = type === 'SET' ? quantity : previousQty + quantity;

        if (newQty < 0) {
          results.failed++;
          results.errors.push({
            productId: product.id,
            error: 'Insufficient inventory',
          });
          continue;
        }

        // Update in transaction
        await prisma.$transaction([
          prisma.product.update({
            where: { id: product.id },
            data: {
              inventory: newQty,
              inStock: newQty > 0,
            },
          }),
          prisma.inventoryLog.create({
            data: {
              productId: product.id,
              type: type === 'SET' ? 'ADJUSTMENT' : type || 'ADJUSTMENT',
              quantity: type === 'SET' ? newQty - previousQty : quantity,
              reason: reason || 'Bulk update',
              previousQty,
              newQty,
              createdBy: authCheck.user?.id,
            },
          }),
        ]);

        // Create alerts if needed
        if (newQty <= product.lowStockThreshold && newQty > 0) {
          await prisma.inventoryAlert.create({
            data: {
              productId: product.id,
              type: 'LOW_STOCK',
              threshold: product.lowStockThreshold,
              message: `${product.name} is running low (${newQty} units)`,
            },
          });
        } else if (newQty === 0) {
          await prisma.inventoryAlert.create({
            data: {
              productId: product.id,
              type: 'OUT_OF_STOCK',
              message: `${product.name} is out of stock`,
            },
          });
        }

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          productId,
          sku,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error bulk updating inventory:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update inventory' },
      { status: 500 }
    );
  }
}
