import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null; // ADD THIS
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  addItemSilently: (
    item: Omit<CartItem, 'quantity'> & { quantity?: number }
  ) => void;
  removeItem: (productId: string, variantId?: string | null) => void; // UPDATE THIS
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string | null
  ) => void; // UPDATE THIS
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const items = get().items;
        // Check for existing item with same product AND variant
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
            isOpen: true, // Open cart when item is added
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
            isOpen: true, // Open cart when item is added
          });
        }
      },
      addItemSilently: (item) => {
        const items = get().items;
        // Check for existing item with same product AND variant
        const existingItem = items.find(
          (i) =>
            i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
            // Don't open cart sidebar
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
            // Don't open cart sidebar
          });
        }
      },
      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          ),
        });
      },
      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
