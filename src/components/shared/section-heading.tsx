"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Heading section konsisten: kicker kecil + judul display + subteks */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "space-y-3",
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left",
        className
      )}
    >
      {kicker && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={cn(
            "inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]",
            dark ? "bg-gacoan/20 text-gacoan-yellow" : "bg-gacoan/10 text-gacoan"
          )}
        >
          {kicker}
        </motion.span>
      )}
      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.05] tracking-tight",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-sm sm:text-base", dark ? "text-white/60" : "text-muted-foreground")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
