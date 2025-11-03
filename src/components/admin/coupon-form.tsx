'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Code must be at least 3 characters')
      .max(20, 'Code must be less than 20 characters')
      .regex(
        /^[A-Z0-9_-]+$/,
        'Code can only contain uppercase letters, numbers, underscores, and hyphens'
      ),
    description: z.string().optional(),
    descriptionHe: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z
      .number()
      .min(0.01, 'Discount value must be greater than 0'),
    minPurchase: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    usageLimit: z.number().int().min(1).optional(),
    usagePerUser: z.number().int().min(1).optional(),
    validFrom: z.date(),
    validTo: z.date().optional(),
    active: z.boolean(),
    campaignType: z
      .enum([
        'NEWSLETTER_WELCOME',
        'FIRST_ORDER',
        'BLACK_FRIDAY',
        'HOLIDAY',
        'FLASH_SALE',
        'ABANDONED_CART',
        'BIRTHDAY',
        'REFERRAL',
        'CUSTOM',
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.validTo && data.validFrom > data.validTo) {
        return false;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['validTo'],
    }
  )
  .refine(
    (data) => {
      if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
        return false;
      }
      return true;
    },
    {
      message: 'Percentage discount cannot exceed 100%',
      path: ['discountValue'],
    }
  );

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormProps {
  initialData?: Partial<CouponFormData & { id: string }>;
  isEditing?: boolean;
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

export function CouponForm({
  initialData,
  isEditing = false,
}: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: initialData?.code || '',
      description: initialData?.description || '',
      descriptionHe: initialData?.descriptionHe || '',
      discountType: initialData?.discountType || 'PERCENTAGE',
      discountValue: initialData?.discountValue || 0,
      minPurchase: initialData?.minPurchase || 0,
      maxDiscount: initialData?.maxDiscount || 0,
      usageLimit: initialData?.usageLimit || 0,
      usagePerUser: initialData?.usagePerUser || 1,
      validFrom: initialData?.validFrom
        ? new Date(initialData.validFrom)
        : new Date(),
      validTo: initialData?.validTo ? new Date(initialData.validTo) : undefined,
      active: initialData?.active ?? true,
      campaignType: initialData?.campaignType || undefined,
    },
  });

  const discountType = form.watch('discountType');
  const discountValue = form.watch('discountValue');

  const onSubmit = async (data: CouponFormData) => {
    setLoading(true);
    try {
      const url = isEditing
        ? `/api/admin/coupons/${initialData?.id}`
        : '/api/admin/coupons';

      const method = isEditing ? 'PUT' : 'POST';

      // Convert 0 values back to undefined for optional fields
      const processedData = {
        ...data,
        code: data.code.toUpperCase(),
        minPurchase: data.minPurchase === 0 ? undefined : data.minPurchase,
        maxDiscount: data.maxDiscount === 0 ? undefined : data.maxDiscount,
        usageLimit: data.usageLimit === 0 ? undefined : data.usageLimit,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save coupon');
      }

      toast.success(
        isEditing
          ? 'Coupon updated successfully!'
          : 'Coupon created successfully!'
      );
      router.push('/admin/coupons');
      router.refresh();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save coupon'
      );
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue('code', result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Coupon' : 'Create Coupon'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Update coupon details'
              : 'Create a new discount coupon'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
              <TabsTrigger value="usage">Usage & Validity</TabsTrigger>
              <TabsTrigger value="campaign">Campaign</TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Code</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="SAVE20"
                                className="uppercase"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.value.toUpperCase())
                                }
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={generateRandomCode}
                              size="sm"
                            >
                              Generate
                            </Button>
                          </div>
                          <FormDescription>
                            Unique code customers will enter. Only uppercase
                            letters, numbers, underscores, and hyphens allowed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end">
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Active</FormLabel>
                          </div>
                          <FormDescription>
                            Only active coupons can be used by customers
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="20% off on all jewelry items"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description of the coupon offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionHe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Hebrew)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="20% הנחה על כל פריטי התכשיטים"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Hebrew description for bilingual support
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Discount Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">
                                Percentage
                              </SelectItem>
                              <SelectItem value="FIXED">
                                Fixed Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount Value{' '}
                            {discountType === 'PERCENTAGE' ? '(%)' : '(₪)'}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max={
                                discountType === 'PERCENTAGE'
                                  ? '100'
                                  : undefined
                              }
                              step={
                                discountType === 'PERCENTAGE' ? '1' : '0.01'
                              }
                              placeholder={
                                discountType === 'PERCENTAGE' ? '20' : '50.00'
                              }
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {discountType === 'PERCENTAGE'
                              ? 'Percentage off the total (1-100)'
                              : 'Fixed amount off in Shekels'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Preview */}
                  {discountValue > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Preview:</p>
                      <p className="text-sm text-muted-foreground">
                        Customers will get{' '}
                        <Badge variant="secondary">
                          {discountType === 'PERCENTAGE'
                            ? `${discountValue}% off`
                            : `₪${discountValue} off`}
                        </Badge>{' '}
                        their order
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Restrictions Tab */}
            <TabsContent value="restrictions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Restrictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minPurchase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Purchase (₪)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="100.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum order amount required to use this coupon
                            (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxDiscount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Discount (₪)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="500.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum discount amount (useful for percentage
                            coupons)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage & Validity Tab */}
            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="usageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of times this coupon can be used
                            (leave empty for unlimited)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usagePerUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage Per User</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseInt(e.target.value) : 1
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of times each user can use this
                            coupon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Validity Period</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="validFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid From</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? field.value.toISOString().slice(0, 16)
                                  : ''
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : new Date()
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            When this coupon becomes valid
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid Until (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? field.value.toISOString().slice(0, 16)
                                  : ''
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            When this coupon expires (leave empty for no expiry)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Campaign Tab */}
            <TabsContent value="campaign" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select campaign type (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campaignTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Tag this coupon with a campaign type for better
                          tracking and analytics
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Update' : 'Create'} Coupon
            </Button>
            <Link href="/admin/coupons">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
