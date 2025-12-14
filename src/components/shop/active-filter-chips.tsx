// src/components/shop/active-filter-chips.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FilterState } from '@/components/shop/product-filters';
import { FILTER_CONSTANTS } from '@/lib/filter-constants';

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (filterKey: keyof FilterState) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) {
  const activeFilters: { key: keyof FilterState; label: string }[] = [];

  // Check price range
  if (
    filters.priceRange[0] > FILTER_CONSTANTS.PRICE.MIN ||
    filters.priceRange[1] < FILTER_CONSTANTS.PRICE.MAX
  ) {
    activeFilters.push({
      key: 'priceRange',
      label: `₪${filters.priceRange[0]} - ₪${filters.priceRange[1]}`,
    });
  }

  // Check metal filter
  if (filters.metal !== '') {
    const metalOption = [
      { value: 'silver', label: 'Silver' },
      { value: 'stainless', label: 'Stainless Steel' },
    ].find((m) => m.value === filters.metal);

    if (metalOption) {
      activeFilters.push({
        key: 'metal',
        label: metalOption.label,
      });
    }
  }

  if (activeFilters.length === 0) return null;

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="region"
      aria-label="Active filters"
    >
      <span className="text-xs text-gray-600 font-light uppercase tracking-wide">
        Active:
      </span>
      {activeFilters.map(({ key, label }) => (
        <Badge
          key={key}
          variant="secondary"
          className="pl-2.5 pr-1.5 py-1 gap-1 font-light border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900"
        >
          <span className="text-xs">{label}</span>
          <button
            onClick={() => onRemoveFilter(key)}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${label} filter`}
          >
            <X className="h-3 w-3 text-gray-700" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline transition-colors font-light"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
