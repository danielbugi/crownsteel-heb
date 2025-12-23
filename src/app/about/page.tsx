'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Gem, Award, Heart, Shield } from 'lucide-react';
import { HeroSection } from '@/components/layout/hero-section';

export default function AboutPage() {
  const values = [
    {
      icon: Gem,
      title: 'איכות פרימיום',
      description:
        'כל תכשיט נוצר בדיוק מחומרים מובחרים, להבטחת יופי ועמידות לאורך זמן.',
    },
    {
      icon: Award,
      title: 'מומחיות אומנותית',
      description:
        'הצורפים שלנו משלבים ניסיון של עשרות שנים עם עיצוב מודרני וטכניקות מסורתיות.',
    },
    {
      icon: Heart,
      title: 'הלקוח במרכז',
      description:
        'ההצלחה שלכם היא בראש סדר העדיפויות שלנו. אנו כאן לעזור לכם למצוא את התכשיט המושלם שמספר את הסיפור שלכם.',
    },
    {
      icon: Shield,
      title: 'אחריות לכל החיים',
      description:
        'אנו עומדים מאחורי עבודתנו עם אחריות מקיפה לכל החיים על כל תכשיט בעבודת יד.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="אודות"
        description="תכשיטים בעבודת יד המשלבים מסורת עתיקה עם עיצוב מודרני לגבר העכשווי"
        size="lg"
      />

      {/* Story Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">הסיפור שלנו</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Forge & Steel נולדה מתוך תשוקה לתכשיטי גברים יוצאי דופן. המסע
                שלנו החל בסדנה קטנה, שם שני צורפים חלקו חזון - ליצור תכשיטים
                שמספרים סיפור, משלבים עוצמה עם אלגנטיות, ומשקפים את האישיות
                הייחודית של כל עונד.
              </p>
              <p>
                היום אנו גאים להיות מובילים בתחום תכשיטי הגברים, ומשרתים לקוחות
                בכל העולם. כל פריט עדיין נוצר בקפידה על ידי אומנים מיומנים, תוך
                שימוש בחומרים הטובים ביותר ובטכניקות מסורתיות שמחזיקות לאורך
                זמן.
              </p>
              <p>
                המחויבות שלנו לאיכות, אומנות ושירות יוצא דופן ללקוח עומדת בלב כל
                מה שאנו עושים. אנחנו לא רק מוכרים תכשיטים - אנחנו יוצרים ירושות
                שמועברות מדור לדור.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">הערכים שלנו</h2>
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
            <h2 className="text-3xl font-bold mb-6">הצוות שלנו</h2>
            <p className="text-lg text-muted-foreground mb-8">
              הצוות שלנו מורכב מאומנים, מעצבים ואנשי מכירות מסורים, כולם חולקים
              תשוקה לתכשיטים יוצאי דופן. כל אחד מביא עמו מומחיות ייחודית ונגיעה
              אישית, כדי להבטיח שכל לקוח יקבל יחס אישי ושירות יוצא דופן.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-steel text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-light mb-4 text-white">
            מוכנים למצוא את התכשיט המושלם עבורכם?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            חקרו את הקולקציה שלנו וגלה תכשיטים שמספרים את הסיפור שלך
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-black px-8 py-3  font-semibold hover:bg-gray-100 transition-colors"
          >
            לקנייה
          </Link>
        </div>
      </section>
    </div>
  );
}
