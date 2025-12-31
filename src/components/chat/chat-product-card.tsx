// src/components/chat/chat-product-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

export interface ChatProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
}

interface ChatProductCardProps {
  product: ChatProduct;
}

export function ChatProductCard({ product }: ChatProductCardProps) {
  const { name, slug, price, image, rating = 0, reviews = 0 } = product;

  // Don't render if essential data is missing
  if (!name || !slug || !image) {
    return null;
  }

  return (
    <Link
      href={`/shop/${slug}`}
      className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-amber-200"
    >
      {/* Image */}
      <div className="relative h-32 w-full bg-gray-50 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name || 'Product'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 150px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-2xl">📦</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Product Name */}
        <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1.5 leading-tight">
          {name || 'מוצר'}
        </h4>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-600">
              {(rating || 0).toFixed(1)} ({reviews})
            </span>
          </div>
        )}

        {/* Price */}
        <p className="text-sm font-semibold text-gray-900">
          {typeof price === 'number' ? price.toLocaleString('he-IL') : '0'} ₪
        </p>
      </div>
    </Link>
  );
}

interface ChatProductGridProps {
  products: ChatProduct[];
}

export function ChatProductGrid({ products }: ChatProductGridProps) {
  if (!products || products.length === 0) return null;

  // Filter out invalid products
  const validProducts = products.filter(
    (p) => p && p.id && p.name && p.slug && p.image
  );

  if (validProducts.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {validProducts.map((product) => (
        <ChatProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
