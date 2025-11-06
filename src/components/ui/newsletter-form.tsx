'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
  loadingText?: string;
  successText?: string;
  variant?: 'default' | 'elegant' | 'outline' | 'ghost';
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  showIcon?: boolean;
  onSuccess?: (email: string) => void;
  onError?: (error: string) => void;
}

export function NewsletterForm({
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  loadingText = 'Subscribing...',
  successText = 'Subscribed!',
  variant = 'elegant',
  className,
  inputClassName,
  buttonClassName,
  showIcon = true,
  onSuccess,
  onError,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      const error = 'Please enter your email address';
      toast.error(error);
      onError?.(error);
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
        const successEmail = email;
        setEmail('');
        toast.success(data.message || 'Successfully subscribed to newsletter!');
        onSuccess?.(successEmail);

        // Reset success state after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const error = data.error || 'Failed to subscribe';
        toast.error(error);
        onError?.(error);
      }
    } catch {
      const errorMsg = 'Something went wrong. Please try again.';
      toast.error(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading || success}
        className={cn(
          'flex-1 focus-visible:!border-blue-500 focus-visible:!ring-blue-500 focus-visible:!ring-2',
          inputClassName
        )}
        required
      />
      <Button
        type="submit"
        disabled={loading || success}
        className={cn('min-w-[100px]', buttonClassName)}
        variant={variant}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : success ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            {successText}
          </>
        ) : (
          <>
            {showIcon && <Mail className="mr-2 h-4 w-4" />}
            {buttonText}
          </>
        )}
      </Button>
    </form>
  );
}
