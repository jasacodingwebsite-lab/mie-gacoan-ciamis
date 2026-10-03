"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

const STATS = [
  { value: "100+", label: "Menu & kombinasi" },
  { value: "0–8", label: "Pilihan level pedas" },
  { value: "7 Hari", label: "Siap menemani nongkrong" },
];

export function AboutPreview() {
  return (
    <section aria-label="Tentang kami" className="bg-background py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* FOTO */}
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/photos/interior-1.jpg"
              alt="Interior restoran Mie Gacoan Ciamis dengan meja kayu"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 w-36 rotate-3 sm:-right-6 sm:w-44">
            <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white shadow-xl">
              <Image
                src="/images/photos/food-spread-1.jpg"
                alt="Aneka mie, dimsum dan minuman untuk berdua"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </div>
          {/* blob dekoratif */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-40 rounded-full bg-gacoan-yellow/20 blur-2xl"
          />
        </Reveal>

        {/* TEKS */}
        <div className="flex flex-col items-start gap-6">
          <SectionHeading
            align="left"
            kicker="Tentang Kami"
            title="LEBIH DARI SEKADAR MIE"
          />
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Mie Gacoan hadir sebagai tempat untuk menikmati mie pedas, dimsum,
              minuman segar, sekaligus tempat berkumpul bersama teman dan keluarga.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="w-full">
            <dl className="grid grid-cols-3 gap-4 border-y border-border py-6">
              {STATS.map((s) => (
                <div key={s.value} className="text-center sm:text-left">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl text-gacoan sm:text-3xl lg:text-4xl">
                    {s.value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <Button
              asChild
              size="lg"
              className="min-h-11 rounded-full px-7 font-bold shadow-lg shadow-gacoan/25"
            >
              <Link href="/about">
                Kenali Kami
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
