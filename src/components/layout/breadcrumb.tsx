// src/components/layout/breadcrumb.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  labelHe?: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { language, t } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">{t('navigation.home') || 'Home'}</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const label =
          language === 'he' && item.labelHe ? item.labelHe : item.label;

        return (
          <div key={index} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
