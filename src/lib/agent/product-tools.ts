// src/lib/agent/product-tools.ts
import { prisma } from '@/lib/prisma';

interface ProductRecommendation {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

/**
 * Search products by category and filters
 */
export async function searchProductsByCategory(
  categoryName: string,
  limit: number = 6
): Promise<ProductRecommendation[]> {
  const category = await prisma.category.findFirst({
    where: {
      name: {
        contains: categoryName,
        mode: 'insensitive',
      },
    },
  });

  if (!category) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      inStock: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      image: true,
      category: {
        select: {
          name: true,
        },
      },
      averageRating: true,
      reviewCount: true,
      inStock: true,
    },
    orderBy: {
      featured: 'desc',
    },
    take: limit,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    image: p.image,
    category: p.category.name,
    rating: p.averageRating ? Number(p.averageRating) : 0,
    reviews: p.reviewCount,
    inStock: p.inStock,
  }));
}

/**
 * Get featured/bestseller products
 */
export async function getFeaturedProducts(
  limit: number = 4
): Promise<ProductRecommendation[]> {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
      inStock: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      image: true,
      category: {
        select: {
          name: true,
        },
      },
      averageRating: true,
      reviewCount: true,
      inStock: true,
    },
    orderBy: {
      reviewCount: 'desc',
    },
    take: limit,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    image: p.image,
    category: p.category.name,
    rating: p.averageRating ? Number(p.averageRating) : 0,
    reviews: p.reviewCount,
    inStock: p.inStock,
  }));
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: `/images/categories/category-${c.slug}.png`,
    productCount: c._count.products,
  }));
}

/**
 * Search products by name and price range
 */
export async function searchProductsByFilters(
  query?: string,
  minPrice?: number,
  maxPrice?: number,
  limit: number = 6
): Promise<ProductRecommendation[]> {
  const products = await prisma.product.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
        {
          price: {
            gte: minPrice ? minPrice : 0,
            lte: maxPrice ? maxPrice : 999999,
          },
        },
        {
          inStock: true,
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      image: true,
      category: {
        select: {
          name: true,
        },
      },
      averageRating: true,
      reviewCount: true,
      inStock: true,
    },
    orderBy: {
      reviewCount: 'desc',
    },
    take: limit,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    image: p.image,
    category: p.category.name,
    rating: p.averageRating ? Number(p.averageRating) : 0,
    reviews: p.reviewCount,
    inStock: p.inStock,
  }));
}

/**
 * Get products by style preference
 */
export async function getProductsByStyle(
  style: 'minimalist' | 'classic' | 'statement' | 'vintage',
  limit: number = 6
): Promise<ProductRecommendation[]> {
  const styleKeywords: Record<string, string[]> = {
    minimalist: ['minimal', 'simple', 'modern', 'sleek', 'clean'],
    classic: ['classic', 'traditional', 'elegant', 'timeless'],
    statement: ['bold', 'unique', 'eye-catching', 'dramatic'],
    vintage: ['vintage', 'antique', 'retro', 'old-world'],
  };

  const keywords = styleKeywords[style] || [];

  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          inStock: true,
        },
        {
          OR: keywords.map((keyword) => ({
            description: {
              contains: keyword,
              mode: 'insensitive',
            },
          })),
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      image: true,
      category: {
        select: {
          name: true,
        },
      },
      averageRating: true,
      reviewCount: true,
      inStock: true,
    },
    orderBy: {
      reviewCount: 'desc',
    },
    take: limit,
  });

  if (products.length === 0) {
    // Fallback: return featured products if no match found
    return getFeaturedProducts(limit);
  }

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    image: p.image,
    category: p.category.name,
    rating: p.averageRating ? Number(p.averageRating) : 0,
    reviews: p.reviewCount,
    inStock: p.inStock,
  }));
}
