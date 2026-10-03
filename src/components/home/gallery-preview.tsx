"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { useGalleryData } from "@/lib/hooks/use-menu-data";

export function GalleryPreview() {
  const gallery = useGalleryData().slice(0, 8);

  return (
    <section aria-label="Galeri momen" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Galeri"
          title="MOMEN DI GACOAN"
          subtitle="Intip suasananya sebelum mampir — siapa tahu kamu kepo pengin langsung datang."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={Math.min(i * 0.05, 0.3)} y={20}>
              <figure className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* overlay caption saat hover */}
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-xs font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
                  {g.caption}
                </figcaption>
                {g.source === "foto-asli" && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    <Camera className="h-2.5 w-2.5" aria-hidden />
                    Foto Asli
                  </span>
                )}
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-h-11 rounded-full border-2 border-gacoan/50 px-8 font-bold text-gacoan hover:bg-gacoan hover:text-white"
          >
            <Link href="/gallery">
              Lihat Galeri
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
