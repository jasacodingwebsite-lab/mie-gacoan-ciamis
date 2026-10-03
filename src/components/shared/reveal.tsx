"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Wrapper scroll-reveal memakai framer-motion (fade + slide up). */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.9, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
