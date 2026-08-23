// The P4 case object model, as typed data. Dossier bodies are bespoke pages;
// everything shared (card face, accents, chain, meta) lives here.

export interface CaseMeta {
  slug: 'paymentx' | 'docket' | 'bluff' | 'flowlift';
  name: string;
  /** Outcome+domain card title — never a bare product name. Doubles as OG source. */
  cardTitle: string;
  /** Vertical / domain tag shown in the card parenthetical. */
  domain: string;
  /** ONE receipt on the card face (machine-caps layer). */
  receipt: string;
  /** Page <title> */
  metaTitle: string;
  /** Meta description (DRAFT — gated with the rest of the copy). */
  metaDescription: string;
  accent: string;
  accentBright: string;
  accentTint: string;
  /** Artefact links (links, not CTAs). null until confirmed shareable. */
  figmaUrl: string | null;
  liveUrl: string | null;
  /** Fixed next-case cycle: paymentx → docket → flowlift → bluff → paymentx */
  next: 'paymentx' | 'docket' | 'bluff' | 'flowlift';
}

export const cases: Record<CaseMeta['slug'], CaseMeta> = {
  docket: {
    slug: 'docket',
    name: 'Docket',
    cardTitle: 'An AML review console where AI cites its sources',
    domain: 'AI compliance console',
    receipt: '22 SCREENS × 2 MODES · 0 INVENTED METRICS',
    metaTitle: 'Docket: AML review console where AI cites its sources · Giorgi Matsukatovi',
    metaDescription:
      'An AI-assisted source-of-funds review console for a GB-licensed remote casino. The model reads and cites, it never recommends. 22 screens, both modes, self-initiated.',
    accent: '#3d4fe0',
    accentBright: '#6481e6',
    accentTint: '#e7eafc',
    figmaUrl: 'https://www.figma.com/design/uRAQDtUzV8yjc6i3FatDKu/Docket?node-id=0-1',
    liveUrl: null,
    next: 'flowlift',
  },
  bluff: {
    slug: 'bluff',
    name: 'BLUFF',
    cardTitle: 'Fifteen months on a real casino’s money flows',
    domain: 'iGaming · shipped',
    receipt: '50,000+ SIGNUPS · 15% REG-TO-PLAY',
    metaTitle: 'BLUFF: fifteen months on a real casino’s money flows · Giorgi Matsukatovi',
    metaDescription:
      'Design for a shipped, $21M-backed casino and sportsbook: deposits, withdrawals, failure states, twelve games. Real numbers from the shipped product.',
    accent: '#0057ff',
    accentBright: '#358aff',
    accentTint: '#e5f0ff',
    figmaUrl:
      'https://www.figma.com/proto/bV5NSNd8AGK07KUVr248sk/BLUFF-%E2%80%94-Product-Screens-Handoff?node-id=54225-176562&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=54225%3A176562&show-proto-sidebar=1&page-id=2571%3A260129',
    liveUrl: 'https://bluff.com',
    next: 'paymentx',
  },
  flowlift: {
    slug: 'flowlift',
    name: 'FlowLift',
    cardTitle: 'Four platforms of B2B SaaS in seven days',
    domain: 'AI-directed build log',
    receipt: '~60 SCREENS · 4 PLATFORMS · 7 DAYS',
    metaTitle: 'FlowLift: four platforms of B2B SaaS in seven days · Giorgi Matsukatovi',
    metaDescription:
      'A seven-day build log: design system before screens, four platforms on one grammar. No users, invented data, disclosed up front.',
    accent: '#0f7e49',
    accentBright: '#1fb36b',
    accentTint: '#e8f8ef',
    figmaUrl: 'https://www.figma.com/design/gC1lHPGKvVnagMbRtEKaen/FlowLift---Full-Project?node-id=4-3',
    liveUrl: null,
    next: 'bluff',
  },
  paymentx: {
    slug: 'paymentx',
    name: 'PaymentX',
    cardTitle: 'A payments marketplace designed from zero',
    domain: 'B2B fintech · two-sided',
    receipt: '14% → 0 CHECKOUT DROP · 2,392 PROVIDERS',
    metaTitle: 'PaymentX: a payments marketplace designed from zero · Giorgi Matsukatovi',
    metaDescription:
      'Two sides, opposed incentives, one designer. Architecture before pixels, refunds moved inline and the checkout drop disappeared.',
    accent: '#5168b8',
    accentBright: '#6481e6',
    accentTint: '#e9edfc',
    figmaUrl: 'https://www.figma.com/design/XurJ8tK8O8OzqUwrW57yVq/PaymentX?node-id=2192-13709',
    liveUrl: null,
    next: 'docket',
  },
};

/** Shelf order (desktop 2×2, Docket+BLUFF peers on top). */
export const shelfOrder: CaseMeta['slug'][] = ['docket', 'bluff', 'flowlift', 'paymentx'];
