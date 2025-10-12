'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/cart/cart-item';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';

export function CartSheet() {
  const { items, isOpen, toggleCart, getTotalPrice, getTotalItems } =
    useCartStore();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg bg-white border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <SheetTitle className="text-xl font-bold text-black">
            CART ({totalItems})
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="h-8 w-8 text-gray-500 hover:text-black"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length > 0 ? (
          <>
            {/* Cart Items */}
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
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="font-light uppercase tracking-wide text-gray-600">
                  Subtotal
                </span>
                <span className="font-medium text-black">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="font-light uppercase tracking-wide text-gray-600">
                  Shipping
                </span>
                <span className="font-medium text-green-600">Free</span>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200" />

              {/* Total */}
              <div className="flex justify-between">
                <span className="font-light uppercase tracking-wide text-black text-base">
                  Total
                </span>
                <span className="font-bold text-black text-lg">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  size="lg"
                  className="w-full"
                  asChild
                  onClick={toggleCart}
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  size="lg"
                  className="w-full"
                  asChild
                  onClick={toggleCart}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 p-6">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
            <span className="text-lg font-light uppercase tracking-wide text-gray-600">
              Your cart is empty
            </span>
            <Button size="lg" className="w-full" asChild onClick={toggleCart}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
