// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
  type OrderEmailData,
} from '@/lib/email';
import { startPerformanceTracking } from '@/lib/track-performance';

export async function POST(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/orders', 'POST');

  try {
    const session = await auth();
    const body = await request.json();
    const { customerInfo, items, subtotal, tax, total } = body;

    // STEP 1: Batch fetch all products and variants to avoid N+1 queries
    const productIds = items
      .filter((item: { variantId?: string }) => !item.variantId)
      .map((item: { productId: string }) => item.productId);

    const variantIds = items
      .filter((item: { variantId?: string }) => item.variantId)
      .map((item: { variantId: string }) => item.variantId);

    // Fetch all products and variants in parallel
    const [products, variants] = await Promise.all([
      productIds.length > 0
        ? prisma.product.findMany({
            where: { id: { in: productIds } },
            select: {
              id: true,
              name: true,
              inventory: true,
              inStock: true,
              lowStockThreshold: true,
            },
          })
        : [],
      variantIds.length > 0
        ? prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
        : [],
    ]);

    // Create lookup maps for O(1) access
    const productMap = new Map(products.map((p) => [p.id, p]));
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // Validate inventory for all items
    for (const item of items) {
      if (item.variantId) {
        const variant = variantMap.get(item.variantId);

        if (!variant) {
          trackEnd(404);
          return NextResponse.json(
            {
              error: 'Product variant not found',
              variantId: item.variantId,
            },
            { status: 404 }
          );
        }

        if (!variant.inStock || variant.inventory < item.quantity) {
          trackEnd(400);
          return NextResponse.json(
            {
              error: 'Insufficient inventory',
              product: {
                id: variant.product.id,
                name: `${variant.product.name} - ${variant.name}`,
                available: variant.inventory,
                requested: item.quantity,
              },
            },
            { status: 400 }
          );
        }
      } else {
        const product = productMap.get(item.productId);

        if (!product) {
          trackEnd(404);
          return NextResponse.json(
            {
              error: 'Product not found',
              productId: item.productId,
            },
            { status: 404 }
          );
        }

        if (!product.inStock || product.inventory < item.quantity) {
          trackEnd(400);
          return NextResponse.json(
            {
              error: 'Insufficient inventory',
              product: {
                id: product.id,
                name: product.name,
                available: product.inventory,
                requested: item.quantity,
              },
            },
            { status: 400 }
          );
        }
      }
    }

    // STEP 2: Create order with inventory deduction in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Batch fetch existing alerts to avoid N+1 queries
      const existingAlerts = await tx.inventoryAlert.findMany({
        where: {
          OR: [
            ...productIds.map((id: string) => ({
              productId: id,
              variantId: null,
            })),
            ...variantIds.map((id: string) => ({ variantId: id })),
          ],
          acknowledged: false,
        },
      });

      const alertsMap = new Map(
        existingAlerts.map((alert) => [
          alert.variantId || alert.productId,
          alert,
        ])
      );

      // Create the order first
      const newOrder = await tx.order.create({
        data: {
          userId: session?.user?.id || null,
          status: 'PENDING',
          total: total,
          shippingAddress: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            address: customerInfo.address,
            city: customerInfo.city,
            postalCode: customerInfo.postalCode,
            phone: customerInfo.phone,
            email: customerInfo.email,
            idNumber: customerInfo.idNumber,
          },
          orderItems: {
            create: items.map(
              (item: {
                productId: string;
                variantId?: string | null;
                quantity: number;
                price: number;
                name: string;
              }) => ({
                productId: item.productId,
                variantId: item.variantId || null, // ADD THIS
                quantity: item.quantity,
                price: item.price,
                variantSnapshot: item.variantId
                  ? {
                      // ADD THIS: Store variant details
                      variantId: item.variantId,
                      name: item.name,
                    }
                  : null,
              })
            ),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
              variant: true, // ADD THIS
            },
          },
        },
      });

      // STEP 3: Deduct inventory for each item (using pre-fetched maps)
      for (const item of items) {
        if (item.variantId) {
          // Use pre-fetched variant from map instead of individual query
          const variant = variantMap.get(item.variantId);

          if (!variant) {
            throw new Error(`Variant not found: ${item.variantId}`);
          }

          const previousQty = variant.inventory;
          const newQty = previousQty - item.quantity;

          // Update variant inventory
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventory: newQty,
              inStock: newQty > 0,
            },
          });

          // Create inventory log for variant
          await tx.inventoryLog.create({
            data: {
              productId: variant.productId,
              variantId: item.variantId, // ADD THIS
              type: 'SALE',
              quantity: -item.quantity,
              reason: 'Order placed',
              reference: newOrder.id,
              previousQty,
              newQty,
            },
          });

          // Create alerts if needed for variant
          if (
            variant.lowStockThreshold &&
            newQty <= variant.lowStockThreshold &&
            newQty > 0
          ) {
            const existingAlert = alertsMap.get(item.variantId);
            if (!existingAlert || existingAlert.type !== 'LOW_STOCK') {
              await tx.inventoryAlert.create({
                data: {
                  productId: variant.productId,
                  variantId: item.variantId,
                  type: 'LOW_STOCK',
                  message: `Variant ${variant.name} is running low (${newQty} units)`,
                },
              });
            }
          } else if (newQty === 0) {
            const existingAlert = alertsMap.get(item.variantId);
            if (!existingAlert || existingAlert.type !== 'OUT_OF_STOCK') {
              await tx.inventoryAlert.create({
                data: {
                  productId: variant.productId,
                  variantId: item.variantId,
                  type: 'OUT_OF_STOCK',
                  message: `Variant ${variant.name} is out of stock`,
                },
              });
            }
          }
        } else {
          // Use pre-fetched product from map instead of individual query
          const product = productMap.get(item.productId);

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          const previousQty = product.inventory;
          const newQty = previousQty - item.quantity;

          // Update product inventory
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: newQty,
              inStock: newQty > 0,
            },
          });

          // Create inventory log
          await tx.inventoryLog.create({
            data: {
              productId: item.productId,
              type: 'SALE',
              quantity: -item.quantity,
              reason: 'Order placed',
              reference: newOrder.id,
              previousQty,
              newQty,
            },
          });

          // Create alerts if needed (using pre-fetched alertsMap)
          if (newQty <= product.lowStockThreshold && newQty > 0) {
            const existingAlert = alertsMap.get(item.productId);
            if (!existingAlert || existingAlert.type !== 'LOW_STOCK') {
              await tx.inventoryAlert.create({
                data: {
                  productId: item.productId,
                  type: 'LOW_STOCK',
                  threshold: product.lowStockThreshold,
                  message: `${product.name} is running low (${newQty} units remaining)`,
                },
              });
            }
          } else if (newQty === 0) {
            const existingAlert = alertsMap.get(item.productId);
            if (!existingAlert || existingAlert.type !== 'OUT_OF_STOCK') {
              await tx.inventoryAlert.create({
                data: {
                  productId: item.productId,
                  type: 'OUT_OF_STOCK',
                  message: `${product.name} is out of stock`,
                },
              });
            }
          }
        }
      }

      return newOrder;
    });

    // ... rest of email logic stays the same
    trackEnd(200);
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
