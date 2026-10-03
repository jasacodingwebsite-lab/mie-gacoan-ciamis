"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RotateCcw,
  Star,
  Sparkles,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MENU_ITEMS, CATEGORY_LABELS, type MenuItem, type MenuCategory } from "@/lib/data/menu";
import { useAdmin } from "@/lib/store/admin";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatRupiah } from "@/lib/format";
import { AdminPageHeader, AdminSkeleton } from "@/components/admin/shared";
import { cn } from "@/lib/utils";

const CATEGORIES: MenuCategory[] = ["mie", "dimsum", "minuman"];
const PRODUCT_IMAGES = Array.from(new Set(MENU_ITEMS.map((i) => i.image)));

type MenuRow = {
  item: MenuItem;
  isCustom: boolean;
  isDeleted: boolean;
  hasOverride: boolean;
};

type ItemForm = {
  name: string;
  category: MenuCategory;
  price: string;
  desc: string;
  image: string;
  popular: boolean;
  isNew: boolean;
  available: boolean;
};

function emptyForm(): ItemForm {
  return {
    name: "",
    category: "mie",
    price: "",
    desc: "",
    image: PRODUCT_IMAGES[0] ?? "",
    popular: false,
    isNew: false,
    available: true,
  };
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "menu"
  );
}

