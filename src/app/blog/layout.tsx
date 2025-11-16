import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'בלוג תכשיטים | Forge & Steel',
  description: 'מדריכים, טיפים ועדכונים על תכשיטי גברים, כסף וזהב',
  keywords: ['בלוג תכשיטים', 'תכשיטי גברים', 'טיפוח תכשיטים', 'מדריכי תכשיטים'],
  openGraph: {
    title: 'בלוג תכשיטים | Forge & Steel',
    description: 'מדריכים, טיפים ועדכונים על תכשיטי גברים',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
