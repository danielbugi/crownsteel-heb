// src/components/footer/newsletter-signup.tsx
'use client';

import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { NewsletterForm } from '@/components/ui/newsletter-form';

export function NewsletterSignup() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-gray-200 flex items-center gap-2 sm:gap-3">
          <Mail className="h-5 w-5 sm:h-5 sm:w-5 flex-shrink-0" />
          {t('footer.newsletter') || 'Newsletter'}
        </h3>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          {t('footer.newsletterDesc') ||
            'Get the latest updates, exclusive offers, and new arrivals'}
        </p>
      </div>

      <NewsletterForm
        placeholder={t('footer.emailPlaceholder') || 'Enter your email'}
        buttonText={t('footer.subscribe') || 'Subscribe'}
        variant="elegant"
        inputClassName="!text-white min-h-[48px] text-sm sm:text-base"
        buttonClassName="min-h-[48px] font-semibold"
        showIcon={false}
      />

      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
        {t('footer.newsletterPrivacy') ||
          'We respect your privacy. Unsubscribe anytime.'}
      </p>
    </div>
  );
}
