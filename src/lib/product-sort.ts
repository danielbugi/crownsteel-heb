// src/lib/product-sort.ts
import { Prisma } from '@prisma/client';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'popular';

/**
 * Get Prisma orderBy clause based on sort option
 */
export function getProductSortOrder(
  sort: SortOption = 'featured'
):
  | Prisma.ProductOrderByWithRelationInput
  | Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'featured':
      return [{ featured: 'desc' }, { createdAt: 'desc' }];

    case 'newest':
      return { createdAt: 'desc' };

    case 'oldest':
      return { createdAt: 'asc' };

    case 'price-asc':
      return { price: 'asc' };

    case 'price-desc':
      return { price: 'desc' };

    case 'name-asc':
      return { name: 'asc' };

    case 'name-desc':
      return { name: 'desc' };

    case 'popular':
      return [
        { reviewCount: 'desc' },
        { averageRating: 'desc' },
        { createdAt: 'desc' },
      ];

    default:
      return { createdAt: 'desc' };
  }
}

/**
 * Example usage in API route:
 *
 * const sort = searchParams.get('sort') as SortOption || 'featured';
 * const products = await prisma.product.findMany({
 *   where: { ... },
 *   orderBy: getProductSortOrder(sort),
 * });
 */
