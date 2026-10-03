"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCart, cartTotals } from "@/lib/store/cart";
import { useAdmin } from "@/lib/store/admin";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";

const HIDDEN_ROUTES = ["/checkout", "/cart", "/admin"];

/** Floating cart bar — muncul di bawah layar saat keranjang berisi item. */
export function FloatingCart() {
  const pathname = usePathname();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const openCart = useCart((s) => s.openCart);
  const serviceFee = useAdmin((s) => s.settings.serviceFee);

  const { count, total } = cartTotals(items, serviceFee);
  const hidden =
    !mounted || isOpen || count === 0 || HIDDEN_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed inset-x-3 bottom-3 z-40 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            type="button"
            onClick={openCart}
            aria-label={`Buka keranjang, ${count} item, total ${formatRupiah(total)}`}
            className="w-full rounded-2xl bg-ink text-white shadow-2xl shadow-black/30 border border-white/10 p-3 sm:p-4 flex items-center gap-3 hover:bg-ink-soft transition-colors"
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gacoan" aria-hidden>
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gacoan-yellow px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[11px] text-white/60">
                {count} item di keranjang
              </span>
              <span className="block font-display text-base sm:text-lg text-gacoan-yellow leading-tight">
                {formatRupiah(total)}
              </span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-gacoan px-4 py-2.5 text-sm font-bold shrink-0">
              Lihat Keranjang <ChevronRight className="h-4 w-4" />
            </span>
            <span className="sm:hidden grid h-9 w-9 place-items-center rounded-full bg-gacoan shrink-0" aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
