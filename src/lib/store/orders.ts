"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "./cart";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type OrderMethod = "pickup" | "delivery";

export type PaymentMethod = "QRIS" | "E-WALLET" | "TRANSFER" | "PAY_AT_OUTLET";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  method: OrderMethod;
  customer: { name: string; whatsapp: string; note?: string };
  address?: string;
  outlet: string;
  payment: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  service: number;
  total: number;
  history: { status: OrderStatus; at: string }[];
};

export const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

type OrdersState = {
  orders: Order[];
  createOrder: (
    data: Omit<Order, "id" | "createdAt" | "status" | "history">
  ) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
  removeOrder: (id: string) => void;
  clearOrders: () => void;
};

function todayStamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      createOrder: (data) => {
        const stamp = todayStamp();
        const todayCount = get().orders.filter((o) =>
          o.id.includes(`GCN-${stamp}`)
        ).length;
        const id = `GCN-${stamp}-${String(todayCount + 1).padStart(3, "0")}`;
        const now = new Date().toISOString();
        const order: Order = {
          ...data,
          id,
          createdAt: now,
          status: "PENDING",
          history: [{ status: "PENDING", at: now }],
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      updateStatus: (id, status) =>
        set({
          orders: get().orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  history: [...o.history, { status, at: new Date().toISOString() }],
                }
              : o
          ),
        }),
      removeOrder: (id) => set({ orders: get().orders.filter((o) => o.id !== id) }),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "gacoan-orders-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getOrder(id: string): Order | undefined {
  return useOrders.getState().orders.find((o) => o.id === id);
}
