'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PerformanceMetric {
  endpoint: string;
  avgDuration: number;
  requests: number;
  slowRequests: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/performance');

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();

      // Handle both array and object responses
      if (Array.isArray(data)) {
        setMetrics(data);
      } else {
        setMetrics([]);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load performance data');
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const getStatusBadge = (duration: number) => {
    if (duration < 100) {
      return <Badge className="bg-green-500">Excellent</Badge>;
    } else if (duration < 200) {
      return <Badge className="bg-blue-500">Good</Badge>;
    } else if (duration < 500) {
      return <Badge className="bg-yellow-500">Average</Badge>;
    } else {
      return <Badge className="bg-red-500">Slow</Badge>;
    }
  };

  const totalRequests = metrics.reduce((sum, m) => sum + m.requests, 0);
  const avgDuration =
    metrics.length > 0
      ? Math.round(
          metrics.reduce((sum, m) => sum + m.avgDuration, 0) / metrics.length
        )
      : 0;
  const totalSlowRequests = metrics.reduce((sum, m) => sum + m.slowRequests, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchMetrics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button onClick={fetchMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">📊</div>
              <p className="text-lg font-medium">No Performance Data Yet</p>
              <p className="text-muted-foreground">
                Performance metrics will appear here once you start making API
                requests.
              </p>
              <div className="text-sm text-muted-foreground space-y-2 mt-4">
                <p>To populate this dashboard:</p>
                <ol className="text-left max-w-md mx-auto space-y-1">
                  <li>1. Browse your site to make API calls</li>
                  <li>2. Add tracking to specific API routes (optional)</li>
                  <li>3. Click &quot;Refresh Data&quot; to see metrics</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="bg-green-500 rounded-full p-1 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium">Database indexes applied</p>
                <p className="text-muted-foreground">
                  Common queries are optimized with proper indexes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-green-500 rounded-full p-1 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-medium">Pagination enabled</p>
                <p className="text-muted-foreground">
                  API routes return 20 items per page instead of all
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-blue-500 rounded-full p-1 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div>
                <p className="font-medium">Monitor slow requests</p>
                <p className="text-muted-foreground">
                  Requests taking more than 500ms should be investigated
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchMetrics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Requests (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all API endpoints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration}ms</div>
            <p className="text-xs text-muted-foreground mt-1">
              {avgDuration < 200 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Performing well
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Could be improved
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Slow Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlowRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalSlowRequests === 0 ? (
                <span className="text-green-600">No slow requests</span>
              ) : (
                <span>
                  {((totalSlowRequests / totalRequests) * 100).toFixed(1)}% of
                  total
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Details */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoint Performance (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Avg Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Requests</TableHead>
                <TableHead>Slow Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.endpoint}>
                  <TableCell className="font-mono text-sm">
                    {metric.endpoint}
                  </TableCell>
                  <TableCell>{metric.avgDuration}ms</TableCell>
                  <TableCell>{getStatusBadge(metric.avgDuration)}</TableCell>
                  <TableCell>{metric.requests}</TableCell>
                  <TableCell>
                    {metric.slowRequests > 0 ? (
                      <span className="text-yellow-600 font-medium">
                        {metric.slowRequests}
                      </span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="bg-green-500 rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p className="font-medium">Database indexes applied</p>
              <p className="text-muted-foreground">
                Common queries are optimized with proper indexes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-green-500 rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p className="font-medium">Pagination enabled</p>
              <p className="text-muted-foreground">
                API routes return 20 items per page instead of all
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-blue-500 rounded-full p-1 mt-0.5">
              <span className="text-white text-xs">i</span>
            </div>
            <div>
              <p className="font-medium">Monitor slow requests</p>
              <p className="text-muted-foreground">
                Requests taking more than 500ms should be investigated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
