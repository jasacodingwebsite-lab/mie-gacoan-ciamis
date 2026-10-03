import type { Metadata } from "next";
import { PromoManager } from "@/components/admin/promo-manager";

export const metadata: Metadata = {
  title: { absolute: "Kelola Promo — Mie Gacoan Ciamis" },
  description:
    "Atur harga, deskripsi, dan tampilan promo Mie Gacoan Ciamis dari panel admin demo.",
  robots: { index: false, follow: false },
};

export default function AdminPromoPage() {
  return <PromoManager />;
}
