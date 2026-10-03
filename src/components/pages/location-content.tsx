"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bike,
  BookmarkPlus,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Star,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { OpenStatusBadge } from "@/components/shared/open-status";
import { site } from "@/lib/data/site";

const fasilitas: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Bike,
    title: "Parkir Motor & Mobil",
    desc: "Luas, gratis, persis di depan outlet.",
  },
  {
    icon: Users,
    title: "Area Nongkrong",
    desc: "Meja panjang buat rame-rame.",
  },
  {
    icon: Wifi,
    title: "WiFi & Colokan",
    desc: "Enak buat nugas sambil makan.",
  },
];

const suasanaFoto = [
  {
    src: "/images/photos/garden-pond.jpg",
    alt: "Area duduk luar dengan kolam ikan dan payung di outlet Mie Gacoan Ciamis",
    caption: "Taman & Kolam",
  },
  {
    src: "/images/photos/exterior-signage.jpg",
    alt: "Bangunan outlet Mie Gacoan Ciamis dengan papan nama besar",
    caption: "Depan Outlet",
  },
  {
    src: "/images/photos/neon-sign-night.jpg",
    alt: "Papan neon Mie Gacoan menyala saat malam hari",
    caption: "Neon Malam Hari",
  },
  {
    src: "/images/photos/counter-tomorrow.jpg",
    alt: "Counter kasir kuning dengan tulisan Today Tomorrow",
    caption: "Counter Antrian",
  },
];

export function LocationContent() {
  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;

  const simpanLokasi = async () => {
    try {
      await navigator.clipboard.writeText(
        site.address + " — " + site.mapsUrl
      );
      toast.success("Lokasi disalin! Tempel di catatanmu 📍");
    } catch {
      toast.error("Gagal menyalin lokasi. Coba salin manual ya!");
    }
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeading
          kicker="LOKASI"
          title="TEMUKAN KAMI"
          subtitle="Mampir, makan, nongkrong. Kami tunggu!"
        />
      </section>

      {/* ===== Info + Peta ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Kartu info outlet */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="space-y-2">
                <h3 className="font-display text-2xl text-ink">
                  MIE GACOAN CIAMIS
                </h3>
                <OpenStatusBadge showTime />
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gacoan-cream text-gacoan">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ink/80">
                    {site.address}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gacoan-cream text-gacoan">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="pt-1.5 text-sm font-semibold text-ink/80">
                    Senin — Minggu · {site.hoursLabel}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gacoan-cream text-gacoan">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <a
                    href={telHref}
                    className="pt-1.5 text-sm font-semibold text-ink/80 transition-colors hover:text-gacoan"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gacoan-cream text-gacoan">
                    <Star className="h-5 w-5 fill-gacoan-yellow text-gacoan-yellow" aria-hidden />
                  </span>
                  <p className="pt-1.5 text-sm text-ink/80">
                    <span className="font-display text-lg text-ink">4.9</span>{" "}
                    <span className="text-xs text-muted-foreground">
                      · {site.ratingNote}
                    </span>
                  </p>
                </li>
              </ul>

              <div className="mt-auto flex flex-col gap-2.5">
                <Button
                  asChild
                  className="h-11 min-h-11 rounded-full bg-gacoan font-bold text-white shadow-md shadow-gacoan/25 hover:bg-gacoan-dark"
                >
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-4 w-4" aria-hidden />
                    Rute di Google Maps
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={simpanLokasi}
                  className="h-11 min-h-11 rounded-full border-gacoan/40 font-bold text-gacoan hover:bg-gacoan hover:text-white"
                >
                  <BookmarkPlus className="h-4 w-4" aria-hidden />
                  Simpan Lokasi
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Peta embed */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <iframe
              src={site.mapsEmbed}
              title="Peta lokasi Mie Gacoan Ciamis"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[420px] w-full rounded-3xl border-0 grayscale-[30%] transition-[filter] duration-300 hover:grayscale-0"
            />
          </Reveal>
        </div>
      </section>

      {/* ===== Fasilitas ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {fasilitas.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gacoan-cream text-gacoan">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Sekilas suasana (foto asli) ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <h3 className="mb-5 font-display text-xl text-ink sm:text-2xl">
            SEKILAS SUASANA OUTLET 📸
          </h3>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suasanaFoto.map((f, i) => (
            <Reveal key={f.src} delay={i * 0.08}>
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm">
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-xs font-bold text-white">
                  {f.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CTA kecil ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-20 text-center sm:px-6 lg:px-8">
        <Reveal>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-gacoan transition-colors hover:bg-gacoan/10"
          >
            Bingung jalan? Chat kami dulu
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
