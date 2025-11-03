// src/app/api/coupons/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const validateSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  userId: z.string().optional(),
  subtotal: z.number().min(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId, subtotal } = validateSchema.parse(body);

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if active
    if (!coupon.active) {
      return NextResponse.json(
        { error: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (coupon.validFrom > now) {
      return NextResponse.json(
        { error: 'This coupon is not yet valid' },
        { status: 400 }
      );
    }

    if (coupon.validTo && coupon.validTo < now) {
      return NextResponse.json(
        { error: 'This coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: 'This coupon has reached its usage limit' },
        { status: 400 }
      );
    }

    // Check per-user usage limit
    if (userId && coupon.usagePerUser) {
      const userUsageCount = await prisma.order.count({
        where: {
          userId,
          couponId: coupon.id,
        },
      });

      if (userUsageCount >= coupon.usagePerUser) {
        return NextResponse.json(
          { error: 'You have already used this coupon' },
          { status: 400 }
        );
      }
    }

    // Check minimum purchase
    if (coupon.minPurchase && subtotal < Number(coupon.minPurchase)) {
      return NextResponse.json(
        {
          error: `Minimum purchase of ₪${coupon.minPurchase} required`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(coupon.discountValue)) / 100;

      // Apply max discount if set
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      // FIXED discount
      discountAmount = Number(coupon.discountValue);

      // Don't exceed subtotal
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
    }

    const finalTotal = subtotal - discountAmount;

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
      },
      discount: discountAmount,
      finalTotal,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
