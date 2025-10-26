import { PerformanceDashboard } from '@/components/admin/performance-dashboard';

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Monitoring</h1>
        <p className="text-muted-foreground">
          Track API response times and optimize performance
        </p>
      </div>

      <PerformanceDashboard />
    </div>
  );
}
