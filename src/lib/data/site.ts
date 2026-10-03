export const site = {
  brand: "MIE GACOAN",
  outletName: "Mie Gacoan Ciamis",
  tagline: "Mie Pedas, Dimsum, dan Nongkrong Jadi Satu.",
  heroBadge: "🔥 MIE PEDAS FAVORIT",
  address:
    "Jl. Jenderal Ahmad Yani No.43, Ciamis, Kecamatan Ciamis, Kabupaten Ciamis, Jawa Barat 46211",
  shortAddress: "Jl. Jenderal Ahmad Yani No.43, Ciamis, Jawa Barat",
  city: "Ciamis",
  // Jam operasional (waktu lokal browser) — bisa diubah dari Admin > Settings
  openHour: 8, // 08.00
  closeHour: 23, // 23.00
  hoursLabel: "08.00 — 23.00",
  phone: "+62 812-3456-7890",
  whatsapp: "6281234567890",
  rating: 4.9,
  ratingNote: "Contoh rating demo — bukan rating resmi Google",
  mapsQuery: "Mie Gacoan Ciamis Jl. Jenderal Ahmad Yani No.43 Ciamis",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Mie+Gacoan+Ciamis+Jl.+Jenderal+Ahmad+Yani+No.43+Ciamis",
  mapsEmbed:
    "https://www.google.com/maps?q=Mie+Gacoan+Ciamis+Jl.+Jenderal+Ahmad+Yani+No.43+Ciamis&output=embed",
  socials: [
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "TikTok", href: "#", icon: "tiktok" },
    { label: "Facebook", href: "#", icon: "facebook" },
  ],
  priceDisclaimer:
    "Harga yang tampil adalah harga demo untuk keperluan tampilan dan dapat berubah. Harga resmi dapat berbeda di setiap outlet dan sewaktu-waktu.",
  copyright: "© 2026 Mie Gacoan. All rights reserved.",
};

export const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Galeri", href: "/gallery" },
  { label: "Lokasi", href: "/location" },
  { label: "Promo", href: "/promo" },
  { label: "Kontak", href: "/contact" },
];

export const spicyLevels = [
  { level: 0, label: "Tidak Pedas", desc: "Aman buat kamu yang nggak suka pedas.", chilies: 0 },
  { level: 1, label: "Pedas Tipis", desc: "Sekilas hangat di ujung lidah.", chilies: 1 },
  { level: 2, label: "Mulai Pedas", desc: "Pedasnya mulai terasa manis.", chilies: 2 },
  { level: 3, label: "Pedas", desc: "Standar favorit anak muda.", chilies: 3 },
  { level: 4, label: "Pedas Banget", desc: "Siap-siap minum es teh.", chilies: 4 },
  { level: 5, label: "Ekstra Pedas", desc: "Mulai keringetan tapi nagih.", chilies: 5 },
  { level: 6, label: "Sangat Pedas", desc: "Buat kamu yang berani tantangan.", chilies: 6 },
  { level: 7, label: "Extreme", desc: "Pedasnya nendang, berani coba?", chilies: 7 },
  { level: 8, label: "GACOAN MODE 🔥", desc: "Level tertinggi. Hanya untuk legenda.", chilies: 8 },
];

export const orderTimeline = [
  { status: "PENDING", label: "Pesanan dibuat", desc: "Kami menerima pesananmu." },
  { status: "CONFIRMED", label: "Pesanan dikonfirmasi", desc: "Pesanan kamu sudah dikonfirmasi outlet." },
  { status: "PREPARING", label: "Sedang diproses", desc: "Mie pedas kamu lagi dimasak!" },
  { status: "READY", label: "Siap diambil", desc: "Pesanan siap diambil / dikirim." },
  { status: "COMPLETED", label: "Selesai", desc: "Terima kasih sudah makan di Gacoan!" },
];

export const paymentMethods = [
  { id: "QRIS", label: "QRIS", desc: "Scan & bayar dari e-wallet apa saja" },
  { id: "E-WALLET", label: "E-Wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
  { id: "TRANSFER", label: "Transfer Bank", desc: "BCA / BRI / BNI / Mandiri" },
  { id: "PAY_AT_OUTLET", label: "Bayar di Outlet", desc: "Bayar tunai saat ambil pesanan" },
];
