'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Tag,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  usagePerUser?: number | null;
  validFrom: string;
  validTo?: string | null;
  active: boolean;
  campaignType?: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface CouponStats {
  total: number;
  active: number;
  totalUsage: number;
  totalDiscount: number;
}

interface CouponManagementProps {
  initialCoupons: Coupon[];
  initialStats: CouponStats;
}

const campaignTypes = [
  { value: 'NEWSLETTER_WELCOME', label: 'Newsletter Welcome' },
  { value: 'FIRST_ORDER', label: 'First Order' },
  { value: 'BLACK_FRIDAY', label: 'Black Friday' },
  { value: 'HOLIDAY', label: 'Holiday' },
  { value: 'FLASH_SALE', label: 'Flash Sale' },
  { value: 'ABANDONED_CART', label: 'Abandoned Cart' },
  { value: 'BIRTHDAY', label: 'Birthday' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'CUSTOM', label: 'Custom' },
];

export function CouponManagement({
  initialCoupons,
  initialStats,
}: CouponManagementProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const stats = initialStats;
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [expiryFilter, setExpiryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  // Filter coupons based on search and filters
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && coupon.active) ||
      (statusFilter === 'inactive' && !coupon.active);

    const matchesCampaign =
      campaignFilter === 'all' || coupon.campaignType === campaignFilter;

    const now = new Date();
    const isExpired = coupon.validTo && new Date(coupon.validTo) < now;
    const isExpiringSoon =
      coupon.validTo &&
      new Date(coupon.validTo) > now &&
      new Date(coupon.validTo) <
        new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const matchesExpiry =
      expiryFilter === 'all' ||
      (expiryFilter === 'expired' && isExpired) ||
      (expiryFilter === 'expiring' && isExpiringSoon) ||
      (expiryFilter === 'active' && !isExpired);

    return matchesSearch && matchesStatus && matchesCampaign && matchesExpiry;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoupons(filteredCoupons.map((c) => c.id));
    } else {
      setSelectedCoupons([]);
    }
  };

  const handleSelectCoupon = (couponId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoupons((prev) => [...prev, couponId]);
    } else {
      setSelectedCoupons((prev) => prev.filter((id) => id !== couponId));
    }
  };

  const handleBulkActivate = async () => {
    setLoading(true);
    try {
      const promises = selectedCoupons.map((id) =>
        fetch(`/api/admin/coupons/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...coupons.find((c) => c.id === id),
            active: true,
          }),
        })
      );

      await Promise.all(promises);

      // Update local state
      setCoupons((prev) =>
        prev.map((coupon) =>
          selectedCoupons.includes(coupon.id)
            ? { ...coupon, active: true }
            : coupon
        )
      );

      setSelectedCoupons([]);
      toast.success(`Activated ${selectedCoupons.length} coupons`);
    } catch {
      toast.error('Failed to activate coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    setLoading(true);
    try {
      const promises = selectedCoupons.map((id) =>
        fetch(`/api/admin/coupons/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...coupons.find((c) => c.id === id),
            active: false,
          }),
        })
      );

      await Promise.all(promises);

      // Update local state
      setCoupons((prev) =>
        prev.map((coupon) =>
          selectedCoupons.includes(coupon.id)
            ? { ...coupon, active: false }
            : coupon
        )
      );

      setSelectedCoupons([]);
      toast.success(`Deactivated ${selectedCoupons.length} coupons`);
    } catch {
      toast.error('Failed to deactivate coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete coupon'
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    }
  };

  const exportCoupons = () => {
    const csvContent = [
      ['Code', 'Description', 'Type', 'Value', 'Active', 'Usage', 'Created'],
      ...filteredCoupons.map((coupon) => [
        coupon.code,
        coupon.description || '',
        coupon.discountType,
        coupon.discountValue,
        coupon.active ? 'Yes' : 'No',
        `${coupon.usageCount}/${coupon.usageLimit || '∞'}`,
        new Date(coupon.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coupons.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">
            Create and manage discount codes
          </p>
        </div>
        <Link href="/admin/coupons/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Coupons
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Discount Given
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₪{stats.totalDiscount.toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaignTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={expiryFilter} onValueChange={setExpiryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCoupons.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedCoupons.length} coupon(s) selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkActivate}
                disabled={loading}
              >
                <Eye className="mr-2 h-4 w-4" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeactivate}
                disabled={loading}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Deactivate
              </Button>
              <Button variant="outline" size="sm" onClick={exportCoupons}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Coupons ({filteredCoupons.length})</CardTitle>
            {filteredCoupons.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedCoupons.length === filteredCoupons.length}
                  onCheckedChange={handleSelectAll}
                />
                <label className="text-sm text-muted-foreground">
                  Select All
                </label>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No coupons found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ||
                statusFilter !== 'all' ||
                campaignFilter !== 'all' ||
                expiryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first coupon to start offering discounts'}
              </p>
              {!searchTerm &&
                statusFilter === 'all' &&
                campaignFilter === 'all' &&
                expiryFilter === 'all' && (
                  <Link href="/admin/coupons/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Coupon
                    </Button>
                  </Link>
                )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCoupons.map((coupon) => {
                const isExpired =
                  coupon.validTo && new Date(coupon.validTo) < new Date();
                const isExpiringSoon =
                  coupon.validTo &&
                  new Date(coupon.validTo) > new Date() &&
                  new Date(coupon.validTo) <
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                return (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedCoupons.includes(coupon.id)}
                        onCheckedChange={(checked) =>
                          handleSelectCoupon(coupon.id, checked as boolean)
                        }
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-lg font-bold bg-muted px-3 py-1 rounded">
                            {coupon.code}
                          </code>
                          {coupon.active ? (
                            <Badge className="bg-green-100 text-green-700">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                          {isExpired && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                          {isExpiringSoon && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              Expiring Soon
                            </Badge>
                          )}
                          {coupon.campaignType && (
                            <Badge variant="outline">
                              {campaignTypes.find(
                                (t) => t.value === coupon.campaignType
                              )?.label || coupon.campaignType}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {coupon.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {coupon.discountType === 'PERCENTAGE'
                              ? `${coupon.discountValue}% off`
                              : `₪${coupon.discountValue} off`}
                          </span>
                          <span>•</span>
                          <span>
                            Used: {coupon.usageCount}/{coupon.usageLimit || '∞'}
                          </span>
                          <span>•</span>
                          <span>Orders: {coupon._count.orders}</span>
                          {coupon.validTo && (
                            <>
                              <span>•</span>
                              <span>
                                Expires:{' '}
                                {new Date(coupon.validTo).toLocaleDateString()}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>
                            Created:{' '}
                            {formatDistanceToNow(new Date(coupon.createdAt))}{' '}
                            ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/coupons/${coupon.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCouponToDelete(coupon.id);
                          setDeleteDialogOpen(true);
                        }}
                        disabled={coupon._count.orders > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                couponToDelete && handleDeleteCoupon(couponToDelete)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
