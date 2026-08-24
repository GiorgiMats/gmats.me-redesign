// Processes the real portrait into the site's one portrait slot:
// editorial B&W (locked treatment), 4:5 centred crop, no upscaling,
// replacing src/assets/home/portrait.png (home + /about, one slot).
//
//   node scripts/process-portrait.mjs <path-to-photo> [focusX 0..1]
//
// focusX shifts the crop window horizontally (0 = left edge, 0.5 = centre).
import sharp from 'sharp';

const input = process.argv[2];
const focusX = Math.min(1, Math.max(0, parseFloat(process.argv[3] ?? '0.5')));
if (!input) {
  console.error('Usage: node scripts/process-portrait.mjs <path-to-photo> [focusX]');
  process.exit(1);
}

const out = new URL('../src/assets/home/portrait.png', import.meta.url).pathname;
const RATIO = 4 / 5;
const MAX_W = 1140; // 3x of the 380px slot

const oriented = await sharp(input).rotate().toBuffer();
const { width, height } = await sharp(oriented).metadata();

let cw = Math.min(width, Math.round(height * RATIO));
let ch = Math.round(cw / RATIO);
if (ch > height) {
  ch = height;
  cw = Math.round(ch * RATIO);
}
const left = Math.min(width - cw, Math.max(0, Math.round(focusX * width - cw / 2)));

let img = sharp(oriented)
  .extract({ left, top: 0, width: cw, height: ch })
  .grayscale()
  .normalise({ lower: 1, upper: 99 });
if (cw > MAX_W) img = img.resize(MAX_W, Math.round(MAX_W / RATIO));

await img.png().toFile(out);
console.log(`Portrait -> ${out} (crop ${cw}x${ch} at left ${left}, source ${width}x${height})`);
