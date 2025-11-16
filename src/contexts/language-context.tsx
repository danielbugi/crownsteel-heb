'use client';

// Compatibility layer to replace the old language context
// This provides the same interface but always returns English translations

import { translations } from '@/lib/translations';

const direction = 'ltr';

export function useLanguage() {
  return {
    language: 'en' as const,
    direction: direction,
    setLanguage: () => {}, // No-op since we're English only
    t: (key: string): string => {
      return translations[key as keyof typeof translations] || key;
    },
  };
}

// Compatibility provider that doesn't actually do anything
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
