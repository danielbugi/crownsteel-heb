'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Hammer, Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 inline-block">
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'
            }`}
          >
            <Hammer
              className="w-32 h-32 text-gray-800 mx-auto"
              strokeWidth={1.5}
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-200 rounded-full blur-3xl opacity-50 animate-pulse delay-500" />
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1
            className={`text-8xl md:text-9xl font-bold text-gray-800 mb-2 transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            404
          </h1>
          <div
            className={`h-1 w-24 bg-gradient-to-r from-gray-800 to-amber-600 mx-auto rounded-full transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </div>

        {/* Message */}
        <div
          className={`space-y-4 mb-12 transition-all duration-1000 delay-400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button
            asChild
            size="lg"
            className="bg-gray-900 hover:bg-black text-white hover:text-white shadow-lg hover:shadow-xl w-full sm:w-auto group"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-gray-900 bg-white hover:bg-gray-900 hover:text-white text-gray-900 shadow-md hover:shadow-lg w-full sm:w-auto group"
          >
            <Link href="/shop">
              <ShoppingBag className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div
          className={`transition-all duration-1000 delay-600 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm text-gray-500 mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/search"
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all hover:scale-105"
            >
              <Search className="w-3 h-3 inline mr-1" />
              Search
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/about"
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all hover:scale-105"
            >
              About
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/contact"
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all hover:scale-105"
            >
              Contact
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/faq"
              className="text-sm text-gray-700 hover:text-gray-900 hover:underline transition-all hover:scale-105"
            >
              Help
            </Link>
          </div>
        </div>

        {/* Go Back Link */}
        <div
          className={`mt-8 transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
