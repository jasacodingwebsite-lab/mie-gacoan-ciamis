import type { Metadata, Viewport } from "next";
import { Archivo_Black, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  verification: {
    google: "h_q88jfkBaTtNkEpZQ_4mWkvzJ8F41w_45r208hC9LE",
  },
  metadataBase: new URL("https://mie-gacoan-ciamis.space-z.ai"),
  alternates: { canonical: "/" },
  applicationName: "Mie Gacoan Ciamis",
  category: "restaurant",
  title: {
    default: "Mie Gacoan Ciamis | Mie Pedas, Dimsum & Minuman",
    template: "%s | Mie Gacoan Ciamis",
  },
  description:
    "Nikmati mie pedas, dimsum, dan minuman favorit di Mie Gacoan Ciamis. Lihat menu, pesan makanan, cek lokasi, dan dapatkan promo terbaru.",
  keywords: [
    "Mie Gacoan Ciamis",
    "mie pedas Ciamis",
    "dimsum Ciamis",
    "mie gacoan menu",
    "kuliner Ciamis",
    "Mie Gacoan Ahmad Yani",
  ],
  authors: [{ name: "Mie Gacoan Ciamis" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Mie Gacoan Ciamis | Mie Pedas, Dimsum & Minuman",
    description:
      "Nikmati mie pedas, dimsum, dan minuman favorit di Mie Gacoan Ciamis. Lihat menu, pesan makanan, cek lokasi, dan dapatkan promo terbaru.",
    url: "/",
    siteName: "Mie Gacoan Ciamis",
    images: [
      {
        url: "/images/interior-wide.jpg",
        width: 1344,
        height: 768,
        alt: "Suasana Mie Gacoan Ciamis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mie Gacoan Ciamis | Mie Pedas, Dimsum & Minuman",
    description:
      "Nikmati mie pedas, dimsum, dan minuman favorit di Mie Gacoan Ciamis.",
    images: ["/images/interior-wide.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e2242c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://mie-gacoan-ciamis.space-z.ai/#website",
        "url": "https://mie-gacoan-ciamis.space-z.ai/",
        "name": "Mie Gacoan Ciamis",
        "inLanguage": "id-ID",
        "description": "Website informasi dan pemesanan demo untuk menu mie pedas, dimsum, minuman, promo, galeri, dan lokasi di Ciamis.",
      },
      {
        "@type": "WebPage",
        "@id": "https://mie-gacoan-ciamis.space-z.ai/#webpage",
        "url": "https://mie-gacoan-ciamis.space-z.ai/",
        "name": "Mie Gacoan Ciamis | Mie Pedas, Dimsum & Minuman",
        "isPartOf": { "@id": "https://mie-gacoan-ciamis.space-z.ai/#website" },
        "inLanguage": "id-ID",
      },
    ],
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${archivoBlack.variable} ${jakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}


