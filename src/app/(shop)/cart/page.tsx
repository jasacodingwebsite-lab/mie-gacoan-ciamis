import type { Metadata } from "next";
import { CartView } from "@/components/checkout/cart-view";

export const metadata: Metadata = {
  title: "Keranjang — Mie Gacoan Ciamis",
  description:
    "Periksa kembali pesananmu — atur jumlah, level pedas, dan catatan sebelum checkout di Mie Gacoan Ciamis.",
};

export default function CartPage() {
  return <CartView />;
}
