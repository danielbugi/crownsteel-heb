import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">ההזמנה התקבלה!</h1>
              {orderId && (
                <p className="text-sm text-muted-foreground mb-2">
                  מספר הזמנה: {orderId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <p className="text-xl text-muted-foreground">
                תודה על הרכישה. ההזמנה שלך התקבלה ומעובדת.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-4 text-right">
                  <div>
                    <h3 className="font-semibold mb-4 text-right">מה הלאה?</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-right">
                          תקבל/י אישור הזמנה בדוא"ל בקרוב
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-right">
                          נשלח אליך מידע מעקב ברגע שההזמנה תישלח
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-right">
                          התכשיט שלך יארז בקפידה וישלח תוך 2-3 ימי עסקים
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-right">משלוח חינם לכל הארץ</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/shop">המשך קניות</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">חזרה לדף הבית</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
