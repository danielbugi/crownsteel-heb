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
import { useCartStore } from '@/store/cart-store';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/settings-context';

const checkoutSchema = z.object({
  email: z.string().email('כתובת דוא"ל לא תקינה'),
  firstName: z.string().min(2, 'שם פרטי נדרש'),
  lastName: z.string().min(2, 'שם משפחה נדרש'),
  phone: z.string().regex(/^05\d{8}$/, 'מספר טלפון לא תקין (05X-XXX-XXXX)'),
  address: z.string().min(5, 'כתובת נדרשת'),
  city: z.string().min(2, 'עיר נדרשת'),
  postalCode: z.string().min(5, 'מיקוד נדרש').max(7, 'מיקוד לא תקין'),
  idNumber: z
    .string()
    .regex(/^\d{9}$/, 'תעודת זהות לא תקינה (9 ספרות)')
    .optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { settings } = useSettings();
  const router = useRouter();
  const totalPrice = getTotalPrice();
  const taxRate = settings?.taxRate || 17;
  const taxAmount = (totalPrice * taxRate) / 100;
  const finalTotal = totalPrice + taxAmount;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      idNumber: '',
    },
  });

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
            variantId: item.variantId || null, // ADD THIS
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: totalPrice,
          tax: taxAmount,
          total: finalTotal,
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
      toast.error('שגיאה בביצוע ההזמנה. אנא נסה שנית.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי קשר</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>דוא"ל</FormLabel>
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
                  <FormLabel>טלפון נייד</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="05X-XXX-XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle>כתובת למשלוח</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם פרטי</FormLabel>
                    <FormControl>
                      <Input placeholder="דני" {...field} />
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
                    <FormLabel>שם משפחה</FormLabel>
                    <FormControl>
                      <Input placeholder="כהן" {...field} />
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
                  <FormLabel>כתובת</FormLabel>
                  <FormControl>
                    <Input placeholder="רחוב הרצל 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>עיר</FormLabel>
                    <FormControl>
                      <Input placeholder="תל אביב" {...field} />
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
                    <FormLabel>מיקוד</FormLabel>
                    <FormControl>
                      <Input placeholder="6473921" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תעודת זהות (אופציונלי)</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle>תשלום</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm">תשלום מאובטח באמצעות Tranzila</p>
              <p className="text-xs text-muted-foreground">
                לאחר לחיצה על "המשך לתשלום" תועבר/י לדף תשלום מאובטח
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
            ? 'מעבד...'
            : `המשך לתשלום (${settings?.currencySymbol}${finalTotal.toFixed(
                2
              )})`}
        </Button>
      </form>
    </Form>
  );
}
