// Scroll-scrubbed demo (Motion.md job: explanation/continuity — ONE per
// dossier). A [data-scrub] container holds a sticky stage plus [data-step]
// captions; the step crossing the viewport's middle band sets the stage
// state. Enhancement only: with JS off, on mobile, or under reduced
// motion the section stays the static layout and every state is visible.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = window.matchMedia('(min-width: 900px)');

document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((root) => {
  if (reduced) return;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  if (!steps.length) return;

  const apply = () => root.classList.toggle('scrub-on', wide.matches);
  apply();
  wide.addEventListener('change', apply);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const step = entry.target as HTMLElement;
        root.dataset.state = step.dataset.step!;
        steps.forEach((s) => s.classList.toggle('step-active', s === step));
      }
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );
  steps.forEach((s) => io.observe(s));
});
