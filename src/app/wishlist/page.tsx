// src/app/wishlist/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/wishlist-store';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/layout/hero-section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  description?: string;
  inStock: boolean;
  featured: boolean;
  inventory?: number;
  createdAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getItemCount, syncWithServer } = useWishlistStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    setWishlistCount(getItemCount());
  }, [getItemCount]);

  useEffect(() => {
    setWishlistCount(getItemCount());
  }, [items, getItemCount]);

  // ...existing code...
  // Add RTL and Hebrew translation to main render
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <HeroSection
        title="רשימת המשאלות שלי"
        description="כל המוצרים ששמרת כאן"
        size="md"
      />
      <section className="py-10">
        <div className="container px-4 mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">המוצרים ששמרת</h2>
                  <Badge variant="outline" className="text-lg">{wishlistCount} מוצרים</Badge>
                </div>
                {items.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                    <p className="text-lg">הרשימה שלך ריקה כרגע</p>
                    <Link href="/shop">
                      <Button className="mt-6">לגלישה בחנות</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {items.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      if (isAuthenticated) {
        // Fetch from server with full product details
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const { items: wishlistItems } = await response.json();
          const productsList = wishlistItems.map(
            (item: {
              product: {
                id: string;
                name: string;
                slug: string;
                price: number;
                comparePrice: number | null;
                image: string;
                images?: string[];
                description?: string;
                inStock: boolean;
                featured?: boolean;
                inventory?: number;
                createdAt?: string;
                category: {
                  id: string;
                  name: string;
                  slug: string;
                };
              };
            }) => ({
              id: item.product.id,
              name: item.product.name,
              slug: item.product.slug,
              price: item.product.price,
              comparePrice: item.product.comparePrice,
              image: item.product.image,
              images: item.product.images || [item.product.image],
              description: item.product.description || '',
              inStock: item.product.inStock,
              featured: item.product.featured || false,
              inventory: item.product.inventory,
              createdAt: item.product.createdAt,
              category: {
                id: item.product.category.id,
                name: item.product.category.name,
                slug: item.product.category.slug,
              },
            })
          );
          setProducts(productsList);
        } else {
          setProducts([]);
        }
      } else {
        // Guest user - fetch basic product info
        if (items.length > 0) {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: items }),
          });

          if (response.ok) {
            const data = await response.json();
            // Map the products to match the expected interface
            const mappedProducts = (data.products || []).map(
              (product: {
                id: string;
                name: string;
                slug: string;
                price: number;
                comparePrice: number | null;
                image: string;
                images?: string[];
                description?: string;
                inStock: boolean;
                featured?: boolean;
                category?: {
                  id: string;
                  name: string;
                  slug: string;
                };
              }) => ({
                ...product,
                images: product.images || [product.image],
                description: product.description || '',
                featured: product.featured || false,
                category: {
                  id: product.category?.id || '',
                  name: product.category?.name || '',
                  slug: product.category?.slug || '',
                },
              })
            );
            setProducts(mappedProducts);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      }
    } catch (error) {
      console.error('💥 Error loading wishlist products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, items]);

  // Initialize on mount only
  useEffect(() => {
    if (initialized) {
      return;
    }

    setInitialized(true);

    const initialize = async () => {
      if (isAuthenticated && !synced) {
        await syncWithServer();
        setSynced(true);
      }

      loadProducts();
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Reload when items change
  useEffect(() => {
    if (!loading) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]); // Run when items count changes

  // Guest user banner
  const showGuestBanner = !isAuthenticated && wishlistCount > 0;
  const isNearLimit = !isAuthenticated && wishlistCount >= 18;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 fill-current" />
            My Wishlist
          </div>
        }
        description={`${wishlistCount} items in your wishlist`}
      >
        {isNearLimit && (
          <Badge variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {20 - wishlistCount} spots left
          </Badge>
        )}
      </HeroSection>

      {/* Guest Sign-In Banner */}
      {showGuestBanner && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="container px-4 py-4 mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    💡 Sign in to save your favorites forever!
                  </h3>
                  <p className="text-white/90 text-sm">
                    Get personalized recommendations and never lose your
                    favorites
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/auth/signin')}
                >
                  Sign In Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-3xl font-bold mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start adding products you love to your wishlist
              </p>
              <Button size="lg" asChild>
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Products
                </Link>
              </Button>
            </div>
          )}

          {/* Wishlist Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlistItem={true}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
