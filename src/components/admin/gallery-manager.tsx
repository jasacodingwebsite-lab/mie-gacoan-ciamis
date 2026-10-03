"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, Plus, RotateCcw, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/data/gallery";
import { PROMOS } from "@/lib/data/promos";
import { useAdmin } from "@/lib/store/admin";
import { useGalleryData } from "@/lib/hooks/use-menu-data";
import { useMounted } from "@/lib/hooks/use-mounted";
import { AdminPageHeader, AdminSkeleton } from "@/components/admin/shared";
import { cn } from "@/lib/utils";

const SECTION_IMAGES = [
  "/images/hero-mie.jpg",
  "/images/dimsum-hero.jpg",
  "/images/interior-wide.jpg",
  "/images/exterior-wide.jpg",
];
const IMAGE_OPTIONS = Array.from(
  new Set([...GALLERY_ITEMS.map((g) => g.src), ...PROMOS.map((p) => p.image), ...SECTION_IMAGES])
);

/** Kartu satu item galeri. key di parent memuat caption agar draft ikut ter-reset. */
function GalleryCard({
  item,
  shown,
  isDefault,
  onToggle,
  onSaveCaption,
  onRemoveCustom,
}: {
  item: GalleryItem;
  shown: boolean;
  isDefault: boolean;
  onToggle: (next: boolean) => void;
  onSaveCaption: (caption: string) => void;
  onRemoveCustom: () => void;
}) {
  const [caption, setCaption] = useState(item.caption);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-border/70 shadow-sm transition-opacity",
        !shown && "opacity-60"
      )}
    >
      <div
        className={cn(
          "relative w-full bg-muted",
          item.tall ? "aspect-[3/4]" : "aspect-[4/3]",
          !shown && "grayscale"
        )}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
        {!shown ? (
          <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-semibold text-white">
            Sembunyi
          </span>
        ) : null}
      </div>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {shown ? "Tampil" : "Sembunyi"}
          </span>
          <Switch
            checked={shown}
            onCheckedChange={(next) => {
              if (isDefault) onToggle(next);
              else setConfirmOpen(true);
            }}
            aria-label={`${shown ? "Sembunyikan" : "Tampilkan"} foto: ${item.caption}`}
          />
        </div>
        <div className="flex gap-2">
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption foto"
            className="min-h-11 text-sm"
            aria-label={`Caption untuk ${item.alt}`}
          />
          <Button
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl bg-gacoan text-white hover:bg-gacoan-dark"
            onClick={() => {
              if (caption.trim() !== item.caption) onSaveCaption(caption.trim());
              else toast.info("Caption tidak berubah.");
            }}
            aria-label={`Simpan caption ${item.caption}`}
          >
            <Save className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="rounded-full text-[10px] text-muted-foreground">
            {isDefault ? "default" : "custom"}
          </Badge>
          {!isDefault ? (
            <Button
              size="sm"
              variant="ghost"
              className="min-h-9 rounded-full px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Hapus
            </Button>
          ) : null}
        </div>
      </CardContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus foto galeri ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto custom &quot;{item.caption}&quot; akan dihapus dari daftar galeri. Foto default
              tetap bisa ditampilkan kembali lewat switch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-11 rounded-full bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setConfirmOpen(false);
                onRemoveCustom();
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

