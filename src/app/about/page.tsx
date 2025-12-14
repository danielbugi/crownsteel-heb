'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Gem, Award, Heart, Shield } from 'lucide-react';
import { HeroSection } from '@/components/layout/hero-section';

export default function AboutPage() {
  const values = [
    {
      icon: Gem,
      title: 'Premium Quality',
      description:
        'Every piece is crafted with precision using the finest materials, ensuring lasting beauty and durability.',
    },
    {
      icon: Award,
      title: 'Expert Craftsmanship',
      description:
        'Our master jewelers bring decades of experience, combining traditional techniques with modern design.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description:
        "Your satisfaction is our priority. We're here to help you find the perfect piece that tells your story.",
    },
    {
      icon: Shield,
      title: 'Lifetime Guarantee',
      description:
        'We stand behind our work with a comprehensive lifetime warranty on all our handcrafted pieces.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="About Us"
        description="Handcrafted jewelry combining ancient tradition with modern design for the contemporary gentleman"
        size="lg"
      />

      {/* Story Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Forge & Steel was born from a passion for exceptional men&apos;s
                jewelry. Our journey began in a small workshop, where two
                craftsmen shared a vision - to create jewelry that tells a
                story, combines strength with elegance, and reflects the unique
                personality of each wearer.
              </p>
              <p>
                Today, we&apos;re proud to be leaders in men&apos;s jewelry,
                serving customers worldwide. Each piece is still meticulously
                crafted by skilled artisans, using only the finest materials and
                time-honored techniques that stand the test of time.
              </p>
              <p>
                Our commitment to quality, craftsmanship, and exceptional
                customer service remains at the heart of everything we do. We
                don&apos;t just sell jewelry - we create heirlooms that are
                passed down through generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 bg-accent rounded-full">
                        <Icon className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team consists of master craftsmen, designers, and dedicated
              sales professionals who share a passion for exceptional jewelry.
              Each team member brings unique expertise and a personal touch,
              ensuring every customer receives personalized attention and
              outstanding service.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-steel text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-light mb-4 text-white">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore our collection and discover jewelry that tells your story
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-black px-8 py-3  font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
