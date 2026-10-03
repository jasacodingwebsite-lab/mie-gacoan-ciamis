"use client";

import { Star, Info } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { REVIEWS } from "@/lib/data/reviews";
import { site } from "@/lib/data/site";

export function ReviewsSection() {
  return (
    <section aria-label="Ulasan pelanggan" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Testimoni"
          title="KATA MEREKA"
          subtitle="Cerita para gacoan lover setelah mencoba menu andalan kami."
        />

        {/* Rating besar */}
        <Reveal className="mt-8 flex flex-col items-center gap-1.5 text-center">
          <p className="font-display text-5xl text-ink sm:text-6xl">⭐ 4.9</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" aria-hidden />
            {site.ratingNote}
          </p>
        </Reveal>

        {/* Scroll horizontal */}
        <Reveal delay={0.1}>
          <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
            {REVIEWS.map((r) => (
              <li
                key={r.id}
                className="flex w-[280px] shrink-0 snap-start flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:w-[320px]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gacoan/10 font-bold text-gacoan"
                  >
                    {r.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>

                <p aria-label={`Rating ${r.stars} dari 5 bintang`} className="text-sm">
                  {"⭐".repeat(r.stars)}
                  <span className="sr-only">{`Rating ${r.stars} dari 5 bintang`}</span>
                </p>

                <blockquote className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{r.text}&rdquo;
                </blockquote>

                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  <Star className="h-3 w-3" aria-hidden />
                  Contoh ulasan
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
