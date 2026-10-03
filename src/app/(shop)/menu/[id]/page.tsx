import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MENU_ITEMS } from "@/lib/data/menu";
import { ProductDetail } from "@/components/menu/product-detail";

/** Pra-render semua halaman detail menu yang dikenal */
export function generateStaticParams() {
  return MENU_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = MENU_ITEMS.find((m) => m.id === id);
  if (!item) {
    return { title: { absolute: "Menu tidak ditemukan — Mie Gacoan Ciamis" } };
  }
  return {
    title: { absolute: `${item.name} — Mie Gacoan Ciamis` },
    description: item.desc,
    alternates: { canonical: `/menu/${item.id}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${item.name} — Mie Gacoan Ciamis`,
      description: item.desc,
      images: [{ url: item.image, alt: item.name }],
      type: "website",
    },
  };
}

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = MENU_ITEMS.find((m) => m.id === id);

  // Tidak throw notFound() — render kartu "tidak ditemukan" sendiri
  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-16 sm:py-24 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
          <span className="text-6xl" aria-hidden>
            🔍
          </span>
          <h1 className="mt-5 font-display text-2xl sm:text-3xl text-ink">
            Menu tidak ditemukan
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Menu yang kamu cari tidak ada atau sudah dihapus. Yuk, lihat menu
            lainnya yang bikin laper.
          </p>
          <Button
            asChild
            className="mt-6 h-11 rounded-full px-6 font-bold shadow-md shadow-gacoan/25"
          >
            <Link href="/menu">← Kembali ke Menu</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <ProductDetail product={item} />;
}
