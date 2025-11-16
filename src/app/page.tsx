import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/shop/product-carousel';
import { NewsletterForm } from '@/components/ui/newsletter-form';
import { CategoryCard } from '@/components/home/category-card';
import { prisma } from '@/lib/prisma';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { serializeProducts } from '@/lib/serialize';

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

      <section className="container relative h-[60vh] md:h-[80vh] min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
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
        <div className="contaihttp://localhost:3000/shopner px-4 sm:px-6 mx-auto relative z-10">
          <ScrollReveal direction="up" delay={100}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-6 md:space-y-8 text-white-pure animate-fade-in">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white-pure font-cinzel font-bold leading-[1.1] drop-shadow-cinematic-xl tracking-tight">
                  CROWN STEEL
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl text-gold-elegant font-light leading-relaxed drop-shadow-cinematic tracking-widest uppercase">
                  {/* RULE YOUR LOOK <br />
                  FEEL LIKE A KING */}
                  PREMIUM JEWELRY FOR MODERN KINGS
                </p>

                {/* Minimal CTA */}
                <div className="pt-6 flex justify-center">
                  <Link href="/shop">
                    <Button
                      size="xlg"
                      className="bg-gold-elegant hover:bg-gold-600 text-black-pure font-semibold min-h-[62px] px-12 tracking-widest shadow-cinematic hover-masculine uppercase text-sm"
                    >
                      Enter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold-elegant/50 rounded-full p-1">
            <div className="w-1.5 h-3 bg-gold-elegant/50 rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Categories Section - Minimalist */}
      <ScrollReveal direction="up" delay={100}>
        <section className="py-16 sm:py-20 md:py-24 bg-black-soft">
          <div className="container px-4 sm:px-6 mx-auto">
            {/* Power Statement - Less text, more impact */}
            <div className="text-center mb-16 sm:mb-20 md:mb-24">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-light text-white-pure tracking-wider leading-tight">
                  Status.
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-light text-white-pure tracking-wider leading-tight">
                  Presence.
                </p>
                <p
                  className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold tracking-wider leading-tight"
                  style={{ color: '#C5A253' }}
                >
                  POWER.
                </p>
              </div>
            </div>

            {/* First row - 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mb-5 sm:mb-6 md:mb-8">
              <CategoryCard
                href="/shop?category=rings"
                imageSrc="/images/category-rings.jpg"
                title="RINGS"
              />

              <CategoryCard
                href="/shop?category=necklaces"
                imageSrc="/images/category-necklaces.png"
                title="CHAINS"
              />
            </div>

            {/* Second row - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              <CategoryCard
                href="/shop?category=bracelets"
                imageSrc="/images/category-bracelets.png"
                title="BRACELETS"
              />

              <CategoryCard
                href="/shop?category=pendants"
                imageSrc="/images/category-pendants.jpg"
                title="PENDANTS"
              />

              <CategoryCard
                href="/shop?category=bundles"
                imageSrc="/images/category-bundles.png"
                title="BUNDLES"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Products Carousel - Boutique Style */}
      {featuredProducts.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <ProductCarousel
            products={featuredProducts}
            title="Selected for You"
            subtitle="Elegance. Strength. Steel."
          />
        </ScrollReveal>
      )}

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
                      Own Your Power
                    </h3>

                    <p className="uppercase font-light">
                      Premium Steel Jewelry. Built for Status.
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

      {/* New Arrivals Carousel */}
      {newArrivals.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <div className=" bg-black shadow-cinematic">
            <ProductCarousel
              products={newArrivals}
              title="NEW DROPS"
              subtitle="Fresh premium steel.
Just dropped."
            />
          </div>
        </ScrollReveal>
      )}

      {/* Email Subscription Section - Minimal & Dark */}
      <section className="container py-16 sm:py-20 md:py-24 bg-black text-white-pure shadow-cinematic-lg">
        <div className="container px-4 sm:px-6 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold mb-4 sm:mb-6 drop-shadow-cinematic text-white-pure tracking-tight uppercase">
              Join the Elite
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 leading-relaxed px-4">
              10% off your first order <br /> Exclusive drops. VIP access. For
              modern kings only.
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
