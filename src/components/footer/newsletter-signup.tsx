// src/components/footer/newsletter-signup.tsx
'use client';

import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { NewsletterForm } from '@/components/ui/newsletter-form';

export function NewsletterSignup() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {t('footer.newsletter') || 'Newsletter'}
        </h3>
        <p className="text-sm text-gray-200">
          {t('footer.newsletterDesc') ||
            'Get the latest updates, exclusive offers, and new arrivals'}
        </p>
      </div>

      <NewsletterForm
        placeholder={t('footer.emailPlaceholder') || 'Enter your email'}
        buttonText={t('footer.subscribe') || 'Subscribe'}
        variant="elegant"
        inputClassName="!text-white"
        showIcon={false}
      />

      <p className="text-xs text-muted-foreground">
        {t('footer.newsletterPrivacy') ||
          'We respect your privacy. Unsubscribe anytime.'}
      </p>
    </div>
  );
}
