'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface BlogTag {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export default function BlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blog/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingTag
        ? `/api/admin/blog/tags/${editingTag.id}`
        : '/api/admin/blog/tags';
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDialogOpen(false);
        resetForm();
        fetchTags();
      }
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      nameEn: tag.nameEn || '',
      slug: tag.slug,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const response = await fetch(`/api/admin/blog/tags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTags();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', nameEn: '', slug: '' });
    setEditingTag(null);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Tags</h1>
          <p className="text-muted-foreground">
            Manage tags for better content organization
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
                <DialogDescription>
                  Create a new tag for organizing blog posts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2" dir="rtl">
                  <Label htmlFor="name">שם התג (Hebrew) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: generateSlug(name),
                      });
                    }}
                    placeholder="למשל: תכשיטי כסף"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">Tag Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="e.g., Silver Jewelry"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="silver-jewelry"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTag ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Tags</CardTitle>
          <CardDescription>{tags.length} tags total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name (Hebrew)</TableHead>
                  <TableHead>Name (English)</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No tags found. Create your first tag!
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {tag.name}
                        </div>
                      </TableCell>
                      <TableCell>{tag.nameEn || '-'}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {tag.slug}
                      </TableCell>
                      <TableCell>{tag._count.posts}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(tag)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tag.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
