// Debug actual order email sending
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderNotificationToAdmin, type OrderEmailData } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    console.log('\n===================================');
    console.log('DEBUGGING RECENT ORDERS');
    console.log('===================================');

    // Get the most recent order
    const recentOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!recentOrder) {
      return NextResponse.json({
        message: 'No orders found in database',
        suggestion: 'Try placing a test order first',
      });
    }

    console.log('Recent order found:', {
      id: recentOrder.id,
      createdAt: recentOrder.createdAt,
      total: recentOrder.total,
      itemCount: recentOrder.orderItems.length,
      hasShippingAddress: !!recentOrder.shippingAddress,
    });

    // Check if shipping address exists and is valid
    if (!recentOrder.shippingAddress) {
      return NextResponse.json({
        error: 'Order has no shipping address',
        orderId: recentOrder.id,
        suggestion: 'This might cause email sending to fail',
      });
    }

    const shippingAddr = recentOrder.shippingAddress as any;

    // Recreate the email data from the order
    const emailData: OrderEmailData = {
      orderId: recentOrder.id,
      customerName: `${shippingAddr.firstName} ${shippingAddr.lastName}`,
      customerEmail: shippingAddr.email,
      items: recentOrder.orderItems.map((item) => ({
        name: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
        price: Number(item.price),
        image: item.product?.image,
      })),
      subtotal: Number(recentOrder.total) * 0.9, // Estimate
      tax: Number(recentOrder.total) * 0.1, // Estimate
      shipping: 0,
      total: Number(recentOrder.total),
      shippingAddress: {
        firstName: shippingAddr.firstName,
        lastName: shippingAddr.lastName,
        address: shippingAddr.address,
        city: shippingAddr.city,
        postalCode: shippingAddr.postalCode,
        phone: shippingAddr.phone,
      },
      orderDate: recentOrder.createdAt,
    };

    console.log(
      'Attempting to resend admin notification for order:',
      recentOrder.id
    );

    // Try to send the admin notification
    const result = await sendOrderNotificationToAdmin(emailData);

    console.log('Email send result:', result);
    console.log('===================================\n');

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'Admin notification resent successfully!'
        : 'Failed to resend admin notification',
      orderDetails: {
        id: recentOrder.id,
        createdAt: recentOrder.createdAt,
        customerEmail: shippingAddr.email,
        total: recentOrder.total,
        adminEmail: process.env.ADMIN_EMAIL,
      },
      emailResult: result,
    });
  } catch (error: any) {
    console.error('Debug failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
