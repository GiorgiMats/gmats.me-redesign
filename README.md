# gmats.me

Portfolio site for Giorgi Matsukatovi. Astro + vanilla CSS custom-property
tokens + vanilla TS, static output, hosted on Cloudflare Pages. Built from the
Figma file `Fa8WJ0nTYFs9bfxuwzAx7C`; `HANDOVER-P9b.md` is the design-to-build
contract and lives in this repo verbatim.

## Commands

```bash
npm install          # once
npm run dev          # dev server on :4321
npm run build        # static build into dist/
npm run preview      # serve dist/ locally
node scripts/generate-og.mjs   # regenerate OG images (only if covers change)
```

## Deploying (Cloudflare Pages)

Create a Pages project pointed at this repo with:

- Build command: `npm run build`
- Build output directory: `dist`
- No environment variables needed.

`public/_redirects` carries the legacy 301s and the `/project/*` catch-all
(the four real case pages are pinned with 200 rewrites above it — verify all
four still resolve after the first deploy). Custom domain: `gmats.me`; after
cut-over, point the old `*.framer.website` subdomain at the new canonical or
retire it so no stale duplicate stays indexed.

## Structure

- `src/styles/tokens.css` — the whole token sheet; case dossiers swap accents
  via `data-case` on `<html>`, nothing else changes.
- `src/pages/` — one file per route; the four dossiers are bespoke pages that
  share `src/styles/dossier.css` + `SandwichClose`/`PhoneMockup`/
  `BrowserMockup`/`ArtefactButtons` components.
- `src/data/cases.ts` — the P4 case object model (card faces, accents, the
  fixed next-case cycle, artefact links).
- `src/scripts/analytics.ts` — GA4 behind a minimal consent card; the P6
  event dictionary (`outbound_click`, `email_copy`, reach events, web-vitals).
- `src/assets/` — exhibits exported from the Figma frames at 2x; Astro emits
  AVIF/WebP with fallbacks at build.

## Standing rules (violations = bugs)

See `HANDOVER-P9b.md` §4 — checkmark ban, em-dash ban, the canonical
mechanism sentence verbatim, zigzag/bento only, one gradient moment per page,
circle CTA as the only contact action, `/rescue` off-nav, the shared dossier
close, exact numbers only.
