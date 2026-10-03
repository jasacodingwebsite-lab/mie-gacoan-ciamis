"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartTotals, useCart } from "@/lib/store/cart";
import { useAdmin } from "@/lib/store/admin";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { toast } from "sonner";

export function CartView() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const incrementQty = useCart((s) => s.incrementQty);
  const decrementQty = useCart((s) => s.decrementQty);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);
  const serviceFee = useAdmin((s) => s.settings.serviceFee);

  const { subtotal, service, total, count } = cartTotals(items, serviceFee);

  const handleClear = () => {
    clear();
    toast.success("Keranjang berhasil dikosongkan.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          KERANJANG KAMU
        </h1>
        {mounted && count > 0 ? (
          <span className="rounded-full bg-gacoan px-3 py-1 text-xs font-bold text-white shadow-sm shadow-gacoan/30">
            {count} item
          </span>
        ) : null}
      </div>

      {!mounted ? (
        /* ===== Skeleton (sebelum hydrate) ===== */
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border bg-card p-4 animate-pulse"
              >
                <div className="h-20 w-20 shrink-0 rounded-xl bg-muted" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                  <div className="h-8 w-1/2 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border bg-card p-6 animate-pulse">
            <div className="h-5 w-1/2 rounded bg-muted" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-6 w-full rounded bg-muted" />
            </div>
            <div className="mt-6 h-12 w-full rounded-full bg-muted" />
          </div>
        </div>
      ) : items.length === 0 ? (
        /* ===== Empty state ===== */
        <div className="grid min-h-[50vh] place-items-center text-center">
          <div className="space-y-4">
            <div
              className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-muted text-6xl"
              aria-hidden
            >
              🛒
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold">Keranjang kamu masih kosong.</p>
              <p className="text-sm text-muted-foreground">
                Yuk isi dengan mie pedas favoritmu!
              </p>
            </div>
            <Button
              asChild
              className="h-11 rounded-full px-8 font-bold shadow-lg shadow-gacoan/30"
            >
              <Link href="/menu">Lihat Menu</Link>
            </Button>
          </div>
        </div>
      ) : (
        /* ===== Konten utama ===== */
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Daftar item */}
          <ul className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border">
                  <Image
                    src={item.image}
                    alt={`Foto menu ${item.name}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-bold">{item.name}</p>
                      {item.spicyLevel != null ? (
                        <span className="inline-block rounded-full bg-gacoan/10 px-2.5 py-0.5 text-xs font-semibold text-gacoan">
                          🌶️ Level {item.spicyLevel}
                        </span>
                      ) : null}
                      {item.note ? (
                        <p className="truncate text-xs italic text-muted-foreground">
                          &ldquo;{item.note}&rdquo;
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Hapus ${item.name} dari keranjang`}
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decrementQty(item.key)}
                        aria-label={`Kurangi jumlah ${item.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-input transition-colors hover:border-gacoan hover:bg-gacoan hover:text-white"
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <span
                        className="w-8 text-center font-bold"
                        aria-live="polite"
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQty(item.key)}
                        aria-label={`Tambah jumlah ${item.name}`}
                        className="grid h-10 w-10 place-items-center rounded-full border border-input transition-colors hover:border-gacoan hover:bg-gacoan hover:text-white"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <p className="font-bold text-gacoan">
                      {formatRupiah(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Ringkasan */}
          <aside className="lg:col-span-1">
            <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="flex items-center gap-2 font-display text-lg">
                <ShoppingBasket
                  className="h-5 w-5 text-gacoan"
                  aria-hidden
                />
                RINGKASAN
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({count} item)
                  </span>
                  <span className="font-semibold">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-semibold">{formatRupiah(service)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-display text-xl text-gacoan">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <Button
                asChild
                className="h-12 w-full rounded-full font-bold text-base shadow-lg shadow-gacoan/30"
              >
                <Link href="/checkout">
                  Lanjut Checkout
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-full font-bold"
              >
                <Link href="/menu">＋ Lanjut Belanja</Link>
              </Button>

              <button
                type="button"
                onClick={handleClear}
                className="mx-auto block min-h-11 px-2 text-xs font-semibold text-destructive underline-offset-2 transition-colors hover:underline"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
