import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9_-]+$/),
  description: z.string().optional(),
  descriptionHe: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().min(0.01),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  usagePerUser: z.number().int().min(1).optional(),
  validFrom: z.string().transform((str) => new Date(str)),
  validTo: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  active: z.boolean(),
  campaignType: z
    .enum([
      'NEWSLETTER_WELCOME',
      'FIRST_ORDER',
      'BLACK_FRIDAY',
      'HOLIDAY',
      'FLASH_SALE',
      'ABANDONED_CART',
      'BIRTHDAY',
      'REFERRAL',
      'CUSTOM',
    ])
    .optional(),
});

// GET /api/admin/coupons - List all coupons
export async function GET() {
  try {
    const session = await auth();

    if (
      !session?.user ||
      (session.user as { role?: string }).role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/coupons - Create new coupon
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      (session.user as { role?: string }).role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCouponSchema.parse(body);

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Validate percentage discount
    if (
      validatedData.discountType === 'PERCENTAGE' &&
      validatedData.discountValue > 100
    ) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      );
    }

    // Validate date range
    if (
      validatedData.validTo &&
      validatedData.validFrom > validatedData.validTo
    ) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        ...validatedData,
        createdBy: session.user.id,
      },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
