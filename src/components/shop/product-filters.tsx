'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SlidersHorizontal } from 'lucide-react';
import { t } from '@/lib/translations';
import { PriceRangeInput } from './price-range-input';
import {
  FILTER_CONSTANTS,
  METAL_OPTIONS,
  MetalType,
} from '@/lib/filter-constants';

interface ProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  productCount?: number;
}

export interface FilterState {
  priceRange: [number, number];
  metal: MetalType;
}

export function ProductFilters({
  onFiltersChange,
  currentFilters,
  productCount,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  // Sync local filters with prop changes
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'Enter') {
        applyFilters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return [
      localFilters.metal !== '',
      localFilters.priceRange[0] > FILTER_CONSTANTS.PRICE.MIN ||
        localFilters.priceRange[1] < FILTER_CONSTANTS.PRICE.MAX,
    ].filter(Boolean).length;
  }, [localFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  const handlePriceChange = useCallback(
    (value: [number, number]) => {
      setLocalFilters({ ...localFilters, priceRange: value });
    },
    [localFilters]
  );

  const handleMetalChange = useCallback(
    (value: string) => {
      setLocalFilters({ ...localFilters, metal: value as MetalType });
    },
    [localFilters]
  );

  const applyFilters = useCallback(() => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  }, [localFilters, onFiltersChange]);

  const resetFilters = useCallback(() => {
    const defaultFilters: FilterState = {
      priceRange: FILTER_CONSTANTS.PRICE.DEFAULT,
      metal: '',
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  }, [onFiltersChange]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 relative border-2 hover:bg-accent font-light tracking-wide"
          aria-label={`Filters ${hasActiveFilters ? `(${activeFilterCount} active)` : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          <span className="uppercase text-xs">
            {t('shop.filters') || 'Filters'}
          </span>
          {hasActiveFilters && (
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-foreground text-background rounded-full text-[10px] font-medium flex items-center justify-center shadow-md">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[320px] sm:w-[400px] px-0 flex flex-col"
      >
        <SheetHeader className="px-6 pb-6 border-b-2">
          <SheetTitle className="text-2xl font-light tracking-wide">
            {t('shop.filterProducts') || 'סנן מוצרים'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 mt-8 px-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Metal Type */}
            <div className="space-y-4">
              <Label className="text-sm font-light uppercase tracking-wider text-foreground">
                {t('shop.metalType') || 'סוג מתכת'}
              </Label>
              <RadioGroup
                value={localFilters.metal}
                onValueChange={handleMetalChange}
                className="space-y-3"
              >
                {METAL_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={option.value}
                      id={option.id}
                      className="border-2"
                    />
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-light cursor-pointer"
                    >
                      {t(`shop.metal.${option.id}`) || option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="h-px bg-border" />

            {/* Price Range */}
            <div className="space-y-5">
              <PriceRangeInput
                value={localFilters.priceRange}
                onChange={handlePriceChange}
                label={t('shop.priceRange') || 'טווח מחירים'}
              />
            </div>

            {/* Result Count */}
            {productCount !== undefined && (
              <>
                <div className="h-px bg-border" />
                <div
                  className="text-center py-3 px-4 bg-accent/30 rounded-md"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-light">
                    {productCount === 0 ? (
                      <span className="text-muted-foreground">
                        {t('shop.noProductsMatch') ||
                          'No products match these filters'}
                      </span>
                    ) : (
                      <>
                        <span className="font-medium">{productCount}</span>{' '}
                        <span className="text-muted-foreground">
                          {productCount === 1
                            ? t('shop.productFound') || 'מוצר נמצא'
                            : t('shop.productsFound') || 'מוצרים נמצאו'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t-2 border-border">
              <Button
                onClick={applyFilters}
                className="w-full h-11 font-light text-sm tracking-wide uppercase bg-foreground hover:bg-foreground/90"
              >
                {t('shop.applyFilters') || 'החל מסננים'}
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-background text-foreground rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full h-11 font-light text-sm tracking-wide uppercase border-2 hover:bg-accent"
                disabled={!hasActiveFilters}
              >
                {t('shop.resetFilters') || 'אפס מסננים'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
