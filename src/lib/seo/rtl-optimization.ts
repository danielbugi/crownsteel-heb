// src/lib/seo/rtl-optimization.ts

/**
 * RTL Optimization Utilities
 * Provides helpers and configurations for proper RTL (Hebrew) support
 */

/**
 * Get text alignment class based on language direction
 */
export function getTextAlign(language: 'en' | 'he'): string {
  return language === 'he' ? 'text-right' : 'text-left';
}

/**
 * Get flex direction class based on language direction
 */
export function getFlexDirection(language: 'en' | 'he'): string {
  return language === 'he' ? 'flex-row-reverse' : 'flex-row';
}

/**
 * Get padding/margin direction classes
 * Usage: getPadding('pl-4', 'he') => 'pr-4' for RTL
 */
export function getPadding(className: string, language: 'en' | 'he'): string {
  if (language === 'en') return className;

  // Convert LTR padding/margin to RTL
  const rtlMap: Record<string, string> = {
    'pl-': 'pr-',
    'pr-': 'pl-',
    'ml-': 'mr-',
    'mr-': 'ml-',
    'left-': 'right-',
    'right-': 'left-',
    'start-': 'end-',
    'end-': 'start-',
  };

  let result = className;
  Object.entries(rtlMap).forEach(([ltr, rtl]) => {
    result = result.replace(ltr, rtl);
  });

  return result;
}

/**
 * Get border radius for RTL
 */
export function getBorderRadius(
  className: string,
  language: 'en' | 'he'
): string {
  if (language === 'en') return className;

  const rtlMap: Record<string, string> = {
    'rounded-l-': 'rounded-r-',
    'rounded-r-': 'rounded-l-',
    'rounded-tl-': 'rounded-tr-',
    'rounded-tr-': 'rounded-tl-',
    'rounded-bl-': 'rounded-br-',
    'rounded-br-': 'rounded-bl-',
  };

  let result = className;
  Object.entries(rtlMap).forEach(([ltr, rtl]) => {
    result = result.replace(ltr, rtl);
  });

  return result;
}

/**
 * RTL-aware className builder
 * Automatically converts directional classes based on language
 */
export function rtlClass(baseClasses: string, language: 'en' | 'he'): string {
  if (language === 'en') return baseClasses;

  let result = baseClasses;
  result = getPadding(result, language);
  result = getBorderRadius(result, language);

  return result;
}

/**
 * Get icon rotation for RTL (useful for arrows, chevrons)
 */
export function getIconRotation(language: 'en' | 'he'): string {
  return language === 'he' ? 'rotate-180' : '';
}

/**
 * Tailwind CSS Plugin Configuration for RTL
 * Add this to your tailwind.config.ts
 */
export const rtlTailwindPlugin = {
  '.rtl': {
    direction: 'rtl',
  },
  '.ltr': {
    direction: 'ltr',
  },
  // RTL-specific utilities
  '.rtl .rtl\\:flex-row-reverse': {
    'flex-direction': 'row-reverse',
  },
  '.rtl .rtl\\:text-right': {
    'text-align': 'right',
  },
  '.rtl .rtl\\:space-x-reverse > :not([hidden]) ~ :not([hidden])': {
    '--tw-space-x-reverse': '1',
  },
};

/**
 * HTML lang and dir attributes helper
 */
export function getHtmlAttributes(language: 'en' | 'he'): {
  lang: string;
  dir: 'ltr' | 'rtl';
} {
  return {
    lang: language,
    dir: language === 'he' ? 'rtl' : 'ltr',
  };
}

/**
 * CSS logical properties recommendation
 * Use these instead of directional properties for better RTL support
 */
export const logicalPropertiesGuide = {
  // Instead of margin-left/right, use:
  'margin-inline-start': 'margin-left in LTR, margin-right in RTL',
  'margin-inline-end': 'margin-right in LTR, margin-left in RTL',

  // Instead of padding-left/right, use:
  'padding-inline-start': 'padding-left in LTR, padding-right in RTL',
  'padding-inline-end': 'padding-right in LTR, padding-left in RTL',

  // Instead of border-left/right, use:
  'border-inline-start': 'border-left in LTR, border-right in RTL',
  'border-inline-end': 'border-right in LTR, border-left in RTL',

  // For absolute positioning:
  'inset-inline-start': 'left in LTR, right in RTL',
  'inset-inline-end': 'right in LTR, left in RTL',
};

/**
 * Font recommendations for Hebrew
 */
export const hebrewFonts = {
  primary: [
    'Rubik', // Excellent Hebrew support
    'Heebo', // Clean, modern Hebrew font
    'Assistant', // Light and readable
    'Secular One', // Bold display font
  ],
  fallback: 'sans-serif',
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&family=Heebo:wght@300;400;500;600;700&display=swap',
};

/**
 * Number formatting for Hebrew (right-to-left numbers)
 */
export function formatNumberRTL(number: number, language: 'en' | 'he'): string {
  if (language === 'he') {
    // Hebrew uses LTR numbers but RTL text
    return new Intl.NumberFormat('he-IL').format(number);
  }
  return new Intl.NumberFormat('en-US').format(number);
}

/**
 * Currency formatting for bilingual support
 */
export function formatCurrency(
  amount: number,
  language: 'en' | 'he',
  currency: string = 'ILS'
): string {
  const locale = language === 'he' ? 'he-IL' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Date formatting for bilingual support
 */
export function formatDate(
  date: Date,
  language: 'en' | 'he',
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = language === 'he' ? 'he-IL' : 'en-US';
  return new Intl.DateTimeFormat(locale, options).format(date);
}
