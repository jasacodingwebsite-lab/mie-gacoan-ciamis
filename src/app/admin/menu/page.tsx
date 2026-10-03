import type { Metadata } from "next";
import { MenuManager } from "@/components/admin/menu-manager";

export const metadata: Metadata = {
  title: { absolute: "Kelola Menu — Mie Gacoan Ciamis" },
  description:
    "Tambah, ubah, nonaktifkan, dan pulihkan item menu Mie Gacoan Ciamis dari panel admin demo.",
  robots: { index: false, follow: false },
};

export default function AdminMenuPage() {
  return <MenuManager />;
}