export function GalleryManager() {
  const mounted = useMounted();
  const stored = useAdmin((s) => s.galleryItems);
  const setGalleryItems = useAdmin((s) => s.setGalleryItems);
  const current = useGalleryData();

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    src: IMAGE_OPTIONS[0] ?? "",
    alt: "",
    caption: "",
    tall: false,
  });

  const effective = stored ?? GALLERY_ITEMS;
  const defaultIds = new Set(effective.map((i) => i.id));
  const customItems = effective.filter((i) => !GALLERY_ITEMS.some((g) => g.id === i.id));
  const shownCount = current.length;

  function toggleDefault(id: string, next: boolean) {
    if (next) {
      const item = GALLERY_ITEMS.find((g) => g.id === id);
      if (!item) return;
      setGalleryItems([...effective, item]);
      toast.success("Foto ditampilkan kembali di galeri.");
    } else {
      setGalleryItems(effective.filter((i) => i.id !== id));
      toast.success("Foto disembunyikan dari galeri.");
    }
  }

  function saveCaption(id: string, caption: string) {
    setGalleryItems(effective.map((i) => (i.id === id ? { ...i, caption } : i)));
    toast.success("Caption diperbarui!");
  }

  function saveAdd() {
    if (!form.src.trim()) {
      toast.error("URL gambar wajib diisi.");
      return;
    }
    const newItem: GalleryItem = {
      id: `g-custom-${Date.now().toString(36)}`,
      src: form.src.trim(),
      alt: form.alt.trim() || "Foto galeri outlet",
      caption: form.caption.trim() || "Foto Baru",
      tall: form.tall,
      source: "foto-asli",
    };
    setGalleryItems([...effective, newItem]);
    toast.success("Foto baru ditambahkan ke galeri!");
    setForm({ src: IMAGE_OPTIONS[0] ?? "", alt: "", caption: "", tall: false });
    setAddOpen(false);
  }

  return (
    <div>
      <AdminPageHeader
        title="Galeri"
        description="Pilih foto yang tampil di halaman galeri dan atur caption-nya."
      >
        <Button
          className="min-h-11 rounded-full bg-gacoan px-5 text-white hover:bg-gacoan-dark"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Foto
        </Button>
        <Button
          variant="outline"
          className="min-h-11 rounded-full"
          onClick={() => {
            setGalleryItems(null);
            toast.success("Galeri dikembalikan ke default.");
          }}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Kembalikan Default
        </Button>
      </AdminPageHeader>

      {!mounted ? (
        <AdminSkeleton rows={6} />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {shownCount} dari {GALLERY_ITEMS.length + customItems.length} foto tampil di website.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {GALLERY_ITEMS.map((item) => (
              <GalleryCard
                key={`${item.id}:${item.caption}`}
                item={item}
                shown={defaultIds.has(item.id)}
                isDefault
                onToggle={(next) => toggleDefault(item.id, next)}
                onSaveCaption={(caption) => saveCaption(item.id, caption)}
                onRemoveCustom={() => undefined}
              />
            ))}
            {customItems.map((item) => (
              <GalleryCard
                key={`${item.id}:${item.caption}`}
                item={item}
                shown
                isDefault={false}
                onToggle={() => undefined}
                onSaveCaption={(caption) => saveCaption(item.id, caption)}
                onRemoveCustom={() => {
                  setGalleryItems(effective.filter((i) => i.id !== item.id));
                  toast.success("Foto custom dihapus dari galeri.");
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Dialog Tambah Foto */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <ImagePlus className="h-5 w-5 text-gacoan" aria-hidden />
              Tambah Foto Galeri
            </DialogTitle>
            <DialogDescription>
              Masukkan URL gambar dari folder /images/ milik website ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="gallery-src">URL Gambar</Label>
              <Input
                id="gallery-src"
                value={form.src}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
                placeholder="/images/photos/interior-1.jpg"
                className="min-h-11"
              />
              <Select value={form.src} onValueChange={(v) => setForm({ ...form, src: v })}>
                <SelectTrigger className="min-h-11 w-full" aria-label="Pilih gambar tersedia">
                  <SelectValue placeholder="Pilih dari gambar tersedia" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {IMAGE_OPTIONS.map((img) => (
                    <SelectItem key={img} value={img}>
                      {img.replace("/images/", "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gallery-alt">Alt Text (deskripsi gambar)</Label>
              <Input
                id="gallery-alt"
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Contoh: Suasana meja panjang outlet Ciamis"
                className="min-h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gallery-caption">Caption</Label>
              <Input
                id="gallery-caption"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Contoh: Nongkrong Rame-rame"
                className="min-h-11"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
              <Label htmlFor="gallery-tall" className="text-sm">
                Foto tinggi (portrait)
              </Label>
              <Switch
                id="gallery-tall"
                checked={form.tall}
                onCheckedChange={(v) => setForm({ ...form, tall: v })}
              />
            </div>
            <div className="relative h-36 w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={form.src}
                alt="Pratinjau gambar galeri"
                fill
                sizes="400px"
                className="object-cover"
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
              Tambahkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
