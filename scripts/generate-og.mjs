// Generates OG images (1200×630) + apple-touch-icon from local assets.
// Run once: node scripts/generate-og.mjs  (re-run if covers change)
import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';

const OUT = new URL('../public/og/', import.meta.url).pathname;
await mkdir(OUT, { recursive: true });

// Default OG: circled-g on cool paper, derived from the logo + cobalt.
const logoSvg = await readFile(
  new URL('../src/assets/brand/logo-circled-g.svg', import.meta.url).pathname,
  'utf8'
);
const bigLogo = await sharp(Buffer.from(logoSvg), { density: 300 })
  .resize({ width: 440 })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 4, background: '#f7f8fa' },
})
  .composite([{ input: bigLogo, gravity: 'centre' }])
  .png()
  .toFile(`${OUT}default.png`);

// Case OGs: the card face is the OG source (P4) — cover crops at 1200×630.
const covers = {
  paymentx: 'cover-paymentx.png',
  docket: 'cover-docket.png',
  bluff: 'cover-bluff.png',
  flowlift: 'cover-flowlift.png',
};
for (const [slug, file] of Object.entries(covers)) {
  await sharp(new URL(`../src/assets/home/${file}`, import.meta.url).pathname)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(`${OUT}${slug}.png`);
}

// Apple touch icon: circled-g on white, 180×180.
const smallLogo = await sharp(Buffer.from(logoSvg), { density: 300 })
  .resize({ width: 132 })
  .png()
  .toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
  .composite([{ input: smallLogo, gravity: 'centre' }])
  .png()
  .toFile(new URL('../public/apple-touch-icon.png', import.meta.url).pathname);

console.log('OG images + apple-touch-icon generated.');
