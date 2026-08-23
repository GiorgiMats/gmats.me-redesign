// Fullscreen image overlay: click any content image to open it in a
// <dialog> at its largest exported size; click anywhere or Esc closes.
// Images inside links (case cards, next-case thumbs) keep their navigation
// and are excluded. Pure enhancement — with JS off nothing changes.

function bestSrc(img: HTMLImageElement): string {
  // Prefer the largest candidate of the first <source> (AVIF), else the
  // img's own srcset, else whatever is currently loaded.
  const srcset = img.closest('picture')?.querySelector('source')?.srcset || img.srcset;
  if (srcset) {
    const candidates = srcset
      .split(',')
      .map((s) => s.trim().split(/\s+/))
      .map(([url, w]) => ({ url, w: parseInt(w || '0', 10) || 0 }))
      .sort((a, b) => b.w - a.w);
    if (candidates.length && candidates[0].url) return candidates[0].url;
  }
  return img.currentSrc || img.src;
}

const images = [...document.querySelectorAll<HTMLImageElement>('main picture img')].filter(
  (img) => !img.closest('a')
);

if (images.length) {
  const dialog = document.createElement('dialog');
  dialog.id = 'lightbox';
  dialog.innerHTML =
    '<button class="lb-close" aria-label="Close full-screen image">&times;</button><img alt="" />';
  document.body.appendChild(dialog);
  const big = dialog.querySelector('img')!;

  const open = (img: HTMLImageElement) => {
    big.src = bestSrc(img);
    big.alt = img.alt;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  };

  dialog.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    big.removeAttribute('src');
    document.documentElement.style.overflow = '';
  });

  for (const img of images) {
    img.classList.add('lb-zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `View full screen: ${img.alt || 'image'}`);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img);
      }
    });
  }
}
