import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'welcome';
  const email = searchParams.get('email') || 'test@example.com';

  console.log('\n🔍 EMAIL DEBUG TEST');
  console.log('==================');
  console.log('Type:', type);
  console.log('Email:', email);
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);
  console.log('NEXT_PUBLIC_URL:', process.env.NEXT_PUBLIC_URL);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('==================\n');

  try {
    let result;

    if (type === 'welcome') {
      console.log('📧 Testing welcome email...');
      result = await sendWelcomeEmail(email, 'Test User');
    } else if (type === 'reset') {
      console.log('📧 Testing password reset email...');
      result = await sendPasswordResetEmail(email, 'test-token-123');
    }

    console.log('\n📊 RESULT:', result);

    return NextResponse.json({
      success: result?.success,
      message: result?.success ? 'Email sent!' : 'Email failed',
      result,
      env: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyLength: process.env.RESEND_API_KEY?.length,
        url: process.env.NEXT_PUBLIC_URL,
      },
    });
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
