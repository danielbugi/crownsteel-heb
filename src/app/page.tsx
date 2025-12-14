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

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();
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

      {/* Categories Section - Minimalist */}
      <ScrollReveal>
        <section className="py-0 sm:py-0 bg-muted/60 md:py-0 shadow-cinematic-lg">
          <div className="px-0 sm:px-0 mx-auto">
            {/* First row - 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-0 md:gap-0]">
              <CategoryCard
                href="/shop?category=rings"
                imageSrc="/images/categories/category-rings.png"
                title="RINGS"
                priority={true}
              />

              <CategoryCard
                href="/shop?category=chains"
                imageSrc="/images/categories/category-chains.png"
                title="CHAINS"
                priority={true}
              />
            </div>

            {/* Second row - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-0 sm:gap-0 md:gap-0">
              <CategoryCard
                href="/shop?category=bracelets"
                imageSrc="/images/categories/category-bracelets.png"
                title="BRACELETS"
                priority={true}
              />

              <CategoryCard
                href="/shop?category=pendants"
                imageSrc="/images/categories/category-pendants.png"
                title="PENDANTS"
              />
            </div>
            <div className="grid grid-cols-1  gap-0 sm:gap-0 md:gap-0">
              <CategoryCard
                href="/shop?category=bundles"
                imageSrc="/images/categories/category-bundles.png"
                title="BUNDLES"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Products Carousel - Boutique Style */}
      {featuredProducts.length > 0 && (
        <ScrollReveal>
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

      {/* Secondary CTA Section - Dark & Powerful */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <Link href="/shop" className="absolute inset-0">
          {/* Split Background Images */}
          <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
            {/* Left Image */}
            <div className="relative h-full">
              <Image
                src="/images/product-5.jpg"
                alt="Fine Jewelry Collection"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
              />
              <div className="absolute inset-0 bg-black-pure/60"></div>
            </div>

            {/* Right Image */}
            <div className="relative h-full hidden md:block">
              <Image
                src="/images/product-4.jpg"
                alt="Fine Jewelry Collection"
                fill
                className="object-cover"
                sizes="50vw"
                quality={95}
              />
              <div className="absolute inset-0 bg-black-pure/60"></div>
            </div>
          </div>

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/60 to-black-pure/50 z-[1]"></div>
          <div className="absolute inset-0 shadow-cinematic-xl z-[1]"></div>

          {/* Minimal CTA Content */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="container px-4 sm:px-6 mx-auto">
              <ScrollReveal direction="up" delay={100}>
                <div className="max-w-5xl mx-auto text-center">
                  <div className="space-y-6 sm:space-y-8 text-white-pure animate-fade-in">
                    <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white-pure font-cinzel font-bold leading-tight drop-shadow-cinematic-xl tracking-tight uppercase">
                      Take The Throne
                    </h3>

                    <p className="uppercase font-light">
                      Premium Steel Jewelry.
                    </p>

                    <div className="pt-4 flex justify-center">
                      <Button
                        size="lg"
                        className="bg-gold-elegant hover:bg-gold-600 text-black-pure font-semibold min-h-[56px] px-10 tracking-widest shadow-cinematic hover-masculine uppercase text-sm"
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Link>
      </section>

      {/* Email Subscription Section - Minimal & Dark */}
      <section className="container py-16 sm:py-20 md:py-24 bg-muted-foreground text-black shadow-cinematic-lg">
        <div className="container px-4 sm:px-6 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold mb-4 sm:mb-6 drop-shadow-cinematic text-black tracking-tight uppercase">
              Join the Club
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed px-4">
              Join our club and get Exclusive drops. VIP access. Kings Choice.
            </p>
            <div className="max-w-md mx-auto px-4 sm:px-0">
              <NewsletterForm
                placeholder="Email"
                buttonText="Join"
                variant="elegant"
                inputClassName="!text-white-pure bg-black-soft border-gold-elegant/30 placeholder:text-gray-500 min-h-[52px] text-base shadow-cinematic"
                buttonClassName="bg-gold-elegant text-black-pure hover:bg-gold-600 min-h-[52px] font-semibold tracking-widest uppercase shadow-cinematic hover-masculine"
                showIcon={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
