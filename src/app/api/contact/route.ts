import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormNotification } from '@/lib/email';
import { startPerformanceTracking } from '@/lib/track-performance';

export async function POST(request: NextRequest) {
  const trackEnd = startPerformanceTracking('/api/contact', 'POST');

  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      trackEnd(400);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      trackEnd(400);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Send email notification to admin
    const emailResult = await sendContactFormNotification({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (!emailResult.success) {
      console.error('Failed to send contact form email:', emailResult.error);
      // Don't fail the request if email fails
    }

    // TODO: Optionally save to database
    // await prisma.contactSubmission.create({...})

    trackEnd(200);
    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    trackEnd(500);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
