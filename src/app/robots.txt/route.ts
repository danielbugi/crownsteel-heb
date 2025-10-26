// src/app/robots.txt/route.ts
import { NextResponse } from 'next/server';

/**
 * Robots.txt Generator
 * Includes references to both language-specific sitemaps
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const robotsTxt = `# Forge & Steel Robots.txt
# https://www.robotstxt.org/robotstxt.html

User-agent: *
Allow: /

# Sitemaps - Bilingual
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-en.xml
Sitemap: ${baseUrl}/sitemap-he.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Disallow auth pages
Disallow: /auth/

# Disallow search result pages (prevent duplicate content)
Disallow: /search?
Disallow: /*?q=
Disallow: /*?page=

# Allow product and category pages
Allow: /products/
Allow: /categories/
Allow: /en/
Allow: /he/
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
