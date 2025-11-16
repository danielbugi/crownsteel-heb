// src/app/sitemap.ts
// Dynamic sitemap generation for all pages, products, and categories

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch all products
  const products = await prisma.product.findMany({
    where: {
      inStock: true, // Only include products in stock
    },
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/shop/${product.slug}`,
    lastModified: product.updatedAt || product.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Fetch all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: category.updatedAt || category.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Fetch all published blog posts
  const blogPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Combine all pages
  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}

// Optional: Generate separate sitemaps for different languages
export async function generateLocalizedSitemap(
  locale: 'en' | 'he'
): Promise<MetadataRoute.Sitemap> {
  const baseSitemap = await sitemap();

  return baseSitemap.map((entry) => ({
    ...entry,
    url: entry.url.replace(SITE_URL, `${SITE_URL}/${locale}`),
  }));
}
