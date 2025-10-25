'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
      className="text-white/90 hover:text-gold-400 hover:bg-white/10 relative group"
      aria-label={`Switch to ${language === 'en' ? 'Hebrew' : 'English'}`}
    >
      <Globe className="h-5 w-5" aria-hidden="true" />
      {/* <span className="absolute -bottom-1 right-1 text-[10px] font-bold uppercase text-gold-400">
        {language}
      </span> */}
    </Button>
  );
}
