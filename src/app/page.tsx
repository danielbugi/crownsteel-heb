import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCarousel } from '@/components/shop/product-carousel';
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
  const newArrivals = await getNewArrivals();
  // const bestSellers = await getBestSellers();

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
          <div className="px-4 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <Card className="backdrop-blur-sm">
                <CardContent className="flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Truck className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
                  </div>
                  <h3 className="font-bold text-sm md:text-sm mb-2 md:mb-0">
                    Free Shipping
                  </h3>
                  <p className="text-sm md:sm text-muted-foreground">
                    Complimentary delivery on all orders over ₪500
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm ">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Shield className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
                  </div>
                  <h3 className="font-bold text-sm md:text-sm mb-2 md:mb-0">
                    Lifetime Warranty
                  </h3>
                  <p className="text-sm md:sm text-muted-foreground">
                    Comprehensive coverage on all craftsmanship
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm ">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <Award className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
                  </div>
                  <h3 className="font-bold text-sm md:text-sm mb-2 md:mb-0">
                    Premium Quality
                  </h3>
                  <p className="text-sm md:sm text-muted-foreground">
                    Master-crafted using finest materials
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm ">
                <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
                  <div className="flex items-center justify-center mb-2 md:mb-2">
                    <HeadphonesIcon className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
                  </div>
                  <h3 className="font-bold text-sm md:text-sm mb-2 md:mb-0">
                    Expert Support
                  </h3>
                  <p className="text-sm md:sm text-muted-foreground">
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
        <section className="py-16 md:py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-fade-in">
              {/* <h6 className="text-gold-600 uppercase tracking-widest text-xs md:text-sm font-semibold mb-3 md:mb-4 font-sans">
                Signature Collections
              </h6> */}
              <h3 className="text-xl md:text-3xl lg:text-3xl mb-4 md:mb-6">
                Discover Your Steel
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
                  <h3 className="text-2xl text-white  uppercase md:text-3xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
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
                  <h3 className="text-2xl text-white  uppercase md:text-3xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
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
                  <h3 className="text-2xl text-white  uppercase md:text-3xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px] drop-shadow-lg">
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

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-gradient-to-b from-background to-secondary/20">
            <ProductCarousel
              products={featuredProducts}
              title="Featured Collection"
              subtitle="Handpicked pieces that define excellence"
            />
          </div>
        </ScrollReveal>
      )}

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

      {/* New Arrivals Carousel */}
      {newArrivals.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-gradient-to-b from-secondary/20 to-background">
            <ProductCarousel
              products={newArrivals}
              title="New Arrivals"
              subtitle="Fresh designs just added to our collection"
            />
          </div>
        </ScrollReveal>
      )}

      {/* Featured Products Section - Softer Background */}

      {/* <ScrollReveal direction="up" delay={100}>
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-12 gap-4">
              <div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3">
                  Featured Collection
                </h2>
     
              </div>
            </div> */}

      {/* {featuredProducts.length > 0 ? (
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
            )} */}
      {/* <div className="mt-8 md:mt-12 text-center ">
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
      </ScrollReveal> */}

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

// import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   ArrowRight,
//   Shield,
//   Truck,
//   Award,
//   HeadphonesIcon,
//   Sparkles,
//   TrendingUp,
//   Clock,
//   Star,
// } from 'lucide-react';
// import { prisma } from '@/lib/prisma';

// import { ScrollReveal } from '@/components/ui/scroll-reveal';
// import { serializeProducts } from '@/lib/serialize';

// async function getNewArrivals() {
//   const products = await prisma.product.findMany({
//     where: {
//       inStock: true,
//     },
//     include: {
//       category: true,
//     },
//     take: 10,
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });

//   return serializeProducts(products);
// }

// async function getBestSellers() {
//   const products = await prisma.product.findMany({
//     where: {
//       inStock: true,
//       inventory: { lt: 15 }, // Low stock = popular/best sellers
//     },
//     include: {
//       category: true,
//     },
//     take: 8,
//     orderBy: {
//       inventory: 'asc',
//     },
//   });

//   return serializeProducts(products);
// }

// export default async function HomePage() {
//

//   return (
//     <div className="flex flex-col">
//       {/* Hero Section - Responsive Height with Better Contrast */}
//       <section className="relative h-[90vh] md:h-[70vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/images/hero-main.png"
//             alt="Luxury Jewelry Collection"
//             fill
//             priority
//             className="object-cover"
//             sizes="100vw"
//             quality={90}
//           />
//           {/* Stronger Dark Overlay for Better Text Readability */}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>
//         </div>

