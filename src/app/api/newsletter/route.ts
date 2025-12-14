// // src/app/api/newsletter/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { z } from 'zod';
// import { resend } from '@/lib/email';
// import WelcomeDiscountEmail from '@/emails/welcome-discount';

// const newsletterSchema = z.object({
//   email: z.string().email('Invalid email address'),
// });

// /**
//  * Generate unique coupon code
//  */
// function generateCouponCode(email: string): string {
//   const prefix = 'WELCOME';
//   const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
//   return `${prefix}${randomPart}`;
// }

// /**
//  * Create welcome coupon for new subscriber
//  */
// async function createWelcomeCoupon(newsletterId: string, email: string) {
//   const code = generateCouponCode(email);
//   const validFrom = new Date();
//   const validTo = new Date();
//   validTo.setDate(validTo.getDate() + 30); // Valid for 30 days

//   return await prisma.coupon.create({
//     data: {
//       code,
//       description: '10% off your first order - Welcome discount',
//       descriptionHe: '10% הנחה על ההזמנה הראשונה - הנחת קבלת פנים',
//       discountType: 'PERCENTAGE',
//       discountValue: 10, // 10%
//       minPurchase: 0, // No minimum
//       maxDiscount: null, // No maximum
//       usageLimit: 1, // Single use
//       usagePerUser: 1,
//       validFrom,
//       validTo,
//       active: true,
//       campaignType: 'NEWSLETTER_WELCOME',
//       newsletterId,
//     },
//   });
// }

// /**
//  * Send welcome email with discount code
//  */
// async function sendWelcomeEmail(
//   email: string,
//   couponCode: string,
//   validUntil: Date
// ) {
//   try {
//     await resend.emails.send({
//       from: 'CrownSteel <noreply@crownsteel.com>',
//       to: email,
//       subject: "🎉 Welcome! Here's Your 10% Discount Code",
//       react: WelcomeDiscountEmail({
//         email,
//         couponCode,
//         discountPercentage: 10,
//         validUntil,
//       }),
//     });
//     return { success: true };
//   } catch (error) {
//     console.error('Failed to send welcome email:', error);
//     return { success: false, error };
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { email } = newsletterSchema.parse(body);

//     // Check if email already exists
//     const existing = await prisma.newsletter.findUnique({
//       where: { email },
//       include: { coupons: true },
//     });

//     if (existing) {
//       if (existing.subscribed) {
//         // Already subscribed - check if they have a coupon
//         if (existing.coupons.length > 0) {
//           const activeCoupon = existing.coupons.find((c) => c.active);
//           if (activeCoupon) {
//             return NextResponse.json(
//               {
//                 error: 'This email is already subscribed',
//                 hasCoupon: true,
//               },
//               { status: 400 }
//             );
//           }
//         }

//         return NextResponse.json(
//           { error: 'This email is already subscribed' },
//           { status: 400 }
//         );
//       } else {
//         // Resubscribe
//         await prisma.newsletter.update({
//           where: { email },
//           data: { subscribed: true },
//         });

//         // Create new coupon for resubscriber
//         const coupon = await createWelcomeCoupon(existing.id, email);

//         // Send welcome email
//         await sendWelcomeEmail(email, coupon.code, coupon.validTo!);

//         return NextResponse.json({
//           success: true,
//           message: 'Successfully resubscribed to newsletter!',
//           couponCode: coupon.code,
//         });
//       }
//     }

//     // Create new subscription
//     const newsletter = await prisma.newsletter.create({
//       data: { email },
//     });

//     // Create welcome coupon
//     const coupon = await createWelcomeCoupon(newsletter.id, email);

//     // Send welcome email with coupon
//     const emailResult = await sendWelcomeEmail(
//       email,
//       coupon.code,
//       coupon.validTo!
//     );

//     if (!emailResult.success) {
//       console.error('Welcome email failed, but subscription created');
//     }

//     return NextResponse.json({
//       success: true,
//       message:
//         'Successfully subscribed! Check your email for a welcome discount.',
//       couponCode: coupon.code,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     console.error('Newsletter subscription error:', error);
//     return NextResponse.json(
//       { error: 'Failed to subscribe to newsletter' },
//       { status: 500 }
//     );
//   }
// }

// // Unsubscribe endpoint
// export async function DELETE(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get('email');

//     if (!email) {
//       return NextResponse.json({ error: 'Email is required' }, { status: 400 });
//     }

