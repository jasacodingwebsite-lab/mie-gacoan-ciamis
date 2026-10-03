"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgePercent, MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { usePromoData } from "@/lib/hooks/use-menu-data";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { site } from "@/lib/data/site";
import type { PromoItem } from "@/lib/data/promos";

/** Harga normal (dicoret) = harga promo dibulatkan ke kelipatan 500 */
const hargaNormal = (price: number) => Math.round((price * 1.35) / 500) * 500;

function PromoImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div
        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-gacoan-cream via-accent to-gacoan-yellow/40 text-6xl"
        aria-hidden
      >
        🍜
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setOk(false)}
    />
  );
}

function PromoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-11 flex-1 rounded-full" />
          <Skeleton className="h-11 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PromoContent() {
  const promos = usePromoData();
  const mounted = useMounted();

  return (
    <div className="pattern-dots">
      {/* ===== Header ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeading
          kicker="DEAL SPESIAL"
          title="PROMO & PAKET HEMAT"
          subtitle="Paket hemat buat makan sendiri sampai rame-rame. Harga demo — klaim langsung di outlet."
        />
      </section>

      {/* ===== Grid promo ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {mounted ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {promos.map((promo, i) => (
                <motion.article
                  key={promo.id}
                  layout
                  initial={{ opacity: 0, y: 28, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.09,
                    ease: [0.22, 0.9, 0.35, 1],
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gacoan/10"
                >
                  {/* Foto */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <PromoImage
                      src={promo.image}
                      alt={`Promo ${promo.title} di Mie Gacoan Ciamis`}
                    />
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-gacoan px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      {promo.badge}
                    </span>
                  </div>

                  {/* Konten */}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="font-display text-lg leading-tight text-ink transition-colors group-hover:text-gacoan">
                      {promo.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {promo.desc}
                    </p>

                    <div className="flex flex-wrap items-baseline gap-2 pt-1">
                      <p className="font-display text-2xl text-gacoan">
                        <span className="mr-1 font-sans text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                          Mulai
                        </span>
                        {formatRupiah(promo.price)}
                      </p>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatRupiah(hargaNormal(promo.price))}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                      *{promo.terms}
                    </p>

                    <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
                      <Button
                        asChild
                        className="h-11 min-h-11 flex-1 rounded-full bg-gacoan font-bold text-white shadow-md shadow-gacoan/25 hover:bg-gacoan-dark"
                      >
                        <Link href="/menu">
                          <ShoppingBag className="h-4 w-4" aria-hidden />
                          Pesan Sekarang
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 min-h-11 flex-1 rounded-full border-gacoan/40 font-bold text-gacoan hover:bg-gacoan hover:text-white"
                      >
                        <a
                          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                            "Halo! Saya mau klaim promo " + promo.title
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden />
                          Klaim via WA
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PromoCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ===== Disclaimer ===== */}
        <Reveal className="mt-10">
          <div className="flex items-start gap-3 rounded-2xl bg-gacoan-cream p-4 text-xs leading-relaxed text-ink/70">
            <BadgePercent className="mt-0.5 h-4 w-4 shrink-0 text-gacoan" aria-hidden />
            <p>
              {site.priceDisclaimer} Promo pada halaman ini adalah demo.
            </p>
          </div>
        </Reveal>

        {/* ===== CTA akhir ===== */}
        <Reveal className="mt-10" delay={0.05}>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-center sm:px-10 sm:py-14">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gacoan/30 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gacoan-yellow/20 blur-3xl"
              aria-hidden
            />
            <h3 className="font-display text-2xl text-white sm:text-3xl">
              MASIH BINGUNG PILIH? 🍜
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
              Buka menu, pilih level pedas favoritmu, dan biarkan kami yang
              masak. Sambalnya jangan ditawar ya.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 h-11 min-h-11 rounded-full bg-gacoan-yellow px-8 font-bold text-ink hover:bg-gacoan-yellow/90"
            >
              <Link href="/menu">
                Lihat Semua Menu
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
