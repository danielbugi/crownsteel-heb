// src/components/footer/newsletter-signup.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import toast from 'react-hot-toast';

export function NewsletterSignup() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        toast.success(data.message);

        // Reset success state after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder={t('footer.emailPlaceholder') || 'Enter your email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || success}
          className="flex-1 !text-white focus-visible:!border-blue-500 focus-visible:!ring-blue-500 focus-visible:!ring-2"
          required
        />
        <Button
          type="submit"
          disabled={loading || success}
          className="min-w-[100px]"
          variant={'elegant'}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Subscribed!
            </>
          ) : (
            t('footer.subscribe') || 'Subscribe'
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        {t('footer.newsletterPrivacy') ||
          'We respect your privacy. Unsubscribe anytime.'}
      </p>
    </div>
  );
}
