// src/app/api/email/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { emailMonitor } from '@/lib/email';

export async function GET(request: NextRequest) {
  // Check admin authorization
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const hours = parseInt(searchParams.get('hours') || '24');
    const email = searchParams.get('email');

    // Get stats
    const stats = emailMonitor.getStats(hours);

    // Get logs based on query
    let logs;
    if (email) {
      logs = emailMonitor.getLogsForEmail(email);
    } else {
      const limit = parseInt(searchParams.get('limit') || '50');
      logs = emailMonitor.getRecentLogs(limit);
    }

    // Get recent failures for alerts
    const recentFailures = emailMonitor.getRecentFailures(60);

    return NextResponse.json({
      success: true,
      stats,
      logs,
      recentFailures: recentFailures.length,
      alerts: recentFailures.length > 10 ? ['High failure rate detected'] : [],
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email stats' },
      { status: 500 }
    );
  }
}
