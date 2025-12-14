// src/lib/seo/metadata.ts
// Utility functions for generating consistent metadata across the site

import { Metadata } from 'next';

const SITE_NAME = 'Forge & Steel';
const SITE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const DEFAULT_LOCALE = 'en';

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  locale?: string;
  alternateLocale?: string;
  noIndex?: boolean;
  canonical?: string;
}

interface ProductMetadataOptions extends PageMetadataOptions {
  price?: number;
  currency?: string;
  availability?: string;
  brand?: string;
}

/**
 * Generate base metadata for any page
 */
export function generateMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = `${SITE_URL}/images/og-default.jpg`,
    url = SITE_URL,
    type = 'website',
    locale = 'en',
    alternateLocale = 'he',
    noIndex = false,
    canonical,
  } = options;

  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const truncatedDescription = description.slice(0, 160);

  const metadata: Metadata = {
    title: fullTitle,
    description: truncatedDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: canonical || url,
      languages: {
        [locale]: url,
        [alternateLocale]: url.replace(`/${locale}`, `/${alternateLocale}`),
      },
    },
    openGraph: {
      type: type === 'product' ? 'website' : type,
      locale: locale === 'en' ? 'en_US' : 'he_IL',
      alternateLocale: alternateLocale === 'en' ? 'en_US' : 'he_IL',
      url: url,
      title: fullTitle,
      description: truncatedDescription,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: truncatedDescription,
      images: [image],
    },
  };

  return metadata;
}

/**
 * Generate product-specific metadata
 */
export function generateProductMetadata(
  options: ProductMetadataOptions
): Metadata {
  const baseMetadata = generateMetadata({
    ...options,
    type: 'website',
  });

  // Add product-specific OpenGraph data
  if (options.price && baseMetadata.openGraph) {
    baseMetadata.openGraph = {
      ...baseMetadata.openGraph,
      // @ts-expect-error - Next.js types don't fully support all product OG properties
      productPrice: {
        amount: options.price.toFixed(2),
        currency: options.currency || 'ILS',
      },
      productAvailability: options.availability || 'in stock',
    };
  }

  return baseMetadata;
}

/**
 * Generate home page metadata
 */
export function generateHomeMetadata(language: 'en' | 'he' = 'en'): Metadata {
  const titles = {
    en: "Premium Men's Jewelry - Handcrafted Rings & Accessories",
    he: 'תכשיטים לגברים - טבעות ואביזרים בעבודת יד',
  };

  const descriptions = {
    en: 'Discover Forge & Steel - Premium handcrafted jewelry for the modern gentleman. Unique rings, bracelets, and accessories made with the finest materials.',
    he: "גלה את פורג' אנד סטיל - תכשיטים בעבודת יד איכוtiים לגבר המודרני. טבעות ייחודיות, צמידים ואביזרים מחומרים משובחים.",
  };

  return generateMetadata({
    title: titles[language],
    description: descriptions[language],
    keywords: [
      "men's jewelry",
      'handcrafted rings',
      'premium jewelry',
      'men accessories',
      'steel jewelry',
      'תכשיטים לגברים',
      'טבעות לגברים',
    ],
    url: SITE_URL,
    locale: language,
  });
}

/**
 * Generate category page metadata
 */
export function generateCategoryMetadata(
  categoryName: string,
  categoryDescription: string,
  categorySlug: string,
  language: 'en' | 'he' = 'en'
): Metadata {
  return generateMetadata({
    title: `${categoryName} Collection`,
    description: categoryDescription || `Shop our ${categoryName} collection`,
    url: `${SITE_URL}/categories/${categorySlug}`,
    keywords: [categoryName, 'jewelry', 'men accessories'],
    locale: language,
  });
}

/**
 * Generate search results metadata
 */
export function generateSearchMetadata(
  query: string,
  language: 'en' | 'he' = 'en'
): Metadata {
  return generateMetadata({
    title: `Search Results: ${query}`,
    description: `Browse our products matching "${query}"`,
    url: `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
    noIndex: true, // Don't index search result pages
    locale: language,
  });
}

/**
 * Get site URL (for use in schema generation)
 */
export function getSiteUrl(): string {
  return SITE_URL;
}

/**
 * Get site name
 */
export function getSiteName(): string {
  return SITE_NAME;
}

/**
 * Generate hreflang links for bilingual support
 */
export function generateHreflangLinks(
  basePath: string
): { rel: string; hreflang: string; href: string }[] {
  return [
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${SITE_URL}/en${basePath}`,
    },
    {
      rel: 'alternate',
      hreflang: 'he',
      href: `${SITE_URL}/he${basePath}`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_URL}${basePath}`,
    },
  ];
}
