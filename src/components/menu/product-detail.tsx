"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  MapPin,
  Bike,
  Link2,
  ChevronRight,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MenuCard, MenuCardSkeleton } from "@/components/menu/menu-card";
import { SpicyMeter } from "@/components/shared/spicy-meter";
import { OpenStatusBadge } from "@/components/shared/open-status";
import { useCart } from "@/lib/store/cart";
import { useMenuData } from "@/lib/hooks/use-menu-data";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/data/menu";
import { site, spicyLevels } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/data/menu";

const LEVELS = Array.from({ length: 9 }, (_, i) => i);

/**
 * Halaman detail produk: foto besar, level pedas 0–8, jumlah,
 * catatan pesanan, tombol tambah ke keranjang + rekomendasi.
 */
export function ProductDetail({ product }: { product: MenuItem }) {
  const mounted = useMounted();
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const liveItems = useMenuData();

  const [level, setLevel] = useState(4);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const [btnRef, setBtnRef] = useState<HTMLButtonElement | null>(null);

  // Versi live (override admin) dipakai setelah mount; sebelum mount
  // pakai data statis dari server agar tidak hydration mismatch.
  const live = mounted ? liveItems.find((m) => m.id === product.id) : undefined;
  const item = live ?? product;

  // Rekomendasi se-kategori (exclude item ini), maksimal 4
  const related = mounted
    ? liveItems
        .filter((m) => m.category === item.category && m.id !== item.id)
        .slice(0, 4)
    : [];

  const handleAdd = () => {
    if (!item.available) return;
    addItem({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      spicyLevel: item.spicy ? level : null,
      qty,
      note,
      flyFrom: btnRef,
    });
    setJustAdded(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link menu disalin!");
    } catch {
      toast.error("Gagal menyalin link. Coba lagi ya!");
    }
  };

  return (
    <div className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* ===== Breadcrumb ===== */}
        <nav aria-label="Breadcrumb" className="py-4 sm:py-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <li>
              <Link href="/" className="font-medium hover:text-gacoan transition-colors">
                Beranda
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/menu" className="font-medium hover:text-gacoan transition-colors">
                Menu
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="max-w-[180px] truncate font-bold text-ink sm:max-w-xs">
              {item.name}
            </li>
          </ol>
        </nav>

        {/* ===== Detail utama ===== */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Foto besar */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted shadow-lg shadow-ink/5">
            <Image
              src={item.image}
              alt={`${item.name} — ${CATEGORY_LABELS[item.category]} di Mie Gacoan Ciamis`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
              {item.popular && (
                <Badge className="border-0 bg-gacoan-yellow font-bold text-ink shadow">
                  🔥 Populer
                </Badge>
              )}
              {item.isNew && (
                <Badge className="border-0 bg-gacoan font-bold text-white shadow">
                  BARU
                </Badge>
              )}
            </div>
            {item.spicy && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                <Flame className="h-3.5 w-3.5 text-gacoan-yellow" aria-hidden />
                Bisa pilih level pedas 0–8
              </div>
            )}
            {!item.available && (
              <div className="absolute inset-0 grid place-items-center bg-black/55">
                <span className="rounded-full bg-white px-5 py-2 font-bold text-ink">
                  Habis
                </span>
              </div>
            )}
          </div>

          {/* Info produk */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge
                variant="outline"
                className="rounded-full border-gacoan/40 bg-gacoan/5 px-3 py-1 font-bold text-gacoan"
              >
                {CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 gap-1.5 rounded-full px-3 text-xs font-bold"
                aria-label="Salin link menu ini"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden />
                Salin Link
              </Button>
            </div>

            <h1 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              {item.name}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {item.desc}
            </p>
            <p className="font-display text-3xl text-gacoan">
              {formatRupiah(item.price)}
            </p>

            {/* Level pedas */}
            {item.spicy && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                  PILIH LEVEL PEDAS <span aria-hidden>🌶️</span>
                </p>
                <div
                  className="grid grid-cols-3 gap-2"
                  role="radiogroup"
                  aria-label="Pilih level pedas"
                >
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      role="radio"
                      aria-checked={level === l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "rounded-xl border-2 px-2 py-2 text-center transition-all min-h-11",
                        level === l
                          ? "border-gacoan bg-gacoan/10 shadow-md shadow-gacoan/10"
                          : "border-border hover:border-gacoan/40"
                      )}
                    >
                      <span className="block text-xs font-bold">Level {l}</span>
                      <SpicyMeter level={l} size="sm" className="mt-0.5 justify-center" />
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {spicyLevels[level]
                    ? `${spicyLevels[level].label} — ${spicyLevels[level].desc}`
                    : ""}
                </p>
              </div>
            )}

            {/* Jumlah */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-bold">Jumlah</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Kurangi jumlah"
                  className="grid h-10 w-10 place-items-center rounded-full border border-input transition-colors hover:border-gacoan hover:bg-gacoan hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <span className="w-10 text-center font-display text-lg" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  disabled={qty >= 99}
                  aria-label="Tambah jumlah"
                  className="grid h-10 w-10 place-items-center rounded-full border border-input transition-colors hover:border-gacoan hover:bg-gacoan hover:text-white disabled:pointer-events-none disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            {/* Catatan pesanan */}
            <div>
              <label htmlFor="product-note" className="mb-1.5 block text-sm font-bold">
                Catatan pesanan{" "}
                <span className="font-normal text-muted-foreground">(opsional)</span>
              </label>
              <Textarea
                id="product-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: tanpa bawang, extra sambal…"
                className="min-h-20 resize-none"
                maxLength={140}
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {note.length}/140
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-2.5">
              <Button
                ref={setBtnRef}
                onClick={handleAdd}
                disabled={!item.available}
                className="h-14 w-full rounded-full text-base font-bold shadow-lg shadow-gacoan/30"
              >
                🛒 Tambahkan ke Keranjang · {formatRupiah(item.price * qty)}
              </Button>
              {justAdded && item.available && (
                <Button
                  variant="outline"
                  onClick={openCart}
                  className="h-11 w-full rounded-full font-bold border-gacoan/40 text-gacoan hover:bg-gacoan hover:text-white"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden />
                  Lihat Keranjang
                </Button>
              )}
              {!item.available && (
                <p className="text-center text-xs font-semibold text-destructive">
                  Menu ini sedang habis — pilih menu lain dulu ya!
                </p>
              )}
            </div>

            {/* Info outlet */}
            <div className="space-y-2.5 rounded-2xl border border-border bg-gacoan-cream/60 p-4">
              <OpenStatusBadge showTime />
              <p className="flex items-start gap-2 text-xs sm:text-sm">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gacoan"
                  aria-hidden
                />
                <span>
                  <span className="font-bold">Ambil di:</span> {site.outletName} —{" "}
                  {site.shortAddress}
                </span>
              </p>
              <p className="flex items-start gap-2 text-xs sm:text-sm">
                <Bike className="mt-0.5 h-4 w-4 shrink-0 text-gacoan" aria-hidden />
                <span>Pesan antar tersedia</span>
              </p>
            </div>
          </div>
        </div>

        {/* ===== COBA JUGA ===== */}
        <section className="mt-14 sm:mt-20" aria-label="Rekomendasi menu lain">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-block rounded-full bg-gacoan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gacoan">
                Menu lainnya
              </span>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-ink sm:text-3xl">
                COBA JUGA
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm font-bold text-gacoan hover:underline min-h-11 flex items-center"
            >
              Lihat Semua Menu →
            </Link>
          </div>

          {!mounted ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <MenuCardSkeleton key={i} />
              ))}
            </div>
          ) : related.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => (
                <MenuCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada menu lain di kategori ini — coba jelajahi kategori lain ya!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
