import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { AdminHeader } from '../../components/admin/admin-header';
import { SettingsProvider } from '@/contexts/settings-context';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated and has ADMIN role
  if (!session || !session.user) {
    redirect('/');
  }

  if ((session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <SettingsProvider>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader user={session.user} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SettingsProvider>
  );
}
