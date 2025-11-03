// src/app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('email') || 'test@example.com';

  console.log('\n========================================');
  console.log('🧪 TESTING EMAIL CONFIGURATION');
  console.log('========================================\n');

  // Check environment variables
  const checks = {
    resendApiKey: !!process.env.RESEND_API_KEY,
    resendApiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    resendApiKeyPrefix:
      process.env.RESEND_API_KEY?.substring(0, 10) || 'NOT SET',
    fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev (default)',
    nextPublicUrl: process.env.NEXT_PUBLIC_URL || 'NOT SET',
    adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
  };

  console.log('📋 Environment Check:');
  console.log(
    '  RESEND_API_KEY:',
    checks.resendApiKey ? '✅ Set' : '❌ NOT SET'
  );
  console.log('  Key Length:', checks.resendApiKeyLength);
  console.log('  Key Prefix:', checks.resendApiKeyPrefix);
  console.log('  FROM_EMAIL:', checks.fromEmail);
  console.log('  NEXT_PUBLIC_URL:', checks.nextPublicUrl);
  console.log('  ADMIN_EMAIL:', checks.adminEmail);
  console.log('');

  // Try to send a test email
  try {
    console.log('📤 Attempting to send test email to:', testEmail);
    console.log('📨 From:', checks.fromEmail);
    console.log('');

    const result = await resend.emails.send({
      from: checks.fromEmail as string,
      to: testEmail,
      subject: '🧪 Test Email from CrownSteel',
      html: `
        <h1>✅ Email Configuration Working!</h1>
        <p>This is a test email from your CrownSteel newsletter system.</p>
        <p><strong>Configuration Details:</strong></p>
        <ul>
          <li>Sent at: ${new Date().toISOString()}</li>
          <li>From: ${checks.fromEmail}</li>
          <li>To: ${testEmail}</li>
        </ul>
        <p>If you received this email, your Resend configuration is working correctly! 🎉</p>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', result.data?.id);
    console.log('');
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      emailId: result.data?.id,
      sentTo: testEmail,
      sentFrom: checks.fromEmail,
      configuration: checks,
    });
  } catch (error: any) {
    console.error('❌ Failed to send test email');
    console.error('Error:', error.message);
    console.error('');
    console.error('========================================\n');

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        configuration: checks,
        troubleshooting: {
          missingApiKey: !checks.resendApiKey,
          suggestion: !checks.resendApiKey
            ? 'Add RESEND_API_KEY to your .env file'
            : 'Check if your Resend API key is valid and has not expired',
          resendDashboard: 'https://resend.com/api-keys',
        },
      },
      { status: 500 }
    );
  }
}
