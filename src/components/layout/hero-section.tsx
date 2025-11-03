'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  backgroundImage?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export function HeroSection({
  title,
  description,
  children,
  className,
  backgroundImage = '/images/assets/7385.jpg',
  size = 'lg',
  overlay = true,
}: HeroSectionProps) {
  const sizeClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
  };

  const titleSizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  };

  return (
    <section
      className={cn(
        'bg-cover bg-center bg-no-repeat text-white relative',
        sizeClasses[size],
        className
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {overlay && <div className="absolute inset-0 bg-black/50 z-0" />}

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center">
          {typeof title === 'string' ? (
            <h1
              className={cn(
                titleSizeClasses[size],
                'font-bold leading-tight mb-4'
              )}
            >
              {title}
            </h1>
          ) : (
            <div
              className={cn(
                titleSizeClasses[size],
                'font-bold leading-tight mb-4'
              )}
            >
              {title}
            </div>
          )}

          {description && (
            <div className="text-xl text-white/80 max-w-3xl mx-auto mb-6">
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

// Specialized variant for search pages with search input
export function SearchHeroSection({
  title,
  description,
  searchElement,
  backgroundImage,
}: {
  title: string | ReactNode;
  description?: string | ReactNode;
  searchElement?: ReactNode;
  backgroundImage?: string;
}) {
  return (
    <HeroSection
      title={title}
      description={description}
      backgroundImage={backgroundImage}
      size="lg"
    >
      {searchElement && <div className="max-w-md mx-auto">{searchElement}</div>}
    </HeroSection>
  );
}
