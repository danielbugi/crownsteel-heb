'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/product-grid';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchSort } from '@/components/search/search-sort';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const inStock = searchParams.get('inStock') || '';
  const featured = searchParams.get('featured') || '';

  useEffect(() => {
    fetchResults();
  }, [
    query,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    inStock,
    featured,
    language,
    pagination.page,
  ]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (inStock) params.append('inStock', inStock);
      if (featured) params.append('featured', featured);
      params.append('lang', language);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      setProducts(data.products || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [
    query,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    inStock,
    featured,
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-steel text-white py-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {query
              ? `${t('search.resultsFor')}: "${query}"`
              : t('search.allProducts')}
          </h1>
          <p className="text-muted-foreground">
            {loading
              ? t('common.loading')
              : `${pagination.total} ${t('search.productsFound')}`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <SearchFilters />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {loading
                    ? t('common.loading')
                    : `${pagination.total} ${t('search.productsFound')}`}
                </p>
                <SearchSort />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Results */}
              {!loading && products.length > 0 && (
                <>
                  <ProductGrid products={products} />

                  {/* Pagination Controls */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => goToPage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(5, pagination.pages))].map(
                          (_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.page >=
                              pagination.pages - 2
                            ) {
                              pageNum = pagination.pages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pagination.page === pageNum
                                    ? 'default'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={() => goToPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => goToPage(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* No Results */}
              {!loading && products.length === 0 && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-2">
                    {t('search.noResults')}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('search.tryDifferent')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