//     await prisma.newsletter.update({
//       where: { email },
//       data: { subscribed: false },
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Successfully unsubscribed from newsletter',
//     });
//   } catch (error) {
//     console.error('Newsletter unsubscribe error:', error);
//     return NextResponse.json(
//       { error: 'Failed to unsubscribe' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { resend } from '@/lib/email';
import WelcomeDiscountEmail from '@/emails/welcome-discount';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Generate unique coupon code
 */
function generateCouponCode(email: string): string {
  const prefix = 'WELCOME';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomPart}`;
}

/**
 * Create welcome coupon for new subscriber
 */
async function createWelcomeCoupon(newsletterId: string, email: string) {
  const code = generateCouponCode(email);
  const validFrom = new Date();
  const validTo = new Date();
  validTo.setDate(validTo.getDate() + 30); // Valid for 30 days

  return await prisma.coupon.create({
    data: {
      code,
      description: '10% off your first order - Welcome discount',
      discountType: 'PERCENTAGE',
      discountValue: 10, // 10%
      minPurchase: 0, // No minimum
      maxDiscount: null, // No maximum
      usageLimit: 1, // Single use
      usagePerUser: 1,
      validFrom,
      validTo,
      active: true,
      campaignType: 'NEWSLETTER_WELCOME',
      newsletterId,
    },
  });
}

/**
 * Send welcome email with discount code
 */
async function sendWelcomeEmail(
  email: string,
  couponCode: string,
  validUntil: Date
) {
  try {
    console.log('📧 Attempting to send welcome email to:', email);
    console.log('🎟️ Coupon code:', couponCode);
    console.log('📅 Valid until:', validUntil);

    // Get FROM_EMAIL from environment or use default
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    console.log('📤 Sending from:', fromEmail);

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "🎉 Welcome! Here's Your 10% Discount Code",
      react: WelcomeDiscountEmail({
        email,
        couponCode,
        discountPercentage: 10,
        validUntil,
      }),
    });

    console.log('✅ Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Newsletter subscription request:', body);

    const { email } = newsletterSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email },
      include: { coupons: true },
    });

    if (existing) {
      console.log('⚠️ Email already exists:', email);

      if (existing.subscribed) {
        // Already subscribed - check if they have a coupon
        if (existing.coupons.length > 0) {
          const activeCoupon = existing.coupons.find((c) => c.active);
          if (activeCoupon) {
            console.log('✅ User has active coupon:', activeCoupon.code);
            return NextResponse.json(
              {
                error: 'This email is already subscribed',
                hasCoupon: true,
                couponCode: activeCoupon.code,
              },
              { status: 400 }
            );
          }
        }

        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Resubscribe
        console.log('🔄 Resubscribing user:', email);

        await prisma.newsletter.update({
          where: { email },
          data: { subscribed: true },
        });

        // Create new coupon for resubscriber
        const coupon = await createWelcomeCoupon(existing.id, email);
        console.log('🎟️ Created new coupon for resubscriber:', coupon.code);

        // Send welcome email
        const emailResult = await sendWelcomeEmail(
          email,
          coupon.code,
          coupon.validTo!
        );

        if (!emailResult.success) {
          console.error('⚠️ Email failed but subscription succeeded');
        }

        return NextResponse.json({
          success: true,
          message: 'Successfully resubscribed to newsletter!',
          couponCode: coupon.code,
          emailSent: emailResult.success,
        });
      }
    }

    // Create new subscription
    console.log('✨ Creating new subscription for:', email);

    const newsletter = await prisma.newsletter.create({
      data: { email },
    });

    console.log('✅ Newsletter subscription created:', newsletter.id);

    // Create welcome coupon
    const coupon = await createWelcomeCoupon(newsletter.id, email);
    console.log('🎟️ Created coupon:', coupon.code);

    // Send welcome email with coupon
    const emailResult = await sendWelcomeEmail(
      email,
      coupon.code,
      coupon.validTo!
    );

    if (!emailResult.success) {
      console.error('⚠️ Email failed but subscription and coupon created');
      console.error('Email error:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: emailResult.success
        ? 'Successfully subscribed! Check your email for a welcome discount.'
        : 'Successfully subscribed! However, there was an issue sending the email. Your coupon code is: ' +
          coupon.code,
      couponCode: coupon.code,
      emailSent: emailResult.success,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.issues);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('❌ Newsletter subscription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await prisma.newsletter.update({
      where: { email },
      data: { subscribed: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
