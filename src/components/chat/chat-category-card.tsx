// src/components/chat/chat-category-card.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';

export interface ChatCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
}

interface ChatCategoryCardProps {
  category: ChatCategory;
}

export function ChatCategoryCard({ category }: ChatCategoryCardProps) {
  const { name, slug, image, productCount = 0 } = category;

  // Don't render if essential data is missing
  if (!name || !slug) {
    return null;
  }

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-amber-200"
    >
      {/* Image */}
      <div className="relative h-28 w-full overflow-hidden">
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 150px"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <Package className="h-10 w-10 text-amber-600/50" />
          </div>
        )}

        {/* Category name overlay */}
        <div className="absolute bottom-0 inset-x-0 p-2.5">
          <h4 className="text-sm font-semibold text-white drop-shadow-md">
            {name}
          </h4>
          <p className="text-xs text-white/80">
            {productCount} {productCount === 1 ? 'מוצר' : 'מוצרים'}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface ChatCategoryGridProps {
  categories: ChatCategory[];
}

export function ChatCategoryGrid({ categories }: ChatCategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  // Filter out invalid categories
  const validCategories = categories.filter(
    (c) => c && c.id && c.name && c.slug
  );

  if (validCategories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {validCategories.map((category) => (
        <ChatCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
