// src/components/shop/stock-alert-badge.tsx
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockAlertBadgeProps {
  inventory: number;
  lowStockThreshold?: number;
  className?: string;
  variant?: 'default' | 'minimal';
}

export function StockAlertBadge({
  inventory,
  lowStockThreshold = 10,
  className,
  variant = 'default',
}: StockAlertBadgeProps) {
  // Out of stock
  if (inventory === 0) {
    return (
      <Badge variant="destructive" className={cn('gap-1', className)}>
        <Package className="h-3 w-3" />
        Out of Stock
      </Badge>
    );
  }

  // Low stock warning (urgent)
  if (inventory <= 3) {
    return (
      <Badge
        variant="destructive"
        className={cn(
          'gap-1 bg-red-100 text-red-700 border-red-200 animate-pulse',
          className
        )}
      >
        <AlertTriangle className="h-3 w-3" />
        Only {inventory} left!
      </Badge>
    );
  }

  // Medium stock warning
  if (inventory <= lowStockThreshold) {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1 bg-orange-50 text-orange-700 border-orange-200',
          className
        )}
      >
        <TrendingUp className="h-3 w-3" />
        {variant === 'minimal'
          ? `${inventory} left`
          : `Only ${inventory} left in stock`}
      </Badge>
    );
  }

  // In stock (no badge needed for high stock)
  return null;
}

// Compact version for product cards - Minimalist red text
export function StockAlertBadgeCompact({
  inventory,
  className,
}: Omit<StockAlertBadgeProps, 'lowStockThreshold'>) {
  if (inventory === 0) {
    return (
      <span className={cn('text-xs font-semibold text-red-600', className)}>
        Out of Stock
      </span>
    );
  }

  // Show only for very low stock (3 or less) - Red, no emoji
  if (inventory <= 3) {
    return (
      <span className={cn('text-xs font-medium text-red-600', className)}>
        Only {inventory} left
      </span>
    );
  }

  // Don't show anything for medium stock - keep it clean
  return null;
}
