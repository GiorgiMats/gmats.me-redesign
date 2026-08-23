// Once-on-first-view stat motion (Motion.md job: explanation, fires once).
//  - [data-countup]  counts the number up, tabular numerals, aria-live
//  - [data-fill="X%"] fills a bar from 0 to X% (markup carries the final
//    width, so JS off / reduced motion shows the static truth)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  // --- count-ups ---
  const counts = document.querySelectorAll<HTMLElement>('[data-countup]');
  if (counts.length) {
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
    counts.forEach((el) => io.observe(el));
  }

  // --- bar fills ---
  const fills = document.querySelectorAll<HTMLElement>('[data-fill]');
  if (fills.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          requestAnimationFrame(() => {
            el.style.width = el.dataset.fill!;
          });
        }
      },
      { threshold: 0.5 }
    );
    fills.forEach((el) => {
      el.style.transition = 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.width = '0%';
      io.observe(el);
    });
  }
}
