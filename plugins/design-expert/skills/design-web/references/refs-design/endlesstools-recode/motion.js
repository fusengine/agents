/* Design reference — interface behaviors. Vanilla JS, no dependency.
   [measured] = read in the source (static HTML or CSS sheet)
   [decided] = a choice made by this reference, not observable in the source.

   The source is a Next.js application: of its behaviors, the scraped HTML keeps only
   the traces left before hydration — a start state as inline style, the playback
   attributes of the <video> elements, the layout classes. Durations, curves and
   scrolling mechanics live in the bundle and are flagged as not measurable. */

(() => {
  'use strict';

  /* Re-read at every decision rather than captured once: the preference can change
     mid-session, and a page with eight videos must comply right away.
     [decided] — the source consults this preference nowhere. */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canObserve = 'IntersectionObserver' in window;

  /* ==== 1. Reveal on scroll ============================================
     Measured technique: ~18 containers carry, in the served HTML,
     `style="opacity:0;transform:translateY(5px)"` [measured] — the START state, hard-coded
     before hydration. Duration and curve appear nowhere in the sheet: the ones used
     here are [decided] and live in styles.css.
     Two deliberate deviations: the start state is set in CSS (not inline), and under
     `reduce` everything is revealed immediately, with no transition. */
  const targets = document.querySelectorAll('[data-reveal]');
  const revealAll = () => targets.forEach((el) => el.classList.add('is-visible'));

  if (reducedMotion.matches || !canObserve) {
    revealAll(); /* never leave content at opacity 0 */
  } else {
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        watcher.unobserve(e.target); /* once only: no re-animation on the way back */
      });
    }, {
      rootMargin: '0px 0px -10% 0px', /* [decided] fires once the element is clearly inside */
      threshold: 0.01
    });
    targets.forEach((el) => watcher.observe(el));
  }

  /* ==== 2. Video playback ==============================================
     Attributes measured on the 8 <video> elements, identical for all of them:
     `preload="none" loop muted autoplay playsinline` [measured] — no poster, no <source>,
     no controls.

     `preload="none"` prevents preloading, not autoplay: as soon as the browser starts
     playback, it downloads. With eight videos, that makes eight concurrent downloads
     on load.

     What this block adds [decided]: `src` set only when approaching the viewport
     (the <video> elements carry data-src), playback stopped when leaving the screen so
     only one decode at a time, and under `reduce` the source is loaded to show the first
     frame but play() is never called. */
  const videos = document.querySelectorAll('[data-video-deferred]');

  const activateVideo = (v) => {
    /* [decided] `&& v.dataset.src` guard: without it, a missing data-src (undefined) is
       coerced by the IDL into "undefined" — the browser would load that literal relative URL. */
    if (!v.src && v.dataset.src) {
      v.src = v.dataset.src;
      v.preload = 'metadata'; /* [decided] enough to show the 1st frame, the rest comes with playback */
    }
    if (reducedMotion.matches) return;
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {}); /* autoplay refusal = normal case */
  };

  if (canObserve) {
    const videoWatcher = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) activateVideo(v);
        else if (v.src && !v.paused) v.pause();
      });
    }, {
      rootMargin: '200px 0px', /* [decided] the video gets ready before being seen, without loading from afar */
      threshold: 0.1
    });
    videos.forEach((v) => videoWatcher.observe(v));
  } else {
    videos.forEach(activateVideo);
  }

  /* Preference changed mid-session: immediate compliance, in both
     directions. [decided] */
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        videos.forEach((v) => { if (v.src && !v.paused) v.pause(); });
        revealAll();
        return;
      }
      videos.forEach((v) => {
        const r = v.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) activateVideo(v);
      });
    });
  }

  /* ==== 3. Mosaic hover videos =========================================
     SECOND video treatment on the page, opposite to the first. Measured on the tiles:
     `preload="auto" loop playsinline`, overlaid as `absolute inset-0 object-cover`,
     `opacity-0` at rest and `group-hover:opacity-100` on hover.

     Two defects fixed here:
     - `preload="auto"` on twelve videos makes them all download on load, for
       content nobody will see without hovering. Replaced by a load on
       first hover. [decided]
     - the source omits `muted`: without it, a browser refuses programmatic playback.
       The attribute is added in the HTML. [decided]

     Under `reduce`, no playback: the tile keeps its cover image. */
  document.querySelectorAll('[data-video-hover]').forEach((v) => {
    const tile = v.closest('.tile');
    if (!tile) return;

    const start = () => {
      if (reducedMotion.matches) return;
      /* [decided] same guard as in §2: missing dataset.src → avoid the "undefined" coercion. */
      if (!v.src && v.dataset.src) v.src = v.dataset.src; /* loaded on first hover, never before */
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    const stop = () => { if (v.src && !v.paused) v.pause(); };

    tile.addEventListener('mouseenter', start);
    tile.addEventListener('mouseleave', stop);
    /* With the keyboard: focus counts as hover, otherwise the technique exists only for the mouse. */
    tile.addEventListener('focusin', start);
    tile.addEventListener('focusout', stop);
  });

  /* ==== 4. Horizontal rails (offers, testimonials) =====================
     Measured: container `overflow-hidden relative`, track `flex items-end`, cell
     widths `w-[85%] sm:w-[45%] md:w-1/3`, controls (two 40 × 40 arrows at opacity .65,
     a 50 × 6 gauge on #333).

     NOT measurable: the movement mechanics. The static HTML contains neither
     `overflow-x-auto`, nor `snap-*`, nor `translate-x`, nor `transition-transform`
     (0 occurrences of each) — the source moves its rails in JS, with styles set at
     runtime. The native scrolling chosen here is [decided]: same gesture (swipe,
     next button, visible position) without inventing an unverifiable implementation. */
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const track = rail.querySelector('.rail__track');
    if (!track) return;

    /* The controls sit below the rail, not inside it: we look for them in the parent.
       Their absence is a normal case — the offers rail has none. */
    const zone = rail.parentElement;
    const gauge = zone && zone.querySelector('[data-rail-gauge]');

    const updateGauge = () => {
      if (!gauge) return;
      const travel = track.scrollWidth - track.clientWidth;
      const ratio = travel <= 0 ? 1 : track.scrollLeft / travel;
      gauge.style.width = (ratio * 100).toFixed(2) + '%';
    };

    track.addEventListener('scroll', updateGauge, { passive: true });
    window.addEventListener('resize', updateGauge);
    updateGauge();

    if (!zone) return;
    zone.querySelectorAll('[data-rail-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const cell = track.firstElementChild;
        const width = cell ? cell.offsetWidth : track.clientWidth;
        track.scrollBy({
          left: width * Number(button.dataset.railStep),
          /* Under `reduce`, instant jump: an animated scroll of several hundred
             pixels is exactly what this preference rules out. */
          behavior: reducedMotion.matches ? 'auto' : 'smooth'
        });
      });
    });
  });

  /* ==== 5. Billing selector ============================================
     Measured technique, counter-intuitive and reusable: the ACTIVE option is the one that
     carries `disabled`. The sheet defines no selected-state class — it is
     `disabled:text-white` that lights up the current option, while the other stays at
     `text-white/30` with a hover at `text-white/75`. [measured]

     Toggling therefore comes down to moving the attribute: no state in JS, no class to
     keep in sync, and the active option naturally leaves the tab order. */
  document.querySelectorAll('.toggle').forEach((toggle) => {
    const options = toggle.querySelectorAll('.toggle__option');
    options.forEach((option) => {
      option.addEventListener('click', () => {
        options.forEach((o) => { o.disabled = (o === option); });
      });
    });
  });
})();
