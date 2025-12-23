'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/cart/cart-item';
import { formatPrice } from '@/lib/utils';
import { calculateShipping, formatShippingInfo } from '@/lib/shipping';
import { useSettings } from '@/contexts/settings-context';
import Link from 'next/link';
import { ShoppingBag, X, Truck, Gift } from 'lucide-react';

export function CartSheet() {
  const { items, isOpen, toggleCart, getTotalPrice, getTotalItems } =
    useCartStore();
  const { settings } = useSettings();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // Calculate shipping
  const subtotal = totalPrice;
  const shippingCost = calculateShipping(
    subtotal,
    settings?.shippingCost || 20,
    settings?.freeShippingThreshold || 200
  );
  const freeShippingThreshold = settings?.freeShippingThreshold || 200;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const totalWithShipping = subtotal + shippingCost;

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent
        side="left"
        className="flex w-full flex-col p-0 sm:max-w-lg bg-white border-r border-gray-200 left-0 !right-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <SheetTitle className="text-xl font-bold text-black">
            עגלה ({totalItems})
          </SheetTitle>
          <Button
            onClick={toggleCart}
            variant="ghost"
            size="icon"
            className="text-black"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length > 0 ? (
          <>
            {/* פריטי עגלה */}
            <div className="flex-1 overflow-auto">
              {items.map((item, index) => (
                <div key={item.id}>
                  <CartItem item={item} />
                  {index !== items.length - 1 && (
                    <div className="border-b border-gray-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="border-t border-gray-200 p-6 space-y-4 bg-white">
              {/* Free Shipping Progress */}
              {remainingForFreeShipping > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">
                        הוסף {formatPrice(remainingForFreeShipping)} כדי לקבל
                        משלוח חינם
                      </span>
                    </div>
                  </div>
                  <Progress value={freeShippingProgress} className="h-2" />
                </div>
              )}

              {/* Free Shipping Achieved */}
              {remainingForFreeShipping === 0 && shippingCost === 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <Gift className="h-4 w-4" />
                  <span className="font-medium">קיבלת משלוח חינם!</span>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="font-light uppercase tracking-wide text-gray-600">
                  סיכום ביניים
                </span>
                <span className="font-medium text-black">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="font-light uppercase tracking-wide text-gray-600">
                  משלוח
                </span>
                <span
                  className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-black'}`}
                >
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200" />

              {/* Total */}
              <div className="flex justify-between">
                <span className="font-light uppercase tracking-wide text-black text-base">
                  סה"כ
                </span>
                <span className="font-bold text-black text-lg">
                  {formatPrice(totalWithShipping)}
                </span>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-2 gap-2 flex flex-col">
                <Button size="lg" asChild onClick={toggleCart}>
                  <Link href="/checkout">לתשלום</Link>
                </Button>
                <Button size="lg" asChild onClick={toggleCart}>
                  <Link href="/cart">לצפייה בעגלה</Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-6">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <span className="text-lg font-light uppercase tracking-wide text-gray-600">
              העגלה שלך ריקה
            </span>
            <Button
              size="lg"
              variant="outline"
              className="w-full hover:text-black"
              onClick={toggleCart}
            >
              <Link href="/shop">להמשיך לקנות</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
