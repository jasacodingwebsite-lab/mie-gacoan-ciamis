"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { flyToCart } from "@/lib/fly-to-cart";

export type CartItem = {
  /** key unik = productId + level + note */
  key: string;
  id: string;
  name: string;
  image: string;
  price: number;
  /** null untuk non-mie */
  spicyLevel: number | null;
  qty: number;
  note: string;
};

export type AddToCartInput = {
  id: string;
  name: string;
  image: string;
  price: number;
  spicyLevel: number | null;
  qty?: number;
  note?: string;
  /** elemen trigger untuk animasi fly-to-cart */
  flyFrom?: HTMLElement | null;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (input: AddToCartInput) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  incrementQty: (key: string) => void;
  decrementQty: (key: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

function makeKey(id: string, level: number | null, note: string) {
  return [id, level ?? "-", note.trim().toLowerCase() || "-"].join("|");
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (input) => {
        const key = makeKey(input.id, input.spicyLevel, input.note ?? "");
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + (input.qty ?? 1) } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                key,
                id: input.id,
                name: input.name,
                image: input.image,
                price: input.price,
                spicyLevel: input.spicyLevel,
                qty: input.qty ?? 1,
                note: input.note ?? "",
              },
            ],
          });
        }
        if (input.flyFrom) flyToCart(input.flyFrom, input.image);
        toast.success(`${input.name} berhasil ditambahkan ke keranjang`, {
          description: input.spicyLevel != null ? `Level pedas ${input.spicyLevel}` : undefined,
        });
      },
      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      setQty: (key, qty) =>
        set({
          items: get()
            .items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))
            .filter((i) => i.qty > 0),
        }),
      incrementQty: (key) => {
        const item = get().items.find((i) => i.key === key);
        if (item) get().setQty(key, item.qty + 1);
      },
      decrementQty: (key) => {
        const item = get().items.find((i) => i.key === key);
        if (!item) return;
        if (item.qty <= 1) {
          set({ items: get().items.filter((i) => i.key !== key) });
          toast(`${item.name} dihapus dari keranjang`);
        } else {
          get().setQty(key, item.qty - 1);
        }
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "gacoan-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export function cartTotals(items: CartItem[], serviceFee: number) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const service = items.length ? serviceFee : 0;
  return { subtotal, service, total: subtotal + service, count: items.reduce((a, i) => a + i.qty, 0) };
}
