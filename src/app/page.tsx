import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/shop/product-carousel';
import { NewsletterForm } from '@/components/ui/newsletter-form';
import { CategoryCard } from '@/components/home/category-card';
import { prisma } from '@/lib/prisma';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { serializeProducts } from '@/lib/serialize';

// ISR: Revalidate homepage every 5 minutes
export const revalidate = 300;

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
      inStock: true,
    },
    include: {
      category: true,
    },
    take: 8, // Keep 8 products, just show 3 at a time
    orderBy: {
      createdAt: 'desc',
    },
  });
  return serializeProducts(products);
}

async function getNewArrivals() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // ✅ SERIALIZE
  return serializeProducts(products);
}

async function getLatestBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
    },
    take: 2,
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
  }));
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();
  const latestBlogPosts = await getLatestBlogPosts();
  // const bestSellers = await getBestSellers();

  return (
    <div className="flex flex-col relative z-10">
      {/* Hero Section - Masculine Energy */}

      <section className="relative h-[60vh] md:h-[80vh] min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Link href="/shop">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-main.jpg"
              alt="Luxury Jewelry Collection"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={95}
            />
            {/* Cinematic Overlay - Deep shadows */}
            <div className="absolute inset-0 bg-gradient-to-r from-black-pure/80 via-black-pure/60 to-black-pure/70"></div>
            <div className="absolute inset-0 shadow-cinematic-xl"></div>
          </div>

          {/* Hero Content - Minimal & Powerful */}
          <div className="px-4 sm:px-6 mx-auto relative z-10">
            <ScrollReveal direction="up" delay={100}>
              <div className="max-w-4xl mx-auto text-center">
                <div className="space-y-6 md:space-y-8 text-white-pure animate-fade-in">
                  <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-4xl text-white-pure font-figtree font-medium leading-[1.1] drop-shadow-cinematic-xl tracking-tight">
                    The Path To your Throne
                  </h1>

                  <p className="text-xl sm:text-xl md:text-xl text-white font-light leading-relaxed drop-shadow-cinematic tracking-widest uppercase">
                    {/* RULE YOUR LOOK <br />
                  FEEL LIKE A KING */}
                    new collection
                  </p>

                  {/* Minimal CTA */}
                  {/* <div className="pt-6 flex justify-center">
                  <Link href="/shop">
                    <Button
                      size="xlg"
                      className="bg-gold-elegant hover:bg-gold-600 text-black-pure font-semibold min-h-[62px] px-12 tracking-widest shadow-cinematic hover-masculine uppercase text-sm"
                    >
                      Enter
                    </Button>
                  </Link>
                </div> */}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Scroll Indicator */}
          {/* <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <div className="w-6 h-10 border-2 border-gold-elegant/50 rounded-full p-1">
              <div className="w-1.5 h-3 bg-gold-elegant/50 rounded-full mx-auto"></div>
            </div>
          </div> */}
        </Link>
      </section>

      {/* Featured Products Carousel - Boutique Style */}
      {featuredProducts.length > 0 && (
        <ScrollReveal>
          <div className="border-t border-gray-200">
            <ProductCarousel
              products={
                featuredProducts as unknown as Parameters<
                  typeof ProductCarousel
                >[0]['products']
              }
              title="Hot Sellers"
              subtitle="Most wanted"
              prioritizeFirstImages={true}
            />
          </div>
        </ScrollReveal>
      )}

      {/* New Arrivals Carousel
      {newArrivals.length > 0 && (
        <ScrollReveal>
          <div className=" bg-black shadow-cinematic">
            <ProductCarousel
              products={
                newArrivals as unknown as Parameters<
                  typeof ProductCarousel
                >[0]['products']
              }
              title="NEW DROPS"
              subtitle="Just Landed"
            />
          </div>
        </ScrollReveal>
      )} */}

      {/* Gift Collections Section - Split Design */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          {/* Left Image - Gifts for Him */}
          <div className="relative h-full group">
            <Image
              src="/images/product-5.jpg"
              alt="Gifts for Him"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-black-pure/50 group-hover:bg-black-pure/40 transition-all"></div>

            {/* Text Overlay - Left */}
            <div className="absolute inset-0 flex items-end justify-start z-10 px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
              <ScrollReveal direction="up" delay={100}>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl sm:text-xl md:text-xl lg:text-xl text-white-pure font-sans font-bold leading-tight drop-shadow-cinematic-xl tracking-tight uppercase mb-6">
                    Gifts for Him
                  </h3>
                  <Link href="/shop?gender=him">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 font-semibold uppercase"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Image - Gifts for Her */}
          <div className="relative h-full group">
            <Image
              src="/images/product-4.jpg"
              alt="Gifts for Her"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-black-pure/50 group-hover:bg-black-pure/40 transition-all"></div>

            {/* Text Overlay - Right */}
            <div className="absolute inset-0 flex items-end justify-start z-10 px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
              <ScrollReveal direction="up" delay={150}>
                <div className="flex flex-col items-start">
                  <h3 className="text-xl sm:text-xl md:text-xl lg:text-xl text-white-pure font-sans font-bold leading-tight drop-shadow-cinematic-xl tracking-tight uppercase mb-6">
                    Gifts for Her
                  </h3>
                  <Link href="/shop?gender=her">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 font-semibold  uppercase"
                    >
                      Explore
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Our Collections */}
      <ScrollReveal>
        <section className="py-16 px-10 sm:py-20 bg-white">
          {/* Section Header */}
          <div className=" mb-12">
            <h2 className="text-lg sm:text-lg font-normal text-gray-900 mb-2">
              Our Collections
            </h2>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-20">
            {/* Rings */}
            <Link href="/shop?category=rings" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-rings.png"
                  alt="Rings Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-start text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors ">
                Rings
              </h3>
            </Link>

            {/* Chains */}
            <Link href="/shop?category=chains" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-chains.png"
                  alt="Chains Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-start text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                Chains
              </h3>
            </Link>

            {/* Bracelets */}
            <Link href="/shop?category=bracelets" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-bracelets.png"
                  alt="Bracelets Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-start text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                Bracelets
              </h3>
            </Link>

            {/* Pendants */}
            <Link href="/shop?category=pendants" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-pendants.png"
                  alt="Pendants Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-start text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                Pendants
              </h3>
            </Link>

            {/* Bundles */}
            <Link href="/shop?category=bundles" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-bundles.png"
                  alt="Bundles Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-start text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors ">
                Bundles
              </h3>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Blog Articles Section */}
      {latestBlogPosts && latestBlogPosts.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-center">
              {latestBlogPosts.map((post) => (
                <div key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    {/* Article Image */}
                    <div className="relative aspect-[16/10] mb-6 overflow-hidden bg-gray-100">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-sm">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Title */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Discover Button */}
                    <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all">
                      Discover
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Values Section - Modern & Clean */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-4 border-black">
            {/* Value 1 - Premium Quality */}
            <div className="text-center py-8 px-6 border-r border-b border-l border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Premium Quality
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Handcrafted with the finest materials. Each piece is
                meticulously designed for lasting beauty.
              </p>
            </div>

            {/* Value 2 - Lifetime Warranty */}
            <div className="text-center py-8 px-6 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lifetime Warranty
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We stand behind our craft. Every piece comes with a lifetime
                warranty against defects.
              </p>
            </div>

            {/* Value 3 - Free Shipping */}
            <div className="text-center py-8 px-6 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Free Shipping
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complimentary shipping on all orders. Your jewelry arrives
                safely, beautifully packaged.
              </p>
            </div>

            {/* Value 4 - Expert Craftsmanship */}
            <div className="text-center py-8 px-6 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expert Craftsmanship
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Years of expertise in every piece. Designed by artisans,
                perfected for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
