export type PromoItem = {
  id: string;
  title: string;
  desc: string;
  price: number;
  image: string;
  badge: string;
  terms: string;
};

/**
 * PROMO DEMO — bisa diubah lewat Admin Panel (/admin/promo).
 */
export const PROMOS: PromoItem[] = [
  {
    id: "gacoan-combo",
    title: "GACOAN COMBO",
    desc: "1 mie pilihan + 3 dimsum favorit + es teh manis. Paket pas buat makan kenyang.",
    price: 35000,
    image: "/images/promo-combo.jpg",
    badge: "LIMITED OFFER",
    terms: "Harga demo. Berlaku untuk semua level mie 0–8.",
  },
  {
    id: "hemat-berempat",
    title: "HEMAT BEREMPAT",
    desc: "Paket 4 orang: 4 mie + 6 dimsum + 4 minuman es. Cocok buat nongkrong bareng.",
    price: 99000,
    image: "/images/promo-berempat.jpg",
    badge: "PALING HEMAT",
    terms: "Harga demo. Gratis upgrade es teh jadi ukuran besar.",
  },
  {
    id: "pedas-party",
    title: "PEDAS PARTY",
    desc: "Mie + dimsum + minuman untuk rame-rame. Mode gacoan: siapkan banyak tisu!",
    price: 150000,
    image: "/images/promo-party.jpg",
    badge: "LIMITED OFFER",
    terms: "Harga demo. Reservasi area meja panjang disarankan.",
  },
];
