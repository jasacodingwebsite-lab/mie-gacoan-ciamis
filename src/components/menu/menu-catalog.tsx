"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuCard, MenuCardSkeleton } from "@/components/menu/menu-card";
import { useMenuData } from "@/lib/hooks/use-menu-data";
import { useMounted } from "@/lib/hooks/use-mounted";
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type MenuCategory,
} from "@/lib/data/menu";
import { site } from "@/lib/data/site";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | MenuCategory;
type SortKey = "popular" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Terpopuler" },
  { value: "price-asc", label: "Harga terendah" },
  { value: "price-desc", label: "Harga tertinggi" },
  { value: "newest", label: "Terbaru" },
];

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "mie", label: `${CATEGORY_ICONS.mie} Mie` },
  { value: "dimsum", label: `${CATEGORY_ICONS.dimsum} Dimsum` },
  { value: "minuman", label: `${CATEGORY_ICONS.minuman} Minuman` },
];

/**
 * Halaman katalog menu: pencarian realtime, filter kategori,
 * pengurutan, dan grid MenuCard responsif.
 */
export function MenuCatalog() {
  const mounted = useMounted();
  const products = useMenuData();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("popular");

  /** jumlah item per kategori (untuk badge) */
  const counts = useMemo(() => {
    const c: Record<CategoryFilter, number> = {
      all: products.length,
      mie: 0,
      dimsum: 0,
      minuman: 0,
    };
    for (const p of products) c[p.category] += 1;
    return c;
  }, [products]);

  /** filter kategori + pencarian realtime (nama & deskripsi) */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    });
  }, [products, category, query]);

  /** pengurutan hasil */
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "price-asc":
        arr.sort((a, b) => a.price - b.price || a.sort - b.sort);
        break;
      case "price-desc":
        arr.sort((a, b) => b.price - a.price || a.sort - b.sort);
        break;
      case "newest":
        arr.sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.sort - b.sort);
        break;
      default:
        // Terpopuler: item popular duluan, sisanya urut standar
        arr.sort((a, b) => Number(b.popular) - Number(a.popular) || a.sort - b.sort);
    }
    return arr;
  }, [filtered, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("popular");
  };

  const categoryButton = (tab: { value: CategoryFilter; label: string }) => {
    const active = category === tab.value;
    return (
      <button
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={active}
        onClick={() => setCategory(tab.value)}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all min-h-11",
          active
            ? "border-gacoan bg-gacoan text-white shadow-md shadow-gacoan/25"
            : "border-border bg-card text-foreground hover:border-gacoan/50 hover:bg-gacoan/5"
        )}
      >
        {tab.label}
        {mounted && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
              active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}
          >
            {counts[tab.value]}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* ===== Header section ===== */}
        <header className="pt-8 sm:pt-12 pb-6 text-center space-y-3">
          <span className="inline-block rounded-full bg-gacoan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gacoan">
            Menu Kami
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight text-ink">
            PILIH SANTAPANMU
          </h1>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground">
            {site.priceDisclaimer}
          </p>
        </header>

        {/* ===== Pencarian + Urutkan ===== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pb-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <label htmlFor="menu-search" className="sr-only">
              Cari menu
            </label>
            <Input
              id="menu-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari mie, dimsum, atau minuman..."
              className="h-12 rounded-full border-border bg-card pl-12 pr-4 text-base shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              id="sort-label"
              className="hidden sm:block text-xs font-bold whitespace-nowrap text-muted-foreground"
            >
              Urutkan:
            </span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger
                aria-label="Urutkan menu"
                className="h-12 w-full rounded-full border-border bg-card font-semibold shadow-sm sm:w-44"
              >
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ===== Tab kategori (mobile, sticky di bawah navbar) ===== */}
        <div className="lg:hidden sticky top-[64px] z-30 -mx-3 px-3 bg-background/95 backdrop-blur py-3">
          <div
            className="flex overflow-x-auto no-scrollbar gap-2"
            role="tablist"
            aria-label="Kategori menu"
          >
            {CATEGORY_TABS.map(categoryButton)}
          </div>
        </div>

        {/* ===== Konten utama ===== */}
        {!mounted ? (
          // skeleton loading sebelum hydrate — bukan spinner
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <MenuCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          // ERROR STATE: daftar menu kosong total (mis. admin menonaktifkan semua)
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-7 w-7 text-destructive" aria-hidden />
            </span>
            <h2 className="mt-4 font-display text-xl text-ink">
              Menu sedang mengalami gangguan.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Daftar menu tidak tersedia saat ini. Tenang, pesananmu tetap aman — coba
              muat ulang daftarnya.
            </p>
            <Button
              onClick={resetFilters}
              className="mt-5 h-11 rounded-full px-6 font-bold shadow-md shadow-gacoan/25"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
            {/* Sidebar kategori (desktop) */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-24 flex w-56 flex-col gap-1.5 py-2"
                role="tablist"
                aria-label="Kategori menu"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = category === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(tab.value)}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-left transition-all min-h-11",
                        active
                          ? "bg-gacoan text-white shadow-md shadow-gacoan/25"
                          : "bg-card text-foreground border border-border hover:border-gacoan/50 hover:bg-gacoan/5"
                      )}
                    >
                      {tab.label}
                      {mounted && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold leading-none",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {counts[tab.value]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Grid produk */}
            <div className="pt-2">
              {sorted.length === 0 ? (
                // EMPTY STATE hasil pencarian
                <div className="py-14 sm:py-20 text-center">
                  <span className="text-6xl" aria-hidden>
                    🔍
                  </span>
                  <h2 className="mt-4 font-display text-2xl text-ink">
                    Menu tidak ditemukan
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Coba kata kunci lain atau reset filter.
                  </p>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="mt-6 h-11 rounded-full px-6 font-bold border-gacoan/40 text-gacoan hover:bg-gacoan hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Reset Pencarian
                  </Button>
                </div>
              ) : (
                <>
                  {/* judul sub kategori */}
                  {category !== "all" && (
                    <h2 className="mb-2 font-display text-xl sm:text-2xl text-ink">
                      {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
                      <span className="ml-2 font-sans text-sm sm:text-base font-semibold text-muted-foreground">
                        — {sorted.length} menu
                      </span>
                    </h2>
                  )}

                  {/* counter hasil */}
                  <p
                    className="mb-4 text-xs font-semibold text-muted-foreground"
                    aria-live="polite"
                  >
                    Menampilkan {sorted.length} dari {products.length} menu
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {sorted.map((product, i) => (
                      <MenuCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
