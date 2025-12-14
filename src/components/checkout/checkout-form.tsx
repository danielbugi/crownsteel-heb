// src/components/checkout/checkout-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CouponInput } from '@/components/checkout/coupon-input';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/settings-context';
import { useSession } from 'next-auth/react';
import { formatShippingInfo } from '@/lib/shipping';

// Removed idNumber from schema
const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^05\d{8}$/, 'Invalid phone number (05X-XXX-XXXX)'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z
    .string()
    .min(5, 'Postal code is required')
    .max(7, 'Invalid postal code'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  appliedCoupon: {
    code: string;
    discount: number;
    id: string;
  } | null;
  setAppliedCoupon: (
    coupon: { code: string; discount: number; id: string } | null
  ) => void;
}

export function CheckoutForm({
  appliedCoupon,
  setAppliedCoupon,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { settings } = useSettings();
  const router = useRouter();
  const { data: session } = useSession();

  const totalPrice = getTotalPrice();
  const taxRate = settings?.taxRate ?? 18;
  const subtotal = totalPrice;
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

  const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
  const finalTotal = subtotalAfterDiscount + shippingInfo.cost + taxAmount;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const handleApplyCoupon = (
    discountAmt: number,
    code: string,
    couponId: string
  ) => {
    setAppliedCoupon({ code, discount: discountAmt, id: couponId });
    toast.success(`Coupon applied! You saved ₪${discountAmt.toFixed(2)}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsLoading(true);

    try {
      // Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: data,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: subtotal,
          discount: discountAmount,
          tax: taxAmount,
          total: finalTotal,
          couponId: appliedCoupon?.id || null,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();

        // Handle insufficient inventory error
        if (errorData.error === 'Insufficient inventory' && errorData.product) {
          toast.error(
            `${errorData.product.name}: Only ${errorData.product.available} available, but you requested ${errorData.product.requested}`,
            { duration: 5000 }
          );
          setIsLoading(false);
          return;
        }

        // Handle product not found error
        if (errorData.error === 'Product not found') {
          toast.error(
            'One or more products in your cart are no longer available'
          );
          setIsLoading(false);
          return;
        }

        // Generic error
        toast.error(errorData.error || 'Failed to create order');
        setIsLoading(false);
        return;
      }

      const { order } = await orderResponse.json();

      // If coupon was used, increment usage count
      if (appliedCoupon?.id) {
        await fetch('/api/coupons/use', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ couponId: appliedCoupon.id }),
        });
      }

      // Clear cart
      clearCart();

      // Redirect to Tranzila payment page
      const tranzilaResponse = await fetch('/api/payment/tranzila', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          amount: finalTotal,
          customerName: `${data.firstName} ${data.lastName}`,
          customerEmail: data.email,
          customerPhone: data.phone,
        }),
      });

      const { paymentUrl } = await tranzilaResponse.json();

      // Redirect to Tranzila
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error processing order. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="050-123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Tel Aviv" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="6473921" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Coupon Code */}
        <Card>
          <CardHeader>
            <CardTitle>Coupon Code</CardTitle>
          </CardHeader>
          <CardContent>
            <CouponInput
              subtotal={subtotal}
              userId={session?.user?.id}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              appliedCoupon={appliedCoupon}
            />
          </CardContent>
        </Card>

        {/* Order Summary (Mobile Only) */}
        <Card className="lg:hidden">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                {settings?.currencySymbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>
                  -{settings?.currencySymbol}
                  {discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shippingInfo.isFree ? 'text-green-600' : ''}>
                {shippingInfo.displayText}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT ({taxRate}%)</span>
              <span>
                {settings?.currencySymbol}
                {taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>
                {settings?.currencySymbol}
                {finalTotal.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm">Secure payment via Tranzila</p>
              <p className="text-xs text-muted-foreground">
                After clicking &quot;Continue to Payment&quot; you will be
                redirected to a secure payment page
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isLoading || items.length === 0}
        >
          {isLoading
            ? 'Processing...'
            : `Continue to Payment (${settings?.currencySymbol}${finalTotal.toFixed(2)})`}
        </Button>
      </form>
    </Form>
  );
}
