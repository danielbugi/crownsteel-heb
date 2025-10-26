// src/components/seo/hreflang-links.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * HreflangLinks component
 * Generates proper hreflang tags for bilingual SEO (EN/HE)
 * Should be placed in the root layout
 *
 * FIXED: Works independently without LanguageContext
 * to avoid "useLanguage must be used within LanguageProvider" error
 */
export function HreflangLinks() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) return null;

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  // Detect current language from pathname or document
  const isEnglish = pathname.startsWith('/en');
  const isHebrew = pathname.startsWith('/he');
  const currentLang = isEnglish
    ? 'en'
    : isHebrew
      ? 'he'
      : typeof document !== 'undefined'
        ? document.documentElement.lang || 'he'
        : 'he';

  // Remove language prefix from pathname if exists
  const cleanPath = pathname.replace(/^\/(en|he)/, '') || '/';

  return (
    <>
      {/* English version */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanPath}`} />

      {/* Hebrew version */}
      <link rel="alternate" hrefLang="he" href={`${baseUrl}/he${cleanPath}`} />

      {/* Default/fallback - Hebrew as default for Israeli market */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${cleanPath}`}
      />

      {/* Canonical - points to current language version */}
      <link rel="canonical" href={`${baseUrl}/${currentLang}${cleanPath}`} />
    </>
  );
}
