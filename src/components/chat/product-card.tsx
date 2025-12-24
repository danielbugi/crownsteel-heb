// src/components/chat/product-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  category?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  rating = 4.5,
  reviews = 0,
  category = 'Jewelry',
}: ProductCardProps) {
  return (
    <Link href={`/shop/${slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image Container */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {category}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
            {name}
          </h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.round(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">({reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">₪{price}</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
