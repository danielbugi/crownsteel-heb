// src/components/product/product-variant-selector.tsx
'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Variant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  priceAdjustment?: number;
  inventory: number;
  inStock: boolean;
  isDefault: boolean;
  sortOrder: number;
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  basePrice: number;
  variantLabel?: string;
  onVariantChange: (variant: Variant | null) => void;
}

export function ProductVariantSelector({
  variants,
  basePrice,
  variantLabel = 'Select Size',
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  // Don't auto-select variant - force user to choose
  useEffect(() => {
    // Reset selection when variants change
    setSelectedVariantId('');
    onVariantChange(null);
  }, [variants, onVariantChange]);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const variant = variants.find((v) => v.id === variantId);
    onVariantChange(variant || null);
  };

  const calculatePrice = (variant: Variant) => {
    if (variant.price) return variant.price;
    if (variant.priceAdjustment) return basePrice + variant.priceAdjustment;
    return basePrice;
  };

  const getVariantName = (variant: Variant) => {
    return variant.name;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-medium">{variantLabel}</Label>
        <Select value={selectedVariantId} onValueChange={handleVariantChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Choose ${variantLabel}...`} />
          </SelectTrigger>
          <SelectContent>
            {variants
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((variant) => {
                const variantPrice = calculatePrice(variant);
                const priceDiff = variantPrice - basePrice;
                const isAvailable = variant.inStock && variant.inventory > 0;

                return (
                  <SelectItem
                    key={variant.id}
                    value={variant.id}
                    disabled={!isAvailable}
                  >
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="font-medium">
                        {getVariantName(variant)}
                      </span>

                      {/* <div className="flex items-center gap-2">
                        {priceDiff !== 0 && (
                          <span className="text-sm text-muted-foreground">
                            {priceDiff > 0 ? '+' : ''}
                            {formatPrice(priceDiff)}
                          </span>
                        )}

                        {!isAvailable ? (
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        ) : variant.inventory <= 3 ? (
                          <Badge variant="outline" className="text-xs">
                            Only {variant.inventory} left
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-600"
                          >
                            {variant.inventory} available
                          </Badge>
                        )}
                      </div> */}
                    </div>
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
