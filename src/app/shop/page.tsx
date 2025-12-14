// src/app/shop/page.tsx
// ENHANCED VERSION with SEO improvements

'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductSort } from '@/components/shop/product-sort';
import { ProductFilters, FilterState } from '@/components/shop/product-filters';
import { ActiveFilterChips } from '@/components/shop/active-filter-chips';
import { FILTER_CONSTANTS } from '@/lib/filter-constants';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Columns2,
  Columns3,
  LayoutList,
} from 'lucide-react';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// Note: For client components, we can't use generateMetadata
// Instead, we'll need to create a separate metadata file or use a server component wrapper

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  freeShipping: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<
    'grid-2' | 'grid-3' | 'grid-4' | 'list'
  >('grid-3');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    metal: '',
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    // Update page title dynamically
    const categoryName = categories.find((c) => c.slug === category)?.name;
    document.title = categoryName
      ? `${categoryName} Collection | Forge & Steel`
      : 'Shop All Jewelry | Forge & Steel';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        categoryName
          ? `Shop our ${categoryName} collection. Premium handcrafted jewelry for men.`
          : 'Shop all premium handcrafted jewelry for men. Rings, bracelets, necklaces and more.'
      );
    }
  }, [category, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      logger.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (category) {
        params.append('category', category);
      }

      // Add filter parameters
      if (filters.metal) {
        params.append('metal', filters.metal);
      }
      if (filters.priceRange[0] > 0) {
        params.append('minPrice', filters.priceRange[0].toString());
      }
      if (filters.priceRange[1] < 2000) {
        params.append('maxPrice', filters.priceRange[1].toString());
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      setProducts(data.products || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [category]);

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCategory = categories.find((c) => c.slug === category);
  const pageTitle = currentCategory?.name || 'All Products';
  const pageDescription = 'Claim Your Style';

  return (
    <div className="min-h-screen bg-white">
      {/* Elegant Header */}
      <div className="relative bg-white py-16 border-b-2 border-gray-200">
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-start">
            <h1 className="text-3xl md:text-3xl lg:text-4xl font-figtree font-semibold text-gray-900 mb-4 tracking-wider">
              {pageTitle}
            </h1>
            <p className="text-md md:text-md text-gray-700 font-light max-w-2xl uppercase tracking-wide">
              {pageDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="container px-4 mx-auto py-12">
        {/* Products Section */}
        <div className="w-full">
          {/* Elegant Toolbar */}
          <div className="mb-8 space-y-4">
            {/* Sort + View Toggle + Filter Options */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: Filter Options */}
              <div className="flex items-center gap-2 flex-wrap">
                <ProductFilters
                  currentFilters={filters}
                  productCount={pagination.total}
                  onFiltersChange={(newFilters: FilterState) => {
                    setFilters(newFilters);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                />
              </div>

              {/* Center: View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-md">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                  title="תצוגת רשימה"
                >
                  <LayoutList className="h-4 w-4 text-gray-700" />
                </Button>
                <Button
                  variant={viewMode === 'grid-2' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid-2')}
                  title="2 עמודות"
                >
                  <Columns2 className="h-4 w-4 text-gray-700" />
                </Button>
                <Button
                  variant={viewMode === 'grid-3' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid-3')}
                  title="3 עמודות"
                >
                  <Columns3 className="h-4 w-4 text-gray-700" />
                </Button>
                <Button
                  variant={viewMode === 'grid-4' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid-4')}
                  title="4 עמודות"
                >
                  <LayoutGrid className="h-4 w-4 text-gray-700" />
                </Button>
              </div>

              {/* Right: Sort */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <ProductSort />
              </div>
            </div>

            {/* Active Category Tag (if filtered) */}
            {currentCategory && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 font-medium">
                  Viewing:
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-sm text-gray-900">
                  <span>{pageTitle}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-gray-200 text-gray-600"
                    onClick={() => (window.location.href = '/shop')}
                  >
                    <span className="sr-only">Clear filter</span>×
                  </Button>
                </div>
              </div>
            )}

            {/* Active Filter Chips */}
            <ActiveFilterChips
              filters={filters}
              onRemoveFilter={(filterKey) => {
                if (filterKey === 'priceRange') {
                  setFilters({
                    ...filters,
                    priceRange: FILTER_CONSTANTS.PRICE.DEFAULT,
                  });
                } else if (filterKey === 'metal') {
                  setFilters({ ...filters, metal: '' });
                }
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              onClearAll={() => {
                setFilters({
                  priceRange: FILTER_CONSTANTS.PRICE.DEFAULT,
                  metal: '',
                });
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </div>

          {/* Products Grid/List */}
          {/* Products Grid/List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-semibold mb-2 text-gray-900">
                No products found
              </p>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <ProductGrid products={products} viewMode={viewMode} />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                  </Button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((page) => {
                      const current = pagination.page;
                      return (
                        page === 1 ||
                        page === pagination.pages ||
                        (page >= current - 1 && page <= current + 1)
                      );
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-2">
                          {showEllipsis && (
                            <span className="px-2 text-gray-600">...</span>
                          )}
                          <Button
                            variant={
                              page === pagination.page ? 'default' : 'outline'
                            }
                            onClick={() => goToPage(page)}
                            className={
                              page === pagination.page
                                ? 'bg-gray-900 hover:bg-gray-800'
                                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                            }
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
