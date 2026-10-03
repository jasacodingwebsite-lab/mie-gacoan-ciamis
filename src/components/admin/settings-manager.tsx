"use client";

import { useState } from "react";
import {
  Store,
  Clock,
  Save,
  AlertTriangle,
  Trash2,
  MapPin,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAdmin, type Settings } from "@/lib/store/admin";
import { useOrders } from "@/lib/store/orders";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { AdminPageHeader, AdminSkeleton } from "@/components/admin/shared";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number) {
  return `${String(h).padStart(2, "0")}.00`;
}

/** Form pengaturan — di-remount lewat key saat settings berubah dari luar (mis. resetAll). */
function SettingsForm({
  initial,
  onSave,
}: {
  initial: Settings;
  onSave: (patch: Omit<Settings, never>) => void;
}) {
  const [outletName, setOutletName] = useState(initial.outletName);
  const [address, setAddress] = useState(initial.address);
  const [serviceFee, setServiceFee] = useState(String(initial.serviceFee));
  const [openHour, setOpenHour] = useState(String(initial.openHour));
  const [closeHour, setCloseHour] = useState(String(initial.closeHour));
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp);

  const previewFee = Math.max(0, Number(serviceFee) || 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Form */}
      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-lg tracking-tight">
            <Store className="h-5 w-5 text-gacoan" aria-hidden />
            Informasi Outlet
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="set-name">Nama Outlet</Label>
            <Input
              id="set-name"
              value={outletName}
              onChange={(e) => setOutletName(e.target.value)}
              className="min-h-11"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="set-address">Alamat</Label>
            <Textarea
              id="set-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="set-fee">Service Fee</Label>
            <Input
              id="set-fee"
              type="number"
              min={0}
              inputMode="numeric"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              className="min-h-11"
            />
            <p className="text-xs text-muted-foreground">Rp, contoh 2000</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Jam Buka</Label>
              <Select value={openHour} onValueChange={setOpenHour}>
                <SelectTrigger className="min-h-11 w-full" aria-label="Jam buka outlet">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {hourLabel(h)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Jam Tutup</Label>
              <Select value={closeHour} onValueChange={setCloseHour}>
                <SelectTrigger className="min-h-11 w-full" aria-label="Jam tutup outlet">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {hourLabel(h)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="set-wa">Nomor WhatsApp</Label>
            <Input
              id="set-wa"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="6281234567890"
              className="min-h-11"
            />
            <p className="text-xs text-muted-foreground">
              Format internasional tanpa tanda +, contoh 6281234567890.
            </p>
          </div>

          <Button
            className="min-h-11 w-full rounded-full bg-gacoan text-white hover:bg-gacoan-dark sm:w-fit sm:px-8"
            onClick={() =>
              onSave({
                outletName: outletName.trim() || "Mie Gacoan Ciamis",
                address: address.trim(),
                serviceFee: Math.max(0, Number(serviceFee) || 0),
                openHour: Number(openHour),
                closeHour: Number(closeHour),
                whatsapp: whatsapp.trim(),
              })
            }
          >
            <Save className="h-4 w-4" aria-hidden />
            Simpan Pengaturan
          </Button>
        </CardContent>
      </Card>

      {/* Live preview */}
      <Card className="h-fit rounded-2xl border-border/70 bg-gacoan-cream/70 shadow-sm lg:sticky lg:top-24">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base tracking-tight">
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Nama Outlet</p>
            <p className="font-bold text-ink">{outletName.trim() || "—"}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> Alamat
            </p>
            <p className="text-foreground">{address.trim() || "—"}</p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden /> Jam Operasional
            </p>
            <p className="font-semibold text-foreground">
              {hourLabel(Number(openHour) || 0)} — {hourLabel(Number(closeHour) || 0)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" aria-hidden /> Service Fee
            </p>
            <p className="font-semibold text-gacoan">{formatRupiah(previewFee)}</p>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Nilai di atas mengikuti isian form sebelum disimpan. Customer melihat data ini
            setelah kamu menekan Simpan Pengaturan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsManager() {
  const mounted = useMounted();
  const settings = useAdmin((s) => s.settings);
  const setSettings = useAdmin((s) => s.setSettings);
  const resetAll = useAdmin((s) => s.resetAll);
  const clearOrders = useOrders((s) => s.clearOrders);

  return (
    <div>
      <AdminPageHeader
        title="Pengaturan"
        description="Informasi outlet yang tampil di seluruh halaman customer."
      />

      {!mounted ? (
        <AdminSkeleton rows={5} />
      ) : (
        <>
          <SettingsForm
            key={JSON.stringify(settings)}
            initial={settings}
            onSave={(patch) => {
              setSettings(patch);
              toast.success("Pengaturan disimpan!");
            }}
          />

          {/* Danger zone */}
          <Card className="mt-8 rounded-2xl border-destructive/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-display text-lg tracking-tight text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Reset Semua Data Admin
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Menu, promo, galeri, dan pengaturan kembali ke kondisi awal.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="min-h-11 shrink-0 rounded-full px-5"
                    >
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      Reset Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset semua data admin?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Semua override menu, promo, galeri, dan pengaturan outlet akan
                        dikembalikan ke default. Tindakan ini tidak bisa dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="min-h-11 rounded-full">
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="min-h-11 rounded-full bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => {
                          resetAll();
                          toast.success("Semua perubahan admin direset ke default.");
                        }}
                      >
                        Ya, Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Hapus Riwayat Pesanan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mengosongkan daftar pesanan (Orders) dari localStorage.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="min-h-11 shrink-0 rounded-full border-destructive/50 px-5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Hapus Pesanan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus semua riwayat pesanan?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Seluruh pesanan demo akan dihapus permanen dari browser ini.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="min-h-11 rounded-full">
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="min-h-11 rounded-full bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => {
                          clearOrders();
                          toast.success("Riwayat pesanan dihapus.");
                        }}
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
