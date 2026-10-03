import type { Metadata } from "next";
import { PromoContent } from "@/components/pages/promo-content";

export const metadata: Metadata = {
  title: "Promo & Paket Hemat",
  description:
    "Paket hemat mie pedas, dimsum, dan minuman di Mie Gacoan Ciamis. Mulai Rp35.000 — klaim langsung di outlet atau lewat WhatsApp. Harga demo, promo update rutin.",
};

export default function PromoPage() {
  return <PromoContent />;
}
