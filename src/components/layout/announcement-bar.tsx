'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Truck, Tag, Shield, Sparkles } from 'lucide-react';

const announcements = [
  {
    en: 'Free Shipping on Orders Over ₪350',
    he: 'משלוח חינם בהזמנות מעל 350 ש״ח',
    icon: Truck,
  },
  {
    en: '25% Off All Collections',
    he: '25% הנחה על כל הקולקציות',
    icon: Tag,
  },
  {
    en: 'Lifetime Warranty on All Jewelry',
    he: 'אחריות לכל החיים על כל התכשיטים',
    icon: Shield,
  },
  {
    en: 'New Collection Just Arrived',
    he: 'קולקציה חדשה הגיעה זה עתה',
    icon: Sparkles,
  },
];

export function AnnouncementBar() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAnnouncement = announcements[currentIndex];
  const Icon = currentAnnouncement.icon;

  return (
    <div className="bg-white text-black py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <p
            key={currentIndex}
            className="animate-fade-in text-center"
            dir={language === 'he' ? 'rtl' : 'ltr'}
          >
            {language === 'he'
              ? currentAnnouncement.he
              : currentAnnouncement.en}
          </p>
        </div>
      </div>
    </div>
  );
}
