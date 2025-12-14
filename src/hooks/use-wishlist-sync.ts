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
        // Check if there are guest items to sync
        const localItems = useWishlistStore.getState().items;

        if (localItems.length > 0) {
          // Has guest items - sync with server
          await syncWithServer();
        } else {
          // No guest items - just load from server
          await loadFromServer();
        }

        hasSynced.current = true;
      }

      // User logged out - reset sync flag
      if (!session?.user && hasSynced.current) {
        hasSynced.current = false;
      }
    };

    handleSync();
  }, [session?.user, status, syncWithServer, loadFromServer]);
}
