import type { Metadata } from "next";
import { GalleryContent } from "@/components/pages/gallery-content";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Galeri foto suasana outlet Mie Gacoan Ciamis: interior, eksterior, mural, dan aneka hidangan mie pedas & dimsum. Foto asli outlet + ilustrasi pendukung.",
};

export default function GalleryPage() {
  return <GalleryContent />;
}
