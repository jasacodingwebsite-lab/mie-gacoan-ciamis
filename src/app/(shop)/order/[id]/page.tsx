import type { Metadata } from "next";
import { OrderDetail } from "@/components/checkout/order-detail";

export const metadata: Metadata = {
  title: "Detail Pesanan — Mie Gacoan Ciamis",
  description:
    "Lacak status pesananmu — dari pesanan dibuat sampai siap diambil atau diantar ke alamatmu.",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
