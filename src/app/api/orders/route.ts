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

    console.log('Creating order with items:', items);

    // STEP 1: Validate inventory BEFORE creating order
    for (const item of items) {
      if (item.variantId) {
        // Check variant inventory
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

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
        // Check product inventory (no variant)
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            inventory: true,
            inStock: true,
          },
        });

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
            create: items.map((item: any) => ({
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
            })),
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

      // STEP 3: Deduct inventory for each item
      for (const item of items) {
        if (item.variantId) {
          // Deduct from variant inventory
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: {
              id: true,
              name: true,
              inventory: true,
              productId: true,
            },
          });

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
          if (newQty <= (variant as any).lowStockThreshold && newQty > 0) {
            await tx.inventoryAlert.create({
              data: {
                productId: variant.productId,
                variantId: item.variantId,
                type: 'LOW_STOCK',
                message: `Variant ${variant.name} is running low (${newQty} units)`,
              },
            });
          } else if (newQty === 0) {
            await tx.inventoryAlert.create({
              data: {
                productId: variant.productId,
                variantId: item.variantId,
                type: 'OUT_OF_STOCK',
                message: `Variant ${variant.name} is out of stock`,
              },
            });
          }
        } else {
          // Deduct from product inventory (existing code)
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: {
              id: true,
              name: true,
              inventory: true,
              lowStockThreshold: true,
            },
          });

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

          // Create alerts if needed
          if (newQty <= product.lowStockThreshold && newQty > 0) {
            const existingAlert = await tx.inventoryAlert.findFirst({
              where: {
                productId: item.productId,
                type: 'LOW_STOCK',
                acknowledged: false,
              },
            });

            if (!existingAlert) {
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
            const existingAlert = await tx.inventoryAlert.findFirst({
              where: {
                productId: item.productId,
                type: 'OUT_OF_STOCK',
                acknowledged: false,
              },
            });

            if (!existingAlert) {
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

    console.log('Order created with inventory deduction:', order.id);

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
