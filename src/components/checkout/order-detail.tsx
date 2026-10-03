"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Ban,
  Bike,
  Check,
  Flame,
  House,
  MapPin,
  ReceiptText,
  Store,
  UserRound,
  Utensils,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useOrders, type Order, type OrderStatus } from "@/lib/store/orders";
import { useMounted } from "@/lib/hooks/use-mounted";
import { orderTimeline, paymentMethods } from "@/lib/data/site";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PREPARING: "bg-gacoan text-white",
  READY: "bg-gacoan-yellow text-ink",
  COMPLETED: "bg-emerald-600 text-white",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  PREPARING: "Sedang Diproses",
  READY: "Siap Diambil",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderDetail({ id }: { id: string }) {
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);
  const updateStatus = useOrders((s) => s.updateStatus);

  const decodedId = decodeURIComponent(id).toUpperCase();
  const order: Order | undefined = orders.find((o) => o.id === decodedId);

  const handleCancel = () => {
    if (!order) return;
    updateStatus(order.id, "CANCELLED");
    toast.success("Pesanan dibatalkan.", {
      description: `Pesanan ${order.id} tidak diproses lagi.`,
    });
  };

  /* ===== Skeleton sebelum hydrate ===== */
  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="h-8 w-72 rounded bg-muted animate-pulse" />
        <div className="mt-6 space-y-6">
          <div className="h-48 w-full rounded-2xl border bg-card animate-pulse" />
          <div className="h-64 w-full rounded-2xl border bg-card animate-pulse" />
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
            🤷
          </div>
          <h1 className="font-display text-xl">Pesanan tidak ditemukan</h1>
          <p className="text-sm text-muted-foreground">
            Pesanan dengan nomor{" "}
            <span className="font-mono font-semibold">{decodedId}</span> nggak
            ada di perangkat ini.
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

  const isCancelled = order.status === "CANCELLED";
  const currentIndex = orderTimeline.findIndex(
    (t) => t.status === order.status
  );
  const paymentLabel =
    paymentMethods.find((pm) => pm.id === order.payment)?.label ??
    order.payment;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
        <div className="min-w-0">
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
            Pesanan{" "}
            <span className="text-gacoan">{order.id}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dibuat {formatDateTime(order.createdAt)}
          </p>
        </div>
        <span
          className={cn(
            "ml-auto rounded-full px-4 py-1.5 text-sm font-bold",
            STATUS_STYLE[order.status]
          )}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* ============ KOLOM KIRI ============ */}
        <div className="space-y-6 lg:col-span-2">
          {/* Timeline status */}
          <section
            aria-label="Status pesanan"
            className="rounded-2xl border bg-card p-6"
          >
            {isCancelled ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <Ban
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                    aria-hidden
                  />
                  <div>
                    <p className="font-bold text-red-700">
                      Pesanan dibatalkan
                    </p>
                    <p className="text-sm text-red-600">
                      Pesanan ini sudah tidak diproses. Checkout lagi kalau
                      masih lapar ya! 🌶️
                    </p>
                  </div>
                </div>
                {/* Riwayat status tetap tampil */}
                <ul className="space-y-2 text-sm">
                  {order.history.map((h, i) => (
                    <li
                      key={`${h.status}-${i}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="text-muted-foreground">
                        {STATUS_LABEL[h.status] ?? h.status}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatTime(h.at)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ol className="relative space-y-0">
                {orderTimeline.map((step, i) => {
                  const passed = i < currentIndex;
                  const active = i === currentIndex;
                  const hist = order.history.find((h) => h.status === step.status);
                  return (
                    <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                      {/* Garis penghubung */}
                      {i < orderTimeline.length - 1 ? (
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5",
                            passed ? "bg-emerald-400" : "bg-border"
                          )}
                        />
                      ) : null}
                      {/* Lingkaran icon */}
                      <span
                        aria-hidden
                        className={cn(
                          "z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                          passed && "bg-emerald-500 text-white",
                          active &&
                            "bg-gacoan text-white shadow-md shadow-gacoan/30 animate-pulse",
                          !passed && !active && "border-2 border-border bg-muted"
                        )}
                      >
                        {passed ? (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        ) : active ? (
                          <Flame className="h-4 w-4" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                        )}
                      </span>
                      {/* Label */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center justify-between gap-x-3">
                          <p
                            className={cn(
                              "font-bold",
                              !passed && !active && "text-muted-foreground"
                            )}
                          >
                            {step.label}
                          </p>
                          {hist ? (
                            <span className="font-mono text-xs text-muted-foreground">
                              {formatTime(hist.at)}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* Item pesanan */}
          <section
            aria-labelledby="sec-items"
            className="rounded-2xl border bg-card p-6"
          >
            <h2
              id="sec-items"
              className="mb-4 flex items-center gap-2 font-display text-sm tracking-wide"
            >
              <Utensils className="h-4 w-4 text-gacoan" aria-hidden />
              ITEM PESANAN ({order.items.length})
            </h2>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.key} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border">
                    <Image
                      src={item.image}
                      alt={`Foto menu ${item.name}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.spicyLevel != null
                        ? `🌶️ Level ${item.spicyLevel} · `
                        : ""}
                      {item.qty} pcs
                      {item.note ? ` · “${item.note}”` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gacoan">
                    {formatRupiah(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  {formatRupiah(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-semibold">{formatRupiah(order.service)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-bold">Total Bayar</span>
                <span className="font-display text-lg text-gacoan">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ============ KOLOM KANAN ============ */}
        <aside className="lg:col-span-1">
          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 font-display text-sm tracking-wide">
              <ReceiptText className="h-4 w-4 text-gacoan" aria-hidden />
              DETAIL PENGIRIMAN
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" aria-hidden />
                  Pemesan
                </p>
                <p className="font-semibold">{order.customer.name}</p>
                <p className="text-muted-foreground">
                  WA: {order.customer.whatsapp}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {order.method === "pickup" ? (
                    <Store className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Bike className="h-3.5 w-3.5" aria-hidden />
                  )}
                  Metode
                </p>
                <p className="font-semibold">
                  {order.method === "pickup" ? "Pesan & Ambil" : "Pesan Antar"}
                </p>
                <p className="flex items-start gap-1.5 text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {order.method === "pickup" ? order.outlet : order.address}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" aria-hidden />
                  Pembayaran
                </p>
                <p className="font-semibold">{paymentLabel}</p>
              </div>

              {order.customer.note ? (
                <div>
                  <p className="text-xs text-muted-foreground">Catatan</p>
                  <p className="italic text-muted-foreground">
                    &ldquo;{order.customer.note}&rdquo;
                  </p>
                </div>
              ) : null}
            </div>

            {/* Aksi */}
            <div className="space-y-3 pt-1">
              {order.status === "PENDING" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full rounded-full border-destructive/40 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Ban className="h-4 w-4" aria-hidden />
                      Batalkan Pesanan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Batalkan pesanan ini?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Pesanan {order.id} akan dibatalkan dan tidak bisa
                        diproses lagi. Pesanan yang sudah dikonfirmasi outlet
                        sebaiknya jangan dibatalkan ya.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Enggak dulu</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Ya, batalkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}

              <Button
                asChild
                className="h-11 w-full rounded-full font-bold shadow-lg shadow-gacoan/30"
              >
                <Link href="/menu">Pesan Lagi</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-full font-semibold"
              >
                <Link href="/">
                  <House className="h-4 w-4" aria-hidden />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
