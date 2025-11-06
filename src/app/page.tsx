import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCarousel } from '@/components/shop/product-carousel';
import { NewsletterForm } from '@/components/ui/newsletter-form';
import {
  ArrowRight,
  Shield,
  Truck,
  Award,
  HeadphonesIcon,
  Sparkles,
} from 'lucide-react';
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
    take: 8,
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
    <div className="flex flex-col">
      {/* Hero Section - Mobile Optimized */}

      <section className="container relative h-[60vh] md:h-[70vh] min-h-[450px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-main.png"
            alt="Luxury Jewelry Collection"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          {/* Stronger Dark Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="container px-4 sm:px-6 mx-auto relative z-10">
          <ScrollReveal direction="up" delay={100}>
            <div className="max-w-3xl">
              <div className="space-y-3 sm:space-y-4 md:space-y-6 text-white animate-fade-in">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sparkles className="h-6 w-6 sm:h-5 sm:w-5 text-gold-400 flex-shrink-0" />
                  <h6 className="text-gold-400 uppercase tracking-widest text-xs sm:text-sm font-semibold font-sans drop-shadow-lg">
                    Premium Handcrafted Jewelry
                  </h6>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-light leading-tight drop-shadow-2xl">
                  25% Off All Collections
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed drop-shadow-lg max-w-2xl">
                  Discover exceptional pieces crafted for the modern gentleman.
                  Where tradition meets contemporary design.
                </p>

                {/* Mobile CTA Button */}
                <div className="pt-2 sm:pt-4">
                  <Link href="/shop">
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold min-h-[48px] px-6 sm:px-8"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Scroll Indicator - Hidden on Mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Mobile Optimized */}
      <ScrollReveal direction="up" delay={200}>
        <section className="container py-8 sm:py-12 md:py-16 bg-gradient-to-b from-secondary/20 to-background">
          <div className="px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <Card className="backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center pt-8 pb-8 px-4">
                  <div className="flex items-center justify-center mb-4 min-h-[48px]">
                    <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    Free Shipping
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Complimentary delivery on all orders over ₪500
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center pt-8 pb-8 px-4">
                  <div className="flex items-center justify-center mb-4 min-h-[48px]">
                    <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    Lifetime Warranty
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Comprehensive coverage on all craftsmanship
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center pt-8 pb-8 px-4">
                  <div className="flex items-center justify-center mb-4 min-h-[48px]">
                    <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    Premium Quality
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Master-crafted using finest materials
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center pt-8 pb-8 px-4">
                  <div className="flex items-center justify-center mb-4 min-h-[48px]">
                    <HeadphonesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    Expert Support
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Personal consultation and dedicated service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <div className="container bg-gradient-to-b from-background to-secondary/20">
            <ProductCarousel
              products={featuredProducts}
              title="Featured Collection"
              subtitle="Handpicked pieces that define excellence"
            />
          </div>
        </ScrollReveal>
      )}

      {/* Featured Collections - Mobile Optimized */}
      <ScrollReveal direction="up" delay={100}>
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 md:mb-6">
                Discover Your Steel
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {/* Rings Collection */}
              <Link
                href="/shop?category=rings"
                className="group relative overflow-hidden h-[350px] sm:h-[400px] md:h-[500px] rounded-lg"
              >
                <Image
                  src="/images/category_rings.png"
                  alt="Rings Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient Overlay - Lighter on mobile for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>

                {/* Content - Touch-friendly sizing */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-8 text-white">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl uppercase font-light mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
                    Rings
                  </h3>
                  <p className="text-sm sm:text-base md:text-base text-gray-200 mb-3 sm:mb-4 leading-relaxed">
                    Signature pieces that define elegance
                  </p>
                  <div className="flex items-center gap-2 text-gray-200 font-semibold text-sm sm:text-base min-h-[44px]">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-5 w-5 sm:h-4 sm:w-4 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* Necklaces Collection */}
              <Link
                href="/shop?category=necklaces"
                className="group relative overflow-hidden h-[350px] sm:h-[400px] md:h-[500px] rounded-lg"
              >
                <Image
                  src="/images/category-necklaces.png"
                  alt="Necklaces Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-8 text-white">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl uppercase font-light mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
                    Necklaces
                  </h3>
                  <p className="text-sm sm:text-base md:text-base text-gray-200 mb-3 sm:mb-4 leading-relaxed">
                    Statement pieces for the distinguished
                  </p>
                  <div className="flex items-center gap-2 text-gray-200 font-semibold text-sm sm:text-base min-h-[44px]">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-5 w-5 sm:h-4 sm:w-4 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* Bracelets Collection */}
              <Link
                href="/shop?category=bracelets"
                className="group relative overflow-hidden h-[350px] sm:h-[400px] md:h-[500px] rounded-lg"
              >
                <Image
                  src="/images/category-bracelets.png"
                  alt="Bracelets Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-8 text-white">
                  <h3 className="text-2xl sm:text-3xl md:text-3xl uppercase font-light mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
                    Bracelets
                  </h3>
                  <p className="text-sm sm:text-base md:text-base text-gray-200 mb-3 sm:mb-4 leading-relaxed">
                    Crafted for everyday sophistication
                  </p>
                  <div className="flex items-center gap-2 text-gray-200 font-semibold text-sm sm:text-base min-h-[44px]">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-5 w-5 sm:h-4 sm:w-4 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Secondary CTA Section - Mobile Optimized */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Link href="/shop" className="absolute inset-0">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/rings-1.png"
              alt="Luxury Jewelry Collection"
              fill
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            {/* Optimized Overlay for Mobile */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/65 to-black/50"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          </div>

          {/* CTA Content */}
          <div className="container px-4 sm:px-6 mx-auto relative z-10">
            <ScrollReveal direction="up" delay={100}>
              <div className="max-w-3xl">
                <div className="space-y-4 sm:space-y-5 md:space-y-6 text-white animate-fade-in">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light leading-tight drop-shadow-2xl">
                    Explore Our Exquisite Collections
                  </h3>

                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed drop-shadow-lg max-w-2xl">
                    Discover exceptional pieces crafted for the modern
                    gentleman. Where tradition meets contemporary design.
                  </p>

                  {/* Clear CTA Button */}
                  <div className="pt-2 sm:pt-4">
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold min-h-[48px] px-6 sm:px-8"
                    >
                      Browse Collection
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Link>
      </section>

      {/* New Arrivals Carousel */}
      {newArrivals.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <div className="container bg-gradient-to-b from-secondary/20 to-background">
            <ProductCarousel
              products={newArrivals}
              title="New Arrivals"
              subtitle="Fresh designs just added to our collection"
            />
          </div>
        </ScrollReveal>
      )}

      {/* Email Subscription Section - Mobile Optimized */}
      <section className="container py-12 sm:py-16 md:py-20 bg-gradient-luxury text-white">
        <div className="container px-4 sm:px-6 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-3 sm:mb-4 md:mb-6 drop-shadow-lg text-white">
              Stay In The Loop
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-7 md:mb-8 leading-relaxed drop-shadow-md px-4">
              Subscribe to our newsletter and be the first to know about new
              collections, exclusive offers, and special events. Get 10% off
              your first order!
            </p>
            <div className="max-w-md mx-auto px-4 sm:px-0">
              <NewsletterForm
                placeholder="Enter your email"
                buttonText="Subscribe"
                variant="elegant"
                inputClassName="!text-white bg-white/10 border-white/20 placeholder:text-white/60 min-h-[48px] text-base"
                buttonClassName="bg-white text-gray-900 hover:bg-gray-100 min-h-[48px] font-semibold"
                showIcon={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
