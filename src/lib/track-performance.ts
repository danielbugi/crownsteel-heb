// src/lib/track-performance.ts
// REUSABLE PERFORMANCE TRACKING HELPER

import { prisma } from '@/lib/prisma';

/**
 * Track API performance metrics
 * Fire-and-forget: errors won't break the API
 */
export async function trackPerformance(
  endpoint: string,
  method: string,
  duration: number,
  status: number
) {
  try {
    await prisma.performanceMetric.create({
      data: {
        endpoint,
        method,
        duration,
        status,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Just log, don't throw
    console.error('Failed to track performance:', error);
  }
}

/**
 * Wrapper function to automatically track any API handler
 * Supports both Next.js route handlers and custom handlers
 *
 * Usage:
 * export const GET = withPerformanceTracking('/api/products', async (request) => {
 *   const products = await prisma.product.findMany();
 *   return NextResponse.json(products);
 * });
 */
export function withPerformanceTracking<T extends unknown[]>(
  endpoint: string,
  handler: (request: Request, ...args: T) => Promise<Response>
) {
  return async (request: Request, ...args: T) => {
    const startTime = Date.now();
    const method = request.method;
    let status = 200;

    try {
      const response = await handler(request, ...args);
      status = response.status;

      // Track performance (fire and forget)
      const duration = Date.now() - startTime;
      setImmediate(() => {
        trackPerformance(endpoint, method, duration, status);
      });

      return response;
    } catch (error) {
      // Track error performance
      status = 500;
      const duration = Date.now() - startTime;
      setImmediate(() => {
        trackPerformance(endpoint, method, duration, status);
      });

      throw error;
    }
  };
}

/**
 * Simple performance tracking for manual use
 * Returns a function to call when the operation is complete
 *
 * Usage:
 * const trackEnd = startPerformanceTracking('/api/products', 'GET');
 * try {
 *   // ... your route logic
 *   trackEnd(200);
 *   return NextResponse.json(data);
 * } catch (error) {
 *   trackEnd(500);
 *   throw error;
 * }
 */
export function startPerformanceTracking(endpoint: string, method: string) {
  const startTime = Date.now();

  return (status: number = 200) => {
    const duration = Date.now() - startTime;
    setImmediate(() => {
      trackPerformance(endpoint, method, duration, status);
    });
  };
}
