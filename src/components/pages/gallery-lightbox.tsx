"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/data/gallery";

type GalleryLightboxProps = {
  items: GalleryItem[];
  /** index foto aktif, null = tertutup */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Lightbox fullscreen galeri: klik backdrop tutup, navigasi prev/next
 * dengan wrap-around, keyboard (Esc / ← / →), dan scroll-lock body.
 */
export function GalleryLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: GalleryLightboxProps) {
  const total = items.length;
  const isOpen = index !== null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || total === 0) return;
      // wrap-around: foto terakhir → kembali ke awal, dst.
      onIndexChange((index + dir + total) % total);
    },
    [index, total, onIndexChange]
  );

  // Keyboard navigation — setState dipanggil dari handler event, aman.
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, go, onClose]);

  // Body scroll lock saat lightbox terbuka (tanpa setState).
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (total === 0) return null;
  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${index! + 1} dari ${total}: ${item.caption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Tombol tutup */}
          <button
            type="button"
            aria-label="Tutup galeri"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-gacoan"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>

          {/* Counter */}
          <span className="absolute left-4 top-6 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white sm:left-6">
            {index! + 1} / {total}
          </span>

          {/* Gambar aktif */}
          <motion.figure
            key={item.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-xl bg-black/40",
                item.tall
                  ? "aspect-[3/4] h-[68svh] max-h-[80vh] max-w-[88vw]"
                  : "aspect-[4/3] h-[64svh] max-h-[80vh] max-w-[92vw]"
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 max-w-[90vw] text-center">
              <p className="font-bold text-white">{item.caption}</p>
              <p className="mt-1 text-xs text-white/60">{item.alt}</p>
            </figcaption>
          </motion.figure>

          {/* Navigasi prev / next (wrap-around) */}
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-gacoan sm:left-6"
          >
            <ChevronLeft className="h-7 w-7" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-gacoan sm:right-6"
          >
            <ChevronRight className="h-7 w-7" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
