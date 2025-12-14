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
          className="h-9 relative border-2 border-gray-300 hover:bg-gray-100 font-light tracking-wide text-gray-900"
          aria-label={`Filters ${hasActiveFilters ? `(${activeFilterCount} active)` : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-700" />
          <span className="uppercase text-xs">
            {t('shop.filters') || 'Filters'}
          </span>
          {hasActiveFilters && (
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-gray-900 text-white rounded-full text-[10px] font-medium flex items-center justify-center shadow-md">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[320px] sm:w-[400px] px-0 flex flex-col bg-white"
      >
        <SheetHeader className="px-6 pb-6 border-b border-gray-200">
          <SheetTitle className="text-2xl font-semibold tracking-wide text-gray-900">
            {t('shop.filterProducts') || 'Filter Products'}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 mt-8 px-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Metal Type */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                {t('shop.metalType') || 'Metal Type'}
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
                      className="border-2 border-gray-300"
                    />
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-normal cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      {t(`shop.metal.${option.id}`) || option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Price Range */}
            <div className="space-y-5">
              <PriceRangeInput
                value={localFilters.priceRange}
                onChange={handlePriceChange}
                label={t('shop.priceRange') || 'Price Range'}
              />
            </div>

            {/* Result Count */}
            {productCount !== undefined && (
              <>
                <div className="h-px bg-gray-200" />
                <div
                  className="text-center py-3 px-4 bg-gray-100 rounded-md"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-normal">
                    {productCount === 0 ? (
                      <span className="text-gray-600">
                        {t('shop.noProductsMatch') ||
                          'No products match these filters'}
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold text-gray-900">
                          {productCount}
                        </span>{' '}
                        <span className="text-gray-600">
                          {productCount === 1
                            ? 'Product Found'
                            : 'Products Found'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <Button
                onClick={applyFilters}
                className="w-full h-11 font-medium text-sm tracking-wide uppercase bg-black hover:bg-gray-900 text-white"
              >
                {t('shop.applyFilters') || 'Apply Filters'}
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white text-black rounded-full text-xs font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full h-11 font-medium text-sm tracking-wide uppercase border-2 border-gray-300 hover:bg-gray-100 text-gray-900"
                disabled={!hasActiveFilters}
              >
                {t('shop.resetFilters') || 'Reset Filters'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
