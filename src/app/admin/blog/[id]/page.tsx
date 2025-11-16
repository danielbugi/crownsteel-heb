'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Save, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  featuredImage?: string;
  images: string[];
  status: string;
  categoryId: string;
  featured: boolean;
  readTime?: number;
  tags: Array<{
    tag: {
      id: string;
    };
  }>;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
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
    if (params.id) {
      fetchPost(params.id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      setFetchingPost(true);
      const response = await fetch(`/api/admin/blog/posts/${id}`);

      if (!response.ok) {
        alert('Failed to load post');
        router.push('/admin/blog');
        return;
      }

      const post: BlogPost = await response.json();
      setFormData({
        title: post.title,
        titleEn: post.titleEn || '',
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        keywords: post.keywords || [],
        featuredImage: post.featuredImage || '',
        images: post.images || [],
        status: post.status,
        categoryId: post.categoryId,
        featured: post.featured,
        tags: post.tags.map((t) => t.tag.id),
        readTime: post.readTime || 5,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Error loading post');
      router.push('/admin/blog');
    } finally {
      setFetchingPost(false);
    }
  };

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
      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingPost) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">טוען...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ערוך פוסט בבלוג</h1>
          <p className="text-muted-foreground">
            עדכן את התוכן והפרטים של הפוסט
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/blog')}>
          ביטול
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>תוכן הפוסט</CardTitle>
            <CardDescription>מידע עיקרי על הפוסט</CardDescription>
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
            <CardTitle>הגדרות SEO</CardTitle>
            <CardDescription>אופטימיזציה למנועי חיפוש</CardDescription>
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
            <CardTitle>ארגון</CardTitle>
            <CardDescription>קטגוריה ותגיות</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">קטגוריה *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
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
              <Label htmlFor="featuredImage">תמונה ראשית - URL</Label>
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
                <Label htmlFor="featured">פוסט מומלץ</Label>
                <p className="text-sm text-muted-foreground">
                  הצג פוסט זה בעמוד הבית
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
            <CardTitle>פרסום</CardTitle>
            <CardDescription>סטטוס הפוסט</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">סטטוס</Label>
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
                  <SelectItem value="DRAFT">טיוטה</SelectItem>
                  <SelectItem value="PUBLISHED">פורסם</SelectItem>
                  <SelectItem value="ARCHIVED">בארכיון</SelectItem>
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
            ביטול
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              'שומר...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                עדכן פוסט
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
