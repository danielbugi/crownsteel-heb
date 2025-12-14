// src/components/providers/web-vitals-provider.tsx
'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, type WebVitalsMetric } from '@/lib/web-vitals';

export function WebVitalsProvider({ children }: { children: React.ReactNode }) {
  useReportWebVitals((metric) => {
    reportWebVitals(metric as WebVitalsMetric);
  });

  // Track custom performance metrics
  useEffect(() => {
    // Track JavaScript bundle load time
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        // Track DOM Content Loaded
        const dcl =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
        if (dcl > 0) {
          // Custom metric tracking can be added here if needed
        }
      }
    }
  }, []);

  return <>{children}</>;
}
