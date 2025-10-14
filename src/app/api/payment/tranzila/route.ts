import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerName, customerEmail, customerPhone } =
      body;

    // In production, you would:
    // 1. Get your Tranzila terminal ID from environment variables
    // 2. Generate secure payment URL with Tranzila API
    // 3. Include all required parameters

    // For now, we'll create a mock payment URL
    // Replace this with actual Tranzila integration
    const tranzilaTerminalId = process.env.TRANZILA_TERMINAL_ID || 'demo';

    // Tranzila payment URL structure (example)
    const paymentUrl = `${process.env.NEXT_PUBLIC_URL}/payment-success?orderId=${orderId}`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
