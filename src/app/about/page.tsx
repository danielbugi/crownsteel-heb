'use client';

import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Gem, Award, Heart, Shield } from 'lucide-react';
import { HeroSection } from '@/components/layout/hero-section';

export default function AboutPage() {
  const { language } = useLanguage();

  const values = [
    {
      icon: Gem,
      titleEn: 'Premium Quality',
      titleHe: 'איכות פרימיום',
      descEn:
        'Every piece is crafted with precision using the finest materials, ensuring lasting beauty and durability.',
      descHe:
        'כל יצירה מעוצבת בדיוק תוך שימוש בחומרים המשובחים ביותר, המבטיחים יופי ועמידות לאורך זמן.',
    },
    {
      icon: Award,
      titleEn: 'Expert Craftsmanship',
      titleHe: 'אומנות מקצועית',
      descEn:
        'Our master jewelers bring decades of experience, combining traditional techniques with modern design.',
      descHe:
        'התכשיטנים המומחים שלנו מביאים עשרות שנות ניסיון, המשלבים טכניקות מסורתיות עם עיצוב מודרני.',
    },
    {
      icon: Heart,
      titleEn: 'Customer First',
      titleHe: 'הלקוח במרכז',
      descEn:
        "Your satisfaction is our priority. We're here to help you find the perfect piece that tells your story.",
      descHe:
        'שביעות רצונך היא העדיפות שלנו. אנחנו כאן כדי לעזור לך למצוא את היצירה המושלמת שמספרת את הסיפור שלך.',
    },
    {
      icon: Shield,
      titleEn: 'Lifetime Guarantee',
      titleHe: 'אחריות לכל החיים',
      descEn:
        'We stand behind our work with a comprehensive lifetime warranty on all our handcrafted pieces.',
      descHe:
        'אנו עומדים מאחורי העבודה שלנו עם אחריות מקיפה לכל החיים על כל היצירות בעבודת יד שלנו.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={language === 'he' ? 'אודותינו' : 'About Us'}
        description={
          language === 'he'
            ? 'תכשיטים בעבודת יד המשלבים מסורת עתיקה עם עיצוב מודרני לגבר המודרני'
            : 'Handcrafted jewelry combining ancient tradition with modern design for the contemporary gentleman'
        }
        size="lg"
      />

      {/* Story Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {language === 'he' ? 'הסיפור שלנו' : 'Our Story'}
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                {language === 'he'
                  ? "פורג' אנד סטיל נוסדה מתוך תשוקה לתכשיטים יוצאי דופן לגברים. המסע שלנו התחיל בסדנה קטנה, שם שני אומנים חלקו חזון - ליצור תכשיטים שמספרים סיפור, משלבים חוזק עם אלגנטיות, ומשקפים את האישיות הייחודית של כל לובש."
                  : "Forge & Steel was born from a passion for exceptional men's jewelry. Our journey began in a small workshop, where two craftsmen shared a vision - to create jewelry that tells a story, combines strength with elegance, and reflects the unique personality of each wearer."}
              </p>
              <p>
                {language === 'he'
                  ? 'כיום, אנו גאים להיות מובילים בתעשיית התכשיטים לגברים, המשרתים לקוחות ברחבי העולם. כל יצירה עדיין מיוצרת בקפידה בידי אומנים מיומנים, המשתמשים רק בחומרים הטובים ביותר ובשיטות מסורתיות העומדות במבחן הזמן.'
                  : "Today, we're proud to be leaders in men's jewelry, serving customers worldwide. Each piece is still meticulously crafted by skilled artisans, using only the finest materials and time-honored techniques that stand the test of time."}
              </p>
              <p>
                {language === 'he'
                  ? 'המחויבות שלנו לאיכות, אומנות ושירות לקוחות יוצא דופן נשארה בליבת כל מה שאנו עושים. אנו לא רק מוכרים תכשיטים - אנו יוצרים אוצרות שמועברים מדור לדור.'
                  : "Our commitment to quality, craftsmanship, and exceptional customer service remains at the heart of everything we do. We don't just sell jewelry - we create heirlooms that are passed down through generations."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {language === 'he' ? 'הערכים שלנו' : 'Our Values'}
          </h2>
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
                      <h3 className="text-xl font-semibold">
                        {language === 'he' ? value.titleHe : value.titleEn}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'he' ? value.descHe : value.descEn}
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
            <h2 className="text-3xl font-bold mb-6">
              {language === 'he' ? 'הצוות שלנו' : 'Our Team'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'he'
                ? 'הצוות שלנו מורכב מאומנים מומחים, מעצבים ואנשי מכירות מסורים שחולקים תשוקה לתכשיטים יוצאי דופן. כל חבר בצוות מביא מומחיות ייחודית וראייה אישית, המבטיחים שכל לקוח מקבל תשומת לב אישית ושירות יוצא מן הכלל.'
                : 'Our team consists of master craftsmen, designers, and dedicated sales professionals who share a passion for exceptional jewelry. Each team member brings unique expertise and a personal touch, ensuring every customer receives personalized attention and outstanding service.'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-steel text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-light mb-4 text-white">
            {language === 'he'
              ? 'מוכנים למצוא את התכשיט המושלם?'
              : 'Ready to Find Your Perfect Piece?'}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {language === 'he'
              ? 'חקור את הקולקציה שלנו ומצא תכשיטים שמספרים את הסיפור שלך'
              : 'Explore our collection and discover jewelry that tells your story'}
          </p>
          <a
            href="/shop"
            className="inline-block bg-white text-black px-8 py-3  font-semibold hover:bg-gray-100 transition-colors"
          >
            {language === 'he' ? 'עבור לחנות' : 'Shop Now'}
          </a>
        </div>
      </section>
    </div>
  );
}