//         {/* Hero Content */}
//         <div className="container px-4 mx-auto relative z-10">
//           <ScrollReveal direction="up" delay={100}>
//             <div className="max-w-3xl">
//               <div className="space-y-4 md:space-y-6 text-white animate-fade-in">
//                 <div className="flex items-center gap-3">
//                   <Sparkles className="h-5 w-5 text-gold-400" />
//                   <h6 className="text-gold-400 font-thin uppercase tracking-widest text-xs md:text-sm font-semibold font-sans drop-shadow-lg">
//                     Premium Handcrafted Jewelry
//                   </h6>
//                 </div>

//                 <h1 className="text-4xl md:text-5xl text-white lg:text-6xl leading-tight">
//                   25% Off All Collections
//                 </h1>

//                 <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-thin leading-relaxed drop-shadow-lg max-w-2xl">
//                   Discover exceptional pieces crafted for the modern gentleman.
//                   Where tradition meets contemporary design.
//                 </p>

//                 <div className="flex flex-wrap gap-4 pt-4">
//                   <Button
//                     size="lg"
//                     className="bg-white text-black hover:bg-white/90 font-semibold px-8 shadow-2xl"
//                     asChild
//                   >
//                     <Link href="/shop">
//                       Shop Now
//                       <ArrowRight className="ml-2 h-5 w-5" />
//                     </Link>
//                   </Button>
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 backdrop-blur-sm"
//                     asChild
//                   >
//                     <Link href="/categories">Browse Collections</Link>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </ScrollReveal>
//         </div>
//       </section>

//       {/* Features Section - Premium Service Highlights */}
//       <ScrollReveal direction="up" delay={100}>
//         <section className="py-12 md:py-16 bg-secondary/30">
//           <div className="container px-4 mx-auto">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//               <Card className="backdrop-blur-sm ">
//                 <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
//                   <div className="flex items-center justify-center mb-2 md:mb-2">
//                     <Truck className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
//                   </div>
//                   <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
//                     Free Shipping
//                   </h3>
//                   <p className="text-sm md:text-base text-muted-foreground">
//                     On orders over ₪500 across Israel
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="backdrop-blur-sm ">
//                 <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
//                   <div className="flex items-center justify-center mb-2 md:mb-2">
//                     <Award className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
//                   </div>
//                   <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
//                     Premium Quality
//                   </h3>
//                   <p className="text-sm md:text-base text-muted-foreground">
//                     Master-crafted using finest materials
//                   </p>
//                 </CardContent>
//               </Card>

//               <Card className="backdrop-blur-sm hover:shadow-xl transition-all duration-300">
//                 <CardContent className="flex flex-col items-center text-center pt-6 md:pt-8 pb-6 md:pb-8">
//                   <div className="flex items-center justify-center mb-2 md:mb-2">
//                     <HeadphonesIcon className="font-bold text-sm md:text-sm mb-2 md:mb-0" />
//                   </div>
//                   <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-2">
//                     Expert Support
//                   </h3>
//                   <p className="text-sm md:text-base text-muted-foreground">
//                     Personal consultation and dedicated service
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>
//       </ScrollReveal>

//       {/* Best Sellers Carousel */}
//       {bestSellers.length > 0 && (
//         <ScrollReveal direction="up" delay={100}>
//           <div className="bg-gradient-to-b from-background to-secondary/30">
//             <ProductCarousel
//               products={bestSellers}
//               title="Top Sellers"
//               subtitle="Most loved by our customers"
//             />
//           </div>
//         </ScrollReveal>
//       )}

//       {/* Featured Collections Section */}
//       <ScrollReveal direction="up" delay={100}>
//         <section className="py-16 md:py-16 bg-gradient-to-b from-secondary/30 via-secondary/20 to-background">
//           <div className="container px-4 mx-auto">
//             <div className="text-center mb-12 md:mb-16 animate-fade-in">
//               <h3 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6">
//                 Discover Your Style
//               </h3>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Explore our curated collections, each piece telling its own
//                 story
//               </p>
//             </div>

//             {/* Collection Cards Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//               {/* Collection 1 */}
//               <Link
//                 href="/categories/rings"
//                 className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
//               >
//                 <div className="relative h-[400px] md:h-[500px]">
//                   <Image
//                     src="/images/collection-1.jpg"
//                     alt="Rings Collection"
//                     fill
//                     className="object-cover group-hover:scale-110 transition-transform duration-700"
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
//                 </div>
//                 <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
//                   <h4 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-gold-400 transition-colors">
//                     Signature Rings
//                   </h4>
//                   <p className="text-gray-200 mb-4 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
//                     Bold statements for the modern man
//                   </p>
//                   <div className="flex items-center gap-2 text-gray-200 font-semibold text-sm md:text-base">
//                     <span>Explore Collection</span>
//                     <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-2" />
//                   </div>
//                 </div>
//               </Link>

