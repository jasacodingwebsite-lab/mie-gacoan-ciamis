import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — Mie Gacoan Ciamis",
  description:
    "Isi data pemesan, pilih metode ambil/antar, dan pembayaran untuk pesanan mie pedas kamu di Mie Gacoan Ciamis.",
};

function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-8 w-56 rounded bg-muted animate-pulse" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="space-y-4 rounded-2xl border bg-card p-6 animate-pulse"
            >
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border bg-card p-6 animate-pulse">
          <div className="h-5 w-1/2 rounded bg-muted" />
          <div className="h-24 w-full rounded bg-muted" />
          <div className="h-12 w-full rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutForm />
    </Suspense>
  );
}
