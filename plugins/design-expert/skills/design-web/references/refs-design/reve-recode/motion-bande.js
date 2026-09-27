/* DESIGN REFERENCE — app.reve.com · drifting strip (hero and gallery).
   [measured] = mechanism read in the source · [decided] = the author's choice.

   Isolated module because a repo hook caps every file at 200 lines: it is
   the only behaviour big enough to justify its own file, and the only one
   two other blocks (hero, gallery) depend on. Loaded BEFORE motion.js —
   the `defer` order is guaranteed — and exposed on `window.RevStrip`
   rather than as an ES module, which does not load from a `file://` URL.

   The source's comment, which dictates everything that follows:
   « a marquee carousel of curated examples. The strip drifts on its own and
     loops seamlessly (app.ts wireHeroMarquee clones the card set once);
     visitors can grab it directly at any width, and the page scrolls past it
     like any other section. »
   ========================================================================== */
(() => {
  'use strict';

  /* [measured] The source neutralizes motion by resetting its 5 duration
     tokens to 0s; whatever is driven in JS is handled in JS, same media query. */
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const onPreferenceChange = [];
  reducedMotion.addEventListener('change', () =>
    onPreferenceChange.forEach((f) => f(reducedMotion.matches)));

  const all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /**
   * Makes a horizontally scrolling strip drift, looping seamlessly,
   * without ever taking control away from the user.
   * @param {HTMLElement} strip container with `overflow-x: auto`
   */
  function drift(strip) {
    const speed = Number(strip.dataset.speed || 18); /* [decided] px/s */
    const originals = Array.from(strip.children);
    let setWidth = 0, paused = false, lastTime = 0, loop = 0;

    /* [measured] « clones the card set once » — ONE single duplication. The
       clones leave the accessibility tree and the keyboard order: they are
       visual duplicates meant to hide the seam, not content. */
    originals.forEach((el) => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.clone = '';
      all('[tabindex], a, button', clone).forEach((n) => n.setAttribute('tabindex', '-1'));
      strip.appendChild(clone);
    });

    /* The width of a set is measured, not assumed: the cards have different
       ratios, hence different widths. Re-measured on resize. */
    const measure = () => {
      const gap = parseFloat(getComputedStyle(strip).columnGap) || 0;
      setWidth = originals.reduce(
        (total, el) => total + el.getBoundingClientRect().width + gap, 0);
    };
    measure();
    new ResizeObserver(measure).observe(strip);

    /* [decided] We WRITE `scrollLeft` rather than calling
       `scrollBy({behavior:'smooth'})`: that API never consults
       `prefers-reduced-motion` and, with `behavior` omitted, silently follows
       the CSS `scroll-behavior`. A direct write animates nothing — the motion
       is produced frame by frame and therefore stops dead when asked to. */
    const step = (instant) => {
      if (!lastTime) lastTime = instant;
      const delta = (instant - lastTime) / 1000;
      lastTime = instant;
      if (!paused && setWidth > 0) {
        strip.scrollLeft += speed * delta;
        /* Seamless loop: subtract the width of one set instead of going back
           to 0 — the visual position is strictly identical. */
        if (strip.scrollLeft >= setWidth) strip.scrollLeft -= setWidth;
      }
      loop = requestAnimationFrame(step);
    };
    const start = () => {
      if (!loop) { lastTime = 0; loop = requestAnimationFrame(step); }
    };
    const halt = () => {
      if (loop) { cancelAnimationFrame(loop); loop = 0; }
    };

    /* Any interaction suspends the drift. `pointer*` covers mouse, touch and
       stylus; `focus*` covers keyboard navigation; `wheel` the trackpad. */
    const freeze = () => { paused = true; };
    const thaw = () => { paused = false; };
    ['pointerenter', 'focusin'].forEach((t) => strip.addEventListener(t, freeze));
    ['pointerleave', 'focusout'].forEach((t) => strip.addEventListener(t, thaw));
    strip.addEventListener('wheel', freeze, { passive: true });

    /* [measured] « visitors can GRAB it directly at any width ». A container
       with `overflow-x: auto` scrolls via trackpad and finger, but NOT by
       dragging it with the mouse: that gesture has to be built. Pointer
       capture keeps the drag going even when the cursor leaves the strip, and
       `pointercancel` avoids getting stuck in the grabbed state. */
    let startX = null, startScroll = 0;
    strip.addEventListener('pointerdown', (event) => {
      freeze();
      startX = event.clientX;
      startScroll = strip.scrollLeft;
      strip.setPointerCapture(event.pointerId);
      strip.classList.add('is-grabbed');
    });
    strip.addEventListener('pointermove', (event) => {
      if (startX === null) return;
      strip.scrollLeft = startScroll - (event.clientX - startX);
    });
    const release = () => {
      if (startX === null) return;
      startX = null;
      strip.classList.remove('is-grabbed');
      thaw();
    };
    ['pointerup', 'pointercancel'].forEach((t) => strip.addEventListener(t, release));

    /* [decided] Offscreen, the animation loop is released: running a
       `requestAnimationFrame` on an invisible strip serves no purpose. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => entries.forEach((e) =>
        (e.isIntersecting && !reducedMotion.matches ? start() : halt())
      ), { rootMargin: '100px' }).observe(strip);
    } else if (!reducedMotion.matches) {
      start();
    }

    /* Reduced motion: the drift stops, the strip stays draggable. */
    onPreferenceChange.push((reduced) => (reduced ? halt() : start()));
    if (reducedMotion.matches) halt();
  }

  window.RevStrip = { drift, reducedMotion };
})();
