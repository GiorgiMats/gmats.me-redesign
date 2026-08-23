# gmats.me — P9b build handover for Claude Code

Written 2026-08-23, at the close of the Figma design phase. This file is the bridge: everything Claude Code needs to build the site from the Figma file without re-deriving decisions. Drop it in the repo root (or fold it into CLAUDE.md). The decision log (`DECISION-LOG-2026-08-20.md`) is the full audit trail; this is the operating subset.

## 0 · What this is

Full redesign of gmats.me. Stack: **Astro + Cloudflare Pages**, islands architecture. Every screen exists in Figma at two breakpoints (desktop 1440, mobile 390). Design is done; copy is **DRAFT until Giorgi's explicit yes** — build with current copy, but nothing publishes without his gate.

- Figma file key: `Fa8WJ0nTYFs9bfxuwzAx7C`
- Page `01 · Foundations` — tokens, marks, logo construction
- Page `02 · Screens (desktop 1440)` — desktop at y=0, mobile at y=17000, Safari fold-checks beside each mobile frame (reference only, do not build)
- Use the Figma MCP (`get_screenshot`, `get_design_context`, `get_metadata`) against the node map below.

## 1 · Node map

| Route | Desktop 1440 | Mobile 390 | Fold check |
|---|---|---|---|
| `/` | 102:11 | 274:281 | 276:5 |
| `/project/paymentx` | 133:3 | 278:5 | 280:5 |
| `/project/docket` | 167:3 | 278:291 | 280:309 |
| `/project/bluff` | 169:48 | 278:492 | 280:528 |
| `/project/flowlift` | 171:3 | 278:1055 | 280:746 |
| `/rescue` | 175:3 | 278:1233 | 280:942 |
| `/about` | 203:210 | 278:1422 | 280:1149 |
| `/contact` | 204:228 | 278:1539 | 280:1278 |
| `/project` | 204:295 | 278:1590 | 280:1347 |
| `404` | 204:374 | 278:1650 | 280:1425 |

