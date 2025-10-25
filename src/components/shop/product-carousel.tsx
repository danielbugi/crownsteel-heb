'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loading?: boolean;
  error?: string | null;
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  autoPlay = false,
  autoPlayInterval = 4000,
  loading = false,
  error = null,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Use refs to avoid re-renders
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || isDragging || !canScrollRight) return;

    autoPlayTimerRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
        // Reset to beginning when reached end
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
  }, [autoPlay, autoPlayInterval, isHovered, isDragging, canScrollRight]);

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
  }, []);

  const handleMouseLeaveCarousel = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return; // Only work when no input is focused
      
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
            container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canScrollLeft, canScrollRight]);

  // Check scroll position
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Check on resize as well
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [products, checkScroll]);

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // Start drag
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

    // Disable smooth scrolling during drag
    container.style.scrollBehavior = 'auto';
  }, []);

  // During drag
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const deltaX = startXRef.current - clientX;

    // Mark as dragged if moved more than 3px
    if (!hasDraggedRef.current && Math.abs(deltaX) > 3) {
      hasDraggedRef.current = true;
    }

    // Calculate velocity for momentum
    const now = Date.now();
    const timeDelta = now - lastTimeRef.current;
    if (timeDelta > 0) {
      const positionDelta = clientX - lastXRef.current;
      velocityRef.current = positionDelta / timeDelta;
    }
    lastXRef.current = clientX;
    lastTimeRef.current = now;

    // Update scroll position
    container.scrollLeft = scrollLeftRef.current + deltaX;
  }, []);

  // End drag
  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    const container = scrollContainerRef.current;
    if (container) {
      // Apply momentum if velocity is significant
      if (Math.abs(velocityRef.current) > 0.5) {
        const momentum = velocityRef.current * 300; // Adjust multiplier for desired effect
        const targetScroll = container.scrollLeft - momentum;

        container.style.scrollBehavior = 'smooth';
        container.scrollLeft = targetScroll;
      } else {
        container.style.scrollBehavior = 'smooth';
      }
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    // Small delay before allowing clicks again
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only prevent drag on actual clickable buttons and input elements
      const target = e.target as HTMLElement;
      
      // More permissive approach - only block on specific interactive elements
      const isClickableElement = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        // Only block links that have actual href (not wrapper links)
        (target.tagName === 'A' && target.getAttribute('href') && target.textContent?.trim()) ||
        // Check if it's inside a button with specific click handlers
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea');

      // Allow drag from most areas, including product cards
      if (!isClickableElement) {
        e.preventDefault();
        handleDragStart(e.clientX);
      }
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

  const handleMouseLeave = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // For touch, be even more permissive since drag scrolling is expected
        const target = e.target as HTMLElement;
        
        // Only prevent on actual buttons and inputs
        const isFormElement = 
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea');
        
        if (!isFormElement) {
          handleDragStart(e.touches[0].clientX);
        }
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

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="px-4 mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <div className="h-8 bg-muted rounded-md w-48 mb-2 animate-pulse"></div>
              {subtitle && <div className="h-6 bg-muted rounded-md w-32 animate-pulse"></div>}
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex-none w-[280px] md:w-[320px] lg:w-[360px]">
                <div className="bg-muted rounded-lg h-80 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="px-4 mx-auto text-center">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-destructive font-medium">Failed to load products</p>
            <p className="text-muted-foreground text-sm mt-1">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="px-4 mx-auto text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <p className="text-muted-foreground">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-2xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex gap-2">
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

        {/* Carousel Container */}
        <div 
          className="relative -mx-4 md:mx-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeaveCarousel}
        >
          {/* Gradient Overlays */}
          <div 
            className={cn(
              "absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
              canScrollLeft ? "opacity-100" : "opacity-0"
            )}
          />
          <div 
            className={cn(
              "absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300",
              canScrollRight ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className={cn(
              'flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-0',
              isDragging ? 'cursor-grabbing' : 'cursor-grab',
              'select-none' // Prevent text selection during drag
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-none w-[280px] md:w-[320px] lg:w-[360px] transition-transform duration-200 hover:scale-[1.02]"
                style={{
                  pointerEvents: hasDraggedRef.current ? 'none' : 'auto',
                  animationDelay: `${index * 100}ms`,
                }}
                // Add drag handlers to individual cards as backup
                onMouseDown={(e) => {
                  const target = e.target as HTMLElement;
                  const isClickableElement = 
                    target.tagName === 'BUTTON' ||
                    target.tagName === 'INPUT' ||
                    target.tagName === 'A' ||
                    target.closest('button') ||
                    target.closest('input') ||
                    target.closest('a[href]');
                  
                  if (!isClickableElement) {
                    e.preventDefault();
                    handleDragStart(e.clientX);
                  }
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    const target = e.target as HTMLElement;
                    const isFormElement = 
                      target.tagName === 'BUTTON' ||
                      target.tagName === 'INPUT' ||
                      target.closest('button') ||
                      target.closest('input');
                    
                    if (!isFormElement) {
                      handleDragStart(e.touches[0].clientX);
                    }
                  }
                }}
              >
                <div
                  onClick={(e) => {
                    // Prevent navigation if we just dragged
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

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (scrollContainerRef.current?.scrollLeft || 0) / 
                  Math.max(1, (scrollContainerRef.current?.scrollWidth || 1) - (scrollContainerRef.current?.clientWidth || 0)) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
