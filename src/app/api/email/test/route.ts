import { NextRequest, NextResponse } from 'next/server';
import {
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
  sendShippingNotificationEmail,
  sendWelcomeEmail,
  type OrderEmailData,
  type ShippingEmailData,
} from '@/lib/email';

// Test endpoint for sending emails
// Usage: http://localhost:3000/api/email/test?type=order&email=your@email.com

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'order';
  const testEmail = searchParams.get('email') || 'test@example.com';

  try {
    // Test order data
    const mockOrderData: OrderEmailData = {
      orderId: 'TEST-12345',
      customerName: 'John Doe',
      customerEmail: testEmail,
      items: [
        {
          name: 'Silver Steel Ring',
          quantity: 1,
          price: 299,
          image: `${process.env.NEXT_PUBLIC_URL}/products/ring-1.jpg`,
        },
        {
          name: 'Black Leather Bracelet',
          quantity: 2,
          price: 149,
        },
      ],
      subtotal: 597,
      tax: 101,
      shipping: 0,
      total: 698,
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main Street, Apt 4B',
        city: 'Tel Aviv',
        postalCode: '6744300',
        phone: '050-123-4567',
      },
      orderDate: new Date(),
    };

    // Test shipping data
    const mockShippingData: ShippingEmailData = {
      ...mockOrderData,
      trackingNumber: 'IL123456789',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    };

    let result;

    switch (type) {
      case 'order':
        result = await sendOrderConfirmationEmail(mockOrderData);
        break;

      case 'admin':
        result = await sendOrderNotificationToAdmin(mockOrderData);
        break;

      case 'shipped':
        result = await sendShippingNotificationEmail(mockShippingData);
        break;

      case 'welcome':
        result = await sendWelcomeEmail(testEmail, 'John Doe');
        break;

      default:
        return NextResponse.json(
          {
            error: 'Invalid type. Use: order, admin, shipped, or welcome',
          },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${type} email sent successfully to ${testEmail}`,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in email test:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
