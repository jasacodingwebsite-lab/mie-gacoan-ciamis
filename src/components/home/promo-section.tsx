"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { usePromoData } from "@/lib/hooks/use-menu-data";
import { formatRupiah } from "@/lib/format";

/** Harga normal = harga promo × 1.35, dibulatkan ke 500 terdekat */
function normalPrice(price: number) {
  return Math.round((price * 1.35) / 500) * 500;
}

export function PromoSection() {
  const promos = usePromoData().slice(0, 3);

  return (
    <section aria-label="Promo dan paket hemat" className="bg-gacoan-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Jangan Sampai Kehabisan"
          title="PROMO & PAKET HEMAT"
          subtitle="Paket lengkap dengan harga makin bersahabat. Makin rame, makin hemat!"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {promos.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-gacoan/15"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-gacoan px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  {p.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg text-ink sm:text-xl">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

                <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
                  <p className="font-display text-xl text-gacoan sm:text-2xl">
                    Mulai {formatRupiah(p.price)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    {formatRupiah(normalPrice(p.price))}
                  </p>
                </div>

                <Button
                  asChild
                  className="mt-2 min-h-11 w-full rounded-full font-bold shadow-md shadow-gacoan/25"
                >
                  <Link href="/promo">Pesan Sekarang</Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
