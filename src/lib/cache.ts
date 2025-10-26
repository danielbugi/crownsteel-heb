// src/lib/cache.ts
// Simple in-memory cache for frequently accessed data

interface CacheItem {
  data: unknown;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 100; // Prevent memory leaks

  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    // Clear old entries if cache is getting too large
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      const oldestKey = entries[0]?.[0];
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache keys for common patterns
  keys = {
    products: (
      page: number,
      limit: number,
      category?: string,
      featured?: boolean
    ) => `products:${page}:${limit}:${category || 'all'}:${featured || 'all'}`,
    adminProducts: (
      page: number,
      limit: number,
      search?: string,
      categoryId?: string
    ) =>
      `admin_products:${page}:${limit}:${search || 'all'}:${categoryId || 'all'}`,
    categories: (lang: string) => `categories:${lang}`,
    productsByIds: (ids: string[]) => `products_by_ids:${ids.sort().join(',')}`,
  };
}

// Global cache instance
export const cache = new SimpleCache();

// Cache wrapper function for database queries
export function withCache<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlMinutes: number = 5
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Try to get from cache first
      const cached = cache.get<T>(key);
      if (cached) {
        resolve(cached);
        return;
      }

      // Execute query and cache result
      const result = await queryFn();
      cache.set(key, result, ttlMinutes);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
