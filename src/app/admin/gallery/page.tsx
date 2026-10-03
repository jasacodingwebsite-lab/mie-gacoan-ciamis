import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = {
  title: { absolute: "Kelola Galeri — Mie Gacoan Ciamis" },
  description:
    "Atur foto yang tampil di galeri Mie Gacoan Ciamis: sembunyikan, ubah caption, atau tambah foto baru.",
  robots: { index: false, follow: false },
};

export default function AdminGalleryPage() {
  return <GalleryManager />;
}
