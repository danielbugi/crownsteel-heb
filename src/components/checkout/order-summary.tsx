// src/components/checkout/order-summary.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart-store';
import { useSettings } from '@/contexts/settings-context';
import { calculateShipping, formatShippingInfo } from '@/lib/shipping';
import Image from 'next/image';

interface OrderSummaryProps {
  appliedCoupon?: {
    code: string;
    discount: number;
    id: string;
  } | null;
}

export function OrderSummary({ appliedCoupon }: OrderSummaryProps) {
  const { items, getTotalPrice } = useCartStore();
  const { settings } = useSettings();

  const subtotal = getTotalPrice();
  const discountAmount = appliedCoupon?.discount || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;

  // Calculate shipping
  const shippingCost = settings?.shippingCost ?? 20;
  const freeShippingThreshold = settings?.freeShippingThreshold ?? 350;
  const shippingInfo = formatShippingInfo(
    subtotalAfterDiscount,
    shippingCost,
    freeShippingThreshold,
    settings?.currencySymbol || '₪'
  );

  const taxRate = settings?.taxRate ?? 18;
  const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
  const total = subtotalAfterDiscount + shippingInfo.cost + taxAmount;
  const currencySymbol = settings?.currencySymbol || '₪';

  return (
    <Card className="sticky top-4 p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-900">סיכום הזמנה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0 text-gray-800">
        {/* Cart Items */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-secondary">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  כמות: {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm">
                {currencySymbol}
                {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">סך ביניים</span>
            <span className="font-medium">
              {currencySymbol}
              {subtotal.toFixed(2)}
            </span>
          </div>

          {/* Discount Row */}
          {discountAmount > 0 && appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="font-medium">הנחה ({appliedCoupon.code})</span>
              <span className="font-medium">
                -{currencySymbol}
                {discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">משלוח</span>
            <span
              className={`font-medium ${shippingInfo.isFree ? 'text-green-600' : ''}`}
            >
              {shippingInfo.displayText}
            </span>
          </div>

          {/* Free shipping progress indicator */}
          {!shippingInfo.isFree && (
            <div className="text-xs text-muted-foreground">
              {shippingInfo.message}
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              מע&quot;מ ({taxRate}%)
            </span>
            <span className="font-medium">
              {currencySymbol}
              {taxAmount.toFixed(2)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>סה&quot;כ</span>
            <span>
              {currencySymbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
