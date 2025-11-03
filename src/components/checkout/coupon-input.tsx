// src/components/checkout/coupon-input.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Tag, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CouponInputProps {
  subtotal: number;
  userId?: string;
  onApplyCoupon: (
    discount: number,
    couponCode: string,
    couponId: string
  ) => void;
  onRemoveCoupon: () => void;
  appliedCoupon?: {
    code: string;
    discount: number;
  } | null;
}

export function CouponInput({
  subtotal,
  userId,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          userId,
          subtotal,
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        onApplyCoupon(data.discount, data.coupon.code, data.coupon.id);
        toast.success(`Coupon applied! You saved ₪${data.discount.toFixed(2)}`);
        setCode('');
      } else {
        toast.error(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onRemoveCoupon();
    toast.success('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">
              Coupon Applied: {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-700">
              You saved ₪{appliedCoupon.discount.toFixed(2)}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="text-green-700 hover:text-green-900 hover:bg-green-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Have a coupon code?
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter code (e.g., WELCOME10)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApply()}
          disabled={loading}
          className="flex-1 uppercase !text-black dark:!text-white placeholder:text-muted-foreground bg-white dark:bg-gray-800 border-gray-300"
        />
        <Button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="min-w-[100px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </div>
  );
}
