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
import { Input } from '@/components/ui/input';
import { useSettings } from '@/contexts/settings-context';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const { t, language } = useLanguage();

  return (
    <footer className="bg-zinc-900 text-white">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            {/* <div className="flex items-center ">
              <Logo />
            </div> */}
            <h3 className="text-gold-300 text-lg font-light">תמצאו אותנו</h3>
            <div className="space-y-2 text-gray-400">
              <p className="text-gray-400">
                {settings?.siteDescription || t('footer.description')}
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                {settings?.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-gray-200 hover:text-gold-300 transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
                {settings?.contactPhone && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="text-gray-200 hover:text-gold-300 transition-colors"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                )}
                {settings?.address && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gold-300 text-lg font-light">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {t('footer.shopAll')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {t('footer.categories')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-gold-300 text-lg font-light">
              {t('footer.customerService')}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {language === 'he' ? 'משלוחים והחזרות' : 'Shipping & Returns'}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-200 hover:text-gold-300 transition-colors"
                >
                  {language === 'he' ? 'תנאי שימוש' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-gold-300 text-lg font-light">
              {t('footer.newsletter')}
            </h3>
            <p className="text-gray-400">{t('footer.newsletterDesc')}</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-accent hover:bg-accent/90">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} {settings?.siteName || 'Forge & Steel'}.{' '}
            {t('footer.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
