// src/components/admin/category-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/admin/image-uploader';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
  };
  categoryId?: string;
}

export function CategoryForm({ initialData, categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fields
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );

  // Image
  const [image, setImage] = useState<string>(initialData?.image || '');

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!categoryId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('שם הקטגוריה הוא שדה חובה');
      return;
    }

    if (!slug) {
      toast.error('Slug הוא שדה חובה');
      return;
    }

    setIsLoading(true);

    try {
      const url = categoryId
        ? `/api/admin/categories/${categoryId}`
        : '/api/admin/categories';

      const payload = {
        name,
        slug,
        description,
        image: image || null,
      };

      const response = await fetch(url, {
        method: categoryId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      toast.success(
        categoryId ? 'הקטגוריה עודכנה בהצלחה' : 'הקטגוריה נוצרה בהצלחה'
      );
      router.push('/admin/categories');
      router.refresh();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'משהו השתבש');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>{categoryId ? 'ערוך קטגוריה' : 'צור קטגוריה'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="name">
                  שם הקטגוריה <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="טבעות"
                  required
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">תיאור</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="טבעות בעבודת יד איכותיות לכל אירוע"
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="rings"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly name (auto-generated from category name)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Image Card */}
        <Card>
          <CardHeader>
            <CardTitle>Category Image (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload an image to represent this category
              </p>
              <ImageUploader
                value={image}
                onChange={setImage}
                onRemove={() => setImage('')}
                disabled={isLoading}
                label="Upload Category Image"
                folder="categories"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : categoryId
                ? 'Update Category'
                : 'Create Category'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
