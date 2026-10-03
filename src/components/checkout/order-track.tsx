"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { History, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrders } from "@/lib/store/orders";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function OrderTrack() {
  const router = useRouter();
  const mounted = useMounted();
  const orders = useOrders((s) => s.orders);

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = value.trim().toUpperCase();

    if (!query) {
      setError("Masukkan nomor pesananmu dulu ya.");
      return;
    }

    const found = orders.find((o) => o.id === query);
    if (found) {
      setError("");
      router.push(`/order/${found.id}`);
    } else {
      setError("Pesanan tidak ditemukan. Periksa nomor pesananmu.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-1 text-center">
          <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
            LACAK PESANAN
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan nomor pesananmu untuk lihat statusnya.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="nomor-pesanan">Nomor Pesanan</Label>
            <Input
              id="nomor-pesanan"
              name="nomor-pesanan"
              placeholder="GCN-20261002-001"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "nomor-pesanan-error" : undefined}
              className={cn(
                "h-11 rounded-xl font-mono tracking-wide",
                error && "border-destructive"
              )}
              autoComplete="off"
            />
            {error ? (
              <p
                id="nomor-pesanan-error"
                role="alert"
                className="text-xs font-medium text-destructive"
              >
                {error}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full font-bold shadow-lg shadow-gacoan/30"
          >
            <Search className="h-4 w-4" aria-hidden />
            Lacak
          </Button>
        </form>

        {/* Pesanan terakhir */}
        {mounted && orders.length > 0 ? (
          <div className="space-y-2 rounded-xl bg-muted/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <History className="h-3.5 w-3.5" aria-hidden />
              PESANAN TERAKHIR
            </p>
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => router.push(`/order/${o.id}`)}
                  className="min-h-11 rounded-full border bg-card px-3 py-1.5 font-mono text-xs font-semibold transition-colors hover:border-gacoan hover:text-gacoan"
                >
                  {o.id}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <p className="flex items-start justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Nomor pesanan didapat setelah checkout.
        </p>
      </div>
    </div>
  );
}
