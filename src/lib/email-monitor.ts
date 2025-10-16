// src/lib/email-monitor.ts

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed' | 'rate_limited';
  timestamp: Date;
  error?: string;
  emailId?: string;
}

class EmailMonitor {
  private logs: EmailLog[] = [];
  private readonly maxLogs = 1000;

  log(entry: Omit<EmailLog, 'id' | 'timestamp'>) {
    const log: EmailLog = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    this.logs.unshift(log);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Also log to console for immediate visibility
    if (log.status === 'failed') {
      console.error(
        `[EmailMonitor] Failed: ${log.to} - ${log.subject}`,
        log.error
      );
    } else if (log.status === 'rate_limited') {
      console.warn(`[EmailMonitor] Rate Limited: ${log.to} - ${log.subject}`);
    }
  }

  getStats(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = this.logs.filter((l) => l.timestamp > cutoff);

    const total = recentLogs.length;
    const sent = recentLogs.filter((l) => l.status === 'sent').length;
    const failed = recentLogs.filter((l) => l.status === 'failed').length;
    const rateLimited = recentLogs.filter(
      (l) => l.status === 'rate_limited'
    ).length;

    return {
      total,
      sent,
      failed,
      rateLimited,
      successRate: total > 0 ? Number(((sent / total) * 100).toFixed(2)) : 0,
      period: `${hours}h`,
      lastUpdated: new Date(),
    };
  }

  getRecentLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  getLogsForEmail(email: string, limit = 20) {
    return this.logs.filter((l) => l.to === email).slice(0, limit);
  }

  clearOldLogs(daysOld = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    const beforeCount = this.logs.length;
    this.logs = this.logs.filter((l) => l.timestamp > cutoff);
    const removed = beforeCount - this.logs.length;

    if (removed > 0) {
      console.log(
        `[EmailMonitor] Cleared ${removed} logs older than ${daysOld} days`
      );
    }
  }

  // Get failed emails for alerting
  getRecentFailures(minutes = 60) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter(
      (l) => l.status === 'failed' && l.timestamp > cutoff
    );
  }
}

export const emailMonitor = new EmailMonitor();

// Auto-cleanup old logs every 24 hours
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      emailMonitor.clearOldLogs(7);
    },
    24 * 60 * 60 * 1000
  );
}
