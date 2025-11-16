'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Search, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  readTime: number;
  views: number;
  featured: boolean;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
  tags: Array<{
    tag: {
      name: string;
      slug: string;
    };
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      });
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (search) params.append('search', search);

      const response = await fetch(`/api/blog/posts?${params}`);
      const data = await response.json();

      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent/10 to-background py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              בלוג Forge & Steel
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              מדריכים, טיפים ועדכונים על תכשיטי גברים מעולמות הכסף והזהב
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="חפש מאמרים..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pr-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 space-y-6 hidden lg:block">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">קטגוריות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={!selectedCategory ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                  }}
                >
                  הכל
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? 'default' : 'ghost'
                    }
                    className="w-full justify-between"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setPage(1);
                    }}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category._count.posts}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Back to Store */}
            <Card>
              <CardContent className="pt-6">
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    חזרה לחנות
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Blog Posts Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">טוען...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">לא נמצאו מאמרים</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                        {post.featuredImage && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {post.category.name}
                            </Badge>
                            {post.featured && (
                              <Badge variant="default">מומלץ</Badge>
                            )}
                          </div>
                          <CardTitle className="line-clamp-2 text-xl">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {post.excerpt && (
                            <p className="text-muted-foreground line-clamp-3 text-sm">
                              {post.excerpt}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.publishedAt).toLocaleDateString(
                              'he-IL'
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime} דקות קריאה
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      הקודם
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      עמוד {page} מתוך {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      הבא
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
