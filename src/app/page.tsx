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

  return (
    <div className="flex flex-col relative z-10" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <Link href="/shop">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-main.jpg"
              alt="אוסף תכשיטים יוקרתי"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black-pure/80 via-black-pure/60 to-black-pure/70"></div>
            <div className="absolute inset-0 shadow-cinematic-xl"></div>
          </div>
          <div className="px-4 sm:px-6 mx-auto relative z-10">
            <ScrollReveal direction="up" delay={100}>
              <div className="max-w-4xl mx-auto text-center">
                <div className="space-y-6 md:space-y-8 text-white-pure animate-fade-in">
                  <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-4xl text-white-pure font-figtree font-medium leading-[1.1] drop-shadow-cinematic-xl tracking-tight">
                    עד 30% הנחה על כל הקולקציה החדשה שלנו
                  </h1>
                  <p className="text-xl sm:text-xl md:text-xl text-white font-light leading-relaxed drop-shadow-cinematic tracking-widest">
                    קולקציה חדשה
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Link>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <ScrollReveal>
          <div className="border-t border-gray-200">
            <ProductCarousel
              products={
                featuredProducts as unknown as Parameters<
                  typeof ProductCarousel
                >[0]['products']
              }
              title="הנמכרים ביותר"
              subtitle="המבוקשים ביותר"
              prioritizeFirstImages={true}
            />
          </div>
        </ScrollReveal>
      )}

      {/* Gift Collections Section */}
      <section className="relative h-[60vh] sm:h-[60vh] md:h-[75vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-2">
          {/* Left Image - Gifts for Him */}
          <div className="relative h-full group">
            <Image
              src="/images/crownsteel-royal.png"
              alt="מתנות עבורו"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-black-pure/50 group-hover:bg-black-pure/40 transition-all"></div>
            <div className="absolute inset-0 flex items-end justify-end z-10 px-6 sm:px-12 lg:px-16 py-8 sm:py-16 lg:py-20">
              <ScrollReveal direction="up" delay={100}>
                <div className="flex flex-col items-end">
                  <h3 className="text-xl sm:text-xl md:text-2xl lg:text-2xl text-white-pure font-sans font-bold leading-tight drop-shadow-cinematic-xl tracking-wide mb-4 sm:mb-6">
                    מתנות עבורו
                  </h3>
                  <Link href="/shop?gender=him">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 font-semibold text-sm sm:text-base px-6 sm:px-8"
                    >
                      גלו
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
          {/* Right Image - Gifts for Her */}
          <div className="relative h-full group">
            <Image
              src="/images/present.png"
              alt="מתנות עבורה"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-black-pure/50 group-hover:bg-black-pure/40 transition-all"></div>
            <div className="absolute inset-0 flex items-end justify-end z-10 px-6 sm:px-12 lg:px-16 py-8 sm:py-16 lg:py-20">
              <ScrollReveal direction="up" delay={150}>
                <div className="flex flex-col items-end">
                  <h3 className="text-xl sm:text-xl md:text-2xl lg:text-2xl text-white-pure font-sans font-bold leading-tight drop-shadow-cinematic-xl tracking-wide mb-4 sm:mb-6">
                    מתנות עבורה
                  </h3>
                  <Link href="/shop?gender=her">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 font-semibold text-sm sm:text-base px-6 sm:px-8"
                    >
                      גלו
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <ScrollReveal>
        <section className="py-12 px-6 sm:py-20 sm:px-10 bg-white">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-base sm:text-lg font-normal text-gray-900 mb-2">
              הקולקציות שלנו
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-12 lg:gap-20">
            <Link href="/shop?category=rings" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-rings.png"
                  alt="טבעות"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-end text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                טבעות
              </h3>
            </Link>
            <Link href="/shop?category=chains" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-chains.png"
                  alt="שרשראות"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-end text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                שרשראות
              </h3>
            </Link>
            <Link href="/shop?category=bracelets" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-bracelets.png"
                  alt="צמידים"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-end text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                צמידים
              </h3>
            </Link>
            <Link href="/shop?category=pendants" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-pendants.png"
                  alt="תליונים"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-end text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                תליונים
              </h3>
            </Link>
            <Link href="/shop?category=bundles" className="group">
              <div className="relative aspect-square mb-4 overflow-hidden bg-gray-100">
                <Image
                  src="/images/categories/category-bundles.png"
                  alt="סטים"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <h3 className="text-end text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                סטים
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
                            אין תמונה
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>
                    <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all">
                      גלו
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Values Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-4 border-black">
            <div className="text-center py-8 px-6 border-r border-b border-l border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                איכות פרימיום
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                עבודת יד מהחומרים הטובים ביותר. כל פריט מעוצב בקפידה ליופי
                מתמשך.
              </p>
            </div>
            <div className="text-center py-8 px-6 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                אחריות לכל החיים
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                אנו עומדים מאחורי המלאכה שלנו. כל פריט מגיע עם אחריות לכל החיים
                נגד פגמים.
              </p>
            </div>
            <div className="text-center py-8 px-6 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                משלוח חינם
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                משלוח חינם על כל ההזמנות. התכשיטים שלכם יגיעו בבטחה ובאריזה
                יוקרתית.
              </p>
            </div>
            <div className="text-center py-8 px-6 border-r border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                אומנות מומחית
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                שנות ניסיון בכל פריט. עיצוב אומנים, מושלם בשבילך.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
