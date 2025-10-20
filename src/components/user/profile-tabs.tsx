'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from './profile-form';
import { ChangePasswordForm } from './change-password-form';
import { User, Lock, Package, Heart } from 'lucide-react';

interface ProfileTabsProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Personal Info
        </TabsTrigger>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Orders
        </TabsTrigger>
        <TabsTrigger value="wishlist" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Wishlist
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <ProfileForm user={user} />
      </TabsContent>

      <TabsContent value="password">
        <ChangePasswordForm />
      </TabsContent>

      <TabsContent value="orders">
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Order History</h3>
          <p className="text-muted-foreground">
            Your order history will be displayed here
          </p>
        </div>
      </TabsContent>

      <TabsContent value="wishlist">
        <div className="text-center py-8">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Your Wishlist</h3>
          <p className="text-muted-foreground">
            Your saved items will be displayed here
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
