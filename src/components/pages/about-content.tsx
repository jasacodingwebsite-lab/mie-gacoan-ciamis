"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { site } from "@/lib/data/site";

const nilaiGacoan = [
  { emoji: "🌶️", text: "Level pedas 0–8 sesuai berani kamu" },
  { emoji: "🥟", text: "Dimsum & gorengan fresh every day" },
  { emoji: "🛋️", text: "Suasana enak buat nongkrong & nugas" },
];

const stats = [
  { angka: "100+", label: "Menu & kombinasi" },
  { angka: "0–8", label: "Pilihan level pedas" },
  { angka: "7 Hari", label: "Siap menemani nongkrong" },
];

const crewFoto = [
  {
    src: "/images/photos/crew-gacoan-sign.jpg",
    alt: "Crew Mie Gacoan Ciamis berpose di depan papan nama outlet",
    caption: "Crew Gacoan Ciamis",
  },
  {
    src: "/images/photos/crew-yellow-wall.jpg",
    alt: "Crew Mie Gacoan berpose di depan dinding kuning bertuliskan Gacoan",
    caption: "Siap Nambah Level 🌶️",
  },
  {
    src: "/images/photos/cashier-counter.jpg",
    alt: "Kasir Mie Gacoan Ciamis siap melayani pesanan",
    caption: "Kasir Siap Melayani",
  },
];

const stripFoto = [
  {
    src: "/images/photos/garden-pond.jpg",
    alt: "Area duduk luar dengan kolam ikan dan payung di outlet Mie Gacoan Ciamis",
  },
  {
    src: "/images/photos/interior-4.jpg",
    alt: "Meja kayu panjang dengan tanaman gantung di dalam outlet",
  },
  {
    src: "/images/photos/neon-sign-night.jpg",
    alt: "Papan neon Mie Gacoan menyala saat malam hari",
  },
  {
    src: "/images/photos/feast-together.jpg",
    alt: "Anak muda makan mie dan dimsum bersama di meja kayu",
  },
  {
    src: "/images/photos/exterior-signage.jpg",
    alt: "Bangunan outlet Mie Gacoan Ciamis dengan papan nama besar",
  },
  {
    src: "/images/photos/food-spread-4.jpg",
    alt: "Aneka mie, dimsum dan minuman berwarna-warni di atas meja",
  },
];

export function AboutContent() {
  return (
    <div>
      {/* ===== Hero kecil ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeading
          kicker="TENTANG KAMI"
          title="LEBIH DARI SEKADAR MIE"
          subtitle="Mie Gacoan hadir sebagai tempat untuk menikmati mie pedas, dimsum, minuman segar, sekaligus tempat berkumpul bersama teman dan keluarga."
        />
      </section>

      {/* ===== Cerita + foto ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Kiri: komposisi foto */}
          <Reveal className="pb-8">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg shadow-ink/10">
                <Image
                  src="/images/photos/interior-1.jpg"
                  alt="Interior Mie Gacoan Ciamis dengan meja kayu dan tanaman gantung"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Overlay foto kecil di pojok */}
              <div className="absolute -bottom-2 right-3 w-36 rotate-3 overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:-right-4 sm:w-52">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/photos/exterior-mural.jpg"
                    alt="Mural hijau bertuliskan Gacoan di dinding outlet"
                    fill
                    sizes="(max-width: 640px) 144px, 208px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Kanan: cerita brand */}
          <div className="space-y-5">
            <Reveal delay={0.05}>
              <h3 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                Dari mie pedas yang bikin nagih,{" "}
                <span className="text-gacoan">buat kamu yang gacoan.</span>
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="leading-relaxed text-muted-foreground">
                Cerita kami mulai dari satu hal sederhana: seporsi mie pedas
                yang susah dilupain. Di Mie Gacoan Ciamis, setiap mangkuk
                dimasak fresh dengan bumbu khas yang bikin kamu balik lagi
                besoknya — iya, segitunya.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="leading-relaxed text-muted-foreground">
                Bukan cuma mie. Dimsum kami disiapkan setiap hari dan digoreng
                dadakan pas kamu pesan, ditemani minuman segar yang pas buat
                meredam pedas. Dari level 0 buat yang manja lidah, sampai level
                8 buat para legenda.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="leading-relaxed text-muted-foreground">
                Outlet kami di Jalan Ahmad Yani jadi tempat nongkrong favorit
                anak muda Ciamis — meja panjang, suasana asik, WiFi kencang.
                Mau nugas, santai, atau rame-rame? Sini, kursinya udah kami
                siapin.
              </p>
            </Reveal>

            {/* Nilai / bullet */}
            <Reveal delay={0.25}>
              <ul className="space-y-3 pt-2">
                {nilaiGacoan.map((n) => (
                  <li key={n.text} className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gacoan-cream text-xl"
                      aria-hidden
                    >
                      {n.emoji}
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {n.text}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Stats band ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <p className="font-display text-4xl text-gacoan">{s.angka}</p>
                <p className="mt-2 text-sm font-semibold text-ink/70">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Crew / tim ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="TIM KAMI"
            title="CREW GACOAN CIAMIS 👋"
            subtitle="Di balik setiap mangkuk pedas, ada crew yang siap nyiapin pesananmu sambil senyum. Foto asli, bukan stok foto!"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {crewFoto.map((f, i) => (
            <Reveal key={f.src} delay={i * 0.08}>
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm">
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
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

      {/* ===== Strip galeri horizontal ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="font-display text-xl text-ink sm:text-2xl">
              SNEAK PEEK OUTLET 📸
            </h3>
            <Button
              asChild
              variant="outline"
              className="hidden h-10 shrink-0 rounded-full border-gacoan/40 px-5 text-xs font-bold text-gacoan hover:bg-gacoan hover:text-white sm:inline-flex"
            >
              <Link href="/gallery">Lihat Galeri</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {stripFoto.map((f) => (
              <div
                key={f.src}
                className="relative h-48 w-72 shrink-0 snap-start overflow-hidden rounded-2xl sm:w-80"
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gacoan px-6 py-10 text-center sm:px-10 sm:py-14">
            <div
              className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-gacoan-yellow/30 blur-3xl"
              aria-hidden
            />
            <h3 className="font-display text-2xl text-white sm:text-3xl">
              Mau lihat langsung? 👀
            </h3>
            <p className="mx-auto mt-3 flex max-w-md flex-wrap items-center justify-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-4 w-4" aria-hidden />
              {site.shortAddress}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-11 min-h-11 w-full rounded-full bg-ink px-8 font-bold text-white hover:bg-ink-soft sm:w-auto"
              >
                <Link href="/location">
                  Kunjungi Outlet
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-11 min-h-11 w-full rounded-full border-2 border-white/70 bg-transparent px-8 font-bold text-white hover:bg-white hover:text-gacoan sm:w-auto"
              >
                <Link href="/menu">
                  <UtensilsCrossed className="h-4 w-4" aria-hidden />
                  Lihat Menu
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
