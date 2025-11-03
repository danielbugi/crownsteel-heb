// src/app/admin/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { AdminPageHeader } from '@/components/ui/page-header';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Description is required'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  taxRate: z.string().min(1, 'Tax rate is required'),

  // Email Settings
  smtpFromEmail: z.string().email('Invalid email'),
  smtpReplyToEmail: z
    .string()
    .email('Invalid email')
    .optional()
    .or(z.literal('')),
  emailNotificationsEnabled: z.boolean(),
  adminNotificationEmail: z.string().email('Invalid email'),

  // Shipping Settings
  shippingCost: z.string().min(1, 'Shipping cost is required'),
  freeShippingThreshold: z
    .string()
    .min(1, 'Free shipping threshold is required'),
  shippingDescription: z.string().min(1, 'Shipping description is required'),
  processingTime: z.string().min(1, 'Processing time is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      currency: 'ILS',
      currencySymbol: '₪',
      taxRate: '18',

      // Email Settings
      smtpFromEmail: '',
      smtpReplyToEmail: '',
      emailNotificationsEnabled: true,
      adminNotificationEmail: '',

      // Shipping Settings
      shippingCost: '20',
      freeShippingThreshold: '350',
      shippingDescription: 'Standard shipping within Israel',
      processingTime: '2-3 business days',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();

        if (data.settings) {
          form.reset({
            siteName: data.settings.siteName,
            siteDescription: data.settings.siteDescription,
            contactEmail: data.settings.contactEmail,
            contactPhone: data.settings.contactPhone,
            address: data.settings.address,
            currency: data.settings.currency,
            currencySymbol: data.settings.currencySymbol,
            taxRate: data.settings.taxRate.toString(),

            // Email Settings
            smtpFromEmail: data.settings.smtpFromEmail,
            smtpReplyToEmail: data.settings.smtpReplyToEmail || '',
            emailNotificationsEnabled: data.settings.emailNotificationsEnabled,
            adminNotificationEmail: data.settings.adminNotificationEmail,

            // Shipping Settings
            shippingCost: data.settings.shippingCost.toString(),
            freeShippingThreshold:
              data.settings.freeShippingThreshold.toString(),
            shippingDescription: data.settings.shippingDescription,
            processingTime: data.settings.processingTime,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [form]);
  const onSubmit = async (data: SettingsFormValues) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          taxRate: parseFloat(data.taxRate),
          shippingCost: parseFloat(data.shippingCost),
          freeShippingThreshold: parseFloat(data.freeShippingThreshold),
          smtpReplyToEmail: data.smtpReplyToEmail || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update settings');

      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Manage your store settings"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Forge & Steel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Premium Men's Jewelry"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@forgesteel.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+972-50-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Main Street, Tel Aviv, Israel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Currency & Tax */}
          <Card>
            <CardHeader>
              <CardTitle>Currency & Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Code</FormLabel>
                      <FormControl>
                        <Input placeholder="ILS" {...field} />
                      </FormControl>
                      <FormDescription>ISO currency code</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currencySymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="₪" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="18"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter tax rate as percentage (e.g., 18 for 18%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="smtpFromEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="contact@forgesteel.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Email address for outgoing emails
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpReplyToEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reply-To Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="support@forgesteel.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Email for customer replies
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="adminNotificationEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Notification Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@forgesteel.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Email to receive order notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailNotificationsEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Email Notifications
                      </FormLabel>
                      <FormDescription>
                        Enable automatic email notifications for orders
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Shipping Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost (₪)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Standard shipping cost</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="freeShippingThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Shipping Threshold (₪)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="350"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum order for free shipping
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Standard shipping within Israel"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Description shown to customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="processingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing Time</FormLabel>
                    <FormControl>
                      <Input placeholder="2-3 business days" {...field} />
                    </FormControl>
                    <FormDescription>
                      Order processing time description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
