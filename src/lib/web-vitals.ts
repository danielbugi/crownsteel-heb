// src/lib/web-vitals.ts
// Core Web Vitals tracking without performance impact

import { logger } from './logger';

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Thresholds based on Google's Core Web Vitals recommendations
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(
  name: WebVitalsMetric['name'],
  value: number
): WebVitalsMetric['rating'] {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Send metrics to analytics endpoint (fire-and-forget, no await)
function sendToAnalytics(metric: WebVitalsMetric) {
  // Only send in production
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`[Web Vitals] ${metric.name}:`, {
      value: Math.round(metric.value),
      rating: metric.rating,
    });
    return;
  }

  // Use sendBeacon for reliability (survives page unload)
  const body = JSON.stringify(metric);

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    // Fallback for browsers without sendBeacon
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      // Ignore errors - analytics shouldn't break the app
    });
  }
}

// Report all Web Vitals
export function reportWebVitals(metric: WebVitalsMetric) {
  const enhancedMetric = {
    ...metric,
    rating: getRating(metric.name, metric.value),
  };

  sendToAnalytics(enhancedMetric);
}

// Helper to manually track custom metrics
export function trackCustomMetric(name: string, value: number) {
  if (process.env.NODE_ENV !== 'production') {
    logger.log(`[Custom Metric] ${name}:`, Math.round(value));
  }
}
