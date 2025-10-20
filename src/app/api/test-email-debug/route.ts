// src/app/api/test-email-debug/route.ts
// Enhanced version - replace existing file
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'welcome';
  const email = searchParams.get('email') || 'test@example.com';
  const action = searchParams.get('action') || 'test'; // 'test' or 'full-flow'

  console.log('\n===================================');
  console.log('EMAIL DEBUG TEST');
  console.log('===================================');
  console.log('Type:', type);
  console.log('Email:', email);
  console.log('Action:', action);
  console.log('-----------------------------------');
  console.log('Environment Check:');
  console.log(
    'RESEND_API_KEY:',
    process.env.RESEND_API_KEY ? '✓ Set' : '✗ Missing'
  );
  console.log('API Key length:', process.env.RESEND_API_KEY?.length || 0);
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL || 'onboarding@resend.dev');
  console.log('NEXT_PUBLIC_URL:', process.env.NEXT_PUBLIC_URL);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('===================================\n');

  try {
    let result: any;

    // Simple email test
    if (action === 'test') {
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
        message: result?.success
          ? 'Email sent successfully!'
          : 'Email failed to send',
        result,
        env: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          apiKeyLength: process.env.RESEND_API_KEY?.length,
          url: process.env.NEXT_PUBLIC_URL,
          fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        },
      });
    }

    // Full password reset flow test
    if (action === 'full-flow' && type === 'reset') {
      console.log('🔄 Testing FULL PASSWORD RESET FLOW...\n');

      // Step 1: Create/find test user
      console.log('STEP 1: Setting up test user...');
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('testpassword123', 12);
        user = await prisma.user.create({
          data: {
            email,
            name: 'Test User',
            hashedPassword,
            emailVerified: new Date(),
          },
        });
        console.log('✓ Test user created');
      } else {
        console.log('✓ Test user found');
      }

      // Step 2: Generate reset token
      console.log('\nSTEP 2: Generating reset token...');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });
      console.log('✓ Token generated');

      // Step 3: Send email
      console.log('\nSTEP 3: Sending password reset email...');
      const emailResult = await sendPasswordResetEmail(email, resetToken);
      console.log(emailResult.success ? '✓ Email sent' : '✗ Email failed');

      // Step 4: Generate reset URL
      const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;

      console.log('\n===================================');
      console.log('FULL FLOW TEST COMPLETE');
      console.log('===================================');
      console.log('\nReset URL:', resetUrl);
      console.log('\nTest Credentials:');
      console.log('Email:', email);
      console.log('Current Password: testpassword123');
      console.log('\nNext Steps:');
      console.log('1. Check email:', email);
      console.log('2. Or click this URL:', resetUrl);
      console.log('3. Set new password');
      console.log('===================================\n');

      return NextResponse.json({
        success: emailResult.success,
        flow: 'complete',
        steps: {
          userSetup: { status: 'success', userId: user.id },
          tokenGeneration: { status: 'success', token: resetToken },
          emailSending: emailResult,
          resetUrl: resetUrl,
        },
        testCredentials: {
          email,
          currentPassword: 'testpassword123',
        },
        message: 'Full flow test complete. Check logs above for details.',
      });
    }

    return NextResponse.json(
      {
        error: 'Invalid action or type',
        validTypes: ['welcome', 'reset'],
        validActions: ['test', 'full-flow'],
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('\n❌ TEST ERROR:', error);
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
