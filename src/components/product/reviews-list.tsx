// src/components/product/reviews-list.tsx
'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}

interface ReviewsListProps {
  productId: string;
  refreshKey?: number;
}

export function ReviewsList({ productId, refreshKey }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/reviews?productId=${productId}&page=${page}&limit=10`
      );
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page, refreshKey]);

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'helpful' }),
      });

      if (response.ok) {
        const { review } = await response.json();
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, helpful: review.helpful } : r
          )
        );
        toast.success('תודה על המשוב שלך!');
      }
    } catch (error) {
      toast.error('נכשל לסמן כמועיל');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-secondary rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-secondary rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-4 bg-secondary rounded w-3/4"></div>
                <div className="h-3 bg-secondary rounded w-full"></div>
                <div className="h-3 bg-secondary rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">אין ביקורות עדיין</h3>
        <p className="text-muted-foreground">
          היה הראשון לתת ביקורת על המוצר הזה!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="border-border">
          <CardContent className="p-6">
            {/* User Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review.user.image} />
                  <AvatarFallback>
                    {review.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.user.name}</p>
                    {review.verified && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        רכישה מאומתת
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review Content */}
            {review.title && (
              <h4 className="font-semibold mb-2">{review.title}</h4>
            )}
            {review.comment && (
              <p className="text-muted-foreground mb-4">{review.comment}</p>
            )}

            {/* Helpful Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHelpful(review.id)}
                className="text-muted-foreground hover:text-primary"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                מועיל ({review.helpful})
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            הקודם
          </Button>
          <span className="flex items-center px-4">
            עמוד {page} מתוך {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            הבא
          </Button>
        </div>
      )}
    </div>
  );
}