Shared parts inside `/` (home): nav `102:12`, footer `105:66`, work grid `104:13`. Mobile nav/footer live inside `274:281` (`nav-m`, `footer-m`). The shared dossier close is `sandwich-close` inside each case frame (PaymentX's `147:45` is the source of truth; the other three are rethemed clones).

## 2 · Tokens

Colours (site constants):
- ground `#F7F8FA` · surface `#FFFFFF` · sunken `#EDF0F5` · border/hairline `#E2E5EA`
- ink `#1A1B1E` · ink.secondary `#545860`
- accent cobalt `#2E5CE6` · bright `#3B82F6` · tint stage `#E7EDFB`
- Logo is ALWAYS cobalt, on every page, including themed dossiers.

Case accents (each derived from the project's own palette, AA-checked ≥4.5 both on white and white-on-fill):
- PaymentX `#5168B8`, bright `#6481E6`, tint `#E9EDFC`
- Docket `#3D4FE0`, tint `#E7EAFC`
- BLUFF `#0057FF`, bright `#358AFF`, tint `#E5F0FF`
- FlowLift `#0F7E49`, bright `#1FB36B`, tint `#E8F8EF`
On a dossier, the nav CTA takes the case hue; everything else brand-constant.

Radii: cells 24 · cards 20 · mobile cells 16 · pills/buttons 999. Light-background screenshots always carry a 1px `#E2E5EA` inside border (they dissolve otherwise — this was a caught bug, keep it).

## 3 · Type

- **Manrope only** (Google Fonts, self-host + subset). Regular = body. Medium = ALL display and labels — display is never Bold, never below Regular. SemiBold = caps machine layer at 9% letter-spacing (mobile floor 8.5px/8%).
- **No monospace anywhere, ever.** Hard rule.
- Sizes in `rem` (px only for borders/hairlines/icons).
- Desktop scale ≈ 76/58/54 display · 40 claims · 27 titles · 17–18 body/165% · 15/16 support · 12/11/10 caps. Mobile scale ≈ 33 display/112% · 28 claims · 20 titles · 16 body/155–160% · caps 8.5–11. Type does NOT scale proportionally between breakpoints — both scales are authored, use them as-is.
- **H1 line breaks are authored per breakpoint** (in the Figma text). Ship them as hard breaks (`<br class="only-desktop">` / `only-mobile` or two markup variants). Never let heroes auto-wrap; `text-wrap: pretty` for body only.
- Caps lines: `line-height: ~1.0` and `font-feature-settings: "case" 1` (punctuation/dash position in caps and lining-figure contexts).
- Buttons/chips/pills: optical centring (`text-box: trim-both cap alphabetic` where supported, else 1px padding compensation).

## 4 · Structural rules (violations = bugs)

1. **Checkmark glyphs are banned sitewide.** Dots carry yes-semantics.
2. **No em-dashes in site copy.** (Verbatim third-party quotes, e.g. LinkedIn recommendations on /about, keep their own punctuation.)
3. Canonical mechanism sentence, verbatim wherever it appears: *"I direct Claude Code against your product's code myself, so every fix arrives as a change you can review, question and approve."* Never paraphrase it.
4. Multi-image displays are **zigzag or bento only**, shuffled, never the same pattern twice in a row.
5. One vivid gradient moment per page maximum (the sign-off cell in each dossier close).
6. The **circle CTA (Email me)** is the ONLY contact action on marketing pages; artefact buttons ("View in Figma"/"View live site") are links, not CTAs. Circle is centred on mobile, always. `/rescue` has NO circle and no playful moment (trust surface).
7. `/rescue` stays **out of nav and footer** — it's a direct-share destination.
8. Every dossier ends with the same sandwich-close structure (collage · recap chips · artefact button(s) · next-case card · circle CTA). Next-case chain: PaymentX → Docket → FlowLift → BLUFF → PaymentX.
9. BLUFF gets two artefact buttons (View in Figma + View live site); the others per their Figma frames.
10. Numbers are never rounded or invented. "6+ years", never 7. FlowLift's "no users, invented data" disclosure ships in the body, near the top, every time.

## 5 · Interactivity contract

`specs/interaction.md` is binding. Summary:
- **Tier 0 everywhere:** fully readable JS-off · View Transitions API for page-to-page · `prefers-reduced-motion` degrades everything to static · NO preloader, NO scroll-hijack (no Lenis), no load animations. The one licensed signature: the decision-mark draws itself once in the home hero (~600ms).
- **Tier 1 menu (per dossier, never all at once):** `<video muted loop playsinline>` inside mockup frames (poster fallback, one playing at a time, pause off-screen) · ONE scroll-scrubbed demo per dossier via CSS scroll-driven animations (GSAP only where CSS can't) · stat count-ups (once, tabular numerals, `aria-live`) · interactive inline-SVG diagrams (hover/tap highlight, legible static) · deferred click-to-load Figma embed facade at page end only.
- **Cut, do not add back:** carousels (exception: /about recommendations = native horizontal overflow with scroll-snap and edge peek, all cards in DOM — that is NOT a carousel), inline Figma iframes, uniform scroll reveals/stagger/blur-in, pulsing anything.
- JS budget ≤40KB gzip added per dossier. `content-visibility: auto` on below-fold chapters.

## 6 · Assets

- Export screens/illustrations from the Figma frames (2x PNG for raster, SVG where vector). Optimise to AVIF/WebP with `<picture>` fallbacks; explicit width/height everywhere (CLS).
- The dossier screenshots originate from Giorgi's published case studies (framerusercontent) and his product Figma files — the Figma frames already contain them; export from Figma, don't re-fetch.
- The portrait on `/` and `/about` is a **Firefly placeholder** — swap when Giorgi drops his real photo (one slot, reused).
- Favicon/OG images: not yet designed — derive from the circled-g logo (Foundations page) + cobalt.

## 7 · Routes, meta, misc

- Routes: `/`, `/project` (index), `/project/{paymentx,docket,bluff,flowlift}`, `/rescue`, `/about`, `/contact`, custom 404.
- Footer sitemap: WORK (four cases) · SITE (about, contact, project index) · ELSEWHERE (LinkedIn, Dribbble, X). No /rescue.
- `/contact` has NO form — three paths (email primary, LinkedIn DM, optional call). Keep it that way.
- Availability dot in nav is static (no pulsing).
- British spellings in copy. Meta descriptions: draft from each page's intro, gate with the rest of the copy.

## 8 · Open items (not blockers, tracked)

1. Giorgi's drops: real portrait · PaymentX M3 diagrams (PaymentX file `2531:3` Object Model, `2532:2` Token Tiers) · PaymentX marketing-site hero + one mobile screen (labelled placeholders in frame 133:3) · Docket inner-page links.
2. Giorgi's mobile critique round (transformer-built pages may take per-section touch-ups; grammar is locked).
3. Copy gate: Marketing-OS pass + his explicit yes before publish. His OS files (VOICE_LOCK, Landing_and_Offer) still carry the OLD pull-request canonical sentence — the amended one above is the shipping version; he should sync his OS.
4. Tier-3 offer naming on /rescue ("Design partner" vs "Ongoing design") — open ruling.
5. Tablet: no designed breakpoint by decision — fluid CSS between 390 and 1440 (grid collapses at ~900, type via clamp between the two authored scales).
6. BLUFF cover receipts (50,000+/15%) confirmed from his published case study; live-site button points at the post-pivot site (his design system still runs it — intentional).

## 9 · Definition of done for the build

JS-off readable on every route · Lighthouse: LCP is part of the craft argument, aim green on all four · AA contrast (already designed in, don't degrade) · reduced-motion clean · 404 works · no route to /rescue from nav · fold on 390 matches the Figma fold-checks · every rule in §4 audited before calling a page done.
