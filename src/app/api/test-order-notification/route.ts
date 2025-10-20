// Test endpoint for order admin notification
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotificationToAdmin, type OrderEmailData } from '@/lib/email';

export async function GET(request: NextRequest) {
  console.log('\n===================================');
  console.log('TESTING ORDER ADMIN NOTIFICATION');
  console.log('===================================');

  try {
    // Sample order data for testing
    const testOrderData: OrderEmailData = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'John Doe',
      customerEmail: 'customer@example.com',
      items: [
        {
          name: 'Steel Ring',
          quantity: 2,
          price: 150,
          image: 'https://example.com/ring.jpg',
        },
        {
          name: 'Silver Necklace',
          quantity: 1,
          price: 300,
        },
      ],
      subtotal: 600,
      tax: 102,
      shipping: 0,
      total: 702,
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test Street',
        city: 'Tel Aviv',
        postalCode: '12345',
        phone: '+972-50-1234567',
      },
      orderDate: new Date(),
    };

    console.log('Test order data prepared:', {
      orderId: testOrderData.orderId,
      customerName: testOrderData.customerName,
      total: testOrderData.total,
      itemCount: testOrderData.items.length,
    });

    console.log('Admin email configured as:', process.env.ADMIN_EMAIL);
    console.log('Sending admin notification...');

    const result = await sendOrderNotificationToAdmin(testOrderData);

    console.log('Notification result:', result);
    console.log('===================================\n');

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'Admin notification sent successfully!'
        : 'Failed to send admin notification',
      result,
      testData: {
        orderId: testOrderData.orderId,
        adminEmail: process.env.ADMIN_EMAIL,
        customerName: testOrderData.customerName,
        total: testOrderData.total,
      },
    });
  } catch (error: any) {
    console.error('Test failed:', error);
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
