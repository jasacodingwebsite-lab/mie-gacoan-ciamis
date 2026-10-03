"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart, cartTotals } from "@/lib/store/cart";
import { useAdmin } from "@/lib/store/admin";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";

export function CartDrawer() {
  const router = useRouter();
  const mounted = useMounted();
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const incrementQty = useCart((s) => s.incrementQty);
  const decrementQty = useCart((s) => s.decrementQty);
  const removeItem = useCart((s) => s.removeItem);
  const serviceFee = useAdmin((s) => s.settings.serviceFee);

  const { subtotal, service, total, count } = cartTotals(items, serviceFee);

  const goCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? undefined : closeCart())}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] p-0 flex flex-col"
      >
        <SheetHeader className="p-5 pb-3 border-b text-left">
          <SheetTitle className="font-display text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gacoan" aria-hidden />
            Keranjang Kamu
          </SheetTitle>
          <SheetDescription className="text-xs">
            {mounted && count > 0 ? `${count} item siap dimasak 🔥` : "Belum ada pesanan"}
          </SheetDescription>
        </SheetHeader>

        {!mounted ? (
          <div className="flex-1 p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-16 w-16 rounded-xl bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-muted text-5xl" aria-hidden>
                🛒
              </div>
              <div className="space-y-1">
                <p className="font-bold">Keranjang kamu masih kosong.</p>
                <p className="text-sm text-muted-foreground">
                  Yuk pilih mie pedas atau dimsum favoritmu!
                </p>
              </div>
              <Button
                onClick={() => {
                  closeCart();
                  router.push("/menu");
                }}
                className="rounded-full h-11 px-6 font-bold"
              >
                Lihat Menu
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <ul className="divide-y divide-border px-5">
                {items.map((item) => (
                  <li key={item.key} className="py-4 flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{item.name}</p>
                          {item.spicyLevel != null && (
                            <p className="text-xs text-gacoan font-semibold">
                              🌶️ Level {item.spicyLevel}
                            </p>
                          )}
                          {item.note && (
                            <p className="text-[11px] text-muted-foreground italic truncate">
                              “{item.note}”
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Hapus ${item.name} dari keranjang`}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => decrementQty(item.key)}
                            aria-label={`Kurangi ${item.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full border border-input hover:bg-gacoan hover:text-white hover:border-gacoan transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => incrementQty(item.key)}
                            aria-label={`Tambah ${item.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full border border-input hover:bg-gacoan hover:text-white hover:border-gacoan transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-sm text-gacoan">
                          {formatRupiah(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <div className="border-t bg-gacoan-cream/50 p-5 space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-semibold">{formatRupiah(service)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-display text-lg text-gacoan">{formatRupiah(total)}</span>
                </div>
              </div>
              <Button
                onClick={goCheckout}
                className="w-full h-12 rounded-full font-bold text-base shadow-lg shadow-gacoan/30"
              >
                Lanjut Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Harga demo — dapat berubah sesuai outlet.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
