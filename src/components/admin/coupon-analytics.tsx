'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Target,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CouponAnalytics {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  active: boolean;
  campaignType?: string;
  createdAt: string;

  // Analytics data
  totalUses: number;
  totalRevenue: number;
  totalDiscount: number;
  uniqueUsers: number;
  averageOrderValue: number;
  conversionRate: number;
  recentOrders: Array<{
    id: string;
    total: number;
    discount: number;
    createdAt: string;
    user?: {
      name: string;
      email: string;
    };
  }>;

  // Performance metrics
  performanceScore: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
}

interface CouponAnalyticsProps {
  couponId: string;
}

export function CouponAnalytics({ couponId }: CouponAnalyticsProps) {
  const [analytics, setAnalytics] = useState<CouponAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [couponId, timeRange]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/coupons/${couponId}/analytics?range=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch coupon analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [couponId, timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coupon Analytics</h2>
          <p className="text-muted-foreground">
            Performance insights for {analytics.code}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coupon Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <code className="text-xl font-bold bg-muted px-3 py-1 rounded">
                  {analytics.code}
                </code>
                {analytics.active ? (
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
                {analytics.campaignType && (
                  <Badge variant="outline">{analytics.campaignType}</Badge>
                )}
              </div>
              {analytics.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {analytics.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(analytics.createdAt))} ago
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${getPerformanceColor(analytics.performanceScore)}`}
              >
                {analytics.performanceScore}%
              </div>
              <p className="text-sm text-muted-foreground">Performance Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <div className="flex items-center gap-1">
              {getTrendIcon(analytics.trend)}
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUses}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.uniqueUsers} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Impact
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{analytics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ₪{analytics.totalDiscount.toLocaleString()} in discounts given
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{analytics.averageOrderValue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.conversionRate.toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${analytics.roi > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {analytics.roi > 0 ? '+' : ''}
              {analytics.roi.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders ({analytics.recentOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {order.user?.name || 'Guest User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt))} ago
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₪{order.total.toFixed(2)}</p>
                    <p className="text-sm text-green-600">
                      -₪{order.discount.toFixed(2)} discount
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Discount Impact</h4>
              <p className="text-sm text-muted-foreground">
                This{' '}
                {analytics.discountType === 'PERCENTAGE'
                  ? 'percentage'
                  : 'fixed amount'}{' '}
                coupon offers{' '}
                {analytics.discountType === 'PERCENTAGE'
                  ? `${analytics.discountValue}% off`
                  : `₪${analytics.discountValue} off`}{' '}
                and has been used {analytics.totalUses} times, generating ₪
                {analytics.totalRevenue.toLocaleString()} in revenue.
              </p>
            </div>

            {analytics.performanceScore < 50 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium mb-2 text-yellow-800">
                  Improvement Suggestions
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>
                    • Consider adjusting the discount value or minimum purchase
                    requirement
                  </li>
                  <li>
                    • Review the coupon&apos;s target audience and campaign type
                  </li>
                  <li>
                    • Check if the coupon code is easy to remember and share
                  </li>
                </ul>
              </div>
            )}

            {analytics.performanceScore >= 80 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium mb-2 text-green-800">
                  Excellent Performance!
                </h4>
                <p className="text-sm text-green-700">
                  This coupon is performing exceptionally well. Consider
                  creating similar coupons or extending its validity period.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
