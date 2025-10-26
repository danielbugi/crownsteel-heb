'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  Shield,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface UserMenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

export function UserMenuSidebar({
  isOpen,
  onClose,
  user,
}: UserMenuSidebarProps) {
  const { t, direction } = useLanguage();

  // Debug logging
  // console.log('UserMenuSidebar render:', { isOpen, direction, user: !!user });

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  const menuItems = [
    {
      icon: UserIcon,
      label: t('nav.profile'),
      href: '/profile',
    },
    {
      icon: Package,
      label: t('nav.orders'),
      href: '/orders',
    },
    {
      icon: Heart,
      label: t('nav.wishlist'),
      href: '/wishlist',
    },
  ];

  // Add admin link if user is admin
  if (user && (user.email === 'admin@example.com' || user.role === 'ADMIN')) {
    menuItems.push({
      icon: Shield,
      label: t('nav.admin'),
      href: '/admin',
    });
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 transition-opacity duration-300',
          isOpen
            ? 'opacity-100 z-50'
            : 'opacity-0 pointer-events-none invisible -z-10'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        key={direction} // Force re-mount on direction change to prevent transition
        className={cn(
          'fixed top-0 h-full w-full sm:w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          // User menu slides from right in LTR, left in RTL
          direction === 'rtl' ? 'left-0' : 'right-0',
          isOpen && user
            ? 'translate-x-0 z-50 visible'
            : direction === 'rtl'
              ? '-translate-x-full  z-50'
              : 'translate-x-full  z-50'
        )}
        dir={direction}
      >
        {/* Header with User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-black uppercase tracking-wide">
              {t('nav.profile')}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-black hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-16 w-16 border-2 border-gray-200">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || 'User'}
              />
              <AvatarFallback className="bg-black text-white text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-black truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-4 px-6 py-4 text-black hover:bg-gray-50 transition-colors',
                  index !== menuItems.length - 1 && 'border-b border-gray-200'
                )}
              >
                <Icon className="h-5 w-5 text-gray-600" />
                <span className="font-light uppercase tracking-wide text-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 w-full px-6 py-4 text-black hover:bg-gray-50 transition-colors border-t border-gray-200 mt-2"
          >
            <LogOut className="h-5 w-5 text-gray-600" />
            <span className="font-light uppercase tracking-wide text-sm">
              {t('nav.signout')}
            </span>
          </button>
        </nav>
      </div>
    </>
  );
}
