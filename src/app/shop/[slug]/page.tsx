import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductDetail } from '@/components/shop/product-detail';
import { RelatedProducts } from '@/components/shop/related-products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewForm } from '@/components/product/review-form';
import { ReviewsList } from '@/components/product/reviews-list';
import { RatingSummary } from '@/components/product/rating-summary';
import { StructuredData } from '@/components/seo/structured-data';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { generateProductMetadata } from '@/lib/seo/metadata';
import { Star, MessageSquare } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch product data
async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: { inStock: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Serialize Decimal to number
  return {
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
    averageRating: product.averageRating?.toNumber() ?? 0,
    sku: product.sku ?? undefined,
    variantLabel: product.variantLabel ?? undefined,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price?.toNumber() ?? undefined,
      priceAdjustment: v.priceAdjustment?.toNumber() ?? undefined,
      inventory: v.inventory,
      inStock: v.inStock,
      isDefault: v.isDefault,
      sortOrder: v.sortOrder,
    })),
  };
}

// Fetch related products
async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      inStock: true,
    },
    take: 4,
    include: {
      category: true,
    },
  });

  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
    averageRating: product.averageRating?.toNumber() ?? 0,
    createdAt: product.createdAt.toISOString(),
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  const productUrl = `${SITE_URL}/shop/${product.slug}`;

  // Use bilingual names for better SEO
  const title = product.name;
  const description =
    product.description ||
    `Shop ${title} at Forge & Steel. Premium handcrafted jewelry for the modern gentleman.`;

  // Generate keywords from product data
  const keywords = [
    product.name,
    product.category.name,
    "men's jewelry",
    'handcrafted',
    'premium',
  ].filter(Boolean);

  return generateProductMetadata({
    title: title,
    description: description,
    keywords: keywords as string[],
    image: product.image,
    url: productUrl,
    price: product.price,
    currency: 'ILS',
    availability: product.inStock ? 'in stock' : 'out of stock',
    brand: 'Forge & Steel',
    canonical: productUrl,
  });
}

// Main page component
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id
  );

  // Generate Product Schema
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description || '',
    image: product.image,
    images: product.images,
    price: product.price,
    currency: 'ILS',
    availability: product.inStock ? 'InStock' : 'OutOfStock',
    brand: 'Forge & Steel',
    sku: product.sku || undefined,
    category: product.category.name,
    rating: product.averageRating || undefined,
    reviewCount: product.reviewCount || undefined,
    url: `${SITE_URL}/shop/${product.slug}`,
  });

  // Generate Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'דף הבית', url: SITE_URL },
    { name: 'חנות', url: `${SITE_URL}/shop` },
    {
      name: product.category.name,
      url: `${SITE_URL}/categories/${product.category.slug}`,
    },
    {
      name: product.name,
      url: `${SITE_URL}/shop/${product.slug}`,
    },
  ]);

  return (
    <>
      {/* Add Structured Data */}
      <StructuredData data={[productSchema, breadcrumbSchema]} />

      <div className="min-h-screen bg-background">
        {/* Breadcrumb Navigation */}
        <section className="container mx-auto px-4 py-4 md:py-6">
          <Breadcrumb
            items={[
              { label: 'חנות', href: '/shop' },
              {
                label: product.category.name,
                href: `/shop?category=${product.category.slug}`,
              },
              {
                label: product.name,
              },
            ]}
          />
        </section>

        {/* Product Detail */}
        <section className="container mx-auto px-4 py-4 md:py-8">
          <ProductDetail product={product} />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 py-12 bg-white">
            <RelatedProducts products={relatedProducts} />
          </section>
        )}

        {/* Reviews Section */}
        <section className="container mx-auto px-4 md:px-6 py-12 bg-gray-50 border-y border-gray-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-2xl font-semibold mb-8 flex items-center gap-2 text-gray-900">
              חוות דעת של לקוחות
            </h2>

            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-white border border-gray-200">
                <TabsTrigger
                  value="reviews"
                  className="flex items-center gap-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-700"
                >
                  <Star className="h-4 w-4" />
                  חוות דעת ({product.reviewCount || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="write"
                  className="flex items-center gap-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white text-gray-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  כתוב חוות דעת
                </TabsTrigger>
              </TabsList>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                {/* Rating Summary */}
                <RatingSummary
                  productId={product.id}
                  averageRating={product.averageRating || 0}
                  reviewCount={product.reviewCount || 0}
                />

                {/* Reviews List */}
                <div className="mt-8">
                  <ReviewsList productId={product.id} />
                </div>
              </TabsContent>

              {/* Write Review Tab */}
              <TabsContent value="write" className="mt-6">
                <div className="max-w-2xl mx-auto">
                  <ReviewForm productId={product.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
}

// Generate static params for static generation (optional but recommended)
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { inStock: true },
    select: { slug: true },
    take: 100, // Generate top 100 products at build time
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
