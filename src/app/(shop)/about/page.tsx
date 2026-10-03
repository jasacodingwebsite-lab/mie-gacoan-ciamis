import type { Metadata } from "next";
import { AboutContent } from "@/components/pages/about-content";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenalan lebih dekat dengan Mie Gacoan Ciamis — mie pedas level 0–8, dimsum fresh setiap hari, dan tempat nongkrong paling asik di Ciamis. Lebih dari sekadar mie!",
};

export default function AboutPage() {
  return <AboutContent />;
}
