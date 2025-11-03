'use client';

import { useLanguage } from '@/contexts/language-context';
import { HeroSection } from '@/components/layout/hero-section';

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
        description={
          language === 'he'
            ? 'עדכון אחרון: אוקטובר 2025'
            : 'Last Updated: October 2025'
        }
        size="lg"
      />

      {/* Content */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {language === 'he' ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    1. מידע שאנו אוספים
                  </h2>
                  <p>
                    אנו אוספים מידע שאתה מספק לנו במהלך ההרשמה, ביצוע הזמנות
                    ויצירת קשר. זה כולל:
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
                    אנו משתמשים באמצעי אבטחה בתעשייתיים כדי להגן על המידע האישי
                    שלך. כל העסקאות מוצפנות באמצעות SSL והמידע שלך מאוחסן בשרתים
                    מאובטחים.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. שיתוף מידע</h2>
                  <p>
                    אנו לא מוכרים או משכירים את המידע האישי שלך לצדדים שלישיים.
                    אנו משתפים מידע רק עם:
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
                    אנו משתמשים בעוגיות כדי לשפר את חווית הגלישה שלך, לנתח
                    תעבורה ולהתאים אישית תוכן. אתה יכול לנהל את העדפות העוגיות
                    בהגדרות הדפדפן שלך.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. צור קשר</h2>
                  <p>
                    אם יש לך שאלות לגבי מדיניות הפרטיות שלנו, אנא צור קשר
                    בכתובת: privacy@forgesteel.com
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    1. Information We Collect
                  </h2>
                  <p>
                    We collect information you provide when registering, placing
                    orders, and contacting us. This includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Personal details (name, email address, phone number)
                    </li>
                    <li>Shipping and billing addresses</li>
                    <li>
                      Payment information (processed securely via third-party
                      payment providers)
                    </li>
                    <li>Purchase history and preferences</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p>We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Process and fulfill orders</li>
                    <li>Communicate with you about orders and products</li>
                    <li>Improve our service and experience</li>
                    <li>Send marketing updates (only if you've opted in)</li>
                    <li>Prevent fraud and ensure security</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    3. Information Security
                  </h2>
                  <p>
                    We use industry-standard security measures to protect your
                    personal information. All transactions are encrypted using
                    SSL and your information is stored on secure servers.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    4. Information Sharing
                  </h2>
                  <p>
                    We do not sell or rent your personal information to third
                    parties. We only share information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Payment processors for transaction purposes</li>
                    <li>Shipping companies for order delivery</li>
                    <li>Service providers who help us operate the website</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
                  <p>
                    We use cookies to enhance your browsing experience, analyze
                    traffic, and personalize content. You can manage cookie
                    preferences in your browser settings.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
                  <p>
                    If you have questions about our privacy policy, please
                    contact us at: privacy@forgesteel.com
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
