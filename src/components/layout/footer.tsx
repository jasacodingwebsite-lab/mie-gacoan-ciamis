"use client";

import Link from "next/link";
import { Flame, MapPin, Clock, Phone, Instagram, Facebook, Music2, Store, Bike, PackageSearch } from "lucide-react";
import { navLinks, site } from "@/lib/data/site";
import { OpenStatusBadge } from "@/components/shared/open-status";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
};

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gacoan text-white">
                <Flame className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-xl leading-none">
                MIE <span className="text-gacoan-yellow">GACOAN</span>
                <span className="block text-[9px] font-sans font-bold text-white/50 tracking-[0.25em] uppercase">
                  Ciamis
                </span>
              </span>
            </Link>
            <p className="text-sm text-white/70 max-w-xs">{site.tagline}</p>
            <OpenStatusBadge dark />
            <div className="flex items-center gap-2">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon] ?? Instagram;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-gacoan transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Menu links */}
          <nav aria-label="Menu footer">
            <h3 className="font-display text-sm tracking-widest text-gacoan-yellow mb-4">MENU</h3>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Order links */}
          <nav aria-label="Pesan footer">
            <h3 className="font-display text-sm tracking-widest text-gacoan-yellow mb-4">ORDER</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/checkout?method=pickup" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2">
                  <Store className="h-4 w-4 text-gacoan-yellow" /> Pesan Ambil
                </Link>
              </li>
              <li>
                <Link href="/checkout?method=delivery" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2">
                  <Bike className="h-4 w-4 text-gacoan-yellow" /> Pesan Antar
                </Link>
              </li>
              <li>
                <Link href="/order/track" className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2">
                  <PackageSearch className="h-4 w-4 text-gacoan-yellow" /> Lacak Pesanan
                </Link>
              </li>
            </ul>
            <h3 className="font-display text-sm tracking-widest text-gacoan-yellow mt-6 mb-3">INFO</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gacoan-yellow" aria-hidden />
                <span>{site.shortAddress}</span>
              </li>
              <li className="flex gap-2">
                <Clock className="h-4 w-4 shrink-0 mt-0.5 text-gacoan-yellow" aria-hidden />
                <span>Setiap hari, {site.hoursLabel} WIB</span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-gacoan-yellow" aria-hidden />
                <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
            </ul>
          </nav>

          {/* Outlet card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-display text-sm tracking-widest text-gacoan-yellow mb-3">OUTLET KAMI</h3>
            <p className="font-bold">{site.outletName}</p>
            <p className="mt-2 text-sm text-white/70">{site.address}</p>
            <Link
              href="/location"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gacoan-yellow hover:underline"
            >
              Lihat Lokasi & Rute →
            </Link>
            <p className="mt-4 text-[11px] leading-relaxed text-white/40">
              {site.priceDisclaimer}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-white/50">
          <p>{site.copyright}</p>
          <p>
            Website demo — tidak berafiliasi resmi dengan brand Mie Gacoan.
          </p>
        </div>
      </div>
    </footer>
  );
}
