import type { Metadata } from "next";
import { MenuCatalog } from "@/components/menu/menu-catalog";

export const metadata: Metadata = {
  title: {
    absolute: "Menu Mie Gacoan Ciamis — Mie Pedas, Dimsum & Minuman",
  },
  description:
    "Lihat semua menu Mie Gacoan Ciamis: mie pedas level 0–8, dimsum favorit, dan minuman segar. Cari menu favoritmu, pilih level pedas, dan pesan sekarang.",
  keywords: [
    "menu mie gacoan",
    "menu mie gacoan ciamis",
    "mie pedas level",
    "dimsum ciamis",
    "minuman gacoan",
  ],
  openGraph: {
    title: "Menu Mie Gacoan Ciamis — Mie Pedas, Dimsum & Minuman",
    description:
      "Lihat semua menu Mie Gacoan Ciamis: mie pedas level 0–8, dimsum favorit, dan minuman segar.",
    url: "/menu",
    type: "website",
  },
};

export default function MenuPage() {
  return <MenuCatalog />;
}
