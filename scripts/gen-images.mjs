import ZAI from 'z-ai-web-dev-sdk';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT = '/home/z/my-project/public/images';
const LOG = '/home/z/my-project/imggen.log';

const FOOD = 'photorealistic professional food photography, appetizing, vibrant colors, warm cozy cafe lighting, wooden table background, shallow depth of field, high quality, detailed';
const BLACK_PLATE = 'served on a matte black square plate';
const YELLOW_BOWL = 'served in a round yellow plastic steamer bowl with a piece of red chili sauce on the side';
const CUP = 'served in a tall clear plastic takeaway cup with dome lid and black straw, condensation droplets on the cup';

const tasks = [
  // ===== MIE =====
  { f: 'products/mie-gacoan.jpg', size: '1024x1024', p: `Indonesian spicy garlic fried noodles (mie gacoan) with minced chicken and shrimp topping, springy yellow wok-fried noodles garnished with fried shallots and sliced chili, ${BLACK_PLATE}, ${FOOD}` },
  { f: 'products/mie-hompimpa.jpg', size: '1024x1024', p: `Indonesian spicy noodles topped with sliced beef meatballs and sausage rounds, springy yellow noodles, chili flakes, ${BLACK_PLATE}, ${FOOD}` },
  { f: 'products/mie-suit.jpg', size: '1024x1024', p: `Indonesian spicy noodles topped with crispy fried wonton strips and scrambled egg, springy yellow noodles, fried shallots, ${BLACK_PLATE}, ${FOOD}` },
  // ===== DIMSUM =====
  { f: 'products/pangsit-goreng.jpg', size: '1024x1024', p: `Crispy golden fried wonton (pangsit goreng) stacked in a small black bowl, crunchy texture, ${FOOD}` },
  { f: 'products/lumpia-udang.jpg', size: '1024x1024', p: `Golden crispy shrimp spring rolls (lumpia udang) cut in half showing whole shrimp inside, 5 pieces, ${YELLOW_BOWL}, ${FOOD}` },
  { f: 'products/udang-keju.jpg', size: '1024x1024', p: `Golden fried shrimp cheese balls (udang keju), one cut open with melted mozzarella cheese pull, 5 pieces, ${YELLOW_BOWL}, ${FOOD}` },
  { f: 'products/udang-rambutan.jpg', size: '1024x1024', p: `Fried shrimp wrapped in shredded noodle strands resembling rambutan fruit, golden crispy, 5 pieces, ${YELLOW_BOWL}, ${FOOD}` },
  { f: 'products/siomay-ayam.jpg', size: '1024x1024', p: `Steamed chicken siomay dumplings topped with orange fish roe, 4 pieces, ${YELLOW_BOWL}, ${FOOD}` },
  // ===== MINUMAN =====
  { f: 'products/es-gobak-sodor.jpg', size: '1024x1024', p: `Bright red lychee squash iced drink with nata de coco and jelly cubes floating, ${CUP}, ${FOOD}` },
  { f: 'products/es-teklek.jpg', size: '1024x1024', p: `Red strawberry squash iced drink with longan fruit and jelly, ${CUP}, ${FOOD}` },
  { f: 'products/es-sluku-bathok.jpg', size: '1024x1024', p: `Vivid red strawberry soda iced drink with colorful grass jelly cubes, fizzy bubbles, ${CUP}, ${FOOD}` },
  { f: 'products/es-petak-umpet.jpg', size: '1024x1024', p: `Red orange squash iced drink with nata de coco and mango jelly, ${CUP}, ${FOOD}` },
  { f: 'products/lemon-tea.jpg', size: '1024x1024', p: `Iced lemon tea with lemon slices and ice cubes, amber tea color, ${CUP}, ${FOOD}` },
  { f: 'products/es-tea.jpg', size: '1024x1024', p: `Classic Indonesian iced sweet tea (es teh) with ice cubes, amber color, ${CUP}, ${FOOD}` },
  { f: 'products/milo.jpg', size: '1024x1024', p: `Iced milo chocolate malt drink, rich brown creamy chocolate with ice, ${CUP}, ${FOOD}` },
  { f: 'products/orange.jpg', size: '1024x1024', p: `Fresh orange juice iced drink, bright orange color with pulp, ${CUP}, ${FOOD}` },
  { f: 'products/thai-tea.jpg', size: '1024x1024', p: `Thai iced tea, orange milk tea with creamy white milk layer on top gradient, ${CUP}, ${FOOD}` },
  { f: 'products/thai-green-tea.jpg', size: '1024x1024', p: `Thai green iced milk tea, green tea with creamy milk layer gradient, ${CUP}, ${FOOD}` },
  { f: 'products/vanilla-latte.jpg', size: '1024x1024', p: `Iced vanilla latte coffee with milk swirls and ice cubes, latte art gradient, ${CUP}, ${FOOD}` },
  { f: 'products/es-coklat.jpg', size: '1024x1024', p: `Iced chocolate milk drink, rich dark chocolate with ice cubes, ${CUP}, ${FOOD}` },
  // ===== HERO & SECTION IMAGES =====
  { f: 'hero-mie.jpg', size: '864x1152', p: `Dramatic appetizing shot of Indonesian spicy garlic noodles (mie gacoan level pedas) with red chili flakes, minced topping and fried shallots on matte black square plate, steam rising, dark moody restaurant background with warm bokeh lights, red accents, ${FOOD}` },
  { f: 'dimsum-hero.jpg', size: '864x1152', p: `Assorted Indonesian dimsum platter: fried shrimp balls, siomay with roe, crispy wontons in yellow steamer bowls on wooden tray, ${FOOD}` },
  { f: 'interior-wide.jpg', size: '1344x768', p: `Modern industrial Indonesian noodle cafe interior, long wooden communal tables, black steel chairs, hanging green tropical plants from black ceiling grid, skylight roof, warm string lights, youthful crowd atmosphere, red and white branding accents, photorealistic architectural photography, high quality` },
  { f: 'exterior-wide.jpg', size: '1344x768', p: `Modern Indonesian restaurant exterior at dusk, white building facade with large tropical green leaf mural wall art, glowing signboard, glass windows warm light inside, motorcycles parked in front, street food vibe, photorealistic, high quality` },
  { f: 'promo-combo.jpg', size: '1152x864', p: `Indonesian spicy noodle combo meal spread: spicy noodles on black square plates, assorted dimsum in yellow bowls, red iced drinks in plastic cups, on wooden table, top view slightly angled, feast for sharing, ${FOOD}` },
  { f: 'promo-party.jpg', size: '1152x864', p: `Big group feast of Indonesian spicy noodles, dimsum varieties in yellow steamer bowls, red iced drinks, multiple plates on long wooden table, party atmosphere, ${FOOD}` },
  { f: 'promo-berempat.jpg', size: '1152x864', p: `Meal for four: four bowls of Indonesian spicy noodles with different toppings, dimsum baskets, four colorful iced drinks, wooden table top view, ${FOOD}` },
];

async function genOne(zai, t) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const res = await zai.images.generations.create({ prompt: t.p, size: t.size });
      const b64 = res?.data?.[0]?.base64;
      if (!b64) throw new Error('no base64');
      const buf = Buffer.from(b64, 'base64');
      const out = path.join(OUT, t.f);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await sharp(buf).jpeg({ quality: 84 }).toFile(out);
      log(`OK  ${t.f}`);
      await new Promise(r => setTimeout(r, 4000));
      return true;
    } catch (e) {
      log(`ERR ${t.f} attempt ${attempt}: ${e.message}`);
      await new Promise(r => setTimeout(r, 15000 * attempt));
    }
  }
  return false;
}

function log(m) { fs.appendFileSync(LOG, m + '\n'); console.log(m); }

async function main() {
  const zai = await ZAI.create();
  let fail = 0;
  // sekuensial + jeda untuk menghindari rate limit 429
  for (const t of tasks) {
    const ok = await genOne(zai, t);
    if (!ok) fail++;
  }
  log(`DONE total=${tasks.length} failed=${fail}`);
}

main().catch(e => { log('FATAL ' + e.message); process.exit(1); });
