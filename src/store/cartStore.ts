import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductColor } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, color: ProductColor, size: number, qty?: number) => void;
  removeItem: (productId: string, colorName: string, size: number) => void;
  updateQuantity: (productId: string, colorName: string, size: number, quantity: number) => void;
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

      addItem: (product, color, size, qty = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product.id === product.id &&
              i.selectedColor.name === color.name &&
              i.selectedSize === size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id &&
                  i.selectedColor.name === color.name &&
                  i.selectedSize === size
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, selectedColor: color, selectedSize: size, quantity: qty },
            ],
          };
        });
      },

      removeItem: (productId, colorName, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                i.selectedColor.name === colorName &&
                i.selectedSize === size
              )
          ),
        }));
      },

      updateQuantity: (productId, colorName, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorName, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId &&
              i.selectedColor.name === colorName &&
              i.selectedSize === size
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'nike-cart-v2',
      // Zustand v5 compatible persist config
      partialize: (state) => ({ items: state.items }),
    }
  )
);
