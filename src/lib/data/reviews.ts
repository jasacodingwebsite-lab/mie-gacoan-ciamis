export type Review = {
  id: string;
  name: string;
  initials: string;
  stars: number;
  text: string;
  date: string;
};

/**
 * CONTOH ULASAN (demo) — bukan ulasan asli dari Google.
 * Data ini placeholder dan bisa diganti dengan ulasan asli milik outlet.
 */
export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Rina W.",
    initials: "RW",
    stars: 5,
    text: "Pelayanannya ramah, harga worth it, suasananya nyaman dan restonya bersih.",
    date: "2 hari lalu",
  },
  {
    id: "r2",
    name: "Dimas P.",
    initials: "DP",
    stars: 5,
    text: "Mie Gacoan level 5 emang beda! Dimsumnya juga juicy banget, wajib reorder.",
    date: "1 minggu lalu",
  },
  {
    id: "r3",
    name: "Salsa A.",
    initials: "SA",
    stars: 5,
    text: "Tempatnya luas, enak buat nongkrong bareng temen. Es Gobak Sodor juara!",
    date: "1 minggu lalu",
  },
  {
    id: "r4",
    name: "Fajar N.",
    initials: "FN",
    stars: 4,
    text: "Pesan ambil gampang banget, tinggal tunjukin nomor pesanan ke kasir.",
    date: "2 minggu lalu",
  },
  {
    id: "r5",
    name: "Tiara S.",
    initials: "TS",
    stars: 5,
    text: "Decor-nya aesthetic buat foto-foto. Mie Suit level 3 pas buat aku, nggak bikin mewek.",
    date: "3 minggu lalu",
  },
  {
    id: "r6",
    name: "Bayu K.",
    initials: "BK",
    stars: 5,
    text: "Level 8 beneran bikin keringetan tapi nagih. Siap-siap banyak minum!",
    date: "1 bulan lalu",
  },
];
