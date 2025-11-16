'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Save, Eye } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    featuredImage: '',
    images: [] as string[],
    status: 'DRAFT',
    categoryId: '',
    featured: false,
    tags: [] as string[],
    readTime: 5,
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/blog/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/blog/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
          <p className="text-muted-foreground">
            Write compelling content in Hebrew to boost SEO
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/blog')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Post Content</CardTitle>
            <CardDescription>Main blog post information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="title">כותרת (Hebrew) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="כותרת הפוסט בעברית"
                required
              />
            </div>

            <div className="space-y-2" dir="ltr">
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                placeholder="Post title in English (optional)"
              />
            </div>

            <div className="space-y-2" dir="ltr">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="post-url-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">תקציר</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="תקציר קצר של הפוסט"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">תוכן הפוסט *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="תוכן מלא של הפוסט בעברית..."
                rows={15}
                required
              />
              <p className="text-sm text-muted-foreground">
                Tip: Use markdown formatting for better content structure
              </p>
            </div>

            <div className="space-y-2" dir="ltr">
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    readTime: parseInt(e.target.value),
                  })
                }
                min="1"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>Optimize for search engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="כותרת SEO (60 תווים)"
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                placeholder="תיאור SEO (160 תווים)"
                maxLength={160}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">מילות מפתח</Label>
              <Input
                id="keywords"
                value={formData.keywords.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    keywords: e.target.value.split(',').map((k) => k.trim()),
                  })
                }
                placeholder="תכשיטים, גברים, כסף, זהב"
              />
              <p className="text-sm text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Organization */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Categorize and tag your post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured Post</Label>
                <p className="text-sm text-muted-foreground">
                  Show this post on the homepage
                </p>
              </div>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Set post status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              'Creating...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
