// src/app/admin/newsletter/newsletter-list.tsx
'use client';

import { Mail } from 'lucide-react';

interface NewsletterListProps {
  subscribers: Array<{
    id: string;
    email: string;
    subscribed: boolean;
    createdAt: Date;
  }>;
}

export function NewsletterList({ subscribers }: NewsletterListProps) {
  if (subscribers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No subscribers yet
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {subscribers.map((subscriber) => (
        <div
          key={subscriber.id}
          className="flex items-center justify-between py-2 px-3 hover:bg-muted rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{subscriber.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                subscriber.subscribed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(subscriber.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
