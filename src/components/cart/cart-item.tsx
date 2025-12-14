'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Minus, Plus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    variantId?: string | null;
    name: string;
    price: number;
    image: string;
    quantity: number;
    inStock?: boolean;
    maxQuantity?: number;
  };
}

export const CartItem = React.memo<CartItemProps>(function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  // Extract variant info from name if it exists
  const hasVariant = item.name.includes(' - ');
  const [productName, variantName] = hasVariant
    ? item.name.split(' - ')
    : [item.name, null];

  // Stock and quantity limits
  const maxQuantity = item.maxQuantity || 10;
  const isOutOfStock = item.inStock === false;
  const isAtMaxQuantity = item.quantity >= maxQuantity;

  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity < 1 || newQuantity > maxQuantity) return;

      setIsUpdating(true);
      try {
        updateQuantity(item.productId, newQuantity, item.variantId);
      } finally {
        setIsUpdating(false);
      }
    },
    [item.productId, item.variantId, maxQuantity, updateQuantity]
  );

  const handleRemove = useCallback(() => {
    removeItem(item.productId, item.variantId);
  }, [item.productId, item.variantId, removeItem]);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative h-24 w-24 overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Name and Remove Button */}
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-light uppercase tracking-wide text-sm text-black line-clamp-2">
                {productName}
              </h3>
              {/* ADD THIS: Show variant badge if exists */}
              {variantName && (
                <Badge variant="outline" className="mt-1">
                  {variantName}
                </Badge>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {formatPrice(item.price)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-black hover:bg-gray-100"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            {/* Out of Stock Warning */}
            {isOutOfStock && (
              <div className="flex items-center gap-1 text-red-500 text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>Out of stock</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border border-black text-black"
                disabled={item.quantity <= 1 || isUpdating}
                onClick={() => handleQuantityChange(item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center text-sm font-medium text-black">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border border-black text-black"
                disabled={isAtMaxQuantity || isOutOfStock || isUpdating}
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold">
                {formatPrice(item.price * item.quantity)}
              </div>
              {isAtMaxQuantity && !isOutOfStock && (
                <div className="text-xs text-orange-500 mt-1">
                  Max: {maxQuantity}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
