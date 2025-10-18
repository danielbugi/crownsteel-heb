// src/components/shop/related-products.tsx
// IMPROVED VERSION - Added loading state, better layout, and translation support

'use client';

import { ProductCard } from './product-card';
import { useLanguage } from '@/contexts/language-context';
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
  const { t } = useLanguage();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {t('product.relatedProducts') || 'You May Also Like'}
          </h2>
          <p className="text-muted-foreground mt-2">
            Discover similar items from the same category
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Link */}
      {products.length >= 3 && (
        <div className="mt-8 text-center">
          <a
            href={`/shop?category=${products[0]?.category.slug}`}
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
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
