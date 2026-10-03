"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/store/orders";

/** Header standar tiap halaman admin: judul font-display + deskripsi kecil. */
export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PREPARING: "Diproses",
  READY: "Siap Diambil",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING: "border-transparent bg-yellow-100 text-yellow-700",
  CONFIRMED: "border-transparent bg-emerald-100 text-emerald-700",
  PREPARING: "border-transparent bg-orange-100 text-orange-700",
  READY: "border-transparent bg-gacoan-yellow/20 text-ink",
  COMPLETED: "border-transparent bg-emerald-500/15 text-emerald-600",
  CANCELLED: "border-transparent bg-red-100 text-red-600",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("rounded-full px-2.5", STATUS_BADGE_CLASS[status])}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

/** Skeleton dasar untuk halaman admin saat store belum ter-mount. */
export function AdminSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="h-8 w-52 animate-pulse rounded-xl bg-muted" />
      <div className="h-4 w-72 animate-pulse rounded-lg bg-muted" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
