// src/app/api/analytics/vitals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// Store Web Vitals metrics
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Fire-and-forget: Don't await DB write
    prisma.webVitalsMetric
      .create({
        data: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          metricId: metric.id,
          navigationType: metric.navigationType,
          timestamp: new Date(),
        },
      })
      .catch(() => {
        // Silently fail - don't break user experience
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    // Return success even on error to prevent client retries
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