function CategoryBadge({ category }: { category: MenuCategory }) {
  const map: Record<MenuCategory, string> = {
    mie: "bg-gacoan/10 text-gacoan",
    dimsum: "bg-gacoan-orange/10 text-gacoan-orange",
    minuman: "bg-emerald-100 text-emerald-700",
  };
  return (
    <Badge className={cn("rounded-full border-transparent", map[category])}>
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}

/** Form bersama untuk dialog Edit & Tambah. */
function ItemFormFields({
  form,
  setForm,
}: {
  form: ItemForm;
  setForm: (patch: Partial<ItemForm>) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="item-name">Nama Menu</Label>
        <Input
          id="item-name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder="Contoh: Mie Gacoan Extra"
          className="min-h-11"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Kategori</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm({ category: v as MenuCategory })}
          >
            <SelectTrigger className="min-h-11 w-full">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="item-price">Harga (Rp)</Label>
          <Input
            id="item-price"
            type="number"
            min={0}
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ price: e.target.value })}
            placeholder="15000"
            className="min-h-11"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="item-desc">Deskripsi</Label>
        <Textarea
          id="item-desc"
          value={form.desc}
          onChange={(e) => setForm({ desc: e.target.value })}
          placeholder="Deskripsi singkat menu ini…"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="item-image">URL Foto</Label>
        <Input
          id="item-image"
          value={form.image}
          onChange={(e) => setForm({ image: e.target.value })}
          placeholder="/images/products/mie-gacoan.jpg"
          className="min-h-11"
        />
        <p className="text-xs text-muted-foreground">
          Pilih dari daftar foto produk yang tersedia di /images/products/
        </p>
        <Select value={form.image} onValueChange={(v) => setForm({ image: v })}>
          <SelectTrigger className="min-h-11 w-full">
            <SelectValue placeholder="Pilih foto produk" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {PRODUCT_IMAGES.map((img) => (
              <SelectItem key={img} value={img}>
                {img.replace("/images/products/", "")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-muted/50 p-3 sm:grid-cols-3">
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <Label htmlFor="item-popular" className="text-sm">
            Populer
          </Label>
          <Switch
            id="item-popular"
            checked={form.popular}
            onCheckedChange={(v) => setForm({ popular: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <Label htmlFor="item-new" className="text-sm">
            Menu Baru
          </Label>
          <Switch
            id="item-new"
            checked={form.isNew}
            onCheckedChange={(v) => setForm({ isNew: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <Label htmlFor="item-available" className="text-sm">
            Tersedia
          </Label>
          <Switch
            id="item-available"
            checked={form.available}
            onCheckedChange={(v) => setForm({ available: v })}
          />
        </div>
      </div>
    </div>
  );
}

export function MenuManager() {
  const mounted = useMounted();
  const menuOverrides = useAdmin((s) => s.menuOverrides);
  const customItems = useAdmin((s) => s.customItems);
  const setMenuOverride = useAdmin((s) => s.setMenuOverride);
  const removeMenuOverride = useAdmin((s) => s.removeMenuOverride);
  const addCustomItem = useAdmin((s) => s.addCustomItem);
  const updateCustomItem = useAdmin((s) => s.updateCustomItem);
  const removeCustomItem = useAdmin((s) => s.removeCustomItem);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | MenuCategory>("all");
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editForm, setEditForm] = useState<ItemForm>(emptyForm);
  const [addForm, setAddForm] = useState<ItemForm>(emptyForm);
  const [editing, setEditing] = useState<{ id: string; isCustom: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; isCustom: boolean } | null>(null);

  const rows = useMemo<MenuRow[]>(() => {
    const base: MenuRow[] = MENU_ITEMS.map((item) => {
      const ov = menuOverrides[item.id];
      if (!ov) return { item, isCustom: false, isDeleted: false, hasOverride: false };
      const { deleted, ...patch } = ov;
      return {
        item: { ...item, ...patch },
        isCustom: false,
        isDeleted: Boolean(deleted),
        hasOverride: true,
      };
    });
    const customs: MenuRow[] = customItems.map((item) => ({
      item,
      isCustom: true,
      isDeleted: false,
      hasOverride: false,
    }));
    return [...base, ...customs];
  }, [menuOverrides, customItems]);

  const filtered = rows.filter((r) => {
    const matchCategory = category === "all" || r.item.category === category;
    const matchSearch = r.item.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchCategory && matchSearch;
  });

  const overrideCount = rows.filter((r) => r.hasOverride).length + customItems.length;

  const setEdit = (patch: Partial<ItemForm>) =>
    setEditForm((prev) => ({ ...prev, ...patch }));
  const setAdd = (patch: Partial<ItemForm>) =>
    setAddForm((prev) => ({ ...prev, ...patch }));

  function openEdit(row: MenuRow) {
    setEditing({ id: row.item.id, isCustom: row.isCustom });
    setEditForm({
      name: row.item.name,
      category: row.item.category,
      price: String(row.item.price),
      desc: row.item.desc,
      image: row.item.image,
      popular: row.item.popular,
      isNew: row.item.isNew,
      available: row.item.available,
    });
    setEditOpen(true);
  }

  function saveEdit() {
    if (!editing) return;
    const patch: Partial<MenuItem> = {
      name: editForm.name.trim() || "Tanpa Nama",
      category: editForm.category,
      price: Math.max(0, Number(editForm.price) || 0),
      desc: editForm.desc.trim(),
      image: editForm.image.trim(),
      popular: editForm.popular,
      isNew: editForm.isNew,
      available: editForm.available,
    };
    if (editing.isCustom) {
      updateCustomItem(editing.id, patch);
    } else {
      setMenuOverride(editing.id, patch);
    }
    toast.success("Menu diperbarui!");
    setEditOpen(false);
    setEditing(null);
  }

  function saveAdd() {
    const name = addForm.name.trim();
    if (!name) {
      toast.error("Nama menu wajib diisi.");
      return;
    }
    const id = `${slugify(name)}-${Date.now().toString(36)}`;
    addCustomItem({
      id,
      name,
      category: addForm.category,
      desc: addForm.desc.trim() || "Menu baru dari admin panel.",
      price: Math.max(0, Number(addForm.price) || 0),
      image: addForm.image.trim(),
      spicy: addForm.category === "mie",
      popular: addForm.popular,
      isNew: true,
      available: addForm.available,
      sort: 99,
      addedAt: new Date().toISOString().slice(0, 10),
    });
    toast.success(`Menu "${name}" ditambahkan!`);
    setAddForm(emptyForm());
    setAddOpen(false);
  }

  function toggleAvailable(row: MenuRow, value: boolean) {
    if (row.isCustom) {
      updateCustomItem(row.item.id, { available: value });
    } else {
      setMenuOverride(row.item.id, { available: value });
    }
    toast.success(
      value
        ? `"${row.item.name}" kembali tersedia.`
        : `"${row.item.name}" dinonaktifkan — disembunyikan dari customer.`
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.isCustom) {
      removeCustomItem(deleteTarget.id);
      toast.success("Menu custom dihapus.");
    } else {
      setMenuOverride(deleteTarget.id, { deleted: true });
      toast.success(`"${deleteTarget.name}" dihapus — bisa dipulihkan kapan saja.`);
    }
    setDeleteTarget(null);
  }

  function resetOverride(row: MenuRow) {
    removeMenuOverride(row.item.id);
    toast.success(`Perubahan pada "${row.item.name}" dikembalikan ke default.`);
  }

  function restore(row: MenuRow) {
    removeMenuOverride(row.item.id);
    toast.success(`"${row.item.name}" dipulihkan ke katalog.`);
  }

  return (
    <div>
      <AdminPageHeader
        title="Kelola Menu"
        description="Ubah harga, foto, dan status menu. Perubahan langsung tampil di website customer."
      >
        <Badge variant="secondary" className="rounded-full">
          {overrideCount > 0 ? `${overrideCount} item diubah` : "Semua default"}
        </Badge>
        <Button
          className="min-h-11 rounded-full bg-gacoan px-5 text-white hover:bg-gacoan-dark"
          onClick={() => {
            setAddForm(emptyForm());
            setAddOpen(true);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Menu
        </Button>
      </AdminPageHeader>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama menu…"
            className="min-h-11 pl-9"
            aria-label="Cari menu"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v as "all" | MenuCategory)}>
          <SelectTrigger className="min-h-11 w-full sm:w-44" aria-label="Filter kategori">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!mounted ? (
        <AdminSkeleton rows={6} />
      ) : (
        <Card className="rounded-2xl border-border/70 p-0 shadow-sm">
          <div className="overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[38%]">Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada menu yang cocok dengan pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow
                      key={row.item.id}
                      className={cn(row.isDeleted && "opacity-70")}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={row.item.image}
                              alt={row.item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={cn(
                                  "text-sm font-semibold text-foreground",
                                  row.isDeleted && "line-through decoration-destructive/70"
                                )}
                              >
                                {row.item.name}
                              </span>
                              {row.item.popular && !row.isDeleted ? (
                                <Badge className="rounded-full border-transparent bg-gacoan-yellow/20 px-1.5 text-[10px] text-ink">
                                  <Star className="h-3 w-3" aria-hidden /> Populer
                                </Badge>
                              ) : null}
                              {row.item.isNew && !row.isDeleted ? (
                                <Badge className="rounded-full border-transparent bg-gacoan/10 px-1.5 text-[10px] text-gacoan">
                                  <Sparkles className="h-3 w-3" aria-hidden /> BARU
                                </Badge>
                              ) : null}
                              {!row.item.available && !row.isDeleted ? (
                                <Badge className="rounded-full border-transparent bg-red-100 px-1.5 text-[10px] text-red-600">
                                  <Ban className="h-3 w-3" aria-hidden /> Habis
                                </Badge>
                              ) : null}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                              {row.hasOverride ? (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-gacoan/30 px-1.5 text-[10px] text-gacoan"
                                >
                                  diubah
                                </Badge>
                              ) : null}
                              {row.isCustom ? (
                                <Badge
                                  variant="outline"
                                  className="rounded-full px-1.5 text-[10px] text-muted-foreground"
                                >
                                  custom
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge category={row.item.category} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-semibold text-foreground">
                        {formatRupiah(row.item.price)}
                      </TableCell>
                      <TableCell>
                        {row.isDeleted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-11 rounded-full border-gacoan/40 px-4 text-gacoan hover:bg-gacoan/10 hover:text-gacoan-dark"
                            onClick={() => restore(row)}
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden />
                            Pulihkan
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={row.item.available}
                              onCheckedChange={(v) => toggleAvailable(row, v)}
                              aria-label={`Aktifkan/nonaktifkan ${row.item.name}`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {row.item.available ? "Aktif" : "Nonaktif"}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {row.hasOverride && !row.isCustom && !row.isDeleted ? (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-11 w-11 text-muted-foreground hover:text-foreground"
                              onClick={() => resetOverride(row)}
                              aria-label={`Reset perubahan ${row.item.name}`}
                              title="Kembalikan ke default"
                            >
                              <RotateCcw className="h-4 w-4" aria-hidden />
                            </Button>
                          ) : null}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-11 w-11"
                            onClick={() => openEdit(row)}
                            disabled={row.isDeleted}
                            aria-label={`Edit ${row.item.name}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-11 w-11 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() =>
                              setDeleteTarget({
                                id: row.item.id,
                                name: row.item.name,
                                isCustom: row.isCustom,
                              })
                            }
                            disabled={row.isDeleted}
                            aria-label={`Hapus ${row.item.name}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Dialog Edit */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Menu</DialogTitle>
            <DialogDescription>
              {editing?.isCustom
                ? "Item ini buatan admin — perubahan disimpan langsung ke item custom."
                : "Perubahan disimpan sebagai override — menu default tidak diubah permanen."}
            </DialogDescription>
          </DialogHeader>
          <ItemFormFields form={editForm} setForm={setEdit} />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="min-h-11 rounded-full"
              onClick={() => setEditOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="min-h-11 rounded-full bg-gacoan text-white hover:bg-gacoan-dark"
              onClick={saveEdit}
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Tambah Menu Baru</DialogTitle>
            <DialogDescription>
              Menu baru otomatis muncul di katalog customer pada kategori terpilih.
            </DialogDescription>
          </DialogHeader>
          <ItemFormFields form={addForm} setForm={setAdd} />
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
              Tambahkan Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus menu &quot;{deleteTarget?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.isCustom
                ? "Menu custom ini akan dihapus permanen dari katalog."
                : "Menu default akan disembunyikan permanen dari katalog (soft delete). Kamu bisa memulihkannya lewat tombol Pulihkan kapan saja."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-11 rounded-full bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
