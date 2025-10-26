// // src/app/shop/[slug]/page.tsx
// // UPDATED VERSION - WITH REVIEWS INTEGRATION

// import { notFound } from 'next/navigation';
// import { prisma } from '@/lib/prisma';
// import { ProductDetail } from '@/components/shop/product-detail';
// import { RelatedProducts } from '@/components/shop/related-products';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ReviewForm } from '@/components/product/review-form';
// import { ReviewsList } from '@/components/product/reviews-list';
// import { RatingSummary } from '@/components/product/rating-summary';

// interface ProductPageProps {
//   params: Promise<{
//     slug: string;
//   }>;
// }

// async function getProduct(slug: string) {
//   const product = await prisma.product.findUnique({
//     where: { slug },
//     include: {
//       category: true,
//       variants: {
//         // ADD THIS
//         where: { inStock: true },
//         orderBy: { sortOrder: 'asc' },
//       },
//     },
//   });

//   if (!product) {
//     return null;
//   }

//   // Serialize Decimal to number
//   return {
//     ...product,
//     price: product.price.toNumber(),
//     comparePrice: product.comparePrice?.toNumber() ?? null,
//     averageRating: product.averageRating?.toNumber() ?? 0,
//     variants: product.variants.map((v) => ({
//       ...v,
//       price: v.price?.toNumber() ?? null,
//       priceAdjustment: v.priceAdjustment?.toNumber() ?? null,
//     })),
//   };
// }

// async function getRelatedProducts(
//   categoryId: string,
//   currentProductId: string
// ) {
//   const products = await prisma.product.findMany({
//     where: {
//       categoryId,
//       id: { not: currentProductId },
//     },
//     take: 3,
//     include: {
//       category: true,
//     },
//   });

//   // Serialize Decimal to number
//   return products.map((product) => ({
//     ...product,
//     price: product.price.toNumber(),
//     comparePrice: product.comparePrice?.toNumber() ?? null,
//   }));
// }

// export async function generateMetadata({ params }: ProductPageProps) {
//   const { slug } = await params;
//   const product = await getProduct(slug);

//   if (!product) {
//     return {
//       title: 'Product Not Found',
//     };
//   }

//   return {
//     title: `${product.name} - Forge & Steel`,
//     description: product.description,
//   };
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const { slug } = await params;
//   const product = await getProduct(slug);

//   if (!product) {
//     notFound();
//   }

//   const relatedProducts = await getRelatedProducts(
//     product.categoryId,
//     product.id
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container px-4 py-12 mx-auto">
//         {/* Product Details */}
//         <ProductDetail product={product} />

//         {/* Reviews Section */}
//         <section className="mt-16">
//           <Tabs defaultValue="reviews" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
//               <TabsTrigger value="reviews">
//                 Reviews ({product.reviewCount || 0})
//               </TabsTrigger>
//               <TabsTrigger value="write">Write a Review</TabsTrigger>
//             </TabsList>

//             {/* Reviews Tab */}
//             <TabsContent value="reviews" className="mt-8">
//               {/* Rating Summary */}
//               <RatingSummary
//                 productId={product.id}
//                 averageRating={product.averageRating || 0}
//                 reviewCount={product.reviewCount || 0}
//               />

//               {/* Reviews List */}
//               <div className="mt-8">
//                 <ReviewsList productId={product.id} />
//               </div>
//             </TabsContent>

//             {/* Write Review Tab */}
//             <TabsContent value="write" className="mt-8">
//               <div className="max-w-2xl mx-auto">
//                 <ReviewForm productId={product.id} />
//               </div>
//             </TabsContent>
//           </Tabs>
//         </section>

//         {/* Related Products */}
//         {relatedProducts.length > 0 && (
//           <div className="mt-20">
//             <RelatedProducts products={relatedProducts} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/app/shop/[slug]/page.tsx
// ENHANCED VERSION with SEO improvements
// Replace your existing product page with this version

// src/app/shop/[slug]/page.tsx
// ENHANCED VERSION with SEO improvements
// Replace your existing product page with this version

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
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';
import { generateProductMetadata } from '@/lib/seo/metadata';

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
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price?.toNumber() ?? null,
      priceAdjustment: v.priceAdjustment?.toNumber() ?? null,
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
    take: 3,
    include: {
      category: true,
    },
  });

  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
    averageRating: product.averageRating?.toNumber() ?? 0,
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
  const title = product.nameEn || product.name;
  const description =
    product.descriptionEn ||
    product.description ||
    `Shop ${title} at Forge & Steel. Premium handcrafted jewelry for the modern gentleman.`;

  // Generate keywords from product data
  const keywords = [
    product.name,
    product.nameEn,
    product.category.name,
    product.category.nameEn,
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
    nameEn: product.nameEn || undefined,
    nameHe: product.nameHe || undefined,
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
    { name: 'Home', url: SITE_URL },
    { name: 'Shop', url: `${SITE_URL}/shop` },
    {
      name: product.category.name,
      url: `${SITE_URL}/categories/${product.category.slug}`,
    },
    { name: product.name, url: `${SITE_URL}/shop/${product.slug}` },
  ]);

  return (
    <>
      {/* Add Structured Data */}
      <StructuredData data={[productSchema, breadcrumbSchema]} />

      <div className="min-h-screen bg-background">
        {/* Product Detail */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <ProductDetail product={product} />
        </section>

        {/* Tabs Section */}
        <section className="container mx-auto px-4 md:px-6 py-12">
          <Tabs defaultValue="reviews" className="w-full max-w-5xl mx-auto">
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
          <section className="container mx-auto px-4 md:px-6 py-12 bg-muted/30">
            <RelatedProducts products={relatedProducts} />
          </section>
        )}
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
