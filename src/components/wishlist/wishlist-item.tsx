// src/components/wishlist/wishlist-item.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface WishlistItemProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    image: string;
    inStock: boolean;
    category: {
      name: string;
    };
  };
}

export function WishlistItem({ product }: WishlistItemProps) {
  const { addItem: addToCart } = useCartStore();
  const { removeItem: removeFromWishlist } = useWishlistStore();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // State for hover effects and image loading
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleMoveToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    // Add to cart
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    // Remove from wishlist
    removeFromWishlist(product.id, isAuthenticated);

    toast.success('Moved to cart!');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(product.id, isAuthenticated);
  };

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  return (
    <Link href={`/shop/${product.slug}`}>
      <Card
        className="group border-border bg-card hover:shadow-2xl transition-all duration-500 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {!product.inStock && (
              <Badge variant="destructive" className="shadow-lg">
                Out of Stock
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 shadow-lg"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Remove Button */}
          <div
            className={`absolute right-3 top-3 z-10 transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm h-9 w-9"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Move to Cart Button on Hover */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-all duration-300 ${
              isHovered && product.inStock
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            }`}
          >
            <Button
              className="w-full bg-gold-600 hover:bg-gold-700 text-white font-semibold shadow-xl"
              onClick={handleMoveToCart}
              disabled={!product.inStock}
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Move to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-xs uppercase tracking-wider text-black font-semibold mb-2">
            {product.category.name}
          </p>

          <h3 className="text-base md:text-m mb-3 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-s md:text-s font-bold text-foreground">
              {formatPrice(product.price)}
            </p>
            {product.comparePrice && (
              <p className="text-base md:text-s text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
