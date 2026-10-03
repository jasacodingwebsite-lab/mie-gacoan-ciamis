"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GalleryLightbox } from "./gallery-lightbox";
import { useGalleryData } from "@/lib/hooks/use-menu-data";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/data/gallery";

/** Gambar galeri dengan fallback emoji kalau file belum tersedia */
function GalleryImage({
  item,
  sizes,
  priority = false,
}: {
  item: GalleryItem;
  sizes: string;
  priority?: boolean;
}) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div
        className="absolute inset-0 grid place-items-center bg-gradient-to-br from-gacoan-cream via-accent to-gacoan-yellow/30 text-4xl"
        aria-hidden
      >
        📸
      </div>
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setOk(false)}
    />
  );
}

function MasonrySkeleton() {
  const heights = ["aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/3]"];
  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("mb-4 w-full rounded-2xl", heights[i % heights.length])}
        />
      ))}
    </div>
  );
}

export function GalleryContent() {
  const items = useGalleryData();
  const mounted = useMounted();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="pattern-dots">
      {/* ===== Header ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeading
          kicker="GALERI"
          title="MOMEN DI GACOAN"
          subtitle="Foto asli suasana outlet (ditandai) + ilustrasi pendukung."
        />
      </section>

      {/* ===== Masonry ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {mounted ? (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {items.map((item, i) => (
              <Reveal
                key={item.id}
                delay={Math.min(i * 0.04, 0.3)}
                y={18}
                className="mb-4 break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Perbesar foto: ${item.caption}`}
                  className={cn(
                    "group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-muted text-left",
                    item.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                  )}
                >
                  <GalleryImage
                    item={item}
                    priority={i < 4}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Badge sumber foto */}
                  <span
                    className={cn(
                      "absolute right-2 top-2 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm",
                      item.source === "foto-asli"
                        ? "bg-gacoan-yellow text-ink"
                        : "bg-white/80 text-ink"
                    )}
                  >
                    {item.source === "foto-asli" ? "📸 Foto Asli" : "✏️ Ilustrasi"}
                  </span>

                  {/* Overlay gradient bawah + caption */}
                  <span className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-1.5 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-10 opacity-90 transition-opacity group-hover:opacity-100">
                    <Camera
                      className="mb-0.5 h-3.5 w-3.5 shrink-0 text-white/80"
                      aria-hidden
                    />
                    <span className="text-xs font-bold leading-tight text-white">
                      {item.caption}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <MasonrySkeleton />
        )}
      </section>

      {/* ===== Lightbox ===== */}
      <GalleryLightbox
        items={items}
        index={activeIndex}
        onIndexChange={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}
