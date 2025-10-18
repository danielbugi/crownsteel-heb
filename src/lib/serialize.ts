// src/lib/serialize.ts

import { Decimal } from '@prisma/client/runtime/library';

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
 */
export function serializeProduct(product: any) {
  return {
    ...product,
    price: decimalToNumber(product.price),
    comparePrice: decimalToNumber(product.comparePrice),
    averageRating: decimalToNumber(product.averageRating) ?? 0,
  };
}

/**
 * Serialize multiple products
 */
export function serializeProducts(products: any[]) {
  return products.map(serializeProduct);
}

/**
 * Serialize order with items
 */
export function serializeOrder(order: any) {
  return {
    ...order,
    total: decimalToNumber(order.total),
    orderItems: order.orderItems?.map((item: any) => ({
      ...item,
      price: decimalToNumber(item.price),
    })),
  };
}

/**
 * Serialize review
 */
export function serializeReview(review: any) {
  return {
    ...review,
    // Reviews don't have Decimal fields currently, but keeping for consistency
  };
}
