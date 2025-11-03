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

// Compact version for product cards
export function StockAlertBadgeCompact({
  inventory,
  lowStockThreshold = 10,
  className,
}: StockAlertBadgeProps) {
  if (inventory === 0) {
    return (
      <span className={cn('text-xs font-semibold text-red-600', className)}>
        Out of Stock
      </span>
    );
  }

  if (inventory <= 3) {
    return (
      <span
        className={cn(
          'text-xs font-semibold text-red-600 animate-pulse',
          className
        )}
      >
        🔥 Only {inventory} left!
      </span>
    );
  }

  if (inventory <= lowStockThreshold) {
    return (
      <span className={cn('text-xs font-semibold text-orange-600', className)}>
        ⚠️ {inventory} left
      </span>
    );
  }

  return null;
}
