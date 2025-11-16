'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { NewsletterSignup } from '@/components/footer/newsletter-signup';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-black-soft border-t border-black-rich shadow-cinematic-lg">
      <div className="container px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-24 mx-auto">
        {/* Logo Section - Centered & Large */}
        <div className="flex justify-center mb-16">
          <Link href="/" className="block">
            <Image
              src="/images/logo/logo-2-white.png"
              alt={settings?.siteName || 'CrownSteel'}
              width={200}
              height={200}
              className="object-contain w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 opacity-80 hover:opacity-100 transition-opacity shadow-cinematic"
            />
          </Link>
        </div>

        {/* Main Content - Minimal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 max-w-5xl mx-auto mb-16">
          {/* Quick Links */}
          <div className="text-center md:text-right">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-gold-elegant transition-colors text-base font-cinzel font-light tracking-widest uppercase"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-gold-elegant transition-colors text-base font-cinzel font-light tracking-widest uppercase"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-gold-elegant transition-colors text-base font-cinzel font-light tracking-widest uppercase"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter - Center */}
          <div className="text-center">
            <NewsletterSignup />
          </div>

          {/* Customer Service */}
          <div className="text-center md:text-left">
            <ul className="space-y-4">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-gold-elegant transition-colors text-base font-cinzel font-light tracking-widest uppercase"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-gold-elegant transition-colors text-base font-cinzel font-light tracking-widest uppercase"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-gold-elegant transition-colors text-base font-cinzel font-light tracking-widest uppercase"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media - Centered with Gold accents */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <Link
            href="#"
            className="text-gray-500 hover:text-gold-elegant transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gold-elegant transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gold-elegant transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-sm font-light text-gray-400 tracking-wide text-center mb-6">
          CrownSteel. Designed to Make Men Feel Like Kings.
        </p>

        {/* Copyright - Minimal */}
        <div className="text-center">
          <p className="text-gray-600 text-sm font-cinzel font-light tracking-[0.2em] uppercase">
            © {currentYear} {settings?.siteName || 'FORGE & STEEL'}
          </p>
        </div>
      </div>
    </footer>
  );
}
