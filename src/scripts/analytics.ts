// GA4 behind a minimal consent gate (P6). Nothing loads until the visitor
// says yes; "no" is remembered and nothing ever loads. Cloudflare server-side
// analytics stays the consent-independent denominator of record.
//
// Event dictionary (specs/P6-metrics.md — names are the contract):
//   outbound_click {channel, source_page, cta}   — headline signal
//   email_copy {source_page}
//   case_proof_reach {case}
//   offer_view / offer_expand
//   rescue_view / rescue_ask_click
//   employment_route_click / cv_download
//   conversation_click / home_beat_reach {beat} / about_thesis_reach {thesis}
//   CWV: LCP / INP / CLS as web_vitals events
import { onLCP, onINP, onCLS, type Metric } from 'web-vitals';

const GA_ID = 'G-79PV2XPRMR';
const CLARITY_ID = 'y9h4xw9d3o';
const CONSENT_KEY = 'gmats-analytics';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

function loadGtag(): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  // Self-testing convention: ?self=1 marks Giorgi's own sessions (P6).
  const self = new URLSearchParams(location.search).has('self');
  window.gtag('config', GA_ID, self ? { traffic_type: 'internal' } : {});
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

// Clarity (session recordings + heatmaps) behind the same gate. The stub
// queues calls until the tag loads; the explicit consent signal keeps
// Clarity's cookies running for EEA/UK visitors after the visitor opts in.
function loadClarity(): void {
  window.clarity =
    window.clarity ||
    function (...args: unknown[]) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(s);
  window.clarity('consent');
}

function loadAnalytics(): void {
  loadGtag();
  loadClarity();
}

function track(name: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

function wireEvents(): void {
  const page = location.pathname;

  // Click events: any element carrying data-event fires it once per click.
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-event]');
    if (!el) return;
    const name = el.dataset.event!;
    const params: Record<string, string | boolean> = { source_page: page };
    if (el.dataset.channel) params.channel = el.dataset.channel;
    if (el.dataset.cta) params.cta = el.dataset.cta === 'true';
    if (el.dataset.case) params.case = el.dataset.case;
    if (el.dataset.beat) params.beat = el.dataset.beat;
    track(name, params);
  });

  // Reach events: sections carrying data-reach fire once when 50% visible.
  const seen = new Set<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        seen.add(entry.target);
        io.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const params: Record<string, string> = { source_page: page };
        if (el.dataset.case) params.case = el.dataset.case;
        if (el.dataset.beat) params.beat = el.dataset.beat;
        if (el.dataset.thesis) params.thesis = el.dataset.thesis;
        track(el.dataset.reach!, params);
      }
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-reach]').forEach((el) => io.observe(el));

  // Page-scoped events.
  if (page === '/rescue') track('rescue_view', { source_page: page });

  // CWV probe (CrUX has no field data at this n — web-vitals is the probe).
  const sendVital = (m: Metric) =>
    track('web_vitals', {
      metric_name: m.name,
      metric_value: Math.round(m.name === 'CLS' ? m.value * 1000 : m.value),
      metric_rating: m.rating,
    });
  onLCP(sendVital);
  onINP(sendVital);
  onCLS(sendVital);
}

function showBanner(): void {
  const banner = document.getElementById('consent');
  if (!banner) return;
  banner.hidden = false;
  banner.querySelector('[data-consent="yes"]')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    banner.hidden = true;
    loadAnalytics();
    wireEvents();
  });
  banner.querySelector('[data-consent="no"]')?.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    banner.hidden = true;
  });
}

const consent = localStorage.getItem(CONSENT_KEY);
if (consent === 'granted') {
  loadAnalytics();
  wireEvents();
} else if (consent === null) {
  showBanner();
}
