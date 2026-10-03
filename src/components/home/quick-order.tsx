"use client";

import Link from "next/link";
import { ShoppingBag, Bike, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { motion } from "framer-motion";

const METHODS = [
  {
    icon: ShoppingBag,
    title: "PESAN & AMBIL",
    desc: "Pesan terlebih dahulu, kemudian ambil pesananmu di outlet.",
    cta: "Pesan Ambil",
    href: "/checkout?method=pickup",
    emoji: "🏃",
  },
  {
    icon: Bike,
    title: "PESAN ANTAR",
    desc: "Pesan makanan favoritmu dan nikmati dari tempatmu.",
    cta: "Pesan Antar",
    href: "/checkout?method=delivery",
    emoji: "🛵",
  },
];

export function QuickOrder() {
  return (
    <section aria-label="Cara pesan" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Cara Pesan"
          title="MAU PESAN GIMANA?"
          subtitle="Pilih cara favoritmu — mampir langsung atau diantar sampai depan pintu."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
          {METHODS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group flex h-full flex-col items-start gap-4 rounded-2xl border-2 border-border bg-card p-6 transition-colors duration-300 hover:border-gacoan hover:shadow-xl hover:shadow-gacoan/10 sm:p-8"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gacoan text-white shadow-lg shadow-gacoan/30">
                    <m.icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="font-display text-xl text-ink sm:text-2xl">{m.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {m.desc} <span aria-hidden>{m.emoji}</span>
                </p>
                <Button
                  asChild
                  className="mt-auto min-h-11 rounded-full px-6 font-bold shadow-md shadow-gacoan/25 group-hover:shadow-gacoan/40"
                >
                  <Link href={m.href}>
                    {m.cta}
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
