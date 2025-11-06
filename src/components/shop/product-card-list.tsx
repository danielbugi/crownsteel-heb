'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, StarHalf } from 'lucide-react';
import { useState } from 'react';
import { QuickViewModal } from '@/components/shop/quick-view-modal';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  freeShipping: boolean;
  inventory?: number;
  averageRating?: number | null;
  reviewCount?: number;
  category: {
    name: string;
    slug: string;
  };
}

interface ProductCardListProps {
  product: Product;
  isFirst?: boolean;
}

export function ProductCardList({
  product,
  isFirst = false,
}: ProductCardListProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <>
      <Card
        className={`group transition-all duration-300 border border-border ${
          isFirst ? '' : 'border-t-0'
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* LEFT: Image */}
            <Link
              href={`/shop/${product.slug}`}
              className="flex-shrink-0 w-32 h-40 sm:w-40 sm:h-48 relative overflow-hidden bg-secondary group/image"
            >
              {/* Primary Image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } group-hover/image:scale-110 group-hover/image:opacity-0`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 128px, 160px"
              />

              {/* Secondary Image (shown on hover) */}
              {product.images && product.images.length > 1 && (
                <Image
                  src={product.images[1]}
                  alt={`${product.name} - alternate view`}
                  fill
                  className="object-cover transition-all duration-700 opacity-0 scale-100 group-hover/image:scale-110 group-hover/image:opacity-100"
                  sizes="(max-width: 640px) 128px, 160px"
                />
              )}
            </Link>

            {/* MIDDLE: Content */}
            <Link href={`/shop/${product.slug}`} className="flex-1 min-w-0">
              <div className="space-y-2">
                {/* Header: Name and Price */}
                <div>
                  <h3 className="font-light text-lg line-clamp-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground">
                      {formatPrice(product.price)}
                    </p>
                    {product.comparePrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.comparePrice)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(product.averageRating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                )}

                {/* Price and Badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    {discountPercentage > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-white text-black border-gray-300 rounded-none text-xs"
                      >
                        {discountPercentage}% OFF
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge
                        variant="outline"
                        className="bg-white text-black border-gray-300 rounded-none text-xs"
                      >
                        Out of Stock
                      </Badge>
                    )}
                    {product.freeShipping && (
                      <Badge
                        variant="outline"
                        className="bg-white text-black border-gray-300 rounded-none text-xs"
                      >
                        Free Shipping
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* RIGHT: Quick View Button */}
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                className="h-10 px-6 hover:bg-transparent transition-all duration-300 min-w-[160px] font-light border-black"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
              >
                {isHovered ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">QUICK VIEW</span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QuickViewModal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product={product as any}
        open={showQuickView}
        onOpenChange={setShowQuickView}
      />
    </>
  );
}
