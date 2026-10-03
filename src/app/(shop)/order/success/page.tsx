import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccess } from "@/components/checkout/order-success";

export const metadata: Metadata = {
  title: "Pesanan Berhasil — Mie Gacoan Ciamis",
  description:
    "Pesananmu berhasil dibuat! Simpan nomor pesanan dan lacak statusnya sampai mie pedas kamu siap.",
};

function SuccessSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
      <div className="space-y-4 rounded-2xl border bg-card p-8 animate-pulse">
        <div className="mx-auto h-24 w-24 rounded-full bg-muted" />
        <div className="mx-auto h-6 w-2/3 rounded bg-muted" />
        <div className="h-16 w-full rounded-xl bg-muted" />
        <div className="h-24 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <OrderSuccess />
    </Suspense>
  );
}
