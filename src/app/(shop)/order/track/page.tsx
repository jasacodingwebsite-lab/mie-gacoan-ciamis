import type { Metadata } from "next";
import { OrderTrack } from "@/components/checkout/order-track";

export const metadata: Metadata = {
  title: "Lacak Pesanan — Mie Gacoan Ciamis",
  description:
    "Masukkan nomor pesananmu untuk melihat status pesanan — dari dapur sampai siap diambil atau diantar.",
};

export default function OrderTrackPage() {
  return <OrderTrack />;
}
