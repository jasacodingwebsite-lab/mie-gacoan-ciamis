"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Save, Trash2, EyeOff, RotateCcw, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PROMOS, type PromoItem } from "@/lib/data/promos";
import { useAdmin } from "@/lib/store/admin";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { AdminPageHeader, AdminSkeleton } from "@/components/admin/shared";

const PROMO_IMAGES = [
  "/images/promo-combo.jpg",
  "/images/promo-party.jpg",
  "/images/promo-berempat.jpg",
];

type PromoRow = { promo: PromoItem; isCustom: boolean; isHidden: boolean };

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "promo"
  );
}

function PromoCard({
  promo,
  isCustom,
  isHidden,
  onSave,
  onDelete,
  onHide,
  onRestore,
}: {
  promo: PromoItem;
  isCustom: boolean;
  isHidden: boolean;
  onSave: (patch: Partial<PromoItem>) => void;
  onDelete: () => void;
  onHide: () => void;
  onRestore: () => void;
}) {
  const [price, setPrice] = useState(String(promo.price));
  const [desc, setDesc] = useState(promo.desc);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isHidden) {
    return (
      <Card className="rounded-2xl border-dashed border-border bg-muted/40 shadow-none">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-sm font-semibold text-muted-foreground line-through">
            {promo.title}
          </span>
          <Badge variant="outline" className="rounded-full text-muted-foreground">
            Disembunyikan
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto min-h-11 rounded-full border-gacoan/40 text-gacoan hover:bg-gacoan/10 hover:text-gacoan-dark"
            onClick={onRestore}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Pulihkan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-32">
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              sizes="(max-width: 640px) 100vw, 128px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base tracking-tight text-foreground">
                {promo.title}
              </h3>
              {promo.badge ? (
                <Badge className="rounded-full border-transparent bg-gacoan text-[10px] text-white">
                  {promo.badge}
                </Badge>
              ) : null}
              {isCustom ? (
                <Badge variant="outline" className="rounded-full text-[10px] text-muted-foreground">
                  custom
                </Badge>
              ) : null}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[220px_1fr]">
              <div className="grid gap-1.5">
                <Label htmlFor={`price-${promo.id}`} className="text-xs text-muted-foreground">
                  Harga Promo
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`price-${promo.id}`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="min-h-11"
                    aria-label={`Harga promo ${promo.title}`}
                  />
                  <Button
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-xl bg-gacoan text-white hover:bg-gacoan-dark"
                    onClick={() => {
                      const next = Math.max(0, Number(price) || 0);
                      if (next !== promo.price) onSave({ price: next });
                      else toast.info("Harga tidak berubah.");
                    }}
                    aria-label={`Simpan harga ${promo.title}`}
                  >
                    <Save className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sekarang: <strong className="text-gacoan">{formatRupiah(promo.price)}</strong>
                </p>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor={`desc-${promo.id}`} className="text-xs text-muted-foreground">
                  Deskripsi
                </Label>
                <Textarea
                  id={`desc-${promo.id}`}
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="min-h-11"
                  aria-label={`Deskripsi promo ${promo.title}`}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-9 rounded-full px-4"
                    onClick={() => {
                      if (desc.trim() !== promo.desc) onSave({ desc: desc.trim() });
                      else toast.info("Deskripsi tidak berubah.");
                    }}
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden />
                    Simpan Deskripsi
                  </Button>
                </div>
              </div>
            </div>

            <p className="mt-2 text-xs italic text-muted-foreground">{promo.terms}</p>

            <div className="mt-3 flex flex-wrap justify-end gap-2">
              {isCustom ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11 rounded-full px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Hapus
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="min-h-11 rounded-full px-4 text-muted-foreground hover:text-foreground"
                    onClick={onRestore}
                    title="Kembalikan semua perubahan promo ini ke default"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-11 rounded-full"
                    onClick={onHide}
                  >
                    <EyeOff className="h-4 w-4" aria-hidden />
                    Sembunyikan
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus promo &quot;{promo.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Promo custom ini akan dihapus permanen dari daftar promo website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-11 rounded-full bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setConfirmOpen(false);
                onDelete();
              }}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export function PromoManager() {
  const mounted = useMounted();
  const promoOverrides = useAdmin((s) => s.promoOverrides);
  const customPromos = useAdmin((s) => s.customPromos);
  const setPromoOverride = useAdmin((s) => s.setPromoOverride);
  const removePromoOverride = useAdmin((s) => s.removePromoOverride);
  const addCustomPromo = useAdmin((s) => s.addCustomPromo);
  const updateCustomPromo = useAdmin((s) => s.updateCustomPromo);
  const removeCustomPromo = useAdmin((s) => s.removeCustomPromo);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    price: "",
    badge: "",
    image: PROMO_IMAGES[0],
    terms: "",
  });

  const rows: PromoRow[] = [
    ...PROMOS.map((p) => {
      const ov = promoOverrides[p.id] as (Partial<PromoItem> & { deleted?: boolean }) | undefined;
      const isHidden = Boolean(ov?.deleted);
      const promo: PromoItem = ov ? { ...p, ...ov } : p;
      return { promo, isCustom: false, isHidden };
    }),
    ...customPromos.map((p) => ({ promo: p, isCustom: true, isHidden: false })),
  ];

  function savePromo(row: PromoRow, patch: Partial<PromoItem>) {
    if (row.isCustom) {
      updateCustomPromo(row.promo.id, patch);
    } else {
      setPromoOverride(row.promo.id, patch);
    }
    toast.success("Promo diperbarui!");
  }

  function saveAdd() {
    const title = form.title.trim();
    if (!title) {
      toast.error("Judul promo wajib diisi.");
      return;
    }
    addCustomPromo({
      id: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      desc: form.desc.trim() || "Promo spesial dari outlet kami.",
      price: Math.max(0, Number(form.price) || 0),
      image: form.image,
      badge: form.badge.trim() || "PROMO",
      terms: form.terms.trim() || "Harga demo. Syarat & ketentuan berlaku.",
    });
    toast.success(`Promo "${title}" ditambahkan!`);
    setForm({ title: "", desc: "", price: "", badge: "", image: PROMO_IMAGES[0], terms: "" });
    setAddOpen(false);
  }

  return (
    <div>
      <AdminPageHeader
        title="Promo"
        description="Ubah harga dan deskripsi promo, sembunyikan, atau tambah promo baru."
      >
        <Button
          className="min-h-11 rounded-full bg-gacoan px-5 text-white hover:bg-gacoan-dark"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Promo
        </Button>
      </AdminPageHeader>

      {!mounted ? (
        <AdminSkeleton rows={4} />
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <PromoCard
              key={`${row.promo.id}:${row.promo.price}:${row.promo.desc}`}
              promo={row.promo}
              isCustom={row.isCustom}
              isHidden={row.isHidden}
              onSave={(patch) => savePromo(row, patch)}
              onDelete={() => {
                removeCustomPromo(row.promo.id);
                toast.success("Promo custom dihapus.");
              }}
              onHide={() => {
                setPromoOverride(row.promo.id, { deleted: true } as Partial<PromoItem>);
                toast.success(`Promo "${row.promo.title}" disembunyikan dari website.`);
              }}
              onRestore={() => {
                removePromoOverride(row.promo.id);
                toast.success(`Promo "${row.promo.title}" dipulihkan ke default.`);
              }}
            />
          ))}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-gacoan-cream/60 px-6 py-12 text-center">
              <TicketPercent className="h-8 w-8 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">
                Belum ada promo. Tambahkan promo pertamamu!
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Dialog Tambah Promo */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Tambah Promo Baru</DialogTitle>
            <DialogDescription>
              Promo baru langsung tampil di halaman promo customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="promo-title">Judul Promo</Label>
              <Input
                id="promo-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: GACOAN RAMADAN"
                className="min-h-11"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="promo-price">Harga (Rp)</Label>
                <Input
                  id="promo-price"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="35000"
                  className="min-h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="promo-badge">Badge</Label>
                <Input
                  id="promo-badge"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="LIMITED OFFER"
                  className="min-h-11"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo-desc">Deskripsi</Label>
              <Textarea
                id="promo-desc"
                rows={2}
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Deskripsi singkat promo…"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo-image">Foto Promo</Label>
              <Select value={form.image} onValueChange={(v) => setForm({ ...form, image: v })}>
                <SelectTrigger className="min-h-11 w-full" aria-label="Pilih foto promo">
                  <SelectValue placeholder="Pilih foto" />
                </SelectTrigger>
                <SelectContent>
                  {PROMO_IMAGES.map((img) => (
                    <SelectItem key={img} value={img}>
                      {img.replace("/images/", "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative mt-1 h-28 w-full overflow-hidden rounded-xl bg-muted sm:w-44">
                <Image
                  src={form.image}
                  alt="Pratinjau foto promo"
                  fill
                  sizes="176px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo-terms">Syarat & Ketentuan</Label>
              <Textarea
                id="promo-terms"
                rows={2}
                value={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.value })}
                placeholder="Harga demo. Berlaku selama stok tersedia."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="min-h-11 rounded-full"
              onClick={() => setAddOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="min-h-11 rounded-full bg-gacoan text-white hover:bg-gacoan-dark"
              onClick={saveAdd}
            >
              Tambahkan Promo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
