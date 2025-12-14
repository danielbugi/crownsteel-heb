'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { logger } from '@/lib/logger';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: {
    name: string;
  };
}

interface SearchBarProps {
  showSearch: boolean;
  onClose: () => void;
}

export function SearchBar({ showSearch, onClose }: SearchBarProps) {
  // const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<SearchProduct[]>(
    []
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Fetch suggested products when search opens
  useEffect(() => {
    if (showSearch) {
      fetchSuggestedProducts();
      setSearchResults([]);
      setSearchQuery('');
    }
  }, [showSearch]);

  // Search products as user types
  useEffect(() => {
    if (searchQuery.length > 1) {
      const searchProducts = async () => {
        setSearchLoading(true);
        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}&limit=3`
          );
          const data = await response.json();
          setSearchResults(data.products || []);
        } catch (error) {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      };

      const timer = setTimeout(searchProducts, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setSearchLoading(false);
    }
  }, [searchQuery]);

  const fetchSuggestedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=3');
      const data = await response.json();
      setSuggestedProducts(data.products || []);
    } catch (error) {
      logger.error('Failed to fetch suggested products:', error);
      setSuggestedProducts([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Quick links data
  const quickLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Best Sellers', href: '/shop?featured=true' },
    { label: 'Sale', href: '/shop?sale=true' },
  ];

  if (!showSearch) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black z-40 animate-in fade-in duration-300" />

      {/* Search Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
        <div className="w-full max-w-4xl bg-black backdrop-blur-xl rounded-lg shadow-2xl pointer-events-auto animate-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Search</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Section */}
          <div className="px-6 py-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-transparent border-0 border-b border-white text-white placeholder:text-gray-400 text-base focus:ring-0 focus:border-white focus:outline-none transition-all duration-300 rounded-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {/* Search Results */}
            {searchQuery.length > 1 && (
              <div className="mb-8">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500 border-t-transparent mr-3"></div>
                    <span className="text-white text-base">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-4">
                      Search Results ({searchResults.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 p-4 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white text-base truncate group-hover:text-gold-400 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {product.category.name}
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-gold-400">
                            ₪{product.price}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-base">
                      No products found for &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Section: Quick Links & Most Wanted Products */}
            {searchQuery.length <= 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Quick Links */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Quick Links
                  </h3>

                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      onClick={handleClose}
                      className="block py-3 text-gray-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Most Wanted Products */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Most Wanted
                  </h3>
                  {suggestedProducts.length > 0 ? (
                    <div className="space-y-3">
                      {suggestedProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white text-sm truncate group-hover:text-gold-400 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-base font-semibold text-gold-400 mt-1">
                              ₪{product.price}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No products available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
