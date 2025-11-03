'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

interface CookieConsentProps {
  onAccept?: () => void;
}

export function CookieConsent({ onAccept }: CookieConsentProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      // Show banner after 2 seconds with animation delay
      const timer = setTimeout(() => {
        setIsAnimating(true);
        // Small delay for the animation to start
        setTimeout(() => setIsVisible(true), 50);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    // Animate out before hiding
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
      // Trigger signup modal after cookie acceptance
      if (onAccept) {
        onAccept();
      }
    }, 700); // Match animation duration
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'necessary-only');
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  const handleClose = () => {
    // Don't save consent, just hide for this session
    setIsVisible(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  if (!isAnimating) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 bg-black/20 backdrop-blur-sm'
          : 'opacity-0 bg-black/0 pointer-events-none'
      }`}
    >
      <Card
        className={`max-w-4xl mx-auto p-6 shadow-2xl border-2 transform transition-all duration-700 ease-spring ${
          isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full opacity-0 scale-95'
        } hover:shadow-3xl`}
      >
        <div className="flex items-start gap-4">
          {/* Cookie Icon */}
          <div className="flex-shrink-0 mt-1">
            <Cookie
              className={`h-6 w-6 text-amber-600 transition-all duration-500 ${
                isVisible ? 'animate-pulse' : ''
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'he' ? 'הודעה על עוגיות' : 'Cookie Notice'}
              </h3>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 -mt-1 -mr-1"
                aria-label={language === 'he' ? 'סגור' : 'Close'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-3">
              <p>
                {language === 'he'
                  ? 'אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה שלך, לנתח תנועה באתר ולהציג תוכן מותאם אישית. על ידי המשך השימוש באתר, אתה מסכים לשימוש שלנו בעוגיות.'
                  : 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies.'}
              </p>

              <p>
                {language === 'he' ? (
                  <>
                    לקבלת מידע נוסף, עיין ב
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline mx-1"
                    >
                      מדיניות הפרטיות
                    </Link>
                    שלנו.
                  </>
                ) : (
                  <>
                    For more information, please read our{' '}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
                {language === 'he' ? 'קבל את כל העוגיות' : 'Accept All Cookies'}
              </Button>

              <Button
                variant="outline"
                onClick={handleAcceptNecessary}
                className="flex-1 sm:flex-none"
              >
                {language === 'he'
                  ? 'עוגיות נחוצות בלבד'
                  : 'Necessary Cookies Only'}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => window.open('/privacy', '_blank')}
              >
                {language === 'he' ? 'עוד פרטים' : 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook to check cookie consent status
export function useCookieConsent() {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [consentType, setConsentType] = useState<
    'accepted' | 'necessary-only' | null
  >(null);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent) {
      setHasConsented(true);
      setConsentType(consent as 'accepted' | 'necessary-only');
    } else {
      setHasConsented(false);
      setConsentType(null);
    }
  }, []);

  return {
    hasConsented,
    consentType,
    canUseAnalytics: consentType === 'accepted',
    canUseMarketing: consentType === 'accepted',
  };
}
