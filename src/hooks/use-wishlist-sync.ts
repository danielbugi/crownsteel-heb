// src/hooks/use-wishlist-sync.ts

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useWishlistStore } from '@/store/wishlist-store';

export function useWishlistSync() {
  const { data: session, status } = useSession();
  const { syncWithServer, loadFromServer } = useWishlistStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    // Only run when authentication status is resolved
    if (status === 'loading') return;

    const handleSync = async () => {
      // User just logged in and hasn't synced yet
      if (session?.user && !hasSynced.current) {
        console.log('🔄 Syncing wishlist...');

        // Check if there are guest items to sync
        const localItems = useWishlistStore.getState().items;

        if (localItems.length > 0) {
          // Has guest items - sync with server
          console.log(`📦 Found ${localItems.length} guest items to sync`);
          await syncWithServer();
        } else {
          // No guest items - just load from server
          console.log('📥 Loading wishlist from server');
          await loadFromServer();
        }

        hasSynced.current = true;
        console.log('✅ Wishlist sync complete');
      }

      // User logged out - reset sync flag
      if (!session?.user && hasSynced.current) {
        console.log('👋 User logged out, reset sync flag');
        hasSynced.current = false;
      }
    };

    handleSync();
  }, [session?.user, status, syncWithServer, loadFromServer]);
}
