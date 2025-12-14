// src/hooks/use-filter-persistence.ts
'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { FILTER_CONSTANTS } from '@/lib/filter-constants';

export interface FilterState {
  priceRange: [number, number];
}

export function useFilterPersistence() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Load filters from URL
  const loadFiltersFromURL = useCallback((): FilterState => {
    const minPrice = searchParams.get(FILTER_CONSTANTS.URL_PARAMS.MIN_PRICE);
    const maxPrice = searchParams.get(FILTER_CONSTANTS.URL_PARAMS.MAX_PRICE);

    return {
      priceRange: [
        minPrice ? parseInt(minPrice) : FILTER_CONSTANTS.PRICE.MIN,
        maxPrice ? parseInt(maxPrice) : FILTER_CONSTANTS.PRICE.MAX,
      ],
    };
  }, [searchParams]);

  // Save filters to URL
  const saveFiltersToURL = useCallback(
    (filters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update price range
      if (filters.priceRange[0] > FILTER_CONSTANTS.PRICE.MIN) {
        params.set(
          FILTER_CONSTANTS.URL_PARAMS.MIN_PRICE,
          filters.priceRange[0].toString()
        );
      } else {
        params.delete(FILTER_CONSTANTS.URL_PARAMS.MIN_PRICE);
      }

      if (filters.priceRange[1] < FILTER_CONSTANTS.PRICE.MAX) {
        params.set(
          FILTER_CONSTANTS.URL_PARAMS.MAX_PRICE,
          filters.priceRange[1].toString()
        );
      } else {
        params.delete(FILTER_CONSTANTS.URL_PARAMS.MAX_PRICE);
      }

      // Update URL without page reload
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Load filters from localStorage
  const loadFiltersFromStorage = useCallback((): FilterState | null => {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(FILTER_CONSTANTS.STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        priceRange: parsed.priceRange || FILTER_CONSTANTS.PRICE.DEFAULT,
      };
    } catch (error) {
      console.error('Failed to load filters from storage:', error);
      return null;
    }
  }, []);

  // Save filters to localStorage
  const saveFiltersToStorage = useCallback((filters: FilterState) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        FILTER_CONSTANTS.STORAGE_KEY,
        JSON.stringify(filters)
      );
    } catch (error) {
      console.error('Failed to save filters to storage:', error);
    }
  }, []);

  return {
    loadFiltersFromURL,
    saveFiltersToURL,
    loadFiltersFromStorage,
    saveFiltersToStorage,
  };
}
