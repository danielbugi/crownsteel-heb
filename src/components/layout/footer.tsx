'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter valid email.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter valid email.');
      return;
    }

    // Clear error and proceed with subscription
    setError('');
    // TODO: Add your newsletter subscription logic here
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer className="bg-black-soft border-t border-black-rich">
      <div className="container px-6 sm:px-8 lg:px-12 py-12 sm:py-16 mx-auto">
        {/* Header - CrownSteel */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sans tracking-wide">
            CROWNSTEEL
          </h2>
        </div>

        {/* White Separator */}
        <div className="w-full h-px bg-gray-600 mb-12"></div>

        {/* Main Content Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto mb-12">
          {/* Newsletter Sign Up Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white font-sans mb-4">
              Stay Connected
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join the CrownSteel community and be the first to discover our
              exclusive collections. Premium handcrafted jewelry designed for
              those who demand excellence and timeless style.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <div
                  className={`relative flex items-center bg-gray-800 border rounded-sm overflow-hidden focus-within:ring-2 transition-all ${
                    error
                      ? 'border-red-500 focus-within:ring-red-500'
                      : 'border-gray-700 focus-within:ring-white'
                  }`}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-all whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              {/* Consent Text */}
              <p className="text-xs text-gray-500 leading-relaxed">
                By submitting this form, you consent to the processing of your
                personal data and agree to our{' '}
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white underline"
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white underline"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </form>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white font-sans mb-4">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-8">
              {/* Column 1 */}
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/shop"
                      className="text-gray-400 hover:text-white transition-colors text-sm font-sans"
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-400 hover:text-white transition-colors text-sm font-sans"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-400 hover:text-white transition-colors text-sm font-sans"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/faq"
                      className="text-gray-400 hover:text-white transition-colors text-sm font-sans"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-400 hover:text-white transition-colors text-sm font-sans"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-gray-400 hover:text-white transition-colors text-sm font-sans"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-gray-600 text-sm font-sans">
              © {currentYear} {settings?.siteName || 'CrownSteel'}. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
