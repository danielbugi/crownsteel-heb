'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
  prioritizeFirstImages?: boolean; // Optimize LCP for first visible products
}

export function ProductCarousel({
  products,
  title,
  subtitle,
  autoPlay = false,
  autoPlayInterval = 4000,
  loading = false,
  error = null,
  prioritizeFirstImages = false,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRTL = false;
  const [rtlScrollType, setRtlScrollType] = useState<
    'normal' | 'negative' | 'reverse'
  >('normal');

  // Set initial state - left disabled (at start), right enabled if we have scrollable content
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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

  // Detect RTL scroll behavior on mount
  const detectRTLScrollBehavior = useCallback(() => {
    if (!isRTL) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    // Create a temporary scroll to detect behavior
    const originalScrollLeft = container.scrollLeft;
    container.scrollLeft = 1;

    setTimeout(() => {
      const testScrollLeft = container.scrollLeft;

      if (testScrollLeft < 0) {
        setRtlScrollType('negative'); // Firefox
      } else if (testScrollLeft === 1) {
        setRtlScrollType('normal'); // Chrome/Safari
      } else {
        setRtlScrollType('reverse'); // IE/Edge
      }

      // Restore original position
      container.scrollLeft = originalScrollLeft;
    }, 10);
  }, [isRTL]);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Calculate scroll amount based on single card width + gap
      // Boutique style - larger cards: 320px (mobile), 400px (md), 420px (lg), 450px (xl)
      // Gap: 32px (gap-8) for luxury spacing
      const cardWidth =
        window.innerWidth >= 1280
          ? 450 // xl
          : window.innerWidth >= 1024
            ? 420 // lg
            : window.innerWidth >= 768
              ? 400 // md
              : 320; // mobile
      const gap = 32; // gap-8 in Tailwind
      const scrollAmount = cardWidth + gap;
      let increment: number;

      // In RTL, we need to reverse the scroll direction based on browser behavior
      if (isRTL) {
        if (rtlScrollType === 'normal') {
          // Chrome/Safari: scrollLeft increases when scrolling left visually
          // To scroll visually right (previous content), decrease scrollLeft
          // To scroll visually left (next content), increase scrollLeft
          increment = direction === 'left' ? scrollAmount : -scrollAmount;
        } else if (rtlScrollType === 'negative') {
          // Firefox: scrollLeft is negative
          // To scroll visually right, increase scrollLeft (toward 0)
          // To scroll visually left, decrease scrollLeft (more negative)
          increment = direction === 'left' ? -scrollAmount : scrollAmount;
        } else {
          // reverse: IE/Edge
          // To scroll visually right, decrease scrollLeft
          // To scroll visually left, increase scrollLeft
          increment = direction === 'left' ? scrollAmount : -scrollAmount;
        }
      } else {
        // LTR: standard behavior
        increment = direction === 'left' ? -scrollAmount : scrollAmount;
      }

      const target = container.scrollLeft + increment;
      container.scrollTo({ left: target, behavior: 'smooth' });
      setTimeout(checkScroll, 400);
    },
    [isRTL, rtlScrollType]
  );

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || isDragging) return;

    autoPlayTimerRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (isRTL) {
        // In RTL, start from maxScrollLeft and go towards 0
        if (scrollLeft <= 1) {
          // Reset to end when reached beginning
          container.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
          scroll('left'); // Move forward through content (visually left in RTL)
        }
      } else {
        // Normal LTR behavior
        if (scrollLeft >= maxScrollLeft - 1) {
          // Reset to beginning when reached end
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right'); // Move forward through content
        }
      }
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isHovered, isDragging, isRTL, scroll]);

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
            container.scrollTo({
              left: container.scrollWidth,
              behavior: 'smooth',
            });
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canScrollLeft, canScrollRight, scroll]);

  // Check scroll position and update arrow states
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;
    const tolerance = 5; // widen slightly to handle smooth scrolling
    let atStart = false;
    let atEnd = false;

    if (isRTL) {
      if (rtlScrollType === 'normal') {
        atStart = Math.abs(scrollLeft) <= tolerance;
        atEnd = Math.abs(scrollLeft - maxScrollLeft) <= tolerance;
      } else if (rtlScrollType === 'negative') {
        const absLeft = Math.abs(scrollLeft);
        atStart = absLeft >= maxScrollLeft - tolerance;
        atEnd = absLeft <= tolerance;
      } else if (rtlScrollType === 'reverse') {
        atStart = scrollLeft >= maxScrollLeft - tolerance;
        atEnd = scrollLeft <= tolerance;
      }
    } else {
      atStart = scrollLeft <= tolerance;
      atEnd = scrollLeft >= maxScrollLeft - tolerance;
    }

    // Round logic ensures tiny scroll jitter won't flip states incorrectly
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }, [isRTL, rtlScrollType]);

  useEffect(() => {
    // Initial check with a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      detectRTLScrollBehavior();
      checkScroll();

      // Scroll to first product (skip empty slot) on mobile
      const container = scrollContainerRef.current;
      if (container && window.innerWidth < 768) {
        const cardWidth = 320; // mobile card width
        container.scrollLeft = cardWidth;
      }
    }, 100);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);

      // Check on resize as well
      const resizeObserver = new ResizeObserver(() => {
        // Add a small delay for resize events too
        setTimeout(checkScroll, 100);
      });
      resizeObserver.observe(container);

      return () => {
        clearTimeout(timer);
        container.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, [products, checkScroll, detectRTLScrollBehavior]);

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
        (target.tagName === 'A' &&
          target.getAttribute('href') &&
          target.textContent?.trim()) ||
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
        <div className=" mx-auto">
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

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className=" mx-auto text-center">
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

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className=" mx-auto text-center">
          <div className="bg-muted/50 rounded-lg p-8">
            <p className="text-muted-foreground">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 overflow-hidden bg-white-pure">
      <div className="mx-auto">
        {/* Grid Layout: Title Section (1/6) + Carousel (5/6) */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-center"> */}
        {/* Title Section - Left Side */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-base sm:text-lg font-normal text-gray-900 mb-2">
            {title}
          </h2>
        </div>

        {/* Carousel Section - Right Side */}
        <div className="lg:col-span-5">
          {/* Carousel Container */}
          <div
            className=" relative -mx-4 md:mx-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeaveCarousel}
          >
            {/* Scrollable Products with Navigation */}
            <div className="relative">
              {/* Navigation Arrows - Positioned relative to products container */}
              {/* <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={cn(
                    'transition-all duration-200 bg-background/60 backdrop-blur-sm shadow-lg',
                    'hover:scale-105 hover:shadow-xl hover:bg-background h-16 w-12',
                    canScrollLeft
                      ? 'hover:bg-primary/50 hover:text-primary-foreground border-none opacity-100'
                      : 'opacity-0 pointer-events-none',
                    'hidden md:flex' // Only show on desktop
                  )}
                >
                  <ChevronLeft className="size-8" />
                </Button>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={cn(
                    'transition-all duration-200 bg-background/60 backdrop-blur-sm shadow-lg',
                    'hover:scale-105 hover:shadow-xl hover:bg-background h-16 w-12',
                    canScrollRight
                      ? 'hover:bg-primary/50 hover:text-primary-foreground border-none opacity-100'
                      : 'opacity-0 pointer-events-none',
                    'hidden md:flex' // Only show on desktop
                  )}
                >
                  <ChevronRight className="size-8" />
                </Button>
              </div> */}

              {/* Scrollable Products */}
              <div
                ref={scrollContainerRef}
                className={cn(
                  'flex gap-0 overflow-x-auto scrollbar-hide px-4 md:px-0 border-t border-b border-gray-200',
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
                {/* Empty slot at the start */}
                <div className="flex-none w-[320px] md:w-[400px] lg:w-[420px] xl:w-[450px]" />

                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-none w-[320px] md:w-[400px] lg:w-[420px] xl:w-[450px] transition-transform duration-200 "
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
                      <ProductCard
                        product={product}
                        viewMode="carousel"
                        priority={prioritizeFirstImages && index < 3}
                      />
                    </div>
                  </div>
                ))}

                {/* Empty slot at the end */}
                <div className="flex-none w-[320px] md:w-[400px] lg:w-[420px] xl:w-[450px]" />
              </div>
            </div>
          </div>

          {/* Mobile Scroll Indicator */}
          <div className="flex justify-center mt-6 md:hidden">
            <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    ((scrollContainerRef.current?.scrollLeft || 0) /
                      Math.max(
                        1,
                        (scrollContainerRef.current?.scrollWidth || 1) -
                          (scrollContainerRef.current?.clientWidth || 0)
                      )) *
                      100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
        {/* </div> */}
        <div className="mt-10 flex justify-center">
          <Link href="/shop">
            <Button
              size="xlg"
              variant="outline"
              className="uppercase w-full lg:w-fit group block text-xs tracking-widest"
            >
              Upgrade Your Look
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
