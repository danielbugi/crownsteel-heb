'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link
          href="/shop"
          className={cn(
            'block py-2 px-3 rounded-md transition-colors',
            !activeCategory
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-secondary'
          )}
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className={cn(
              'block py-2 px-3 rounded-md transition-colors',
              activeCategory === category.slug
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-secondary'
            )}
          >
            {category.name}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
