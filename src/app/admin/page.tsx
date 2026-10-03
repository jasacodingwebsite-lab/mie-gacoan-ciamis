import type { Metadata } from "next";
import { Dashboard } from "@/components/admin/dashboard";

export const metadata: Metadata = {
  title: { absolute: "Dashboard Admin — Mie Gacoan Ciamis" },
  description:
    "Ringkasan pesanan, pendapatan, dan produk Mie Gacoan Ciamis dari panel admin demo.",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <Dashboard />;
}
