'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export function PageHeader({
  title,
  description,
  children,
  className,
  variant = 'gradient',
  size = 'md',
}: PageHeaderProps) {
  const variantClasses = {
    default: 'bg-background text-foreground',
    gradient: 'bg-gradient-steel text-white',
    primary: 'bg-gradient-to-r from-primary to-primary/80 text-white',
  };

  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-20',
  };

  const titleSizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
  };

  return (
    <section
      className={cn(variantClasses[variant], sizeClasses[size], className)}
    >
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col gap-4">
          {typeof title === 'string' ? (
            <h1
              className={cn(titleSizeClasses[size], 'font-bold leading-tight')}
            >
              {title}
            </h1>
          ) : (
            title
          )}

          {description && (
            <div
              className={cn(
                'text-lg md:text-xl',
                variant === 'default'
                  ? 'text-muted-foreground'
                  : 'text-white/80'
              )}
            >
              {description}
            </div>
          )}

          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </section>
  );
}

// Specialized components for common patterns
export function SearchPageHeader({
  title,
  description,
  searchElement,
}: {
  title: string | ReactNode;
  description?: string | ReactNode;
  searchElement?: ReactNode;
}) {
  return (
    <PageHeader
      title={title}
      description={description}
      size="lg"
      className="text-center"
    >
      {searchElement && (
        <div className="max-w-md mx-auto mt-6">{searchElement}</div>
      )}
    </PageHeader>
  );
}

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2 mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}

export function UserPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2 mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
