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
  { params }: { params: { id: string } }
) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

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

    const order = await prisma.order.update({
      where: { id: params.id },
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
