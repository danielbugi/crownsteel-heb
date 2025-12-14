// src/components/product/rating-summary.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RatingSummaryProps {
  productId: string;
  averageRating?: number;
  reviewCount?: number;
}

interface RatingDistribution {
  [key: number]: number;
}

export function RatingSummary({
  productId,
  averageRating = 0,
  reviewCount = 0,
}: RatingSummaryProps) {
  const [distribution, setDistribution] = useState<RatingDistribution>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  useEffect(() => {
    fetchRatingDistribution();
  }, [productId]);

  const fetchRatingDistribution = async () => {
    try {
      const response = await fetch(`/api/reviews/stats?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setDistribution(data.distribution);
      }
    } catch (error) {
      console.error('Error fetching rating distribution:', error);
    }
  };

  const getPercentage = (count: number) => {
    return reviewCount > 0 ? (count / reviewCount) * 100 : 0;
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress
                  value={getPercentage(distribution[rating] || 0)}
                  className="flex-1 h-2"
                />
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {distribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
