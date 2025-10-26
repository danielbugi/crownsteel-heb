// COMPLETE WORKING API ROUTE
// File: src/app/api/admin/performance/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface GroupedMetric {
  endpoint: string;
  durations: number[];
  requests: number;
  slowRequests: number;
}

interface PerformanceResult {
  endpoint: string;
  avgDuration: number;
  requests: number;
  slowRequests: number;
}

export async function GET() {
  try {
    // Get metrics from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const metrics = await prisma.performanceMetric.findMany({
      where: {
        timestamp: {
          gte: yesterday,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // If no metrics, return empty array (dashboard handles this)
    if (metrics.length === 0) {
      return NextResponse.json([]);
    }

    // Group metrics by endpoint
    const grouped = metrics.reduce(
      (acc: Record<string, GroupedMetric>, metric) => {
        if (!acc[metric.endpoint]) {
          acc[metric.endpoint] = {
            endpoint: metric.endpoint,
            durations: [],
            requests: 0,
            slowRequests: 0,
          };
        }

        acc[metric.endpoint].durations.push(metric.duration);
        acc[metric.endpoint].requests++;

        // Count slow requests (>500ms)
        if (metric.duration > 500) {
          acc[metric.endpoint].slowRequests++;
        }

        return acc;
      },
      {}
    );

    // Calculate averages
    const result = Object.values(grouped).map(
      (group: GroupedMetric): PerformanceResult => {
        const avgDuration = Math.round(
          group.durations.reduce((sum: number, d: number) => sum + d, 0) /
            group.durations.length
        );

        return {
          endpoint: group.endpoint,
          avgDuration,
          requests: group.requests,
          slowRequests: group.slowRequests,
        };
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);

    // Return empty array instead of error to prevent dashboard breaking
    // This way dashboard shows "No data yet" instead of error
    return NextResponse.json([]);

    // OR if you want to see errors:
    // return NextResponse.json(
    //   { error: 'Failed to fetch metrics', details: error.message },
    //   { status: 500 }
    // );
  }
}
