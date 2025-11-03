// src/app/sitemap-en.xml/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

/**
 * English Sitemap Generator
 * Generates XML sitemap for all English content
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  try {
    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Fetch all active categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Static pages
    const staticPages = [
      { url: '/en', changefreq: 'daily', priority: '1.0' },
      { url: '/en/shop', changefreq: 'daily', priority: '0.9' },
      { url: '/en/about', changefreq: 'monthly', priority: '0.7' },
      { url: '/en/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/en/faq', changefreq: 'monthly', priority: '0.6' },
      { url: '/en/privacy', changefreq: 'yearly', priority: '0.4' },
      { url: '/en/terms', changefreq: 'yearly', priority: '0.4' },
      { url: '/en/shipping', changefreq: 'monthly', priority: '0.5' },
    ];

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${page.url}"/>
    <xhtml:link rel="alternate" hreflang="he" href="${baseUrl}${page.url.replace('/en', '/he')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url.replace('/en', '')}"/>
  </url>`
  )
  .join('\n')}
${categories
  .map(
    (category) => `  <url>
    <loc>${baseUrl}/en/categories/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/categories/${category.slug}"/>
    <xhtml:link rel="alternate" hreflang="he" href="${baseUrl}/he/categories/${category.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/categories/${category.slug}"/>
  </url>`
  )
  .join('\n')}
${products
  .map(
    (product) => `  <url>
    <loc>${baseUrl}/en/products/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/products/${product.slug}"/>
    <xhtml:link rel="alternate" hreflang="he" href="${baseUrl}/he/products/${product.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/products/${product.slug}"/>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating English sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
