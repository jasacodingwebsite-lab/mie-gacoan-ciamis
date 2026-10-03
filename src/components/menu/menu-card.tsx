"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductModal } from "./product-modal";
import { SpicyMeter } from "@/components/shared/spicy-meter";
import { useCart } from "@/lib/store/cart";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/data/menu";

/** Skeleton untuk loading state produk */
export function MenuCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MenuCard({
  product,
  index = 0,
  className,
}: {
  product: MenuItem;
  index?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const addItem = useCart((s) => s.addItem);
  const [ref, setRef] = useState<HTMLButtonElement | null>(null);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      spicyLevel: product.spicy ? 4 : null,
      flyFrom: ref,
    });
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4), ease: "easeOut" }}
        className={cn(
          "group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden",
          "shadow-sm hover:shadow-xl hover:shadow-gacoan/10 hover:-translate-y-1 transition-all duration-300",
          !product.available && "opacity-70",
          className
        )}
      >
        {/* Foto */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block aspect-square w-full overflow-hidden bg-muted"
          aria-label={`Lihat detail ${product.name}`}
        >
          {imgOk ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgOk(false)}
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-5xl" aria-hidden>
              🍜
            </span>
          )}

          {/* badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {product.popular && (
              <Badge className="bg-gacoan-yellow text-ink border-0 font-bold text-[10px] shadow">
                🔥 Populer
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-gacoan text-white border-0 font-bold text-[10px] shadow">
                BARU
              </Badge>
            )}
          </div>

          {!product.available && (
            <div className="absolute inset-0 grid place-items-center bg-black/55">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-ink">
                Habis
              </span>
            </div>
          )}

          {product.spicy && (
            <span className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow">
              <Flame className="h-4 w-4 text-gacoan" aria-hidden />
            </span>
          )}
        </button>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
          <button type="button" onClick={() => setOpen(true)} className="text-left">
            <h3 className="font-bold text-sm sm:text-base leading-tight group-hover:text-gacoan transition-colors">
              {product.name}
            </h3>
          </button>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.desc}
          </p>
          {product.spicy && <SpicyMeter level={4} size="sm" className="mt-0.5" />}

          <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
            <p className="font-display text-sm sm:text-base text-gacoan">
              {formatRupiah(product.price)}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                ref={setRef}
                size="icon"
                onClick={quickAdd}
                disabled={!product.available}
                aria-label={`Tambah ${product.name} ke keranjang`}
                className="h-9 w-9 rounded-full shadow-md shadow-gacoan/25"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
                disabled={!product.available}
                className="h-9 rounded-full px-3 text-xs font-bold border-gacoan/40 text-gacoan hover:bg-gacoan hover:text-white"
              >
                Tambah
              </Button>
            </div>
          </div>
        </div>
      </motion.article>

      <ProductModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}
