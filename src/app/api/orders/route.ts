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

    // Send emails with better error handling
    const emailPromises = [
      sendOrderConfirmationEmail(emailData),
      sendOrderNotificationToAdmin(emailData),
    ];

    Promise.all(emailPromises)
      .then((results) => {
        const [confirmationResult, adminNotificationResult] = results;

        console.log('✅ Email Results:');
        console.log(
          'Customer confirmation:',
          confirmationResult.success ? '✅ SENT' : '❌ FAILED'
        );
        console.log(
          'Admin notification:',
          adminNotificationResult.success ? '✅ SENT' : '❌ FAILED'
        );

        if (confirmationResult.success) {
          console.log('Customer email ID:', confirmationResult.data?.data?.id);
        } else {
          console.error('Customer email error:', confirmationResult.error);
        }

        if (adminNotificationResult.success) {
          console.log(
            'Admin email ID:',
            adminNotificationResult.data?.data?.id
          );
        } else {
          console.error('Admin email error:', adminNotificationResult.error);
        }
      })
      .catch((error) => {
        console.error('❌ Critical email error:', error);
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
