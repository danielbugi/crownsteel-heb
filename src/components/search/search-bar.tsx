'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';

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
  isMobile?: boolean;
}

export function SearchBar({
  showSearch,
  onClose,
  isMobile = false,
}: SearchBarProps) {
  const { t } = useLanguage();
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
          console.log('Search results:', data.products);
          setSearchResults(data.products || []);
        } catch (error) {
          console.error('Search error:', error);
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
      console.log('Suggested products:', data.products);
      setSuggestedProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch suggested products:', error);
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

  return (
    <>
      {/* Search Input */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showSearch
            ? isMobile
              ? 'w-40 opacity-100 mr-1'
              : 'w-64 opacity-100 mr-2'
            : 'w-0 opacity-0'
        }`}
      >
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-white/10 border-white/20 text-black placeholder:text-white/50 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                isMobile ? 'h-8 pr-6' : 'h-9 pr-8'
              }`}
              autoFocus={showSearch}
              dir="rtl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className={`absolute top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200 ${
                  isMobile ? 'left-1' : 'left-2'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search Results Overlay */}
      {showSearch && (
        <div className="absolute top-full left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="container px-4 py-4">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Search Results Section */}
              <div>
                {searchQuery.length === 0 ? (
                  <div className="text-center py-8 animate-in fade-in duration-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gold-400" />
                    </div>
                    <p className="text-white/70 text-lg font-medium">
                      תוצאות החיפוש ריקות
                    </p>
                    <p className="text-white/50 text-sm mt-2">
                      התחל להקליד כדי לחפש מוצרים
                    </p>
                  </div>
                ) : searchQuery.length > 1 ? (
                  <>
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-8 animate-in fade-in duration-300">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gold-500 border-t-transparent mr-3"></div>
                        <span className="text-white/70 text-base font-medium">
                          מחפש מוצרים...
                        </span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                          <Search className="w-5 h-5 text-gold-400" />
                          תוצאות חיפוש ({searchResults.length})
                        </h3>
                        <div className="grid gap-2">
                          {searchResults.map((product, index) => (
                            <Link
                              key={product.id}
                              href={`/shop/${product.slug}`}
                              onClick={handleClose}
                              className="w-full flex items-center gap-4 p-3 hover:bg-white/10 hover:scale-[1.02] transition-all duration-200 text-left group animate-in fade-in slide-in-from-right-4"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="w-12 h-12 overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white text-base truncate group-hover:text-gold-200 transition-colors duration-200">
                                  {product.name}
                                </div>
                                <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-200">
                                  {product.category.name}
                                </div>
                              </div>
                              <div className="text-base font-semibold text-gold-400 group-hover:text-gold-300 transition-colors duration-200">
                                ₪{product.price}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 animate-in fade-in duration-500">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <Search className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-white/70 text-lg font-medium">
                          לא נמצאו מוצרים
                        </p>
                        <p className="text-white/50 text-sm mt-2">
                          נסה מילות חיפוש אחרות
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 animate-in fade-in duration-300">
                    <p className="text-white/60 text-sm">
                      הקלד לפחות 2 תווים לחיפוש
                    </p>
                  </div>
                )}
              </div>

              {/* Suggested Products Section */}
              {suggestedProducts.length > 0 && (
                <div className="border-t border-white/10 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                      <span className="text-black text-xs font-bold">★</span>
                    </div>
                    מוצרים מומלצים
                  </h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {suggestedProducts.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        onClick={handleClose}
                        className="flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-white/10 hover:scale-105 transition-all duration-300 text-center group animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${(index + 3) * 100}ms` }}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-lg transition-all duration-300 relative">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="w-full">
                          <div className="font-medium text-white text-xs sm:text-sm truncate group-hover:text-gold-200 transition-colors duration-200">
                            {product.name}
                          </div>
                          <div className="text-xs sm:text-base font-semibold text-gold-400 mt-1 group-hover:text-gold-300 transition-colors duration-200">
                            ₪{product.price}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
