/**
 * Salin & proses foto asli terbaru ke public/images/photos.
 * - Upscale 3x (lanczos3) + sharpen ringan supaya tidak pecah di lightbox.
 * - Nama file deskriptif agar mudah dikelola di Admin > Galeri.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/images/photos");

/** [srcPath, outName, orientation] orientation: "tall" | "wide" */
const PHOTOS = [
  // Batch chat (CDN) — foto crew, kasir, taman, neon, counter, makan
  ["tmp-cdn/team-yellow.jpg", "crew-yellow-wall.jpg", "wide"],
  ["tmp-cdn/cashier.jpg", "cashier-counter.jpg", "wide"],
  ["tmp-cdn/team-sign.jpg", "crew-gacoan-sign.jpg", "wide"],
  ["tmp-cdn/outdoor-pond.jpg", "garden-pond.jpg", "wide"],
  ["tmp-cdn/neon-night.jpg", "neon-sign-night.jpg", "tall"],
  ["tmp-cdn/counter-tomorrow.jpg", "counter-tomorrow.jpg", "tall"],
  ["tmp-cdn/food-table.jpg", "feast-together.jpg", "tall"],
  ["tmp-cdn/food-spread.jpg", "food-spread-3.jpg", "tall"],
  ["tmp-cdn/food-spread-drinks.jpg", "food-spread-4.jpg", "tall"],
  ["tmp-cdn/dimsum-closeup.jpg", "mie-dimsum-closeup.jpg", "tall"],
  // Batch upload lokal — interior, eksterior, papan menu, makanan
  ["upload/unnamed.jpg", "food-spread-5.jpg", "tall"],
  ["upload/unnamed (1).jpg", "food-spread-6.jpg", "tall"],
  ["upload/unnamed (2).jpg", "exterior-signage.jpg", "tall"],
  ["upload/unnamed (3).jpg", "interior-4.jpg", "tall"],
  ["upload/unnamed (4).jpg", "menu-board-2.jpg", "wide"],
  ["upload/unnamed (5).jpg", "interior-5.jpg", "tall"],
  ["upload/unnamed (6).jpg", "interior-6.jpg", "tall"],
  ["upload/unnamed (7).jpg", "food-spread-7.jpg", "wide"],
  ["upload/unnamed (8).jpg", "mural-gacoan-2.jpg", "wide"],
  ["upload/download.jpg", "mie-pangsit-gacok.jpg", "tall"],
];

await mkdir(OUT_DIR, { recursive: true });

for (const [src, out] of PHOTOS) {
  const input = path.resolve(src);
  const meta = await sharp(input).metadata();
  const target = sharp(input)
    .resize({ width: meta.width * 3, kernel: "lanczos3" })
    .sharpen({ sigma: 0.8 })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true });
  await target.toFile(path.join(OUT_DIR, out));
  console.log(`✓ ${out}  (${meta.width}x${meta.height} → ${meta.width * 3}x${meta.height * 3})`);
}

console.log(`\nSelesai: ${PHOTOS.length} foto diproses ke ${OUT_DIR}`);
