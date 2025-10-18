// src/app/admin/reviews/page.tsx
// Admin page for managing reviews

import { AdminReviewsManagement } from '@/components/admin/admin-reviews-management';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Manage and moderate customer reviews
        </p>
      </div>
      <AdminReviewsManagement />
    </div>
  );
}
