'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Eye, ArrowRight, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  readTime: number;
  views: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    image: string;
  };
  tags: Array<{
    tag: {
      name: string;
      slug: string;
    };
  }>;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${slug}`);

      if (!response.ok) {
        router.push('/blog');
        return;
      }

      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>טוען...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <article className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent/10 to-background py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לבלוג
            </Button>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href={`/blog?category=${post.category.slug}`}>
                <Badge variant="secondary">{post.category.name}</Badge>
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('he-IL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} דקות קריאה
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views.toLocaleString('he-IL')} צפיות
              </div>
              {post.author.name && (
                <div className="flex items-center gap-2">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>מאת {post.author.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div
            className="whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, '<br />'),
            }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">תגיות:</span>
              {post.tags.map(({ tag }) => (
                <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
                  <Badge variant="outline" className="hover:bg-accent">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Author Bio */}
        {post.author && (
          <>
            <Separator className="my-8" />
            <div className="flex items-center gap-4 p-6 bg-accent/10 rounded-lg">
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-lg">על הכותב</p>
                <p className="text-muted-foreground">{post.author.name}</p>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="mt-12">
          <Link href="/blog">
            <Button variant="outline" size="lg" className="w-full md:w-auto">
              <ArrowRight className="ml-2 h-4 w-4" />
              עוד מאמרים בבלוג
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
