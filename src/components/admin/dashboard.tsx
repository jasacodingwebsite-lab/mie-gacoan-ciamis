"use client";

import Link from "next/link";
import {
  ClipboardList,
  Wallet,
  UtensilsCrossed,
  Flame,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useOrders } from "@/lib/store/orders";
import { useMenuData } from "@/lib/hooks/use-menu-data";
import { formatRupiah } from "@/lib/format";
import { AdminPageHeader, OrderStatusBadge } from "@/components/admin/shared";

function shortDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof ClipboardList;
  accent?: boolean;
}) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
        <span
          className={
            accent
              ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gacoan text-white"
              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gacoan-yellow/20 text-ink"
          }
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="truncate text-lg font-bold text-foreground sm:text-xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);
  const menu = useMenuData();

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);
  const today = new Date().toDateString();
  const todayCount = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  ).length;
  const recent = orders.slice(0, 5);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan aktivitas outlet — pesanan, pendapatan, dan menu."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {!mounted ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Order"
              value={String(orders.length)}
              icon={ClipboardList}
            />
            <StatCard
              label="Total Revenue"
              value={formatRupiah(revenue)}
              icon={Wallet}
              accent
            />
            <StatCard
              label="Total Produk"
              value={String(menu.length)}
              icon={UtensilsCrossed}
            />
            <StatCard
              label="Pesanan Hari Ini"
              value={String(todayCount)}
              icon={Flame}
              accent
            />
          </>
        )}
      </div>

      {/* Pesanan terbaru */}
      <Card className="mt-6 rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="font-display text-lg tracking-tight">
            Pesanan Terbaru
          </CardTitle>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full text-gacoan hover:bg-gacoan/10 hover:text-gacoan-dark"
          >
            <Link href="/admin/orders">
              Kelola
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!mounted ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-gacoan-cream/60 px-6 py-10 text-center">
              <span className="text-3xl" aria-hidden>
                🛒
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                Belum ada pesanan masuk. Coba buat pesanan dari halaman customer!
              </p>
              <Button
                asChild
                size="sm"
                className="min-h-11 rounded-full bg-gacoan px-5 text-white hover:bg-gacoan-dark"
              >
                <Link href="/checkout">
                  <ShoppingBag className="h-4 w-4" aria-hidden />
                  Buka Halaman Checkout
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {recent.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border/70 bg-gacoan-cream/40 px-4 py-3"
                >
                  <span className="font-mono text-sm font-semibold text-ink">
                    {o.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {shortDateTime(o.createdAt)}
                  </span>
                  <span className="ml-auto text-sm font-bold text-gacoan">
                    {formatRupiah(o.total)}
                  </span>
                  <OrderStatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
