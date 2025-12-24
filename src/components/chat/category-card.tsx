// src/components/chat/category-card.tsx
import Link from 'next/link';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
}

export function CategoryCard({
  id,
  name,
  slug,
  image,
  productCount,
}: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${slug}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image Container */}
        {image ? (
          <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-4xl text-white opacity-50">📦</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
          <p className="text-sm text-gray-600">
            {productCount} {productCount === 1 ? 'מוצר' : 'מוצרים'}
          </p>
          <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
            גלוש
          </button>
        </div>
      </div>
    </Link>
  );
}
