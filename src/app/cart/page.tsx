'use client';

import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/cart/cart-item-full';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { HeroSection } from '@/components/layout/hero-section';

export default function CartPage() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <div className="container px-4 py-20 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">העגלה שלך ריקה</h1>
            <p className="text-muted-foreground mb-8">
              נראה שעדיין לא הוספת פריטים לעגלה שלך.
            </p>
            <Button size="lg" asChild>
              <Link href="/shop">המשך קניות</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <HeroSection title="עגלת קניות" size="md">
        <Link
          href="/shop"
          className="inline-flex items-center text-sm text-white/80 hover:text-white"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          המשך קניות
        </Link>
        <p className="text-white/80 mt-1">{totalItems} פריטים בעגלה שלך</p>
      </HeroSection>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container px-4 py-4 sm:px-8 sm:py-8 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg shadow border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-gray-900">פריטים בעגלה</CardTitle>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive"
                  >
                    נקה עגלה
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 p-0 text-gray-800">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg shadow border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900">סיכום הזמנה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-0 text-gray-800">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">סך ביניים</span>
                      <span className="font-medium">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">משלוח</span>
                      <span className="font-medium text-green-600">חינם</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>סה&quot;כ</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="lg"
                    asChild
                  >
                    <Link href="/checkout">להמשך לתשלום</Link>
                  </Button>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> משלוח חינם על כל
                      ההזמנות
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> אחריות לכל החיים
                      כלולה
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">✓</span> מדיניות החזרה
                      ל-30 יום
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
