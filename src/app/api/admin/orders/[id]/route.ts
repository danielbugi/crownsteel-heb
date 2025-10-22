// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { sendShippingNotificationEmail } from '@/lib/email';

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
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                nameEn: true,
                nameHe: true,
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get current order status
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true, // ADD THIS
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If changing to CANCELLED, restore inventory
    const shouldRestoreInventory =
      status === 'CANCELLED' && currentOrder.status !== 'CANCELLED';

    let order;

    if (shouldRestoreInventory) {
      // Use transaction to update order and restore inventory
      order = await prisma.$transaction(async (tx) => {
        // Update order status
        const updatedOrder = await tx.order.update({
          where: { id },
          data: { status },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    nameEn: true,
                    nameHe: true,
                    image: true,
                  },
                },
                variant: {
                  // ADD THIS
                  select: {
                    name: true,
                    nameEn: true,
                    nameHe: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Restore inventory for each item
        for (const item of currentOrder.orderItems) {
          if (item.variantId) {
            // Restore variant inventory
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
              select: {
                id: true,
                name: true,
                nameEn: true,
                inventory: true,
                productId: true,
              },
            });

            if (!variant) {
              console.warn(
                `Variant ${item.variantId} not found, skipping inventory restore`
              );
              continue;
            }

            const previousQty = variant.inventory;
            const newQty = previousQty + item.quantity;

            // Restore variant inventory
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                inventory: newQty,
                inStock: true,
              },
            });

            // Create inventory log for variant restoration
            await tx.inventoryLog.create({
              data: {
                productId: variant.productId,
                variantId: item.variantId, // ADD THIS
                type: 'RETURN',
                quantity: item.quantity,
                reason: 'Order cancelled',
                reference: id,
                previousQty,
                newQty,
                createdBy: authCheck.session?.user?.id,
              },
            });

            console.log(
              `Restored ${item.quantity} units to variant ${variant.nameEn || variant.name}`
            );
          } else {
            // Restore product inventory (existing code)
            const product = await tx.product.findUnique({
              where: { id: item.productId },
              select: {
                id: true,
                name: true,
                nameEn: true,
                inventory: true,
              },
            });

            if (!product) {
              console.warn(
                `Product ${item.productId} not found, skipping inventory restore`
              );
              continue;
            }

            const previousQty = product.inventory;
            const newQty = previousQty + item.quantity;

            // Restore product inventory
            await tx.product.update({
              where: { id: item.productId },
              data: {
                inventory: newQty,
                inStock: true,
              },
            });

            // Create inventory log for restoration
            await tx.inventoryLog.create({
              data: {
                productId: item.productId,
                type: 'RETURN',
                quantity: item.quantity,
                reason: 'Order cancelled',
                reference: id,
                previousQty,
                newQty,
                createdBy: authCheck.session?.user?.id,
              },
            });

            console.log(
              `Restored ${item.quantity} units to ${product.nameEn || product.name}`
            );
          }
        }

        return updatedOrder;
      });

      console.log(`Order ${id} cancelled and inventory restored`);
    } else {
      // Normal status update without inventory changes
      order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  nameEn: true,
                  nameHe: true,
                  image: true,
                },
              },
              variant: {
                // ADD THIS
                select: {
                  name: true,
                  nameEn: true,
                  nameHe: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    // Send email notification when order is shipped
    const shippingAddress = order.shippingAddress as any;
    const customerEmail = shippingAddress?.email || order.user?.email;

    if (status === 'SHIPPED' && customerEmail) {
      sendShippingNotificationEmail({
        orderId: order.id,
        customerName:
          shippingAddress?.firstName && shippingAddress?.lastName
            ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
            : order.user?.name || 'Customer',
        customerEmail,
        items: order.orderItems.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.product.image,
        })),
        subtotal: Number(order.total),
        tax: 0,
        shipping: 0,
        total: Number(order.total),
        shippingAddress: shippingAddress || {},
        orderDate: order.createdAt,
        trackingNumber: undefined,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      })
        .then(() => console.log('Shipping notification sent to', customerEmail))
        .catch((error) =>
          console.error('Failed to send shipping notification:', error)
        );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
