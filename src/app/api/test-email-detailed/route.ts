// src/app/api/test-email-detailed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email') || 'dabogatesting@gmail.com';

  console.log('\n===================================');
  console.log('DETAILED EMAIL TEST WITH RESEND');
  console.log('===================================');
  console.log('Recipient:', email);
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Set' : 'Missing');
  console.log(
    'API Key starts with:',
    process.env.RESEND_API_KEY?.substring(0, 5)
  );
  console.log('API Key length:', process.env.RESEND_API_KEY?.length);
  console.log('===================================\n');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Test 1: Verify API key by listing API keys
    console.log('TEST 1: Verifying API Key...');
    try {
      const apiKeys = await resend.apiKeys.list();
      console.log('✓ API Key is valid');
      console.log('API Keys in account:', apiKeys.data?.length || 0);
    } catch (error: any) {
      console.error('✗ API Key verification failed:', error.message);
      return NextResponse.json(
        {
          error: 'API Key Invalid',
          message: error.message,
          hint: 'Check your RESEND_API_KEY in .env.local',
        },
        { status: 401 }
      );
    }

    // Test 2: Send actual email with full response
    console.log('\nTEST 2: Sending Email...');
    const sendResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Test Email from Resend',
      html: '<h1>Test Email</h1><p>If you receive this, your email system works!</p>',
    });

    console.log('\n===================================');
    console.log('RESEND FULL RESPONSE:');
    console.log(JSON.stringify(sendResult, null, 2));
    console.log('===================================\n');

    // Check for errors
    if (sendResult.error) {
      console.error('✗ Email sending failed');
      console.error('Error:', sendResult.error);
      return NextResponse.json(
        {
          success: false,
          error: sendResult.error,
          hint: 'Check the error message above',
        },
        { status: 400 }
      );
    }

    // Success
    console.log('✓ Email sent successfully');
    console.log('Email ID:', sendResult.data?.id);

    return NextResponse.json({
      success: true,
      emailId: sendResult.data?.id,
      fullResponse: sendResult,
      message: 'Email sent! Check your inbox and spam folder.',
      checkDashboard: `https://resend.com/emails/${sendResult.data?.id}`,
      recipient: email,
    });
  } catch (error: any) {
    console.error('\n❌ CRITICAL ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        hint: 'Check server console for details',
      },
      { status: 500 }
    );
  }
}
