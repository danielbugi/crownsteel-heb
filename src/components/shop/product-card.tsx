// src/components/shop/product-card.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { QuickViewModal } from '@/components/shop/quick-view-modal';
// ✅ UPDATED: Only importing StockAlertBadgeCompact for bottom section
import { StockAlertBadgeCompact } from '@/components/ui/stock-alert-badge';
import { ProductBadge } from '@/components/product/product-badge';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  description?: string | null;
  inStock: boolean;
  featured: boolean;
  inventory?: number;
  lowStockThreshold?: number; // ✅ ADDED: For stock alerts
  createdAt?: string;
  hasVariants?: boolean;
  variantLabel?: string;
  variants?: Array<{
    id: string;
    name: string;
    inventory: number;
    inStock: boolean;
  }>;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  isWishlistItem?: boolean;
  viewMode?: 'grid-2' | 'grid-3' | 'grid-4' | 'carousel';
  priority?: boolean; // For above-the-fold image optimization
}

export const ProductCard = React.memo<ProductCardProps>(function ProductCard({
  product,
  isWishlistItem = false,
  viewMode = 'carousel',
  priority = false,
}) {
  // Cart store
  const { addItem } = useCartStore();

  // Wishlist store
  const {
    isInWishlist,
    toggleItem: toggleWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();

  // Session for auth check
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // Hydration fix: Add mounted state
  const [mounted, setMounted] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // State
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  // Hydration fix: Update wishlist state after mount
  useEffect(() => {
    setMounted(true);
    setInWishlist(isInWishlist(product.id));
  }, [isInWishlist, product.id]);

  // Hydration fix: Subscribe to wishlist changes
  useEffect(() => {
    if (!mounted) return;

    const unsubscribe = useWishlistStore.subscribe((state) => {
      setInWishlist(state.isInWishlist(product.id));
    });

    return unsubscribe;
  }, [mounted, product.id]);

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();

    // If product has variants, redirect to detail page
    if (
      product.hasVariants &&
      product.variants &&
      product.variants.length > 0
    ) {
      toast.error(`Please select a ${product.variantLabel || 'variant'} first`);
      window.location.href = `/shop/${product.slug}`;
      return;
    }

    if (!product.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }

    // Add to cart
    addItem({
      id: product.id,
      productId: product.id,
      variantId: null,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    // If this is a wishlist item, remove from wishlist
    if (isWishlistItem) {
      removeFromWishlist(product.id, isAuthenticated);
      toast.success('Moved to cart!');
    } else {
      toast.success('Added to cart!');
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, isAuthenticated);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  // Determine image container class based on viewMode
  const imageContainerClass =
    viewMode === 'grid-4' || viewMode === 'carousel'
      ? 'relative overflow-hidden bg-secondary h-[480px] md:h-[560px] lg:h-[480px]' // Boutique luxury heights
      : 'relative aspect-square overflow-hidden bg-secondary'; // 1:1 ratio for grid-2 and grid-3

  return (
    <>
      <Link href={`/shop/${product.slug}`}>
        <Card
          className="group border border-gray-200 bg-white hover:border-gray-300 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={imageContainerClass}>
            {/* Primary Image */}
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Secondary Image (shown on hover) */}
            {product.images && product.images.length > 1 && (
              <Image
                src={product.images[1]}
                alt={`${product.name} - alternate view`}
                fill
                className={`object-cover transition-all duration-300 ${
                  isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
                }`}
              />
            )}

            {/* Badges - Only Discount Percentage */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {/* Discount Badge - Gold color for luxury look */}
              {discountPercentage > 0 && (
                <ProductBadge variant="gold">
                  {discountPercentage}% OFF
                </ProductBadge>
              )}
            </div>

            {/* Action Buttons - Wishlist and View Product stacked */}
            <div
              className={`absolute right-3 top-3 z-10 flex flex-col gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Wishlist Button */}
              <Button
                size="icon"
                variant="secondary"
                className={`rounded-full shadow-lg backdrop-blur-sm h-9 w-9 transition-colors ${
                  mounted && inWishlist
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white/95 hover:bg-white border border-gray-300 text-gray-900'
                }`}
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    mounted && inWishlist ? 'fill-current' : ''
                  }`}
                />
              </Button>

              {/* View Product Button */}
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full bg-white/95 hover:bg-white border border-gray-300 text-gray-900 shadow-lg backdrop-blur-sm h-9 w-9"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardContent className="py-4 px-3">
            {/* Header with Product Name only - Minimal & Centered */}
            <div className=" text-center">
              <h3 className="text-xs md:text-sm font-light tracking-widest uppercase line-clamp-2 leading-relaxed text-gray-900">
                {product.name}
              </h3>
            </div>

            {/* Price Section - Centered */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Current Price */}
                <p className="text-base md:text-lg font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </p>
                {/* Original Price - Strikethrough */}
                {product.comparePrice && (
                  <p className="text-xs md:text-sm text-gray-500 line-through">
                    {formatPrice(product.comparePrice)}
                  </p>
                )}
              </div>

              {/* ✅ NEW: Compact Stock Alert below price */}
              {product.inventory !== undefined && (
                <StockAlertBadgeCompact inventory={product.inventory} />
              )}
            </div>
          </CardContent>
        </Card>
      </Link>

      <QuickViewModal
        product={product}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
});

ProductCard.displayName = 'ProductCard';
