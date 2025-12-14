// src/components/wishlist/wishlist-sheet.tsx
'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { useWishlistStore } from '@/store/wishlist-store';

import { Heart, X, ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { WishlistSheetItem } from './wishlist-sheet-item';
import { logger } from '@/lib/logger';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  inStock: boolean;
}

export function WishlistSheet() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, isOpen, toggleWishlist, getItemCount, closeWishlist } =
    useWishlistStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!session?.user;
  const wishlistCount = getItemCount();
  const isNearLimit = !isAuthenticated && wishlistCount >= 18;

  // Load product details when sheet opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      loadProducts();
    }
  }, [isOpen, items]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Fetch from server with full details
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
                comparePrice?: number;
                image: string;
                inStock: boolean;
              };
            }) => ({
              id: item.product.id,
              name: item.product.name,
              slug: item.product.slug,
              price: item.product.price,
              comparePrice: item.product.comparePrice,
              image: item.product.image,
              inStock: item.product.inStock,
            })
          );
          setProducts(productsList);
        }
      } else {
        // Guest - fetch basic info
        if (items.length > 0) {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: items }),
          });
          if (response.ok) {
            const data = await response.json();
            setProducts(data.products || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    closeWishlist();
    router.push('/wishlist');
  };

  const handleSignIn = () => {
    closeWishlist();
    router.push('/auth/signin');
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleWishlist}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg bg-white border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <SheetTitle className="text-xl font-bold text-black flex items-center gap-2">
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            FAVORITES ({wishlistCount})
          </SheetTitle>
          <Button
            onClick={toggleWishlist}
            variant="ghost"
            size="icon"
            className="text-black hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Guest Banner */}
        {!isAuthenticated && wishlistCount > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                💡 Sign in to save your favorites forever!
              </p>
              <Button
                size="sm"
                variant="default"
                className="w-full"
                onClick={handleSignIn}
              >
                Sign In Now
              </Button>
            </div>
          </div>
        )}

        {/* Limit Warning */}
        {isNearLimit && (
          <div className="px-4 pt-2">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                ⚠️ {20 - wishlistCount} spots left! Sign in for unlimited
                favorites.
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Start adding products you love to your wishlist
              </p>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  closeWishlist();
                  router.push('/shop');
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Button>
            </div>
          ) : (
            /* Wishlist Items */
            <div className="space-y-4">
              {products.map((product) => (
                <WishlistSheetItem
                  key={product.id}
                  product={product}
                  onClose={closeWishlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-black text-black hover:bg-gray-100"
              onClick={handleViewAll}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View All Favorites ({wishlistCount})
            </Button>

            <Button
              size="lg"
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={() => {
                closeWishlist();
                router.push('/shop');
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
