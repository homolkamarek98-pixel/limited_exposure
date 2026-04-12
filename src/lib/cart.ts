"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  editionId: string;
  photoTitle: string;
  photographerName: string;
  imageUrl: string;
  price: number; // v haléřích
  tier: "RISING_TALENT" | "SIGNATURE";
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (editionId: string) => void;
  clearCart: () => void;
  totalAmount: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.editionId === item.editionId);
          if (exists) return state; // každá edice jen jednou
          return { items: [...state.items, item] };
        }),

      removeItem: (editionId) =>
        set((state) => ({
          items: state.items.filter((i) => i.editionId !== editionId),
        })),

      clearCart: () => set({ items: [] }),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.price, 0),
    }),
    { name: "le-cart" }
  )
);
