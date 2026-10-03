import type { Metadata } from "next";
import { SettingsManager } from "@/components/admin/settings-manager";

export const metadata: Metadata = {
  title: { absolute: "Pengaturan Admin — Mie Gacoan Ciamis" },
  description:
    "Atur informasi outlet, biaya layanan, jam operasional, dan reset data demo Mie Gacoan Ciamis.",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return <SettingsManager />;
}
