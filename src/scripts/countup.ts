// Stat count-up: fires once on first view, tabular numerals, announced via
// aria-live on the parent. Degrades to the static number with reduced
// motion or JS off (the number is already in the markup).
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const els = document.querySelectorAll<HTMLElement>('[data-countup]');
if (els.length && !reduced) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const finalText = el.textContent ?? '';
        const target = parseFloat(finalText.replace(/[^0-9.]/g, ''));
        if (!isFinite(target) || target === 0) continue;
        const format = (n: number) =>
          finalText.replace(/[\d,.]+/, Math.round(n).toLocaleString('en-GB'));
        const t0 = performance.now();
        const duration = 900;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(target * eased);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = finalText;
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}
