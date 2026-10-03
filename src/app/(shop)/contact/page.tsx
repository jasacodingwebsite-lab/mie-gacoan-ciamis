import type { Metadata } from "next";
import { ContactContent } from "@/components/pages/contact-content";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Mie Gacoan Ciamis via WhatsApp, telepon, atau sosial media. Tanya menu, reservasi rombongan, pesanan besar, atau sekadar sapa — kami balas secepatnya.",
};

export default function ContactPage() {
  return <ContactContent />;
}
