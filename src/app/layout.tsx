// src/app/layout.tsx
// ENHANCED VERSION with improved SEO
// Replace your existing layout.tsx with this version

import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Figtree, Cinzel } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CartSheet } from '@/components/cart/cart-sheet';
import { AuthProvider } from '@/components/providers/auth-provider';
import { SettingsProvider } from '@/contexts/settings-context';
// import { LanguageProvider } from '@/contexts/language-context';
import { Toaster } from 'react-hot-toast';
import { WishlistSyncProvider } from '@/components/providers/wishlist-sync-provider';
import { WishlistSheet } from '@/components/wishlist/wishlist-sheet';
import { StructuredData } from '@/components/seo/structured-data';
import { HreflangLinks } from '@/components/seo/hreflang-links';
import { CookieAndSignupFlow } from '@/components/layout/cookie-and-signup-flow';
import { WebVitalsProvider } from '@/components/providers/web-vitals-provider';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/structured-data';

// Luxury Fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-figtree',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const SITE_NAME = 'CrownSteel';

// Enhanced Metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Kings Choice`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Handcrafted rings and jewelry designed for the modern gentleman. Premium quality materials, expert craftsmanship, and timeless designs.',
  keywords: [
    "men's jewelry",
    'handcrafted rings',
    'premium jewelry',
    'steel jewelry',
    'men accessories',
    'men rings',
    'bracelets',
    'necklaces',
    'jewelry store',
    'luxury jewelry',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/en`,
      he: `${SITE_URL}/he`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'he_IL',
    url: SITE_URL,
    title: `${SITE_NAME} - Premium Men's Jewelry`,
    description:
      'Handcrafted rings and jewelry designed for the modern gentleman',
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Premium Men's Jewelry`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Premium Men's Jewelry`,
    description:
      'Handcrafted rings and jewelry designed for the modern gentleman',
    images: [`${SITE_URL}/images/twitter-image.jpg`],
    creator: '@forgeandsteel', // Update with your actual Twitter handle
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Generate organization and website schemas
const organizationSchema = generateOrganizationSchema({
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  contactEmail: 'info@forgeandsteel.com', // Update with actual email
  contactPhone: '+972-XX-XXXXXXX', // Update with actual phone
  address: 'Tel Aviv, Israel', // Update with actual address
  socialLinks: [
    'https://facebook.com/forgeandsteel',
    'https://instagram.com/forgeandsteel',
    'https://twitter.com/forgeandsteel',
  ],
});

const websiteSchema = generateWebSiteSchema(SITE_URL, SITE_NAME);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${figtree.variable} ${cinzel.variable} ${playfair.variable}`}
    >
      <head>
        <HreflangLinks />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Structured Data */}
        <StructuredData data={[organizationSchema, websiteSchema]} />
      </head>
      <body
        className="font-sans"
        style={{ fontFamily: "'Figtree', system-ui, sans-serif" }}
      >
        <AuthProvider>
          <SettingsProvider>
            <WishlistSyncProvider>
              <WebVitalsProvider>
                <div className="flex min-h-screen flex-col">
                  <AnnouncementBar />
                  <div className="sticky top-0 z-50 border-b-4 border-black" />
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <CartSheet />
                <WishlistSheet />
                <CookieAndSignupFlow />
                <Toaster position="bottom-right" />
              </WebVitalsProvider>
            </WishlistSyncProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
