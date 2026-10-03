"use client";

import { MapPin, Clock, Phone, Star, Navigation, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { OpenStatusBadge } from "@/components/shared/open-status";
import { site } from "@/lib/data/site";

export function LocationSection() {
  const copyAddress = () => {
    navigator.clipboard
      .writeText(site.address)
      .then(() => toast.success("Alamat berhasil disalin!"))
      .catch(() => toast.error("Gagal menyalin alamat."));
  };

  return (
    <section aria-label="Lokasi outlet" className="bg-gacoan-cream/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Lokasi"
          title="TEMUKAN KAMI"
          subtitle="Mampir kapan saja — kami buka setiap hari dari pagi sampai malam."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* INFO OUTLET */}
          <Reveal>
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-2xl text-ink sm:text-3xl">
                MIE GACOAN CIAMIS
              </h3>

              <ul className="space-y-4 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gacoan" aria-hidden />
                  <span className="text-muted-foreground">{site.address}</span>
                </li>
                <li>
                  <OpenStatusBadge showTime />
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-gacoan" aria-hidden />
                  <span className="text-muted-foreground">
                    Senin — Minggu · {site.hoursLabel}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-gacoan" aria-hidden />
                  <a
                    href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                    className="text-muted-foreground underline-offset-4 hover:text-gacoan hover:underline"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="h-5 w-5 fill-gacoan-yellow text-gacoan-yellow" aria-hidden />
                  <span className="font-bold text-ink">4.9</span>
                  <span className="text-xs text-muted-foreground">{site.ratingNote}</span>
                </li>
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
                <Button
                  asChild
                  className="min-h-11 flex-1 rounded-full font-bold shadow-md shadow-gacoan/25"
                >
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="mr-1.5 h-4 w-4" aria-hidden />
                    Rute di Google Maps
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={copyAddress}
                  className="min-h-11 flex-1 rounded-full border-2 border-gacoan/50 font-bold text-gacoan hover:bg-gacoan hover:text-white"
                >
                  <Bookmark className="mr-1.5 h-4 w-4" aria-hidden />
                  Simpan Lokasi
                </Button>
              </div>
            </div>
          </Reveal>

          {/* PETA */}
          <Reveal delay={0.1} className="h-full">
            <iframe
              title="Peta Mie Gacoan Ciamis"
              src={site.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[360px] w-full rounded-2xl border-0 shadow-sm"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