//               {/* Collection 2 */}
//               <Link
//                 href="/categories/bracelets"
//                 className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500"
//               >
//                 <div className="relative h-[400px] md:h-[500px]">
//                   <Image
//                     src="/images/collection-2.jpg"
//                     alt="Bracelets Collection"
//                     fill
//                     className="object-cover group-hover:scale-110 transition-transform duration-700"
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
//                 </div>
//                 <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
//                   <h4 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-gold-400 transition-colors">
//                     Elegant Bracelets
//                   </h4>
//                   <p className="text-gray-200 mb-4 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
//                     Crafted for everyday sophistication
//                   </p>
//                   <div className="flex items-center gap-2 text-gray-200 font-semibold text-sm md:text-base">
//                     <span>Explore Collection</span>
//                     <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-2" />
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//       </ScrollReveal>

//       {/* Second Hero Section */}
//       <section className="relative h-[90vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
//         <Link href="/shop">
//           <div className="absolute inset-0 z-0">
//             <Image
//               src="/images/hero-2.png"
//               alt="Luxury Jewelry Collection"
//               fill
//               priority
//               className="object-cover"
//               sizes="100vw"
//               quality={90}
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40"></div>
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//           </div>

//           <div className="container px-4 mx-auto relative z-10">
//             <ScrollReveal direction="up" delay={100}>
//               <div className="max-w-3xl">
//                 <div className="space-y-4 md:space-y-6 text-white animate-fade-in">
//                   <h3 className="text-2xl md:text-4xl lg:text-5xl text-white font-light leading-tight">
//                     Explore Our Exquisite Collections
//                   </h3>

//                   <p className="text-lg md:text-xl lg:text-xl text-gray-200 font-thin leading-relaxed drop-shadow-lg max-w-2xl">
//                     Discover exceptional pieces crafted for the modern
//                     gentleman. Where tradition meets contemporary design.
//                   </p>

//                   <Button
//                     size="lg"
//                     className="bg-gold-600 hover:bg-gold-700 text-white font-semibold px-8 shadow-2xl"
//                   >
//                     Discover More
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </Button>
//                 </div>
//               </div>
//             </ScrollReveal>
//           </div>
//         </Link>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 md:py-20 bg-gradient-luxury text-white">
//         <div className="container px-4 mx-auto text-center">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 drop-shadow-lg text-white">
//               Begin Your Journey
//             </h2>
//             <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed drop-shadow-md">
//               Schedule a personal consultation with our jewelry experts to find
//               the perfect piece that tells your story.
//             </p>
//             <Button
//               size="lg"
//               className="bg-white text-black hover:bg-white/90 font-semibold px-10 py-6 text-lg shadow-2xl"
//               asChild
//             >
//               <Link href="/contact">Book Consultation</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <ScrollReveal direction="up" delay={100}>
//         <section className="py-16 md:py-20 bg-background">
//           <div className="container px-4 mx-auto">
//             <div className="text-center mb-12 md:mb-16">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
//                 Why Choose Us
//               </h2>
//               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                 Excellence in every detail, commitment to perfection
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               <div className="text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="p-4 bg-gold-100 rounded-full">
//                     <Shield className="h-8 w-8 text-gold-600" />
//                   </div>
//                 </div>
//                 <h3 className="font-bold text-xl mb-2">Lifetime Warranty</h3>
//                 <p className="text-muted-foreground">
//                   Every piece backed by our comprehensive lifetime guarantee
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="p-4 bg-gold-100 rounded-full">
//                     <Star className="h-8 w-8 text-gold-600" />
//                   </div>
//                 </div>
//                 <h3 className="font-bold text-xl mb-2">5-Star Reviews</h3>
//                 <p className="text-muted-foreground">
//                   Trusted by thousands of satisfied customers nationwide
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="p-4 bg-gold-100 rounded-full">
//                     <Clock className="h-8 w-8 text-gold-600" />
//                   </div>
//                 </div>
//                 <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
//                 <p className="text-muted-foreground">
//                   Express shipping available throughout Israel
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="p-4 bg-gold-100 rounded-full">
//                     <TrendingUp className="h-8 w-8 text-gold-600" />
//                   </div>
//                 </div>
//                 <h3 className="font-bold text-xl mb-2">Trendsetting Design</h3>
//                 <p className="text-muted-foreground">
//                   Contemporary styles that stand the test of time
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//       </ScrollReveal>
//     </div>
//   );
// }
