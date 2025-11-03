import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CouponForm } from '@/components/admin/coupon-form';

async function getCoupon(id: string) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    return coupon;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return null;
  }
}

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const coupon = await getCoupon(resolvedParams.id);

  if (!coupon) {
    notFound();
  }

  return (
    <CouponForm
      initialData={{
        id: coupon.id,
        code: coupon.code,
        description: coupon.description || '',
        descriptionHe: coupon.descriptionHe || '',
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        minPurchase: coupon.minPurchase
          ? Number(coupon.minPurchase)
          : undefined,
        maxDiscount: coupon.maxDiscount
          ? Number(coupon.maxDiscount)
          : undefined,
        usageLimit: coupon.usageLimit || undefined,
        usagePerUser: coupon.usagePerUser || 1,
        validFrom: coupon.validFrom,
        validTo: coupon.validTo || undefined,
        active: coupon.active,
        campaignType: coupon.campaignType || undefined,
      }}
      isEditing
    />
  );
}
