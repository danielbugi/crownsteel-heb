// src/components/wishlist/wishlist-sheet-item.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface WishlistSheetItemProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    image: string;
    inStock: boolean;
  };
  onClose: () => void;
}

export function WishlistSheetItem({
  product,
  onClose,
}: WishlistSheetItemProps) {
  const { addItem: addToCart } = useCartStore();
  const { removeItem: removeFromWishlist } = useWishlistStore();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    toast.success('Added to cart!');
  };

  const handleMoveToCart = () => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    removeFromWishlist(product.id, isAuthenticated);
    toast.success('Moved to cart!');
  };

  const handleRemove = () => {
    removeFromWishlist(product.id, isAuthenticated);
  };

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    <div className="flex gap-3 group">
      {/* Product Image */}
      <Link
        href={`/shop/${product.slug}`}
        onClick={onClose}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/shop/${product.slug}`}
          onClick={onClose}
          className="hover:text-primary transition-colors"
        >
          <h4 className="font-semibold text-sm line-clamp-2 mb-1">
            {product.name}
          </h4>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
              <span className="text-xs font-semibold text-green-600">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs flex-1"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            size="sm"
            variant="default"
            className="h-8 text-xs"
            onClick={handleMoveToCart}
            disabled={!product.inStock}
          >
            Move
          </Button>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0"
        onClick={handleRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
