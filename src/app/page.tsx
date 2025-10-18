import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Shield,
  Truck,
  Award,
  HeadphonesIcon,
  Sparkles,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/product-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { serializeProducts } from '@/lib/serialize';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
    include: {
      category: true,
    },
    take: 3,
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

async function getBestSellers() {
  const products = await prisma.product.findMany({
    where: {
      inventory: { lt: 10 }, // Low stock = best sellers
    },
    include: {
      category: true,
    },
    take: 6,
  });

  // ✅ SERIALIZE
  return serializeProducts(products);
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Responsive Height with Better Contrast */}

      <section className="relative h-[90vh] md:h-[70vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
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
          {/* Additional bottom gradient for better text readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div> */}
        </div>

        {/* Hero Content */}
        <div className="container px-4 mx-auto relative z-10">
          <ScrollReveal direction="up" delay={100}>
            <div className="max-w-3xl">
              <div className="space-y-4 md:space-y-6 text-white animate-fade-in">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-gold-400" />
                  <h6 className="text-gold-400 font-thin uppercase tracking-widest text-xs md:text-sm font-semibold font-sans drop-shadow-lg">
                    Premium Handcrafted Jewelry
                  </h6>
                </div>

                <h1 className="text-4xl md:text-5xl text-white lg:text-6xl leading-tight">
                  {/* <span className="drop-shadow-2xl">Forge Your Legacy</span> */}
                  {/* <span className="block text-white mt-2 drop-shadow-2xl"> */}
                  25% Off All Collections
                  {/* </span> */}
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-thin leading-relaxed drop-shadow-lg max-w-2xl">
                  Discover exceptional pieces crafted for the modern gentleman.
                  Where tradition meets contemporary design.
                </p>
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

      {/* Why Choose Us Section - Softer Background */}
      <ScrollReveal direction="up" delay={200}>
        <section className="py-4 md:py-4 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <Card className="backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Truck className="h-8 md:h-10 w-8 md:w-10 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
                    Free Shipping
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Complimentary delivery on all orders over ₪500
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Shield className="h-8 md:h-10 w-8 md:w-10 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
                    Lifetime Warranty
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Comprehensive coverage on all craftsmanship
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Award className="h-8 md:h-10 w-8 md:w-10 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
                    Premium Quality
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Master-crafted using finest materials
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm hover:shadow-xl transition-all duration-300 ">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <HeadphonesIcon className="h-8 md:h-10 w-8 md:w-10 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
                    Expert Support
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Personal consultation and dedicated service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Collections - Softer Background Transition */}
      <ScrollReveal direction="up" delay={100}>
        <section className="py-16 md:py-16bg-gradient-to-b from-background via-secondary/20 to-background">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-fade-in">
              {/* <h6 className="text-gold-600 uppercase tracking-widest text-xs md:text-sm font-semibold mb-3 md:mb-4 font-sans">
                Signature Collections
              </h6> */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6">
                Discover Your Style
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Rings Collection - Always Show Title */}
              <Link
                href="/shop?category=rings"
                className="group relative overflow-hidden h-[400px] md:h-[500px]"
              >
                <Image
                  src="/images/category_rings.png"
                  alt="Rings Collection"
                  fill
                  className="object-cover transition-transform duration-700 "
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient Overlay - Always Visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-300"></div>

                {/* Content - Title Always Visible, Description on Hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                  <h3 className="text-2xl text-gray-200  uppercase md:text-3xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
                    Rings
                  </h3>
                  <p className="text-sm md:text-base text-gray-200 mb-3 md:mb-4 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Signature pieces that define elegance
                  </p>
                  <div className="flex items-center gap-2 text-gray-200  font-semibold text-sm md:text-base">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* Necklaces Collection */}
              <Link
                href="/shop?category=necklaces"
                className="group relative overflow-hidden h-[400px] md:h-[500px]"
              >
                <Image
                  src="/images/category-necklaces.png"
                  alt="Necklaces Collection"
                  fill
                  className="object-cover transition-transform duration-700 "
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                  <h3 className="text-2xl text-gray-200  uppercase md:text-3xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
                    Necklaces
                  </h3>
                  <p className="text-sm md:text-base text-gray-200 mb-3 md:mb-4 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Statement pieces for the distinguished
                  </p>
                  <div className="flex items-center gap-2 text-gray-200  font-semibold text-sm md:text-base">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* Bracelets Collection */}
              <Link
                href="/shop?category=bracelets"
                className="group relative overflow-hidden h-[400px] md:h-[500px]"
              >
                <Image
                  src="/images/category-bracelets.png"
                  alt="Bracelets Collection"
                  fill
                  className="object-cover transition-transform duration-700 "
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                  <h3 className="text-2xl text-gray-200  uppercase md:text-3xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
                    Bracelets
                  </h3>
                  <p className="text-sm md:text-base text-gray-200 mb-3 md:mb-4 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Crafted for everyday sophistication
                  </p>
                  <div className="flex items-center gap-2 text-gray-200  font-semibold text-sm md:text-base">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="relative h-[90vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Link href="/shop">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-2.png"
              alt="Luxury Jewelry Collection"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            {/* Stronger Dark Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>
            {/* Additional bottom gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="container px-4 mx-auto relative z-10">
            <ScrollReveal direction="up" delay={100}>
              <div className="max-w-3xl">
                <div className="space-y-4 md:space-y-6 text-white animate-fade-in">
                  <h3 className="text-2xl md:text-4xl lg:text-5xl  text-white font-light leading-tight">
                    {/* <span className="drop-shadow-2xl">Forge Your Legacy</span> */}
                    Explore Our Exquisite Collections
                  </h3>

                  <p className="text-lg md:text-xl lg:text-xl text-gray-200 font-thin leading-relaxed drop-shadow-lg max-w-2xl">
                    Discover exceptional pieces crafted for the modern
                    gentleman. Where tradition meets contemporary design.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Link>
      </section>

      {/* Featured Products Section - Softer Background */}
      <ScrollReveal direction="up" delay={100}>
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-4">
              <div>
                {/* <h6 className="text-gold-600 uppercase tracking-widest text-xs md:text-sm font-semibold mb-2 md:mb-3 font-sans">
                  Curated Selection
                </h6> */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3">
                  Featured Collection
                </h2>
                {/* <p className="text-base md:text-lg text-muted-foreground">
                  Handpicked pieces that define excellence
                </p> */}
              </div>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground text-lg mb-4">
                  No featured products available at the moment.
                </p>
                <Button asChild>
                  <Link href="/shop">Browse All Products</Link>
                </Button>
              </div>
            )}
            <div className="mt-8 md:mt-12 text-center ">
              <Button
                size={'lg'}
                className="bg-gold-600 hover:bg-gold-700 text-white font-semibold"
                asChild
              >
                <Link href="/shop">
                  View All Products
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-luxury text-white">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl  mb-4 md:mb-6 drop-shadow-lg text-white">
              Begin Your Journey
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed drop-shadow-md">
              Schedule a personal consultation with our jewelry experts to find
              the perfect piece that tells your story.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                size={'lg'}
                className="bg-gold-600 hover:bg-gold-700 text-white font-semibold"
                asChild
              >
                <Link href="/contact">Book Consultation</Link>
              </Button>
              <Button
                size={'lg'}
                variant="outline"
                className="border-white text-black  hover:bg-white/10"
                asChild
              >
                <Link href="/shop">Browse Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
