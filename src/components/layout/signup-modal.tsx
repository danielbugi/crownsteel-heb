'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  X,
  Mail,
  Sparkles,
  Bell,
  Gift,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import toast from 'react-hot-toast';

const SIGNUP_MODAL_KEY = 'signup-modal-shown';

interface SignupModalProps {
  trigger: boolean;
  onClose: () => void;
}

export function SignupModal({ trigger, onClose }: SignupModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (trigger) {
      // Check if modal was already shown
      const hasShown = localStorage.getItem(SIGNUP_MODAL_KEY);
      if (!hasShown) {
        // Show modal after 2-3 seconds delay
        const timer = setTimeout(() => {
          setIsAnimating(true);
          // Small delay for the animation to start
          setTimeout(() => setIsVisible(true), 50);
          localStorage.setItem(SIGNUP_MODAL_KEY, 'true');
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [trigger]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 400); // Match animation duration
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(
        language === 'he'
          ? 'אנא הזן כתובת אימייל'
          : 'Please enter your email address'
      );
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

        // Auto close after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        toast.error(
          data.error ||
            (language === 'he' ? 'הרשמה נכשלה' : 'Failed to subscribe')
        );
      }
    } catch {
      toast.error(
        language === 'he'
          ? 'משהו השתבש. אנא נסה שוב.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-400 ease-out ${
        isVisible
          ? 'bg-black/50 backdrop-blur-sm opacity-100'
          : 'bg-black/0 opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`transform transition-all duration-500 ease-out ${
          isVisible
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-90 opacity-0 translate-y-8'
        }`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          transitionTimingFunction: isVisible
            ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            : 'ease-out',
        }}
      >
        <Card className="max-w-md w-full p-8 shadow-2xl border-2 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ${
                  isVisible ? 'animate-pulse' : ''
                }`}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {language === 'he'
                  ? 'הצטרף לחברים שלנו!'
                  : 'Join Our Community!'}
              </h2>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 -mt-1 -mr-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={language === 'he' ? 'סגור' : 'Close'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {language === 'he'
                  ? 'היה הראשון לדעת על אוספים חדשים ומבצעים בלעדיים!'
                  : 'Be the first to know about new collections & exclusive deals!'}
              </p>

              <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div
                  className={`flex items-center gap-2 transition-all duration-500 delay-100 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span>
                    {language === 'he' ? 'עדכונים מיידיים' : 'Instant Updates'}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 transition-all duration-500 delay-200 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Gift className="h-4 w-4 text-purple-500" />
                  <span>
                    {language === 'he'
                      ? 'הנחות בלעדיות'
                      : 'Exclusive Discounts'}
                  </span>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder={
                    language === 'he'
                      ? 'הזן את האימייל שלך'
                      : 'Enter your email address'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  className="pl-10 h-12 text-base border-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {language === 'he' ? 'נרשם...' : 'Subscribing...'}
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {language === 'he' ? 'הצלחנו!' : 'Success!'}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    {language === 'he' ? 'הצטרף עכשיו' : 'Join Now'}
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Notice */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {language === 'he'
                ? 'אנו מכבדים את הפרטיות שלך. תוכל לבטל את המנוי בכל עת.'
                : 'We respect your privacy. You can unsubscribe anytime.'}
            </p>

            {/* Skip Option */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {language === 'he' ? 'אולי מאוחר יותר' : 'Maybe Later'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
