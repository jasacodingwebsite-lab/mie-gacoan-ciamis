"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Star, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpenStatusBadge } from "@/components/shared/open-status";

/** Animasi float infinite untuk badge di sekitar foto hero */
function floatY(delay = 0) {
  return {
    animate: { y: [0, -10, 0] },
    transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, delay },
  };
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.9, 0.35, 1] },
  },
};

const FLOATING_BADGES = [
  { emoji: "🌶️", label: "Level Pedas 0–8", className: "-left-3 top-8 sm:-left-6", delay: 0 },
  { emoji: "🥟", label: "Dimsum Favorit", className: "-right-3 top-1/3 sm:-right-8", delay: 0.8 },
  { emoji: "✨", label: "Fresh Every Day", className: "left-6 bottom-8 sm:left-10", delay: 1.6 },
];

export function Hero() {
  return (
    <section
      aria-label="Hero Mie Gacoan Ciamis"
      className="relative overflow-hidden bg-background pattern-dots"
    >
      {/* Blob dekoratif blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-gacoan/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gacoan-yellow/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-gacoan-orange/15 blur-2xl"
      />

      <div className="relative mx-auto grid min-h-[92svh] w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pt-16">
        {/* KIRI — copywriting */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-5 text-left"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center rounded-full bg-gacoan/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gacoan"
          >
            🔥 MIE PEDAS FAVORIT
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            PEDASNYA BIKIN
            <br />
            <span className="relative inline-block text-gacoan">
              NAGIH!
              {/* aksen underline kreatif */}
              <svg
                aria-hidden
                viewBox="0 0 220 20"
                className="absolute -bottom-2 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 14 C 40 4, 80 18, 116 10 S 190 4, 216 12"
                  fill="none"
                  stroke="#ffb800"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Rasakan mie pedas, dimsum gurih, dan minuman segar dalam satu tempat.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="min-h-11 rounded-full px-7 text-base font-bold shadow-lg shadow-gacoan/30 hover:shadow-gacoan/50"
            >
              <Link href="/menu">🍜 Lihat Menu</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-11 rounded-full border-2 border-gacoan/50 px-7 text-base font-bold text-gacoan hover:bg-gacoan hover:text-white"
            >
              <Link href="/menu">🛒 Pesan Sekarang</Link>
            </Button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            variants={item}
            className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
          >
            <OpenStatusBadge showTime />
            <span className="inline-flex items-center gap-1 font-bold text-ink">
              <Star className="h-4 w-4 fill-gacoan-yellow text-gacoan-yellow" aria-hidden />
              4.9
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CarFront className="h-4 w-4 text-gacoan" aria-hidden />
              Parkir luas &amp; gratis
            </span>
          </motion.div>
        </motion.div>

        {/* KANAN — foto + floating badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 0.9, 0.35, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          <div className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-3xl shadow-2xl shadow-gacoan/20">
            <Image
              src="/images/hero-mie.jpg"
              alt="Semangkuk mie pedas Mie Gacoan dengan topping melimpah"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent"
            />
          </div>

          {FLOATING_BADGES.map((b) => (
            <motion.div
              key={b.label}
              {...floatY(b.delay)}
              className={`absolute ${b.className} rounded-2xl bg-white/95 px-3.5 py-2.5 shadow-xl shadow-ink/10 backdrop-blur`}
            >
              <p className="flex items-center gap-1.5 text-xs font-bold text-ink sm:text-sm">
                <span aria-hidden>{b.emoji}</span>
                {b.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
