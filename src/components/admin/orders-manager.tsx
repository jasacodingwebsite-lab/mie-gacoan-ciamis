"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  ShoppingBag,
  Bike,
  History,
  MapPin,
  StickyNote,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders, type OrderStatus } from "@/lib/store/orders";
import { paymentMethods } from "@/lib/data/site";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah, formatDateTime } from "@/lib/format";
import {
  AdminPageHeader,
  AdminSkeleton,
  ORDER_STATUS_LABELS,
  OrderStatusBadge,
} from "@/components/admin/shared";
import { cn } from "@/lib/utils";

const STATUS_LIST: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

const CHIP_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-gacoan-yellow/20 text-ink",
  COMPLETED: "bg-emerald-500/15 text-emerald-600",
  CANCELLED: "bg-red-100 text-red-600",
};

function shortDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function paymentLabel(id: string) {
  return paymentMethods.find((p) => p.id === id)?.label ?? id;
}

export function OrdersManager() {
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);
  const updateStatus = useOrders((s) => s.updateStatus);

  const [statusFilter, setStatusFilter] = useState<"SEMUA" | OrderStatus>("SEMUA");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.total, 0);
    const perStatus = STATUS_LIST.map((s) => ({
      status: s,
      count: orders.filter((o) => o.status === s).length,
    }));
    return { revenue, perStatus };
  }, [orders]);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "SEMUA" || o.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const detail = orders.find((o) => o.id === detailId) ?? null;

  function changeStatus(id: string, status: OrderStatus) {
    updateStatus(id, status);
    toast.success("Status pesanan diperbarui!");
  }

  return (
    <div>
      <AdminPageHeader
        title="Pesanan"
        description="Pantau pesanan masuk dan perbarui statusnya secara langsung."
      />

      {/* Statistik mini */}
      <div className="mb-6 grid gap-3 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Total Order</p>
            {!mounted ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Revenue (non-batal)
            </p>
            {!mounted ? (
              <Skeleton className="mt-1 h-7 w-28" />
            ) : (
              <p className="text-2xl font-bold text-gacoan">{formatRupiah(stats.revenue)}</p>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Per Status</p>
            <div className="flex flex-wrap gap-1.5">
              {!mounted ? (
                <Skeleton className="h-7 w-full" />
              ) : (
                stats.perStatus.map((s) => (
                  <button
                    key={s.status}
                    type="button"
                    onClick={() =>
                      setStatusFilter((prev) => (prev === s.status ? "SEMUA" : s.status))
                    }
                    className={cn(
                      "inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-transform hover:scale-105",
                      CHIP_CLASS[s.status],
                      statusFilter === s.status && "ring-2 ring-gacoan ring-offset-1"
                    )}
                    aria-label={`Filter status ${ORDER_STATUS_LABELS[s.status]} (${s.count})`}
                  >
                    {ORDER_STATUS_LABELS[s.status]}
                    <span className="font-mono">{s.count}</span>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor pesanan atau nama pelanggan…"
            className="min-h-11 pl-9"
            aria-label="Cari pesanan"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "SEMUA" | OrderStatus)}
        >
          <SelectTrigger className="min-h-11 w-full sm:w-52" aria-label="Filter status">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SEMUA">Semua Status</SelectItem>
            {STATUS_LIST.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!mounted ? (
        <AdminSkeleton rows={5} />
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-gacoan-cream/60 px-6 py-12 text-center">
          <span className="text-3xl" aria-hidden>
            🧾
          </span>
          <p className="max-w-md text-sm text-muted-foreground">
            Belum ada pesanan masuk. Buka /checkout sebagai customer untuk membuat
            pesanan demo.
          </p>
          <Button
            asChild
            className="min-h-11 rounded-full bg-gacoan px-5 text-white hover:bg-gacoan-dark"
          >
            <Link href="/checkout">
              <ShoppingBag className="h-4 w-4" aria-hidden />
              Buat Pesanan Demo
            </Link>
          </Button>
        </div>
      ) : (
        <Card className="rounded-2xl border-border/70 p-0 shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada pesanan yang cocok dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="whitespace-nowrap font-mono text-sm font-semibold text-ink">
                        {o.id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {shortDateTime(o.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {o.customer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {o.customer.whatsapp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-full whitespace-nowrap border-border text-foreground"
                        >
                          {o.method === "delivery" ? (
                            <>
                              <Bike className="h-3 w-3 text-gacoan" aria-hidden />
                              Diantar
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-3 w-3 text-gacoan-orange" aria-hidden />
                              Ambil Sendiri
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {paymentLabel(o.payment)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-bold text-gacoan">
                        {formatRupiah(o.total)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={o.status}
                          onValueChange={(v) => changeStatus(o.id, v as OrderStatus)}
                        >
                          <SelectTrigger
                            className="h-9 w-36 rounded-full text-xs font-semibold"
                            aria-label={`Ubah status pesanan ${o.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_LIST.map((s) => (
                              <SelectItem key={s} value={s}>
                                {ORDER_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-11 w-11"
                          onClick={() => setDetailId(o.id)}
                          aria-label={`Lihat detail pesanan ${o.id}`}
                        >
                          <Eye className="h-4 w-4" aria-hidden />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Dialog detail pesanan */}
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetailId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          {detail ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-3 font-display text-xl">
                  <span className="font-mono text-base">{detail.id}</span>
                  <OrderStatusBadge status={detail.status} />
                </DialogTitle>
                <DialogDescription>
                  Dibuat {formatDateTime(detail.createdAt)} • Outlet {detail.outlet}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                {/* Item list */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">Item Pesanan</p>
                  <ul className="max-h-48 space-y-2 overflow-y-auto rounded-xl bg-muted/50 p-3">
                    {detail.items.map((it) => (
                      <li key={it.key} className="flex items-start justify-between gap-3 text-sm">
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {it.name} <span className="text-muted-foreground">×{it.qty}</span>
                          </p>
                          {it.spicyLevel !== null ? (
                            <p className="text-xs text-gacoan">Level pedas {it.spicyLevel}</p>
                          ) : null}
                          {it.note ? (
                            <p className="text-xs italic text-muted-foreground">
                              Catatan: {it.note}
                            </p>
                          ) : null}
                        </div>
                        <span className="whitespace-nowrap font-semibold text-foreground">
                          {formatRupiah(it.price * it.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatRupiah(detail.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Biaya layanan</span>
                      <span>{formatRupiah(detail.service)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-gacoan">{formatRupiah(detail.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-xl border border-border/70 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span>
                      Metode:{" "}
                      <strong className="text-foreground">
                        {detail.method === "delivery" ? "Diantar" : "Ambil Sendiri"}
                      </strong>{" "}
                      • {paymentLabel(detail.payment)}
                    </span>
                  </div>
                  {detail.address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span>
                        Alamat: <span className="text-muted-foreground">{detail.address}</span>
                      </span>
                    </div>
                  ) : null}
                  {detail.customer.note ? (
                    <div className="flex items-start gap-2">
                      <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span>
                        Catatan: <span className="text-muted-foreground">{detail.customer.note}</span>
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Riwayat status */}
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <History className="h-4 w-4 text-muted-foreground" aria-hidden />
                    Riwayat Status
                  </p>
                  <ol className="space-y-0">
                    {detail.history.map((h, i) => (
                      <li key={`${h.status}-${h.at}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
                        {i < detail.history.length - 1 ? (
                          <span
                            className="absolute left-[5px] top-4 h-full w-px bg-border"
                            aria-hidden
                          />
                        ) : null}
                        <span
                          className={cn(
                            "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                            h.status === "CANCELLED" ? "bg-destructive" : "bg-gacoan"
                          )}
                          aria-hidden
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {ORDER_STATUS_LABELS[h.status]}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(h.at)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="min-h-11 rounded-full"
                onClick={() => setDetailId(null)}
              >
                <Link href="/order/track">
                  Lacak sebagai Customer
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
