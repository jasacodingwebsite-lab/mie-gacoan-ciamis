"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShoppingBag, Menu as MenuIcon, X, Bike, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navLinks, site } from "@/lib/data/site";
import { useCart, cartTotals } from "@/lib/store/cart";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { count, total } = cartTotals(items, 2000);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          : "bg-white"
      )}
    >
      {/* Promo strip */}
      <div className="bg-ink text-white text-[11px] sm:text-xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 h-8 flex items-center justify-center gap-2 overflow-hidden">
          <Flame className="h-3.5 w-3.5 text-gacoan-yellow shrink-0" aria-hidden />
          <p className="truncate font-medium tracking-wide">
            LIMITED OFFER — Gacoan Combo mulai {formatRupiah(35000)} 🔥
          </p>
          <Link
            href="/promo"
            className="hidden sm:inline text-gacoan-yellow hover:underline shrink-0 font-semibold"
          >
            Lihat Promo
          </Link>
        </div>
      </div>

      <nav
        aria-label="Navigasi utama"
        className="mx-auto max-w-7xl px-3 sm:px-6 h-16 flex items-center justify-between gap-3"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Mie Gacoan Ciamis - Beranda">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gacoan text-white shadow-md shadow-gacoan/30">
            <Flame className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-base sm:text-lg leading-none tracking-tight">
            MIE <span className="text-gacoan">GACOAN</span>
            <span className="block text-[9px] font-sans font-bold text-muted-foreground tracking-[0.25em] uppercase">
              Ciamis
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 rounded-full text-sm font-semibold transition-colors",
                    active ? "text-gacoan" : "text-foreground/70 hover:text-gacoan hover:bg-gacoan/5"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gacoan"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-cart-icon
            onClick={openCart}
            aria-label={`Buka keranjang, ${count} item`}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-border bg-white hover:bg-gacoan/5 hover:border-gacoan/40 transition-colors"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {mounted && count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gacoan px-1 text-[10px] font-bold text-white shadow"
              >
                {count}
              </motion.span>
            )}
          </button>

          <Button
            asChild
            className="hidden md:inline-flex h-11 rounded-full px-5 font-bold shadow-md shadow-gacoan/25 hover:shadow-gacoan/40 transition-shadow"
          >
            <Link href="/menu">
              <Flame className="h-4 w-4" aria-hidden />
              Pesan Sekarang
            </Link>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Buka menu navigasi"
                className="lg:hidden grid h-11 w-11 place-items-center rounded-full border border-border bg-white hover:bg-gacoan/5 transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-xs p-0">
              <SheetHeader className="p-5 pb-3 text-left border-b">
                <SheetTitle className="font-display text-lg">
                  MIE <span className="text-gacoan">GACOAN</span>
                </SheetTitle>
                <p className="text-xs text-muted-foreground">{site.tagline}</p>
              </SheetHeader>
              <nav aria-label="Navigasi mobile" className="p-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const active =
                      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold min-h-11 transition-colors",
                            active
                              ? "bg-gacoan text-white shadow-md shadow-gacoan/25"
                              : "hover:bg-muted"
                          )}
                        >
                          {link.label}
                          <span aria-hidden>›</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="h-11 rounded-xl font-bold">
                    <Link href="/checkout?method=pickup" onClick={() => setMobileOpen(false)}>
                      <Store className="h-4 w-4" /> Pesan Ambil
                    </Link>
                  </Button>
                  <Button asChild className="h-11 rounded-xl font-bold">
                    <Link href="/checkout?method=delivery" onClick={() => setMobileOpen(false)}>
                      <Bike className="h-4 w-4" /> Pesan Antar
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* mobile order CTA strip */}
      <AnimatePresence>
        {mounted && count > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-gacoan-cream/60"
          >
            <div className="mx-auto max-w-7xl px-3 sm:px-6 h-10 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground/80">
                🛒 {count} item di keranjang · {formatRupiah(total)}
              </span>
              <button
                type="button"
                onClick={openCart}
                className="font-bold text-gacoan hover:underline min-h-11 px-2"
              >
                Lihat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
