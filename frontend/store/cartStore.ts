import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number; image_url?: string | null; stock: number }, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + quantity, product.stock);
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: newQty } : item
            ),
          });
        } else {
          const qty = Math.min(quantity, product.stock);
          if (qty > 0) {
            set({
              items: [...currentItems, { ...product, quantity: qty }],
            });
          }
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.id === productId) {
              const safeQty = Math.min(quantity, item.stock);
              return { ...item, quantity: safeQty };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
      },
    }),
    {
      name: 'technova-cart',
    }
  )
);

