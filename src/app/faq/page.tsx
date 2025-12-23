'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchHeroSection } from '@/components/layout/hero-section';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'הזמנות ומשלוחים',
      questions: [
        {
          question: 'כמה זמן לוקח המשלוח?',
          answer:
            'משלוח רגיל בתוך ישראל לוקח 3-5 ימי עסקים. משלוח אקספרס זמין לערים מרכזיות ביום למחרת. משלוחים בינלאומיים מגיעים בדרך כלל תוך 7-14 ימי עסקים.',
        },
        {
          question: 'האם יש משלוח חינם?',
          answer:
            'כן! אנו מציעים משלוח חינם על כל הזמנה מעל 500 ש"ח בתוך ישראל. הזמנות בינלאומיות מעל 200$ גם כן זכאיות למשלוח חינם.',
        },
        {
          question: 'האם אפשר לעקוב אחרי ההזמנה?',
          answer:
            'בהחלט! לאחר שליחת ההזמנה תקבלו מספר מעקב במייל. ניתן גם לעקוב אחרי סטטוס ההזמנה דרך החשבון באתר.',
        },
      ],
    },
    {
      title: 'החזרות והחלפות',
      questions: [
        {
          question: 'מה מדיניות ההחזרה שלכם?',
          answer:
            'ניתן להחזיר כל פריט שלא נלבש באריזתו המקורית תוך 30 יום. פריטים בהתאמה אישית אינם ניתנים להחזרה. החזרות בתוך ישראל ללא עלות ואנו מספקים תווית משלוח מראש.',
        },
        {
          question: 'איך מחליפים פריט?',
          answer:
            'להחלפת פריט, צרו קשר עם שירות הלקוחות תוך 30 יום מהקבלה. נארגן איסוף ונשלח את הפריט החלופי. ההחלפה כפופה למלאי.',
        },
        {
          question: 'מה קורה אם קיבלתי פריט פגום?',
          answer:
            'במקרה של קבלת פריט פגום, צרו איתנו קשר מיד עם תמונות. נארגן החלפה או החזר כספי מלא ללא עלות. כל הפריטים מבוטחים במשלוח.',
        },
      ],
    },
    {
      title: 'טיפול במוצרים',
      questions: [
        {
          question: 'איך לשמור על התכשיטים?',
          answer:
            'כל פריט מגיע עם הוראות טיפול. באופן כללי: להימנע ממגע עם מים וכימיקלים, לאחסן במקום יבש, ולנקות בעדינות עם מטלית רכה. לניקוי עמוק מומלץ להגיע אלינו או לצורף מקצועי.',
        },
        {
          question: 'האם התכשיטים עמידים במים?',
          answer:
            'רבים מהפריטים עשויים מחומרים עמידים כמו טיטניום ופלדת אל-חלד, אך מומלץ להסיר תכשיטים לפני שחייה, מקלחת או פעילות ספורטיבית לשמירה על מראה ועמידות.',
        },
        {
          question: 'האם יש שירות תיקונים?',
          answer:
            'כן! אנו מציעים תיקונים חינם לפגמים בייצור במסגרת האחריות. שירותי תיקון נוספים בתשלום. צרו קשר לקבלת הצעת מחיר.',
        },
      ],
    },
    {
      title: 'מידות והתאמה',
      questions: [
        {
          question: 'איך אדע את מידת הטבעת שלי?',
          answer:
            'ניתן להזמין מדיד טבעות חינם באתר. לחלופין, ניתן להיבדק אצל כל צורף. מדריך המידות שלנו מסביר כיצד למדוד במדויק.',
        },
        {
          question: 'האם אפשר לשנות מידה לטבעת?',
          answer:
            'רוב הטבעות ניתנות להקטנה או הגדלה בטווח של מידה-שתיים. יש חומרים כמו טונגסטן וסיבי פחמן שלא ניתנים לשינוי מידה. מומלץ להתייעץ לפני ההזמנה.',
        },
      ],
    },
    {
      title: 'תשלום ואבטחה',
      questions: [
        {
          question: 'אילו אמצעי תשלום מתקבלים?',
          answer:
            'אנו מקבלים את כל כרטיסי האשראי (ויזה, מאסטרקארד, אמריקן אקספרס), פייפאל והעברה בנקאית. כל העסקאות מאובטחות בהצפנת SSL.',
        },
        {
          question: 'האם המידע שלי בטוח?',
          answer:
            'בהחלט. אנו משתמשים בהצפנה מתקדמת ולא שומרים את פרטי האשראי המלאים. כל התשלומים מעובדים בשערי תשלום מאובטחים ומאושרים.',
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
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SearchHeroSection
        title="שאלות נפוצות"
        description="מצאו תשובות לשאלות הנפוצות ביותר"
        searchElement={
          <div className="relative">
            <Search
              className="absolute left-3 top-3 h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="חיפוש בשאלות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-black"
            />
          </div>
        }
      />
      {/* FAQ Content */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          {filteredQuestions ? (
            // Show filtered results
            <div>
              <p className="text-muted-foreground mb-6">
                נמצאו {filteredQuestions.length} תוצאות
              </p>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredQuestions.map((item, index) => (
                  <Card key={index}>
                    <AccordionItem value={`item-${index}`} className="border-0">
                      <AccordionTrigger className="px-6 hover:no-underline">
                        <span className="text-left font-semibold">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
              {filteredQuestions.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  לא נמצאו תוצאות
                </p>
              )}
            </div>
          ) : (
            // Show categories
            <div className="space-y-12">
              {faqCategories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((q, qIndex) => (
                      <Card key={qIndex}>
                        <AccordionItem
                          value={`cat-${catIndex}-q-${qIndex}`}
                          className="border-0"
                        >
                          <AccordionTrigger className="px-6 hover:no-underline">
                            <span className="text-left font-semibold">
                              {q.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-muted-foreground">
                            {q.answer}
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
          <h2 className="text-2xl font-bold mb-4">עדיין יש לכם שאלות?</h2>
          <p className="text-muted-foreground mb-6">
            צוות שירות הלקוחות שלנו כאן בשבילכם
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            צרו קשר
          </a>
        </div>
      </section>
    </div>
  );
}
