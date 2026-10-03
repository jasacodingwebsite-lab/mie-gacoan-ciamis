"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { spicyLevels } from "@/lib/data/site";
import { cn } from "@/lib/utils";

/** Warna kartu makin hangat sesuai level pedas */
function levelStyle(level: number) {
  if (level === 0) return "border-white/15 bg-white/5 text-white/50";
  if (level <= 2) return "border-white/15 bg-white/5 text-white/70";
  if (level <= 4)
    return "border-gacoan-yellow/50 bg-gacoan-yellow/10 text-gacoan-yellow";
  if (level <= 6)
    return "border-gacoan-orange/60 bg-gacoan-orange/10 text-gacoan-orange";
  if (level === 7)
    return "border-gacoan bg-gacoan/15 text-white shadow-lg shadow-gacoan/25";
  // level 8 — GACOAN MODE
  return "border-gacoan bg-gacoan text-white shadow-xl shadow-gacoan/40";
}

export function SpicyLevels() {
  return (
    <section aria-label="Tingkat kepedasan" className="relative bg-ink py-16 text-white pattern-dots-light sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          kicker="Level Pedas"
          title="SEBERAPA BERANI KAMU? 🌶️"
          subtitle="Sembilan tingkat kepedasan, dari yang aman sampai yang cuma buat legenda."
        />

        <div className="mt-10 grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-9">
          {spicyLevels.map((s, i) => (
            <motion.div
              key={s.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={cn(
                "flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2.5 text-center transition-colors sm:gap-1.5 sm:p-3",
                levelStyle(s.level)
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 sm:text-xs">
                Level {s.level}
              </span>
              <span aria-hidden className="text-sm leading-none sm:text-lg">
                {s.chilies === 0 ? "◦" : "🌶️".repeat(s.chilies)}
              </span>
              <span className="text-[11px] font-bold leading-tight sm:text-sm">{s.label}</span>
              <span className="hidden text-[10px] leading-snug opacity-70 lg:line-clamp-2 lg:block">
                {s.desc}
              </span>
            </motion.div>
          ))}
        </div>

        <Reveal className="mt-8 text-center" delay={0.15}>
          <p className="text-sm text-white/60 sm:text-base">
            Pilih level pas pesan. Berani sampai 8? 🔥
          </p>
        </Reveal>
      </div>
    </section>
  );
}
