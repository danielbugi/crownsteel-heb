'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  inventory?: number;
  createdAt?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductCarouselOptimizedProps {
  products: Product[];
  title: string;
  subtitle?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loading?: boolean;
  error?: string | null;
  showAutoPlayControl?: boolean;
  itemsPerView?: { mobile: number; tablet: number; desktop: number };
  gap?: number;
}

export function ProductCarouselOptimized({
  products,
  title,
  subtitle,
  autoPlay = false,
  autoPlayInterval = 4000,
  loading = false,
  error = null,
  showAutoPlayControl = false,
  itemsPerView = { mobile: 1.2, tablet: 2.5, desktop: 3.5 },
  gap = 24,
}: ProductCarouselOptimizedProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(autoPlay);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Use refs to avoid re-renders
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized card width calculation
  const cardWidths = useMemo(() => {
    const containerWidth = 1200; // Approximate container width
    return {
      mobile: (containerWidth * 0.9) / itemsPerView.mobile - gap,
      tablet: (containerWidth * 0.95) / itemsPerView.tablet - gap,
      desktop: containerWidth / itemsPerView.desktop - gap,
    };
  }, [itemsPerView, gap]);

  // Check scroll position with progress calculation
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScroll - 10);
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  }, []);

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll, { passive: true });
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [products, checkScroll]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayEnabled || isHovered || isDragging || !canScrollRight) return;

    autoPlayTimerRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth - 10
      ) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroll('right');
      }
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [
    autoPlayEnabled,
    autoPlayInterval,
    isHovered,
    isDragging,
    canScrollRight,
  ]);

  // Scroll functions with improved easing
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            container.scrollLeft + scrollAmount
          );

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // Enhanced drag functionality
  const handleDragStart = useCallback((clientX: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    startXRef.current = clientX;
    scrollLeftRef.current = container.scrollLeft;
    hasDraggedRef.current = false;
    velocityRef.current = 0;
    lastXRef.current = clientX;
    lastTimeRef.current = Date.now();

    setIsDragging(true);
    container.style.scrollBehavior = 'auto';
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const deltaX = startXRef.current - clientX;

    if (!hasDraggedRef.current && Math.abs(deltaX) > 3) {
      hasDraggedRef.current = true;
    }

    // Enhanced velocity calculation
    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    if (timeDelta > 0) {
      const positionDelta = clientX - lastXRef.current;
      velocityRef.current = positionDelta / timeDelta;
    }
    lastXRef.current = clientX;
    lastTimeRef.current = now;

    container.scrollLeft = scrollLeftRef.current + deltaX;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    const container = scrollContainerRef.current;
    if (container) {
      // Enhanced momentum with bounds checking
      if (Math.abs(velocityRef.current) > 0.5) {
        const momentum = velocityRef.current * 400;
        const targetScroll = Math.max(
          0,
          Math.min(
            container.scrollWidth - container.clientWidth,
            container.scrollLeft - momentum
          )
        );

        container.style.scrollBehavior = 'smooth';
        container.scrollLeft = targetScroll;
      } else {
        container.style.scrollBehavior = 'smooth';
      }
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        return;
      }
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      handleDragMove(e.clientX);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX);
      }
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        handleDragMove(e.touches[0].clientX);
      }
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Prevent click when dragging
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (canScrollLeft) scroll('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (canScrollRight) scroll('right');
          break;
        case 'Home':
          e.preventDefault();
          scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          const container = scrollContainerRef.current;
          if (container) {
            container.scrollTo({
              left: container.scrollWidth,
              behavior: 'smooth',
            });
          }
          break;
        case ' ':
          if (showAutoPlayControl) {
            e.preventDefault();
            setAutoPlayEnabled((prev) => !prev);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canScrollLeft, canScrollRight, showAutoPlayControl]);

  // Loading state
  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <div className="h-8 bg-muted rounded-md w-48 mb-2 animate-pulse"></div>
              {subtitle && (
                <div className="h-6 bg-muted rounded-md w-32 animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-none w-[280px] md:w-[320px] lg:w-[360px]"
              >
                <div className="bg-muted rounded-lg h-80 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="px-4 mx-auto max-w-7xl text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-destructive font-medium">
              Failed to load products
            </p>
            <p className="text-muted-foreground text-sm mt-1">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="px-4 mx-auto max-w-7xl text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <p className="text-muted-foreground">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Auto-play control */}
            {showAutoPlayControl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoPlayEnabled((prev) => !prev)}
                className="gap-2"
              >
                {autoPlayEnabled ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  'rounded-full transition-all duration-200 border-2',
                  'hover:scale-105 hover:shadow-md',
                  canScrollLeft
                    ? 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                    : 'opacity-40 cursor-not-allowed'
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  'rounded-full transition-all duration-200 border-2',
                  'hover:scale-105 hover:shadow-md',
                  canScrollRight
                    ? 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                    : 'opacity-40 cursor-not-allowed'
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative -mx-4 md:mx-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gradient Overlays */}
          <div
            className={cn(
              'absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300',
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            )}
          />
          <div
            className={cn(
              'absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300',
              canScrollRight ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className={cn(
              'flex overflow-x-auto scrollbar-hide px-4 md:px-0',
              isDragging ? 'cursor-grabbing' : 'cursor-grab',
              'select-none'
            )}
            style={{
              gap: `${gap}px`,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-none transition-transform duration-200 hover:scale-[1.02]"
                style={{
                  width: `${cardWidths.mobile}px`,
                  pointerEvents: hasDraggedRef.current ? 'none' : 'auto',
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  onClick={(e) => {
                    if (hasDraggedRef.current) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, scrollProgress)}%` }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-4 mt-6 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
