// src/app/admin/coupons/page.tsx
import { prisma } from '@/lib/prisma';
import { CouponManagement } from '@/components/admin/coupon-management';

async function getCouponStats() {
  const [total, active, totalUsage, totalDiscount] = await Promise.all([
    prisma.coupon.count(),
    prisma.coupon.count({ where: { active: true } }),
    prisma.coupon.aggregate({
      _sum: { usageCount: true },
    }),
    prisma.order.aggregate({
      _sum: { discount: true },
      where: { couponId: { not: null } },
    }),
  ]);

  return {
    total,
    active,
    totalUsage: totalUsage._sum.usageCount || 0,
    totalDiscount: Number(totalDiscount._sum.discount || 0),
  };
}

async function getCoupons() {
  return await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    take: 50,
  });
}

export default async function CouponsPage() {
  const stats = await getCouponStats();
  const coupons = await getCoupons();

  // Transform data to match component expectations
  const transformedCoupons = coupons.map((coupon) => ({
    ...coupon,
    discountValue: Number(coupon.discountValue),
    minPurchase: coupon.minPurchase ? Number(coupon.minPurchase) : null,
    maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    createdAt: coupon.createdAt.toISOString(),
    validFrom: coupon.validFrom.toISOString(),
    validTo: coupon.validTo?.toISOString() || null,
  }));

  return (
    <CouponManagement
      initialCoupons={transformedCoupons}
      initialStats={stats}
    />
  );
}
