import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileTabs } from '@/components/user/profile-tabs';
import { UserPageHeader } from '@/components/ui/page-header';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <UserPageHeader
        title="Profile"
        description="Manage your account information"
      />

      <ProfileTabs user={session.user} />
    </div>
  );
}
