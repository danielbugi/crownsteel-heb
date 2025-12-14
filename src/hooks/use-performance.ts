import { useState } from 'react';

interface PerformanceMetrics {
  url: string;
  method: string;
  duration: number;
  timestamp: Date;
  status?: number;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  const measureRequest = async <T>(
    url: string,
    options?: RequestInit
  ): Promise<{ data: T; duration: number }> => {
    const startTime = performance.now();

    try {
      const response = await fetch(url, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const data = await response.json();

      // Log metric
      const metric: PerformanceMetrics = {
        url,
        method: options?.method || 'GET',
        duration,
        timestamp: new Date(),
        status: response.status,
      };

      setMetrics((prev) => [...prev.slice(-99), metric]); // Keep last 100

      return { data, duration };
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      console.error(`[Performance] ${url} failed after ${duration}ms`, error);
      throw error;
    }
  };

  const getAverageDuration = (urlPattern?: string) => {
    const filtered = urlPattern
      ? metrics.filter((m) => m.url.includes(urlPattern))
      : metrics;

    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return Math.round(total / filtered.length);
  };

  const getSlowRequests = (threshold = 500) => {
    return metrics.filter((m) => m.duration > threshold);
  };

  const clearMetrics = () => {
    setMetrics([]);
  };

  return {
    metrics,
    measureRequest,
    getAverageDuration,
    getSlowRequests,
    clearMetrics,
  };
}
