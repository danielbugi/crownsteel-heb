// src/store/wishlist-store.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface WishlistStore {
  // State
  items: string[]; // Array of product IDs
  isLoading: boolean;
  isOpen: boolean;

  // Actions
  addItem: (productId: string, isAuthenticated: boolean) => Promise<void>;
  removeItem: (productId: string, isAuthenticated: boolean) => Promise<void>;
  toggleItem: (productId: string, isAuthenticated: boolean) => Promise<void>;

  // Getters
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;

  // Sync & Management
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  clearWishlist: () => void;

  // Wishlist UI controls
  toggleWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const GUEST_LIMIT = 20;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      isLoading: false,
      isOpen: false,

      // Add item to wishlist
      addItem: async (productId: string, isAuthenticated: boolean) => {
        console.log('🛍️ Adding to wishlist:', { productId, isAuthenticated });

        const currentItems = get().items;

        // Check if already in wishlist
        if (currentItems.includes(productId)) {
          toast.error('Already in your favorites');
          return;
        }

        // Guest user - check limit
        if (!isAuthenticated && currentItems.length >= GUEST_LIMIT) {
          toast.error(
            `Wishlist limit reached! Sign in to save unlimited favorites`,
            { duration: 4000 }
          );
          return;
        }

        // Optimistic update (update UI immediately)
        set({ items: [...currentItems, productId] });
        toast.success('Added to favorites ❤️');

        // If authenticated, save to server
        if (isAuthenticated) {
          try {
            console.log('🌐 Sending to server...');
            const response = await fetch('/api/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId }),
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
              const errorData = await response.text();
              console.log('❌ Error response:', errorData);

              // Revert optimistic update on error
              set({ items: currentItems });

              // בדוק אם זה session שתוקף או foreign key error
              try {
                const errorJson = JSON.parse(errorData);
                if (errorJson.code === 'STALE_SESSION') {
                  toast.error('Please sign in again to save favorites', {
                    duration: 5000,
                  });
                  // יכול להוסיף כאן redirect לדף התחברות
                  return;
                }
              } catch {
                // אם זה לא JSON, בדוק אם זה foreign key error
                if (
                  errorData.includes('foreign key constraint') ||
                  errorData.includes('wishlists_userId_fkey')
                ) {
                  console.log(
                    '🔑 Foreign key constraint - treating as stale session'
                  );
                  toast.error('Please sign in again to save favorites', {
                    duration: 5000,
                  });
                  return;
                }
              }

              if (response.status === 401) {
                toast.error('Please sign in to save favorites');
              } else {
                toast.error('Failed to add to favorites');
              }
            } else {
              console.log('✅ Successfully added to server');
            }
          } catch (error) {
            console.error('💥 Error adding to wishlist:', error);
            // Revert optimistic update
            set({ items: currentItems });
            toast.error('Failed to add to favorites');
          }
        } else {
          // Guest user - show prompt at 18+ items
          if (currentItems.length >= 18) {
            toast.success(
              `${GUEST_LIMIT - currentItems.length - 1} spots left! Sign in to save unlimited favorites`,
              { duration: 4000, icon: '💡' }
            );
          }
        }
      },

      // Remove item from wishlist
      removeItem: async (productId: string, isAuthenticated: boolean) => {
        const currentItems = get().items;

        // Check if in wishlist
        if (!currentItems.includes(productId)) {
          return;
        }

        // Optimistic update
        set({ items: currentItems.filter((id) => id !== productId) });
        toast.success('Removed from favorites');

        // If authenticated, remove from server
        if (isAuthenticated) {
          try {
            const response = await fetch(`/api/wishlist/${productId}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              // Revert optimistic update on error
              set({ items: currentItems });
              toast.error('Failed to remove from favorites');
            }
          } catch (error) {
            console.error('Error removing from wishlist:', error);
            // Revert optimistic update
            set({ items: currentItems });
            toast.error('Failed to remove from favorites');
          }
        }
      },

      // Toggle item (add if not in wishlist, remove if in wishlist)
      toggleItem: async (productId: string, isAuthenticated: boolean) => {
        const isInWishlist = get().isInWishlist(productId);

        if (isInWishlist) {
          await get().removeItem(productId, isAuthenticated);
        } else {
          await get().addItem(productId, isAuthenticated);
        }
      },

      // Check if product is in wishlist
      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },

      // Get total item count
      getItemCount: () => {
        return get().items.length;
      },

      // Sync guest wishlist with server (called on login)
      syncWithServer: async () => {
        const localItems = get().items;

        // No items to sync
        if (localItems.length === 0) {
          await get().loadFromServer();
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch('/api/wishlist/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: localItems }),
          });

          if (response.ok) {
            const { items } = await response.json();
            set({ items });

            // Show success message
            const addedCount = items.length - localItems.length;
            if (addedCount > 0) {
              toast.success(
                `Wishlist synced! ${addedCount} new items from your account`,
                { duration: 4000 }
              );
            } else {
              toast.success('Wishlist synced successfully!');
            }
          } else {
            throw new Error('Failed to sync');
          }
        } catch (error) {
          console.error('Error syncing wishlist:', error);
          toast.error('Failed to sync wishlist');
        } finally {
          set({ isLoading: false });
        }
      },

      // Load wishlist from server (for authenticated users)
      loadFromServer: async () => {
        set({ isLoading: true });

        try {
          const response = await fetch('/api/wishlist');

          if (response.ok) {
            const { items } = await response.json();
            // Extract product IDs from wishlist items
            const productIds = items.map(
              (item: { productId: string }) => item.productId
            );
            set({ items: productIds });
          } else if (response.status === 401) {
            // Not authenticated - keep local items
            console.log('Not authenticated, keeping local wishlist');
          } else {
            throw new Error('Failed to load wishlist');
          }
        } catch (error) {
          console.error('Error loading wishlist:', error);
          // Keep local items on error
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear all wishlist items
      clearWishlist: () => {
        set({ items: [] });
      },

      toggleWishlist: () => {
        set({ isOpen: !get().isOpen });
      },

      closeWishlist: () => {
        set({ isOpen: false });
      },

      openWishlist: () => {
        set({ isOpen: true });
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist items for guests
      partialize: (state) => ({ items: state.items }),
    }
  )
);
