// src/components/shop/product-sort.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'popular';

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const currentSort = (searchParams.get('sort') as SortOption) || 'featured';

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: t('search.featured') || 'Featured' },
    { value: 'newest', label: t('search.newest') || 'Newest First' },
    { value: 'oldest', label: t('search.oldest') || 'Oldest First' },
    {
      value: 'price-asc',
      label: t('search.priceLowToHigh') || 'Price: Low to High',
    },
    {
      value: 'price-desc',
      label: t('search.priceHighToLow') || 'Price: High to Low',
    },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
