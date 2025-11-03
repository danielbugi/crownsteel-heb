// src/app/shop/page.tsx
// ENHANCED VERSION with SEO improvements

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/shop/product-grid';
import { CategoryFilter } from '@/components/shop/category-filter';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { HeroSection } from '@/components/layout/hero-section';

export const dynamic = 'force-dynamic';

// Note: For client components, we can't use generateMetadata
// Instead, we'll need to create a separate metadata file or use a server component wrapper

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

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  nameHe?: string | null;
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
  const { t, language } = useLanguage();
  const category = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, pagination.page]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [category]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (category) {
        params.append('category', category);
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
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCategory = categories.find((c) => c.slug === category);
  const pageTitle =
    language === 'he'
      ? currentCategory?.nameHe || 'כל המוצרים'
      : currentCategory?.nameEn || 'All Products';

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={pageTitle}
        description={t('shop.description')}
        size="lg"
      />

      {/* Main Content */}
      <section className="container px-4 mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilter
              categories={categories}
              selectedCategory={category || undefined}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl font-semibold mb-2">
                  {t('shop.noProducts')}
                </p>
                <p className="text-muted-foreground">
                  {t('shop.noProductsDesc')}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-muted-foreground">
                  {t('shop.productsFound', { count: pagination.total })}
                </div>
                <ProductGrid products={products} />

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
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
                            {showEllipsis && <span className="px-2">...</span>}
                            <Button
                              variant={
                                page === pagination.page ? 'default' : 'outline'
                              }
                              onClick={() => goToPage(page)}
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
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
