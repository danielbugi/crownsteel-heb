import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('Password reset request for:', email);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('User not found, but returning success message');
      return NextResponse.json({
        message: 'If the email exists, a reset link will be sent',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    console.log('Generated reset token for:', user.email);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    console.log('Sending password reset email...');

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken);

    if (emailResult.success) {
      console.log('Password reset email sent successfully');
    } else {
      console.error('Failed to send password reset email:', emailResult.error);
    }

    return NextResponse.json({
      message: 'If the email exists, a reset link will be sent',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
