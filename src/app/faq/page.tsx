'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchHeroSection } from '@/components/layout/hero-section';

export default function FAQPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      titleEn: 'Orders & Shipping',
      titleHe: 'הזמנות ומשלוחים',
      questions: [
        {
          questionEn: 'How long does shipping take?',
          questionHe: 'כמה זמן לוקח המשלוח?',
          answerEn:
            'Standard shipping within Israel takes 3-5 business days. Express shipping is available for next-day delivery in major cities. International shipping times vary by destination, typically 7-14 business days.',
          answerHe:
            'משלוח רגיל בתוך ישראל לוקח 3-5 ימי עסקים. משלוח מהיר זמין למשלוח ביום העסקים הבא בערים מרכזיות. זמני משלוח בינלאומיים משתנים לפי יעד, בדרך כלל 7-14 ימי עסקים.',
        },
        {
          questionEn: 'Do you offer free shipping?',
          questionHe: 'האם יש משלוח חינם?',
          answerEn:
            'Yes! We offer free standard shipping on all orders over ₪500 within Israel. International orders over $200 also qualify for free shipping.',
          answerHe:
            'כן! אנו מציעים משלוח רגיל חינם על כל ההזמנות מעל ₪500 בתוך ישראל. הזמנות בינלאומיות מעל $200 גם זכאות למשלוח חינם.',
        },
        {
          questionEn: 'Can I track my order?',
          questionHe: 'האם אני יכול לעקוב אחרי ההזמנה שלי?',
          answerEn:
            "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and viewing your order history.",
          answerHe:
            'בהחלט! ברגע שההזמנה שלך נשלחת, תקבל מספר מעקב באמצעות אימייל. אתה יכול גם לעקוב אחר סטטוס ההזמנה שלך על ידי התחברות לחשבון שלך וצפייה בהיסטוריית ההזמנות שלך.',
        },
      ],
    },
    {
      titleEn: 'Returns & Exchanges',
      titleHe: 'החזרות והחלפות',
      questions: [
        {
          questionEn: 'What is your return policy?',
          questionHe: 'מה מדיניות ההחזרות שלכם?',
          answerEn:
            'We offer a 30-day return policy on all unworn items in their original packaging. Custom and personalized pieces are final sale. Returns are free within Israel, and we provide a prepaid shipping label.',
          answerHe:
            'אנו מציעים מדיניות החזרה של 30 יום על כל הפריטים שלא נלבשו באריזתם המקורית. פריטים מותאמים אישית הם מכירה סופית. החזרות הן בחינם בתוך ישראל, ואנו מספקים תווית משלוח משולמת מראש.',
        },
        {
          questionEn: 'How do I exchange an item?',
          questionHe: 'איך אני מחליף פריט?',
          answerEn:
            "To exchange an item, contact our customer service team within 30 days of delivery. We'll arrange for the return pickup and send your replacement item. Exchanges are subject to availability.",
          answerHe:
            'כדי להחליף פריט, צור קשר עם צוות שירות הלקוחות שלנו תוך 30 יום מהמסירה. נארגן את איסוף ההחזרה ונשלח את הפריט החלופי שלך. החלפות כפופות לזמינות.',
        },
        {
          questionEn: 'What if my item arrives damaged?',
          questionHe: 'מה אם הפריט שלי מגיע פגום?',
          answerEn:
            "If your item arrives damaged, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you. All items are insured during shipping.",
          answerHe:
            'אם הפריט שלך מגיע פגום, אנא צור איתנו קשר מיד עם תמונות. נארגן החלפה או החזר כספי מלא ללא עלות עבורך. כל הפריטים מבוטחים במהלך המשלוח.',
        },
      ],
    },
    {
      titleEn: 'Product Care',
      titleHe: 'טיפול במוצר',
      questions: [
        {
          questionEn: 'How do I care for my jewelry?',
          questionHe: 'איך אני מטפל בתכשיט שלי?',
          answerEn:
            'Each piece comes with specific care instructions. Generally: avoid water and chemicals, store in a dry place, clean gently with a soft cloth. For deep cleaning, bring your piece to our store or a professional jeweler.',
          answerHe:
            'כל יצירה מגיעה עם הוראות טיפול ספציפיות. באופן כללי: הימנע ממים וכימיקלים, אחסן במקום יבש, נקה בעדינות עם מטלית רכה. לניקוי עמוק, הבא את היצירה שלך לחנות שלנו או לתכשיטן מקצועי.',
        },
        {
          questionEn: 'Is your jewelry water-resistant?',
          questionHe: 'האם התכשיטים שלכם עמידים במים?',
          answerEn:
            'While many of our pieces are made from durable materials like titanium and stainless steel, we recommend removing jewelry before swimming, showering, or exercising to maintain its appearance and longevity.',
          answerHe:
            'בעוד שרבות מהיצירות שלנו עשויות מחומרים עמידים כמו טיטניום ונירוסטה, אנו ממליצים להסיר תכשיטים לפני שחייה, מקלחת או פעילות גופנית כדי לשמור על המראה והעמידות שלהם.',
        },
        {
          questionEn: 'Do you offer repair services?',
          questionHe: 'האם אתם מציעים שירותי תיקון?',
          answerEn:
            'Yes! We offer complimentary repairs for manufacturing defects covered under warranty. Additional repair services are available for a fee. Contact us for a quote.',
          answerHe:
            'כן! אנו מציעים תיקונים ללא עלות עבור פגמי ייצור המכוסים תחת אחריות. שירותי תיקון נוספים זמינים בתשלום. צור איתנו קשר להצעת מחיר.',
        },
      ],
    },
    {
      titleEn: 'Sizing & Fit',
      titleHe: 'מידות והתאמה',
      questions: [
        {
          questionEn: 'How do I find my ring size?',
          questionHe: 'איך אני מוצא את מידת הטבעת שלי?',
          answerEn:
            'We offer a free ring sizer that you can order online. Alternatively, visit any jewelry store for professional sizing. Our size guide provides detailed measuring instructions.',
          answerHe:
            'אנו מציעים מודד טבעות בחינם שאתה יכול להזמין באינטרנט. לחלופין, בקר בכל חנות תכשיטים למדידה מקצועית. מדריך המידות שלנו מספק הוראות מדידה מפורטות.',
        },
        {
          questionEn: 'Can rings be resized?',
          questionHe: 'האם ניתן לשנות מידת טבעות?',
          answerEn:
            'Most of our rings can be resized within 1-2 sizes. However, some materials like tungsten and carbon fiber cannot be resized. Contact us before ordering if you have sizing concerns.',
          answerHe:
            'ניתן לשנות את רוב הטבעות שלנו בטווח של 1-2 מידות. עם זאת, חומרים מסוימים כמו טונגסטן וסיבי פחמן לא ניתנים לשינוי מידה. צור איתנו קשר לפני ההזמנה אם יש לך חששות לגבי מידות.',
        },
      ],
    },
    {
      titleEn: 'Payment & Security',
      titleHe: 'תשלום ואבטחה',
      questions: [
        {
          questionEn: 'What payment methods do you accept?',
          questionHe: 'אילו אמצעי תשלום אתם מקבלים?',
          answerEn:
            'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All transactions are secured with SSL encryption.',
          answerHe:
            'אנו מקבלים את כל כרטיסי האשראי המרכזיים (ויזה, מאסטרקארד, אמריקן אקספרס), PayPal והעברות בנקאיות. כל העסקאות מאובטחות עם הצפנת SSL.',
        },
        {
          questionEn: 'Is my payment information secure?',
          questionHe: 'האם פרטי התשלום שלי מאובטחים?',
          answerEn:
            'Absolutely. We use industry-standard encryption and never store your complete credit card information. All payments are processed through secure, PCI-compliant payment gateways.',
          answerHe:
            'בהחלט. אנו משתמשים בהצפנה בתקן התעשייה ולעולם לא שומרים את פרטי כרטיס האשראי המלאים שלך. כל התשלומים מעובדים דרך שערי תשלום מאובטחים ותואמי PCI.',
        },
      ],
    },
  ];

  const allQuestions = faqCategories.flatMap((category) =>
    category.questions.map((q) => ({ ...q, category }))
  );

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (item) =>
          (language === 'he' ? item.questionHe : item.questionEn)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (language === 'he' ? item.answerHe : item.answerEn)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SearchHeroSection
        title={
          language === 'he' ? 'שאלות נפוצות' : 'Frequently Asked Questions'
        }
        description={
          language === 'he'
            ? 'מצא תשובות לשאלות הנפוצות ביותר'
            : 'Find answers to the most common questions'
        }
        searchElement={
          <div className="relative">
            <Search
              className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder={
                language === 'he' ? 'חפש שאלה...' : 'Search questions...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-black"
            />
          </div>
        }
      />{' '}
      {/* FAQ Content */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          {filteredQuestions ? (
            // Show filtered results
            <div>
              <p className="text-muted-foreground mb-6">
                {language === 'he'
                  ? `נמצאו ${filteredQuestions.length} תוצאות`
                  : `Found ${filteredQuestions.length} results`}
              </p>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredQuestions.map((item, index) => (
                  <Card key={index}>
                    <AccordionItem value={`item-${index}`} className="border-0">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <span className="text-left font-semibold">
                          {language === 'he'
                            ? item.questionHe
                            : item.questionEn}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {language === 'he' ? item.answerHe : item.answerEn}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
              {filteredQuestions.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  {language === 'he' ? 'לא נמצאו תוצאות' : 'No results found'}
                </p>
              )}
            </div>
          ) : (
            // Show categories
            <div className="space-y-12">
              {faqCategories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl font-bold mb-6">
                    {language === 'he' ? category.titleHe : category.titleEn}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((q, qIndex) => (
                      <Card key={qIndex}>
                        <AccordionItem
                          value={`cat-${catIndex}-q-${qIndex}`}
                          className="border-0"
                        >
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <span className="text-left font-semibold">
                              {language === 'he' ? q.questionHe : q.questionEn}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-muted-foreground">
                            {language === 'he' ? q.answerHe : q.answerEn}
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Contact CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'he' ? 'עדיין יש שאלות?' : 'Still Have Questions?'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'he'
              ? 'צוות שירות הלקוחות שלנו כאן לעזור'
              : 'Our customer service team is here to help'}
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            {language === 'he' ? 'צור קשר' : 'Contact Us'}
          </a>
        </div>
      </section>
    </div>
  );
}
