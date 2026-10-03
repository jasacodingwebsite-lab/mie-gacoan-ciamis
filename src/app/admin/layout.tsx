"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  TicketPercent,
  Images,
  Settings,
  Menu as MenuIcon,
  ExternalLink,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/promo", label: "Promo", icon: TicketPercent },
  { href: "/admin/gallery", label: "Galeri", icon: Images },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

/** Isi sidebar — dipakai bersama oleh aside desktop & sheet mobile. */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-5 pb-6 pt-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-2"
          aria-label="Beranda Admin"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gacoan text-white">
            <Flame className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg leading-none tracking-tight text-white">
            MIE GACOAN
          </span>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge className="border-transparent bg-gacoan-yellow text-ink">Admin</Badge>
          <span className="text-[11px] text-white/50">Demo tanpa login</span>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Navigasi admin">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-gacoan text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bawah */}
      <div className="space-y-3 px-5 pb-6 pt-4">
        <Button
          asChild
          variant="outline"
          className="w-full rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/" onClick={onNavigate}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            Lihat Website
          </Link>
        </Button>
        <p className="text-[11px] leading-relaxed text-white/40">
          Demo admin — data tersimpan di localStorage browser ini.
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col bg-ink lg:flex">
        <SidebarContent />
      </aside>

      {/* Konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar mobile */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-ink px-4 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2" aria-label="Beranda Admin">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gacoan text-white">
              <Flame className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-display text-base tracking-tight text-white">MIE GACOAN</span>
            <Badge className="border-transparent bg-gacoan-yellow text-ink">Admin</Badge>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 w-11 text-white hover:bg-white/10 hover:text-white"
                aria-label="Buka menu navigasi admin"
              >
                <MenuIcon className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 border-r-0 bg-ink p-0 text-white [&>button]:text-white/70"
            >
              <SheetTitle className="sr-only">Navigasi Admin</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="min-h-svh flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
