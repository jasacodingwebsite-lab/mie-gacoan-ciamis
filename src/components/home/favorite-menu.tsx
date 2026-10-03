"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { MenuCard } from "@/components/menu/menu-card";
import { useMenuData, usePromoData } from "@/lib/hooks/use-menu-data";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/data/menu";

type TabId = "semua" | MenuCategory | "paket";

const TABS: { id: TabId; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "mie", label: "🍜 Mie" },
  { id: "dimsum", label: "🥟 Dimsum" },
  { id: "minuman", label: "🥤 Minuman" },
  { id: "paket", label: "🎉 Paket" },
];

export function FavoriteMenu() {
  const [tab, setTab] = useState<TabId>("semua");
  const menu = useMenuData();
  const promos = usePromoData().slice(0, 3);

  const items = (() => {
    if (tab === "semua") {
      return [...menu].sort((a, b) => Number(b.popular) - Number(a.popular)).slice(0, 8);
    }
    if (tab === "paket") return [];
    return menu.filter((m) => m.category === tab).slice(0, 8);
  })();

  return (
    <section aria-label="Menu favorit" className="bg-gacoan-cream/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Paling Dicari"
          title="MENU FAVORIT"
          subtitle="Pilihan favorit untuk menemani hari kamu."
        />

        {/* Tab kategori */}
        <div
          role="tablist"
          aria-label="Kategori menu favorit"
          className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border-2 px-5 text-sm font-bold transition-all duration-200",
                tab === t.id
                  ? "border-gacoan bg-gacoan text-white shadow-lg shadow-gacoan/25"
                  : "border-border bg-card text-ink hover:border-gacoan/50 hover:text-gacoan"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Konten tab */}
        {tab === "paket" ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 lg:gap-6">
            {promos.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gacoan/10"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-gacoan px-2.5 py-1 text-[10px] font-bold text-white shadow">
                    {p.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <h3 className="font-display text-sm text-ink sm:text-base">{p.title}</h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <p className="mt-auto pt-1 font-display text-sm text-gacoan sm:text-base">
                    Mulai {formatRupiah(p.price)}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="min-h-11 w-full rounded-full text-xs font-bold sm:text-sm"
                  >
                    <Link href="/promo">Pesan Sekarang</Link>
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div layout className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((product, i) => (
                <motion.div
                  layout
                  key={`${tab}-${product.id}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25 }}
                >
                  <MenuCard product={product} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-h-11 rounded-full border-2 border-gacoan/50 px-8 font-bold text-gacoan hover:bg-gacoan hover:text-white"
          >
            <Link href="/menu">
              Lihat Semua Menu
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
