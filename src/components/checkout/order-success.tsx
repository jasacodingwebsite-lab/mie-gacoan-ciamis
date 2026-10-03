"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bike,
  Check,
  Copy,
  MapPin,
  PackageSearch,
  ReceiptText,
  Store,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/lib/store/orders";
import { useMounted } from "@/lib/hooks/use-mounted";
import { orderTimeline, paymentMethods } from "@/lib/data/site";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OrderSuccess() {
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);
  const [copied, setCopied] = useState(false);

  const id = searchParams.get("id");
  const order = orders.find((o) => o.id === id);

  const handleCopy = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      toast.success("Nomor pesanan disalin!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin nomor pesanan.");
    }
  };

  /* ===== Skeleton sebelum hydrate ===== */
  if (!mounted) {
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

  /* ===== Pesanan tidak ditemukan ===== */
  if (!order) {
    return (
      <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
        <div className="space-y-4 rounded-2xl border bg-card p-8 text-center">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-muted text-4xl"
            aria-hidden
          >
            🔍
          </div>
          <h1 className="font-display text-xl">Pesanan tidak ditemukan</h1>
          <p className="text-sm text-muted-foreground">
            Nomor pesanan tidak ada di perangkat ini. Coba lacak dengan nomor
            pesananmu.
          </p>
          <Button
            asChild
            className="h-11 rounded-full px-8 font-bold shadow-lg shadow-gacoan/30"
          >
            <Link href="/order/track">Lacak Pesanan</Link>
          </Button>
        </div>
      </div>
    );
  }

  const itemCount = order.items.reduce((acc, i) => acc + i.qty, 0);
  const paymentLabel =
    paymentMethods.find((pm) => pm.id === order.payment)?.label ??
    order.payment;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="space-y-5"
      >
        {/* Hero sukses */}
        <div className="space-y-3 text-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.1,
            }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          >
            <Check className="h-12 w-12" strokeWidth={3} aria-hidden />
          </motion.div>
          <h1 className="font-display text-3xl tracking-tight">
            Pesanan Berhasil! 🎉
          </h1>
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            Pesanan diterima
          </span>
          <p className="text-sm text-muted-foreground">
            Simpan nomor pesananmu untuk lacak statusnya ya!
          </p>
        </div>

        {/* Nomor pesanan */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Nomor Pesanan</p>
            <p className="truncate font-mono text-base font-bold tracking-wide">
              {order.id}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Salin nomor pesanan"
            className="h-11 w-11 shrink-0 rounded-full"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </Button>
        </div>

        {/* Info ringkas */}
        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-sm tracking-wide">
            <ReceiptText className="h-4 w-4 text-gacoan" aria-hidden />
            INFO PESANAN
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                {order.method === "pickup" ? (
                  <Store className="h-4 w-4" aria-hidden />
                ) : (
                  <Bike className="h-4 w-4" aria-hidden />
                )}
                Metode
              </dt>
              <dd className="text-right font-semibold">
                {order.method === "pickup"
                  ? `Pesan Ambil — ${order.outlet}`
                  : `Pesan Antar — ${order.address}`}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                <Wallet className="h-4 w-4" aria-hidden />
                Pembayaran
              </dt>
              <dd className="font-semibold">{paymentLabel}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">Jumlah Item</dt>
              <dd className="font-semibold">{itemCount} item</dd>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <dt className="font-bold">Total Bayar</dt>
              <dd className="font-display text-lg text-gacoan">
                {formatRupiah(order.total)}
              </dd>
            </div>
          </dl>
          {order.method === "pickup" ? (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Ambil di {order.outlet}
            </p>
          ) : null}
        </div>

        {/* Mini timeline */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center">
            {orderTimeline.map((step, i) => (
              <div
                key={step.status}
                className={cn(
                  "flex items-center",
                  i < orderTimeline.length - 1 && "flex-1"
                )}
              >
                <div
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors",
                    i === 0
                      ? "bg-gacoan text-white shadow-md shadow-gacoan/30"
                      : "bg-muted text-muted-foreground"
                  )}
                  aria-current={i === 0 ? "step" : undefined}
                >
                  {i === 0 ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < orderTimeline.length - 1 ? (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      i === 0 ? "bg-gacoan" : "bg-border"
                    )}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm">
            <span className="font-bold text-gacoan">
              {orderTimeline[0].label}
            </span>{" "}
            <span className="text-muted-foreground">
              — {orderTimeline[0].desc}
            </span>
          </p>
        </div>

        {/* Aksi */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            asChild
            className="h-12 rounded-full font-bold shadow-lg shadow-gacoan/30"
          >
            <Link href={`/order/${order.id}`}>Lacak Pesanan</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full font-bold">
            <Link href="/menu">Kembali ke Menu</Link>
          </Button>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <PackageSearch className="h-3.5 w-3.5" aria-hidden />
          Salah tempat? Buka halaman Lacak Pesanan dan masukkan nomor pesananmu.
        </p>
      </motion.div>
    </div>
  );
}
