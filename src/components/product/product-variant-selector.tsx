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
import { useLanguage } from '@/contexts/language-context';

interface Variant {
  id: string;
  name: string;
  nameEn?: string;
  nameHe?: string;
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
  variantLabelHe?: string;
  onVariantChange: (variant: Variant | null) => void;
}

export function ProductVariantSelector({
  variants,
  basePrice,
  variantLabel = 'Select Size',
  variantLabelHe = 'בחר מידה',
  onVariantChange,
}: ProductVariantSelectorProps) {
  const { language } = useLanguage();
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  // Set default variant on mount
  useEffect(() => {
    const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
    if (defaultVariant) {
      setSelectedVariantId(defaultVariant.id);
      onVariantChange(defaultVariant);
    }
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
    if (language === 'he' && variant.nameHe) {
      return variant.nameHe;
    }
    return variant.nameEn || variant.name;
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

  const label = language === 'he' ? variantLabelHe : variantLabel;
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-medium">{label}</Label>
        <Select value={selectedVariantId} onValueChange={handleVariantChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${label}`} />
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

                      <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Selected:</p>
            <p className="font-medium">{getVariantName(selectedVariant)}</p>
            <p className="text-xs text-muted-foreground">
              SKU: {selectedVariant.sku}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {formatPrice(calculatePrice(selectedVariant))}
            </p>
            {calculatePrice(selectedVariant) !== basePrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(basePrice)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
