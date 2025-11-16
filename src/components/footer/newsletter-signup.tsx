// src/components/footer/newsletter-signup.tsx
'use client';

import { NewsletterForm } from '@/components/ui/newsletter-form';

export function NewsletterSignup() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-base font-cinzel font-light tracking-widest uppercase text-gray-300">
          Newsletter
        </h3>
        <p className="text-sm font-light text-gray-400 tracking-wide">
          Exclusive updates & offers <br /> & 10% off your first order
        </p>
      </div>

      <NewsletterForm
        placeholder="Your email"
        buttonText="Subscribe"
        variant="elegant"
        inputClassName="!text-white min-h-[48px] text-sm font-light border-gold-elegant/30"
        buttonClassName="min-h-[48px] font-cinzel font-light tracking-widest uppercase border-none"
        showIcon={false}
      />
    </div>
  );
}
