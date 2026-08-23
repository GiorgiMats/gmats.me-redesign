// @ts-check
import { defineConfig } from 'astro/config';

// Static output for Cloudflare Pages. `format: 'file'` emits /about.html
// instead of /about/index.html so Pages serves the extensionless URL and
// 308-normalises the trailing-slash variant (the P4 trailing-slash rule).
export default defineConfig({
  site: 'https://gmats.me',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  image: {
    // Exhibits are exported from Figma at 2x; sharp emits AVIF/WebP at build.
    responsiveStyles: false,
  },
});
