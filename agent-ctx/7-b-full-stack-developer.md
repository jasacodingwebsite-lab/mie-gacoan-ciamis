# Task 7-b — full-stack-developer

## Ringkasan
Membangun halaman MENU (katalog + detail produk) untuk Mie Gacoan Ciamis sesuai spesifikasi worklog.md.

## File yang dibuat (scope sendiri, foundation tidak disentuh)
1. `src/app/(shop)/menu/page.tsx` — server component + metadata (title absolute "Menu Mie Gacoan Ciamis — Mie Pedas, Dimsum & Minuman", description, keywords, OG).
2. `src/components/menu/menu-catalog.tsx` — client katalog: search realtime, filter kategori, sort, grid MenuCard, skeleton, empty & error state.
3. `src/app/(shop)/menu/[id]/page.tsx` — server: generateStaticParams (dari MENU_ITEMS), generateMetadata per item, kartu not-found custom (tanpa throw).
4. `src/components/menu/product-detail.tsx` — client detail: breadcrumb, foto besar, level pedas 0–8, qty stepper, catatan 140 char, CTA add-to-cart (flyFrom) + "Lihat Keranjang", info outlet, salin link, COBA JUGA.

## Keputusan teknis penting
- Hydration safety: seluruh data yang bisa berubah oleh override admin (useMenuData/zustand persist) hanya dirender SETELAH `useMounted()`; sebelum mount → `MenuCardSkeleton` (8 di katalog, 4 di COBA JUGA). Badge jumlah kategori juga digate mounted.
- Tidak ada `useEffect` sama sekali → otomatis lolos rule `react-hooks/set-state-in-effect`; semua reset dilakukan lewat handler (`resetFilters`).
- Sort "Terpopuler" = `Number(b.popular) - Number(a.popular) || a.sort - b.sort`; "Terbaru" = `addedAt` desc.
- Detail page memakai `item = live ?? product` (live = hasil useMenuData setelah mount, fallback data statis dari server) supaya override admin tetap tampil tanpa hydration mismatch.
- Search mencakup nama + deskripsi (lowercase includes) → "udang" menemukan Udang Keju, Udang Rambutan, Lumpia Udang.

## Verifikasi (dev server port 3000)
- `curl /menu` → 200, mengandung "PILIH SANTAPANMU" + disclaimer harga.
- `curl /menu/mie-gacoan` → 200, mengandung "Mie Gacoan" + "PILIH LEVEL PEDAS".
- `curl /menu/tidak-ada` → 200 dengan kartu "Menu tidak ditemukan" + tombol kembali ke /menu.
- Title SSR: `<title>Menu Mie Gacoan Ciamis — Mie Pedas, Dimsum &amp; Minuman</title>` dan `<title>Mie Gacoan — Mie Gacoan Ciamis</title>`.
- `npx eslint "src/app/(shop)/menu/**/*.tsx" src/components/menu/` → 0 error/0 warning.
- dev.log bersih (tidak ada error/hydration warning dari rute menu).

## Penyimpangan
- Tidak ada. Foundation tidak diubah; dugaan bug `useState` di product-modal.tsx ternyata sudah teratasi oleh agen lain (import sudah ada saat verifikasi ulang).
