import type { Metadata } from "next";
import { LocationContent } from "@/components/pages/location-content";

export const metadata: Metadata = {
  title: "Lokasi & Peta",
  description:
    "Lokasi Mie Gacoan Ciamis di Jl. Jenderal Ahmad Yani No.43, Ciamis. Buka setiap hari 08.00–23.00. Parkir luas & gratis, WiFi kencang, enak buat nongkrong dan nugas.",
};

export default function LocationPage() {
  return <LocationContent />;
}
