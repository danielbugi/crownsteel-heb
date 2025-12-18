'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Truck, Tag, Shield, Sparkles } from 'lucide-react';

const announcements = [
  {
    en: 'Free Shipping on Orders Over ₪350',
    icon: Truck,
  },
  {
    en: '25% Off All Collections',
    icon: Tag,
  },
  {
    en: 'Lifetime Warranty on All Jewelry',
    icon: Shield,
  },
  {
    en: 'New Collection Just Arrived',
    icon: Sparkles,
  },
];

// Memoized announcement item component
const AnnouncementItem = ({
  announcement,
  index,
  currentIndex,
  language,
}: {
  announcement: (typeof announcements)[0];
  index: number;
  currentIndex: number;
  language: string;
}) => {
  const Icon = announcement.icon;
  const isActive = index === currentIndex;
  const isNext = index === (currentIndex + 1) % announcements.length;
  const isPrevious =
    index === (currentIndex - 1 + announcements.length) % announcements.length;

  // Memoized class calculations
  const classes = useMemo(() => {
    let translateClass = '';
    let transitionClass = '';
    let opacityClass = 'opacity-0';

    if (isActive) {
      translateClass = 'translate-x-0';
      transitionClass = 'transition-all duration-1000 ease-out';
      opacityClass = 'opacity-100';
    } else if (isNext) {
      translateClass = 'translate-x-full';
      transitionClass = 'transition-all duration-700 ease-in';
      opacityClass = 'opacity-0';
    } else if (isPrevious) {
      translateClass = '-translate-x-full';
      transitionClass = 'transition-all duration-700 ease-in';
      opacityClass = 'opacity-0';
    } else {
      translateClass = 'translate-x-[200%]';
      transitionClass = 'transition-all duration-500 ease-linear';
      opacityClass = 'opacity-0';
    }

    return `absolute top-0 left-0 w-full h-full flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-bold transform ${translateClass} ${opacityClass} ${transitionClass}`;
  }, [isActive, isNext, isPrevious]);

  // Early return for invisible items to reduce render work
  if (!isActive && !isNext && !isPrevious) {
    return (
      <div
        key={index}
        className={classes}
        style={{ visibility: 'hidden' }} // Better than opacity for non-participating elements
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{announcement.en}</span>
      </div>
    );
  }

  return (
    <div key={index} className={classes} dir={'ltr'}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{announcement.en}</span>
    </div>
  );
};

export function AnnouncementBar() {
  // const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Optimized interval with useCallback
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="bg-white text-gray-900 py-2 overflow-hidden relative w-full will-change-transform border-b-4 border-black">
      <div className="relative w-full h-6">
        {announcements.map((announcement, index) => (
          <AnnouncementItem
            key={index}
            announcement={announcement}
            index={index}
            currentIndex={currentIndex}
            language="en"
          />
        ))}
      </div>
    </div>
  );
}
