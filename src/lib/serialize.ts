// src/lib/serialize.ts

import { Decimal } from '@prisma/client/runtime/library';
import {
  Product,
  Order,
  Review,
  ProductVariant,
  OrderItem,
} from '@prisma/client';

// Extend Prisma types to include related models
type ProductWithRelations = Product & {
  category?: {
    id: string;
    name: string;
    slug: string;
    nameEn?: string | null;
    nameHe?: string | null;
  };
  variants?: ProductVariant[];
  reviews?: Review[];
};

// More flexible type for API responses that may not include all fields
type SerializableProduct = Record<string, unknown> & {
  id: string;
  name: string;
  price?: unknown; // Could be Decimal or number
  comparePrice?: unknown;
  averageRating?: unknown;
  category?: Record<string, unknown>;
  variants?: Array<Record<string, unknown>>;
  reviews?: Array<Record<string, unknown>>;
};

type OrderItemWithProduct = OrderItem & {
  product: Product;
};

type OrderWithRelations = Order & {
  orderItems?: OrderItemWithProduct[];
};

/**
 * Convert Prisma Decimal to number
 */
export function decimalToNumber(
  value: Decimal | null | undefined
): number | null {
  if (value === null || value === undefined) return null;
  return value.toNumber();
}

/**
 * Serialize a single product for client consumption
 * Optimized version with minimal processing overhead
 */
export function serializeProduct(product: SerializableProduct) {
  const serialized = { ...product };

  // Convert decimals to numbers (only if they exist and have toNumber method)
  if (
    product.price &&
    typeof product.price === 'object' &&
    'toNumber' in product.price
  ) {
    serialized.price = (product.price as any).toNumber();
  }
  if (
    product.comparePrice &&
    typeof product.comparePrice === 'object' &&
    'toNumber' in product.comparePrice
  ) {
    serialized.comparePrice = (product.comparePrice as any).toNumber();
  }
  if (
    product.averageRating &&
    typeof product.averageRating === 'object' &&
    'toNumber' in product.averageRating
  ) {
    serialized.averageRating = (product.averageRating as any).toNumber();
  }

  // Process variants if they exist
  if (product.variants && Array.isArray(product.variants)) {
    serialized.variants = product.variants.map((variant: any) => ({
      ...variant,
      price:
        variant.price &&
        typeof variant.price === 'object' &&
        'toNumber' in variant.price
          ? variant.price.toNumber()
          : variant.price,
      priceAdjustment:
        variant.priceAdjustment &&
        typeof variant.priceAdjustment === 'object' &&
        'toNumber' in variant.priceAdjustment
          ? variant.priceAdjustment.toNumber()
          : variant.priceAdjustment,
    }));
  }

  return serialized;
}

/**
 * Serialize multiple products with batch processing optimization
 */
export function serializeProducts(products: ProductWithRelations[]) {
  if (!products || !Array.isArray(products)) return [];
  return products.map(serializeProduct);
}

/**
 * Serialize order with items
 */
export function serializeOrder(order: OrderWithRelations) {
  return {
    ...order,
    total: decimalToNumber(order.total),
    orderItems: order.orderItems?.map((item: OrderItemWithProduct) => ({
      ...item,
      price: decimalToNumber(item.price),
    })),
  };
}

/**
 * Serialize review
 */
export function serializeReview(review: Review) {
  return {
    ...review,
    // Reviews don't have Decimal fields currently, but keeping for consistency
  };
}
