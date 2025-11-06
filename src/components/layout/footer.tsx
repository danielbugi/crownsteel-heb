'use client';

import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/settings-context';
import { useLanguage } from '@/contexts/language-context';
// ✅ NEW: Import newsletter component
import { NewsletterSignup } from '@/components/footer/newsletter-signup';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const { t, language } = useLanguage();

  return (
    <footer className="bg-zinc-900">
      <div className="container px-4 sm:px-6 py-10 sm:py-12 md:py-16 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-gray-200 text-lg sm:text-xl font-light">
              {t('footer.findUs')}
            </h3>
            <div className="space-y-3 sm:space-y-4 text-gray-400">
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {settings?.siteDescription || t('footer.description')}
              </p>

              {/* Contact Info - Mobile Optimized */}
              <div className="space-y-3">
                {settings?.contactEmail && (
                  <div className="flex items-center gap-3 text-gray-400 text-sm sm:text-base">
                    <Mail className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-300" />
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-gray-200 hover:text-gold-300 transition-colors min-h-[44px] flex items-center"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
                {settings?.contactPhone && (
                  <div className="flex items-center gap-3 text-gray-400 text-sm sm:text-base">
                    <Phone className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-300" />
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="text-gray-200 hover:text-gold-300 transition-colors min-h-[44px] flex items-center"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                )}
                {settings?.address && (
                  <div className="flex items-start gap-3 text-gray-400 text-sm sm:text-base">
                    <MapPin className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0 text-gray-300 mt-0.5" />
                    <span className="leading-relaxed">{settings.address}</span>
                  </div>
                )}
              </div>

              {/* Social Media - Touch Friendly */}
              <div className="flex items-center gap-2 sm:gap-3 pt-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10"
                >
                  <Facebook className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10"
                >
                  <Instagram className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10"
                >
                  <Twitter className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-gray-200 text-lg sm:text-xl font-light">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {t('footer.shopAll')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {t('footer.categories')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-gray-200 text-lg sm:text-xl font-light">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {language === 'he' ? 'משלוחים והחזרות' : 'Shipping & Returns'}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-200 hover:text-gold-300 transition-colors text-sm sm:text-base min-h-[44px] flex items-center"
                >
                  {language === 'he' ? 'תנאי שימוש' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

          {/* ✅ UPDATED: Newsletter Section - Now uses working component */}
          <div className="space-y-4">
            <NewsletterSignup />
          </div>
        </div>

        {/* Copyright Section - Mobile Optimized */}
        <div className="border-t border-gray-700 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            &copy; {currentYear} {settings?.siteName || 'CrownSteel'}.{' '}
            {t('footer.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
