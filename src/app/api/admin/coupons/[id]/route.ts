import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const updateCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9_-]+$/),
  description: z.string().optional(),
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

// GET /api/admin/coupons/[id] - Get single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      (session.user as { role?: string }).role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/coupons/[id] - Update coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      (session.user as { role?: string }).role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateCouponSchema.parse(body);

    const { id } = await params;
    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Check if code is being changed and if new code already exists
    if (validatedData.code !== existingCoupon.code) {
      const codeExists = await prisma.coupon.findUnique({
        where: { code: validatedData.code },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Coupon code already exists' },
          { status: 400 }
        );
      }
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

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error);

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

// DELETE /api/admin/coupons/[id] - Delete coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      (session.user as { role?: string }).role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    // Check if coupon has been used
    if (existingCoupon._count.orders > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete coupon that has been used in orders. Consider deactivating it instead.',
        },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
