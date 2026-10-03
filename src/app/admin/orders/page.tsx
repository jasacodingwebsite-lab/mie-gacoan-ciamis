import type { Metadata } from "next";
import { OrdersManager } from "@/components/admin/orders-manager";

export const metadata: Metadata = {
  title: { absolute: "Kelola Pesanan — Mie Gacoan Ciamis" },
  description:
    "Pantau dan perbarui status pesanan pelanggan Mie Gacoan Ciamis dari panel admin demo.",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return <OrdersManager />;
}
