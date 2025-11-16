import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold';
  className?: string;
}

/**
 * ProductBadge - Consistent badge styling for all product images and cards
 * Features:
 * - default: Black background, white text, white border
 * - gold: Gold background (#C5A253) for discount badges
 */
export function ProductBadge({
  className,
  children,
  variant = 'default',
}: ProductBadgeProps) {
  const baseStyles = 'shadow-lg rounded-none font-bold';

  const variantStyles =
    variant === 'gold'
      ? 'bg-[#C5A253] text-black border-[#C5A253]'
      : 'bg-black text-white border-white';

  return (
    <Badge
      variant="outline"
      className={cn(baseStyles, variantStyles, className)}
    >
      {children}
    </Badge>
  );
}
