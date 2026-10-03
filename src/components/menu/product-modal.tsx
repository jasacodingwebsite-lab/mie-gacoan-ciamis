"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, ShoppingBag, Flame } from "lucide-react";
import { SpicyMeter } from "@/components/shared/spicy-meter";
import { useCart } from "@/lib/store/cart";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/data/menu";

/**
 * Modal detail produk: foto besar, level pedas 0–8, jumlah,
 * catatan pesanan, dan tombol tambah ke keranjang.
 */
export function ProductModal({
  product,
  open,
  onOpenChange,
}: {
  product: MenuItem;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const [level, setLevel] = useState(4);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [btnRef, setBtnRef] = useState<HTMLButtonElement | null>(null);

  // reset nilai setiap kali modal dibuka (via handler, tanpa effect)
  const handleOpenChange = (o: boolean) => {
    if (o) {
      setLevel(4);
      setQty(1);
      setNote("");
    }
    onOpenChange(o);
  };

  const levels = Array.from({ length: 9 }, (_, i) => i);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      spicyLevel: product.spicy ? level : null,
      qty,
      note,
      flyFrom: btnRef,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 max-h-[92dvh]">
        <div className="grid md:grid-cols-2 overflow-y-auto max-h-[92dvh]">
          {/* Foto besar */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[420px] bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
              priority
            />
            <div className="absolute left-4 top-4 flex gap-1.5">
              {product.popular && (
                <Badge className="bg-gacoan-yellow text-ink border-0 font-bold shadow">
                  🔥 Populer
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-gacoan text-white border-0 font-bold shadow">BARU</Badge>
              )}
            </div>
            {product.spicy && (
              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-white text-xs font-bold flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-gacoan-yellow" aria-hidden />
                Pilih level pedas 0–8
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="flex flex-col p-5 sm:p-6">
            <DialogHeader className="text-left space-y-1.5">
              <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {product.desc}
              </DialogDescription>
            </DialogHeader>

            <p className="mt-2 font-display text-2xl text-gacoan">{formatRupiah(product.price)}</p>

            {/* Level pedas */}
            {product.spicy && (
              <div className="mt-5">
                <p className="text-sm font-bold mb-2 flex items-center gap-1.5">
                  PILIH LEVEL PEDAS <span aria-hidden>🌶️</span>
                </p>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Pilih level pedas">
                  {levels.map((l) => (
                    <button
                      key={l}
                      type="button"
                      role="radio"
                      aria-checked={level === l}
                      onClick={() => setLevel(l)}
                      className={cn(
                        "rounded-xl border-2 px-2 py-2 text-center transition-all min-h-11",
                        level === l
                          ? "border-gacoan bg-gacoan/10 shadow-md shadow-gacoan/10 scale-[1.02]"
                          : "border-border hover:border-gacoan/40"
                      )}
                    >
                      <span className="block text-xs font-bold">Level {l}</span>
                      <SpicyMeter level={l} size="sm" className="justify-center mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Jumlah */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-bold">Jumlah</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                  className="grid h-10 w-10 place-items-center rounded-full border border-input hover:bg-gacoan hover:text-white hover:border-gacoan transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-display text-lg">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Tambah jumlah"
                  className="grid h-10 w-10 place-items-center rounded-full border border-input hover:bg-gacoan hover:text-white hover:border-gacoan transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Catatan */}
            <div className="mt-4">
              <label htmlFor={`note-${product.id}`} className="text-sm font-bold block mb-1.5">
                Catatan pesanan <span className="font-normal text-muted-foreground">(opsional)</span>
              </label>
              <Textarea
                id={`note-${product.id}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: tanpa bawang, pedasnya dikurangi sedikit…"
                className="min-h-20 resize-none"
                maxLength={140}
              />
            </div>

            {/* CTA */}
            <Button
              ref={setBtnRef}
              onClick={handleAdd}
              className="mt-5 h-12 rounded-full font-bold text-base shadow-lg shadow-gacoan/30 w-full"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              Tambahkan ke Keranjang · {formatRupiah(product.price * qty)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
