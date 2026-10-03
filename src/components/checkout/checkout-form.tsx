"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bike,
  Flame,
  Loader2,
  MapPin,
  ReceiptText,
  ShoppingBasket,
  Store,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cartTotals, useCart } from "@/lib/store/cart";
import { useAdmin } from "@/lib/store/admin";
import {
  useOrders,
  type OrderMethod,
  type PaymentMethod,
} from "@/lib/store/orders";
import { useMounted } from "@/lib/hooks/use-mounted";
import { paymentMethods, site } from "@/lib/data/site";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const OUTLET_LABEL = "Mie Gacoan Ciamis — Jl. Jenderal Ahmad Yani No.43";

type FieldErrors = { name: boolean; whatsapp: boolean; address: boolean };

export function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();

  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const serviceFee = useAdmin((s) => s.settings.serviceFee);
  const createOrder = useOrders((s) => s.createOrder);

  const { subtotal, service, total, count } = cartTotals(items, serviceFee);

  // Query ?method=delivery|pickup sebagai default metode
  const initialMethod: OrderMethod =
    searchParams.get("method") === "delivery" ? "delivery" : "pickup";

  const [method, setMethod] = useState<OrderMethod>(initialMethod);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("QRIS");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({
    name: false,
    whatsapp: false,
    address: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Keranjang kosong — tambahkan menu dulu!");
      return;
    }

    const digits = whatsapp.replace(/[\s-]/g, "");
    const waOk = /^\+?\d{9,15}$/.test(digits);
    const nameOk = name.trim().length > 0;
    const addressOk = method === "pickup" || address.trim().length > 0;

    if (!nameOk || !waOk || !addressOk) {
      setErrors({
        name: !nameOk,
        whatsapp: !waOk,
        address: method === "delivery" && !addressOk,
      });
      toast.error("Lengkapi data pemesan dulu ya!");
      return;
    }

    setErrors({ name: false, whatsapp: false, address: false });
    setLoading(true);

    window.setTimeout(() => {
      try {
        const order = createOrder({
          method,
          customer: {
            name: name.trim(),
            whatsapp: digits,
            note: note.trim() || undefined,
          },
          address: method === "delivery" ? address.trim() : undefined,
          outlet: "Mie Gacoan Ciamis",
          payment,
          items,
          subtotal,
          service,
          total,
        });
        clearCart();
        router.push(`/order/success?id=${order.id}`);
      } catch {
        setLoading(false);
        toast.error("Pesanan belum berhasil dibuat. Silakan coba lagi.");
      }
    }, 900);
  };

  /* ===== Empty state: keranjang kosong ===== */
  if (mounted && items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-6 font-display text-2xl tracking-tight sm:text-3xl">
          CHECKOUT
        </h1>
        <div className="grid min-h-[50vh] place-items-center text-center">
          <div className="space-y-4">
            <div
              className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-muted text-6xl"
              aria-hidden
            >
              🛒
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold">Keranjang kamu masih kosong.</p>
              <p className="text-sm text-muted-foreground">
                Tambahkan menu dulu sebelum checkout ya!
              </p>
            </div>
            <Button
              asChild
              className="h-11 rounded-full px-8 font-bold shadow-lg shadow-gacoan/30"
            >
              <Link href="/menu">Lihat Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ===== Skeleton sebelum hydrate ===== */
  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="h-8 w-56 rounded bg-muted animate-pulse" />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border bg-card p-6 animate-pulse"
              >
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-2xl border bg-card p-6 animate-pulse">
            <div className="h-5 w-1/2 rounded bg-muted" />
            <div className="h-24 w-full rounded bg-muted" />
            <div className="h-12 w-full rounded-full bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <h1 className="mb-6 font-display text-2xl tracking-tight sm:text-3xl sm:mb-8">
        CHECKOUT
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 lg:grid-cols-3"
        noValidate
      >
        {/* ============ KOLOM FORM ============ */}
        <div className="space-y-6 lg:col-span-2">
          {/* 1. DATA PEMESAN */}
          <section
            aria-labelledby="sec-pemesan"
            className="space-y-4 rounded-2xl border bg-card p-6"
          >
            <h2
              id="sec-pemesan"
              className="flex items-center gap-2 font-display text-sm tracking-wide"
            >
              <User className="h-4 w-4 text-gacoan" aria-hidden />
              DATA PEMESAN
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="nama">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Nama kamu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={errors.name}
                className={cn(errors.name && "border-destructive")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">
                  Nama kamu wajib diisi ya.
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">
                Nomor WhatsApp <span className="text-destructive">*</span>
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                placeholder="08xxxxxxxxxx"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                autoComplete="tel"
                aria-invalid={errors.whatsapp}
                className={cn(errors.whatsapp && "border-destructive")}
              />
              {errors.whatsapp ? (
                <p className="text-xs text-destructive">
                  Nomor WhatsApp harus 9–15 digit angka.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Kami kirim update status pesanan ke nomor ini.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catatan">Catatan (opsional)</Label>
              <Textarea
                id="catatan"
                name="catatan"
                placeholder="Contoh: pedasnya jangan terlalu tinggi…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
          </section>

          {/* 2. METODE PESAN */}
          <section
            aria-labelledby="sec-metode"
            className="space-y-4 rounded-2xl border bg-card p-6"
          >
            <h2
              id="sec-metode"
              className="flex items-center gap-2 font-display text-sm tracking-wide"
            >
              {method === "pickup" ? (
                <Store className="h-4 w-4 text-gacoan" aria-hidden />
              ) : (
                <Bike className="h-4 w-4 text-gacoan" aria-hidden />
              )}
              METODE PESAN
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                role="radio"
                aria-checked={method === "pickup"}
                onClick={() => setMethod("pickup")}
                className={cn(
                  "flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                  method === "pickup"
                    ? "border-gacoan bg-gacoan/5"
                    : "border-border hover:border-gacoan/40"
                )}
              >
                <Store
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    method === "pickup" ? "text-gacoan" : "text-muted-foreground"
                  )}
                  aria-hidden
                />
                <span>
                  <span className="block font-bold">Pesan &amp; Ambil</span>
                  <span className="block text-xs text-muted-foreground">
                    Ambil langsung di outlet
                  </span>
                </span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={method === "delivery"}
                onClick={() => setMethod("delivery")}
                className={cn(
                  "flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                  method === "delivery"
                    ? "border-gacoan bg-gacoan/5"
                    : "border-border hover:border-gacoan/40"
                )}
              >
                <Bike
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    method === "delivery"
                      ? "text-gacoan"
                      : "text-muted-foreground"
                  )}
                  aria-hidden
                />
                <span>
                  <span className="block font-bold">Pesan Antar</span>
                  <span className="block text-xs text-muted-foreground">
                    Diantar ke alamatmu
                  </span>
                </span>
              </button>
            </div>

            {method === "pickup" ? (
              <div className="space-y-1.5">
                <Label htmlFor="outlet">Outlet</Label>
                <Select value="outlet-ciamis">
                  <SelectTrigger id="outlet" className="w-full">
                    <SelectValue placeholder="Pilih outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outlet-ciamis">
                      {OUTLET_LABEL}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {site.shortAddress}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="alamat">
                  Alamat Lengkap <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  placeholder="Jalan, nomor rumah, patokan…"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  aria-invalid={errors.address}
                  className={cn(errors.address && "border-destructive")}
                />
                {errors.address ? (
                  <p className="text-xs text-destructive">
                    Alamat wajib diisi supaya kurir nggak nyasar ya.
                  </p>
                ) : null}
              </div>
            )}
          </section>

          {/* 3. METODE PEMBAYARAN */}
          <section
            aria-labelledby="sec-bayar"
            className="space-y-4 rounded-2xl border bg-card p-6"
          >
            <h2
              id="sec-bayar"
              className="flex items-center gap-2 font-display text-sm tracking-wide"
            >
              <Wallet className="h-4 w-4 text-gacoan" aria-hidden />
              METODE PEMBAYARAN
            </h2>

            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
              {paymentMethods.map((pm) => {
                const active = payment === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPayment(pm.id as PaymentMethod)}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-start justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                      active
                        ? "border-gacoan bg-gacoan/5"
                        : "border-border hover:border-gacoan/40"
                    )}
                  >
                    <span>
                      <span className="block font-bold">{pm.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {pm.desc}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                        active ? "border-gacoan" : "border-muted-foreground/40"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-colors",
                          active ? "bg-gacoan" : "bg-transparent"
                        )}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ============ KOLOM RINGKASAN ============ */}
        <aside className="lg:col-span-1">
          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 font-display text-lg">
              <ReceiptText className="h-5 w-5 text-gacoan" aria-hidden />
              Ringkasan Pesanan
            </h2>

            <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li
                  key={item.key}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border">
                      <Image
                        src={item.image}
                        alt={`Foto menu ${item.name}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {item.name}{" "}
                        <span className="text-muted-foreground">
                          ×{item.qty}
                        </span>
                      </p>
                      {item.spicyLevel != null ? (
                        <p className="text-xs font-medium text-gacoan">
                          🌶️ Level {item.spicyLevel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="shrink-0 font-semibold">
                    {formatRupiah(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({count} item)
                </span>
                <span className="font-semibold">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-semibold">{formatRupiah(service)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-bold">Total Bayar</span>
                <span className="font-display text-xl text-gacoan">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full font-bold text-base shadow-lg shadow-gacoan/30"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Memproses…
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4" aria-hidden />
                  Buat Pesanan
                </>
              )}
            </Button>

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {site.priceDisclaimer}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
