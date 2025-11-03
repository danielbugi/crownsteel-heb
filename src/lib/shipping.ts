// src/lib/shipping.ts

/**
 * Calculate shipping cost based on order total and settings
 */
export function calculateShipping(
  orderTotal: number,
  shippingCost: number,
  freeShippingThreshold: number
): number {
  if (orderTotal >= freeShippingThreshold) {
    return 0; // Free shipping
  }
  return shippingCost;
}

/**
 * Get shipping display text
 */
export function getShippingDisplayText(
  orderTotal: number,
  shippingCost: number,
  freeShippingThreshold: number,
  currencySymbol: string = '₪'
): string {
  const shipping = calculateShipping(
    orderTotal,
    shippingCost,
    freeShippingThreshold
  );

  if (shipping === 0) {
    return 'Free';
  }

  return `${currencySymbol}${shipping.toFixed(2)}`;
}

/**
 * Check if order qualifies for free shipping
 */
export function qualifiesForFreeShipping(
  orderTotal: number,
  freeShippingThreshold: number
): boolean {
  return orderTotal >= freeShippingThreshold;
}

/**
 * Get amount needed for free shipping
 */
export function getAmountNeededForFreeShipping(
  orderTotal: number,
  freeShippingThreshold: number
): number {
  if (qualifiesForFreeShipping(orderTotal, freeShippingThreshold)) {
    return 0;
  }
  return freeShippingThreshold - orderTotal;
}

/**
 * Get free shipping progress as percentage (0-100)
 */
export function getFreeShippingProgress(
  orderTotal: number,
  freeShippingThreshold: number
): number {
  if (orderTotal >= freeShippingThreshold) {
    return 100;
  }
  return Math.min((orderTotal / freeShippingThreshold) * 100, 100);
}

/**
 * Format shipping info for display
 */
export function formatShippingInfo(
  orderTotal: number,
  shippingCost: number,
  freeShippingThreshold: number,
  currencySymbol: string = '₪'
) {
  const shipping = calculateShipping(
    orderTotal,
    shippingCost,
    freeShippingThreshold
  );
  const isFree = shipping === 0;
  const amountNeeded = getAmountNeededForFreeShipping(
    orderTotal,
    freeShippingThreshold
  );
  const progress = getFreeShippingProgress(orderTotal, freeShippingThreshold);

  return {
    cost: shipping,
    isFree,
    displayText: getShippingDisplayText(
      orderTotal,
      shippingCost,
      freeShippingThreshold,
      currencySymbol
    ),
    amountNeededForFree: amountNeeded,
    progressToFree: progress,
    message: isFree
      ? 'You qualify for free shipping!'
      : `Add ${currencySymbol}${amountNeeded.toFixed(2)} more for free shipping`,
  };
}
