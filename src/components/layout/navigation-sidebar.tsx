'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationSidebar({ isOpen, onClose }: NavigationSidebarProps) {
  const [activeTab, setActiveTab] = useState<'shop' | 'menu'>('menu');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories?lang=he')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  const menuLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Collections' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 transition-all duration-300',
          isOpen
            ? 'opacity-100 z-50'
            : 'opacity-0 pointer-events-none invisible -z-10'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 h-full w-80 bg-white shadow-2xl transition-all duration-300 ease-in-out left-0',
          isOpen
            ? 'translate-x-0 z-50 visible'
            : '-translate-x-full z-50 invisible'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Menu</h2>
          <div className="flex items-center gap-2">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-black hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={cn(
              'flex-1 py-4 text-sm font-light uppercase tracking-wide transition-colors',
              activeTab === 'menu'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={cn(
              'flex-1 py-4 text-sm font-light uppercase tracking-wide transition-colors',
              activeTab === 'shop'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
          >
            Shop
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-9rem)]">
          {activeTab === 'menu' && (
            <nav className="py-2">
              {menuLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'block px-6 py-4 text-sm font-light uppercase tracking-wide text-black hover:bg-gray-50 transition-colors',
                    index !== menuLinks.length - 1 && 'border-b border-gray-200'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {activeTab === 'shop' && (
            <nav className="py-2">
              <Link
                href="/shop"
                onClick={onClose}
                className="block px-6 py-4 text-sm font-light uppercase tracking-wide text-black hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                View All Products
              </Link>

              {categories.length > 0 && (
                <>
                  {categories.map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.slug}`}
                      onClick={onClose}
                      className={cn(
                        'block px-6 py-4 text-sm font-light uppercase tracking-wide text-black hover:bg-gray-50 transition-colors',
                        index !== categories.length - 1 &&
                          'border-b border-gray-200'
                      )}
                    >
                      {category.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
