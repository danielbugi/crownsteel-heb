// src/components/admin/admin-sidebar.tsx
// ALTERNATIVE VERSION: With Grouped Sections
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Settings,
  Gem,
  Star,
  Warehouse,
  Activity,
  Mail,
  Tag,
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';

// Grouped navigation for better organization
const navigationSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Performance', href: '/admin/performance', icon: Activity },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: FolderTree },
      { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
    ],
  },
  {
    title: 'Sales',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    ],
  },
  {
    title: 'Marketing',
    items: [{ name: 'Newsletter', href: '/admin/newsletter', icon: Mail }],
  },
  {
    title: 'Community',
    items: [
      { name: 'Customers', href: '/admin/customers', icon: Users },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'System',
    items: [{ name: 'Settings', href: '/admin/settings', icon: Settings }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center space-x-2">
          <Gem className="h-8 w-8 text-accent" />
          <div>
            <h1 className="font-bold text-lg">
              {settings?.siteName || 'CrownSteel'}
            </h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation with Sections */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title}>
            {/* Section Title */}
            <h3 className="px-3 mb-2 text-xs font-semibold text-black uppercase tracking-wider">
              {section.title}
            </h3>
            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Back to Store */}
      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Gem className="h-5 w-5" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}
