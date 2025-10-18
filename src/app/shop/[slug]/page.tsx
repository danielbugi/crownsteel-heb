// src/app/shop/[slug]/page.tsx
// UPDATED VERSION - WITH REVIEWS INTEGRATION

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetail } from '@/components/shop/product-detail';
import { RelatedProducts } from '@/components/shop/related-products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewForm } from '@/components/product/review-form';
import { ReviewsList } from '@/components/product/reviews-list';
import { RatingSummary } from '@/components/product/rating-summary';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
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
  };
}

async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
    },
    take: 3,
    include: {
      category: true,
    },
  });

  // Serialize Decimal to number
  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Forge & Steel`,
    description: product.description,
  };
}

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-12 mx-auto">
        {/* Product Details */}
        <ProductDetail product={product} />

        {/* Reviews Section */}
        <section className="mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount || 0})
              </TabsTrigger>
              <TabsTrigger value="write">Write a Review</TabsTrigger>
            </TabsList>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
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
            <TabsContent value="write" className="mt-8">
              <div className="max-w-2xl mx-auto">
                <ReviewForm productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
