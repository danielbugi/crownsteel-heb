// src/lib/filter-constants.ts
export const FILTER_CONSTANTS = {
  PRICE: {
    MIN: 0,
    MAX: 2000,
    STEP: 50,
    DEFAULT: [0, 2000] as [number, number],
  },
  STORAGE_KEY: 'shop_filters_history',
  URL_PARAMS: {
    MIN_PRICE: 'minPrice',
    MAX_PRICE: 'maxPrice',
    METAL: 'metal',
  },
} as const;

export const METAL_OPTIONS = [
  { id: 'all', label: 'All Metals', value: '' },
  { id: 'silver', label: 'Silver', value: 'silver' },
  { id: 'stainless', label: 'Stainless Steel', value: 'stainless' },
] as const;

export type MetalType = '' | 'silver' | 'stainless';
