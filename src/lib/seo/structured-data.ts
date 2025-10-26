// src/lib/seo/structured-data.ts
// Utility functions for generating structured data (JSON-LD) for SEO

interface ProductSchemaData {
  name: string;
  nameEn?: string;
  nameHe?: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  currency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}

interface OrganizationSchemaData {
  name: string;
  url: string;
  logo: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: string[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate Product Schema (JSON-LD)
 * Used for e-commerce product pages
 */
export function generateProductSchema(data: ProductSchemaData) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.images || [data.image],
    brand: {
      '@type': 'Brand',
      name: data.brand || 'Forge & Steel',
    },
    offers: {
      '@type': 'Offer',
      price: data.price.toFixed(2),
      priceCurrency: data.currency || 'ILS',
      availability: `https://schema.org/${data.availability}`,
      url: data.url,
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days from now
    },
  };

  // Add optional fields
  if (data.sku) {
    Object.assign(schema, { sku: data.sku });
  }

  if (data.category) {
    Object.assign(schema, { category: data.category });
  }

  // Add aggregate rating if available
  if (data.rating && data.reviewCount) {
    Object.assign(schema, {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating.toFixed(1),
        reviewCount: data.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    });
  }

  return schema;
}

/**
 * Generate Organization Schema (JSON-LD)
 * Used for the main site/homepage
 */
export function generateOrganizationSchema(data: OrganizationSchemaData) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
  };

  if (data.contactEmail) {
    schema.email = data.contactEmail;
  }

  if (data.contactPhone) {
    schema.telephone = data.contactPhone;
  }

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: 'Tel Aviv',
      addressCountry: 'IL',
      streetAddress: data.address,
    };
  }

  if (data.socialLinks && data.socialLinks.length > 0) {
    schema.sameAs = data.socialLinks;
  }

  return schema;
}

/**
 * Generate BreadcrumbList Schema (JSON-LD)
 * Used for navigation breadcrumbs
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate WebSite Schema (JSON-LD)
 * Used for site-wide search functionality
 */
export function generateWebSiteSchema(siteUrl: string, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate ItemList Schema (JSON-LD)
 * Used for category/collection pages
 */
export function generateItemListSchema(
  items: Array<{ name: string; url: string; image: string; price: number }>,
  listName: string,
  listUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        image: item.image,
        url: item.url,
        offers: {
          '@type': 'Offer',
          price: item.price.toFixed(2),
          priceCurrency: 'ILS',
        },
      },
    })),
  };
}

/**
 * Generate FAQ Schema (JSON-LD)
 * Used for FAQ pages
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
