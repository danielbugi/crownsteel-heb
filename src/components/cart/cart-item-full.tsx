'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

export const CartItem = React.memo<CartItemProps>(function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const subtotal = item.price * item.quantity;

  const handleIncrement = useCallback(() => {
    updateQuantity(item.productId, item.quantity + 1);
  }, [item.productId, item.quantity, updateQuantity]);

  const handleDecrement = useCallback(() => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  }, [item.productId, item.quantity, updateQuantity]);

  const handleRemove = useCallback(() => {
    removeItem(item.productId);
  }, [item.productId, removeItem]);

  return (
    <div>
      <div className="flex gap-4 py-4">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-secondary">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <Link
                href={`/shop/${item.productId}`}
                className="font-semibold hover:text-accent"
              >
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                {formatPrice(item.price)} each
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-black border-black hover:bg-black hover:text-white"
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center font-medium">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-black border-black hover:bg-black hover:text-white"
                onClick={handleIncrement}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <p className="font-bold">{formatPrice(subtotal)}</p>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
});
