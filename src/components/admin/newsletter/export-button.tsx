// src/app/admin/newsletter/export-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface NewsletterExportButtonProps {
  subscribers: Array<{
    id: string;
    email: string;
    subscribed: boolean;
    createdAt: Date;
  }>;
}

export function NewsletterExportButton({
  subscribers,
}: NewsletterExportButtonProps) {
  const handleExport = () => {
    const emails = subscribers
      .filter((s) => s.subscribed)
      .map((s) => s.email)
      .join('\n');

    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export Emails
    </Button>
  );
}
