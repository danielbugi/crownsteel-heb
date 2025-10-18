'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';

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

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  console.log('Rendering CartItem for:', item);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
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
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {formatPrice(item.price)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-black hover:bg-gray-100"
              onClick={() => removeItem(item.productId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-gray-300 hover:bg-gray-100"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium text-black">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-gray-300 hover:bg-gray-100"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Subtotal */}
            <span className="font-medium text-black">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
