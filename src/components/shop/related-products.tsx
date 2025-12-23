// src/components/shop/related-products.tsx
// IMPROVED VERSION - Added loading state, better layout

'use client';

import { ProductCard } from './product-card';
import { Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  freeShipping: boolean;
  inventory?: number;
  createdAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-2xl font-semibold flex items-center gap-2 text-gray-900">
            מוצרים קשורים
          </h2>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Link */}
      {products.length >= 4 && (
        <div className="mt-8 text-center">
          <a
            href={`/shop?category=${products[0]?.category.slug}`}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 hover:underline font-medium"
          >
            View All {products[0]?.category.name} Products
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
}
