// src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/layout/hero-section';

export default function CheckoutPage() {
  const { items } = useCartStore();

  // Shared coupon state between CheckoutForm and OrderSummary
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    id: string;
  } | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-20 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out.
            </p>
            <Button size="lg" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="Checkout"
        description="Complete your order"
        size="md"
      />

      {/* Checkout Content */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary appliedCoupon={appliedCoupon} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
