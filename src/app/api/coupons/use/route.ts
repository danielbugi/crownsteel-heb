// src/app/api/coupons/use/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const useSchema = z.object({
  couponId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponId } = useSchema.parse(body);

    // Increment usage count
    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        usageCount: coupon.usageCount,
      },
    });
  } catch (error) {
    console.error('Failed to increment coupon usage:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}
