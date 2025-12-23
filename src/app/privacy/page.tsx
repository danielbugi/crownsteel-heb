'use client';

import { HeroSection } from '@/components/layout/hero-section';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title="מדיניות פרטיות"
        description="עדכון אחרון: אוקטובר 2025"
        size="lg"
      />
      {/* Content */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. מידע שאנו אוספים</h2>
              <p>
                אנו אוספים מידע שאתה מספק לנו במהלך ההרשמה, ביצוע הזמנות ויצירת
                קשר. זה כולל:
              </p>
              <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
                <li>פרטים אישיים (שם, כתובת אימייל, מספר טלפון)</li>
                <li>כתובת למשלוח וחיוב</li>
                <li>
                  פרטי תשלום (מעובדים בצורה מאובטחת דרך ספקי תשלום צד שלישי)
                </li>
                <li>היסטוריית רכישות והעדפות</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                2. כיצד אנו משתמשים במידע שלך
              </h2>
              <p>אנו משתמשים במידע שלך כדי:</p>
              <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
                <li>לעבד ולמלא הזמנות</li>
                <li>לתקשר איתך לגבי הזמנות ומוצרים</li>
                <li>לשפר את השירות והחוויה שלנו</li>
                <li>לשלוח עדכונים שיווקיים (רק אם הסכמת)</li>
                <li>למנוע הונאה ולהבטיח אבטחה</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">3. אבטחת מידע</h2>
              <p>
                אנו משתמשים באמצעי אבטחה בתעשייתיים כדי להגן על המידע האישי שלך.
                כל העסקאות מוצפנות באמצעות SSL והמידע שלך מאוחסן בשרתים
                מאובטחים.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">4. שיתוף מידע</h2>
              <p>
                אנו לא מוכרים או משכירים את המידע האישי שלך לצדדים שלישיים. אנו
                משתפים מידע רק עם:
              </p>
              <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
                <li>מעבדי תשלום למטרות עסקה</li>
                <li>חברות משלוח למסירת הזמנות</li>
                <li>ספקי שירות שעוזרים לנו להפעיל את האתר</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">5. הזכויות שלך</h2>
              <p>יש לך את הזכות:</p>
              <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
                <li>לגשת למידע האישי שלך</li>
                <li>לתקן מידע לא מדויק</li>
                <li>לבקש מחיקת המידע שלך</li>
                <li>לבטל הסכמה לתקשורת שיווקית</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">6. עוגיות</h2>
              <p>
                אנו משתמשים בעוגיות כדי לשפר את חווית הגלישה שלך, לנתח תעבורה
                ולהתאים אישית תוכן. אתה יכול לנהל את העדפות העוגיות בהגדרות
                הדפדפן שלך.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">7. צור קשר</h2>
              <p>
                אם יש לך שאלות לגבי מדיניות הפרטיות שלנו, אנא צור קשר בכתובת:
                privacy@forgesteel.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
