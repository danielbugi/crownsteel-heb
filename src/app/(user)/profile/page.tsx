import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileTabs } from '@/components/user/profile-tabs';

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <ProfileTabs user={session.user} />
    </div>
  );
}
