"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/reveal";

const FLOATING_EMOJIS = [
  { emoji: "🌶️", className: "left-[6%] top-[18%]", size: "text-4xl sm:text-5xl", delay: 0 },
  { emoji: "🔥", className: "right-[8%] top-[24%]", size: "text-3xl sm:text-4xl", delay: 0.7 },
  { emoji: "🥟", className: "left-[12%] bottom-[16%]", size: "text-3xl sm:text-4xl", delay: 1.4 },
  { emoji: "🍜", className: "right-[14%] bottom-[20%]", size: "text-4xl sm:text-5xl", delay: 2.1 },
];

export function CtaSection() {
  return (
    <section
      aria-label="Ajakan pesan"
      className="relative overflow-hidden bg-ink py-20 sm:py-28"
    >
      {/* Background image */}
      <Image
        src="/images/hero-mie.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/60" />

      {/* Emoji floating dekoratif */}
      {FLOATING_EMOJIS.map((e) => (
        <motion.span
          key={e.emoji + e.className}
          aria-hidden
          className={`pointer-events-none absolute select-none ${e.className} ${e.size} opacity-70`}
          animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: e.delay }}
        >
          {e.emoji}
        </motion.span>
      ))}

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            LAGI NGIDAM MIE PEDAS?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base text-white/70 sm:text-lg">
            Jangan cuma dibayangin. Langsung pesan sekarang!
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/menu"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-gacoan-yellow px-8 font-display text-lg text-ink shadow-2xl shadow-gacoan-yellow/30 transition-colors hover:bg-gacoan-yellow/90"
            >
              🍜 PESAN SEKARANG
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
