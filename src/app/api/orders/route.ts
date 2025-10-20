import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
  type OrderEmailData,
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { customerInfo, items, subtotal, tax, total } = body;

    console.log('Creating order with items:', items);

    // Create order
    const order = await prisma.order.create({
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
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log('Order created:', order.id);
    console.log('Order items count:', order.orderItems.length);

    // Prepare email data
    const emailData: OrderEmailData = {
      orderId: order.id,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerEmail: customerInfo.email,
      items: order.orderItems.map((item) => {
        if (!item.product) {
          console.error('Product not found for order item:', item.id);
          throw new Error(`Product not found for item ${item.productId}`);
        }

        return {
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.product.image,
        };
      }),
      subtotal: Number(subtotal),
      tax: Number(tax),
      shipping: 0,
      total: Number(total),
      shippingAddress: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        phone: customerInfo.phone,
      },
      orderDate: order.createdAt,
    };

    console.log('Sending emails...');

    // Send emails asynchronously (don't wait for them)
    Promise.all([
      sendOrderConfirmationEmail(emailData),
      sendOrderNotificationToAdmin(emailData),
    ])
      .then(() => {
        console.log('Order emails sent successfully');
      })
      .catch((error) => {
        console.error('Error sending order emails:', error);
        // Don't fail the order if emails fail
      });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
