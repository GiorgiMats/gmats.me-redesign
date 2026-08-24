// Processes the real portrait into the site's one portrait slot:
// editorial B&W (locked treatment), 4:5 crop at 2x (1140×1425), replacing
// src/assets/home/portrait.png (used on home + /about — one slot, reused).
//
//   node scripts/process-portrait.mjs <path-to-photo>
//
import sharp from 'sharp';

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/process-portrait.mjs <path-to-photo>');
  process.exit(1);
}

const out = new URL('../src/assets/home/portrait.png', import.meta.url).pathname;

await sharp(input)
  .rotate() // honour EXIF orientation
  .resize(1140, 1425, { fit: 'cover', position: 'attention' })
  .grayscale()
  .normalise({ lower: 1, upper: 99 }) // gentle contrast lift, no crush
  .png()
  .toFile(out);

console.log(`Portrait processed -> ${out}`);
console.log('Now run: npm run build');
