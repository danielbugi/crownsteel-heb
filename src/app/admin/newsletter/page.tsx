// src/app/admin/newsletter/page.tsx
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Users, TrendingUp } from 'lucide-react';
import { NewsletterExportButton } from '../../../components/admin/newsletter/export-button';
import { NewsletterList } from '../../../components/admin/newsletter/newsletter-list';
import { AdminPageHeader } from '@/components/ui/page-header';

async function getNewsletterStats() {
  const [total, active, thisMonth] = await Promise.all([
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { subscribed: true } }),
    prisma.newsletter.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  return { total, active, thisMonth };
}

async function getSubscribers() {
  return await prisma.newsletter.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export default async function NewsletterPage() {
  const stats = await getNewsletterStats();
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Newsletter Subscribers"
        description="Manage your email marketing list"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.thisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Export Subscribers</CardTitle>
            <NewsletterExportButton subscribers={subscribers} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Download all active email addresses for your email marketing
            platform
          </p>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <NewsletterList subscribers={subscribers} />
        </CardContent>
      </Card>
    </div>
  );
}
