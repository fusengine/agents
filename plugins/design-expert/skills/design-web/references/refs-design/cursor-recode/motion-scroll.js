/* =============================================================================
   motion-scroll.js — scrolling: reveals, carousels, ambient loops
   Depends on `window.CursorMotion` (motion.js), loaded before with `defer`.

   [measured] = read in the source · [decided] = choice made by this reference
   ========================================================================== */

(function () {
  'use strict';

  var core = window.CursorMotion;
  if (!core) return;

  /* --------------------------------------------------------------------------
     1. REVEAL ON SCROLL — the site's only entrance effect
       @keyframes gallery-marquee-item-slide-up
         {0%{opacity:0;transform:translateY(25%)} to{opacity:1;transform:translate(0)}}
       animation: 1s var(--ease-out-spring) both                  [measured] M

     Trigger: IntersectionObserver. Above all NOT `animation-timeline:view()`,
     which is not "widely available": where it is missing, a keyframe that
     starts at opacity:0 would leave the element invisible for good.

     Hiding is NOT set by this file. The stylesheet declares the animation
     with `animation-play-state:paused`, which freezes the element on its
     starting frame; the JS only LIFTS the pause through `.is-visible`.
     Crucial consequence: if this script never runs, the stylesheet's
     `@media (scripting:none)` rule restarts the animation and the page
     reveals itself. No element can stay invisible for lack of JS.

     Extra safety net, absent from the source: if `IntersectionObserver` is
     missing, we set `data-intro="true"` on <html> and everything unlocks at
     once — the stylesheet has a rule for that case.               [decided]

     `threshold:0.15` and the NEGATIVE bottom margin (which shrinks the
     trigger zone, so the element has clearly entered before animating) are
     [decided].
     `unobserve` after the first pass: the effect does not replay on the way back.
  ---------------------------------------------------------------------------*/
  (function reveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      document.documentElement.setAttribute('data-intro', 'true');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    /* The pause is armed ONLY ONCE the observer is built, and right before
       handing it the targets. As long as `data-js` is not set, the stylesheet
       lets the animation play: a script that is missing, blocked by the
       network or throwing can therefore not leave the page blank. The order
       of these two lines IS the safeguard — hiding before knowing how to
       observe would reopen exactly the hole we just plugged.      [decided] */
    document.documentElement.setAttribute('data-js', '');
    targets.forEach(function (el) { observer.observe(el); });
  })();

  /* --------------------------------------------------------------------------
     2. SNAP CAROUSELS
     The track scrolls natively (`overflow-x:auto` + `scroll-snap-type:x
     mandatory` [measured] H). The JS only adds two scroll buttons, absent
     from the source, which relies on the touch gesture.          [decided]

     Two precautions: `behavior` always explicit (the core reads
     `prefers-reduced-motion` itself); and `scroll-snap-type:x mandatory`
     combined with a smooth `scrollBy` can be interrupted and re-snapped by
     the browser mid-animation (Safari especially) — that is expected, not a
     bug: we do not fight it, we recompute the button state afterwards.
  ---------------------------------------------------------------------------*/
  (function carousels() {
    document.querySelectorAll('[data-track-frame]').forEach(function (frame) {
      var track = frame.querySelector('[data-track]');
      var prev  = frame.querySelector('[data-track-prev]');
      var next  = frame.querySelector('[data-track-next]');
      if (!track || !prev || !next) return;

      /** Width of one jump: one card + one gutter. Measured on the DOM rather
       *  than recomputed from the grid formula — that one lives in the CSS
       *  and does not need duplicating here. `columnGap` can be 'normal'
       *  with no declared gap, hence the fallback to 0.        [decided]
       *  @returns {number} Scroll distance in pixels. */
      function step() {
        var item = track.querySelector('.track__item');
        var rail = track.querySelector('.track__rail');
        if (!item || !rail) return track.clientWidth;
        var gutter = parseFloat(getComputedStyle(rail).columnGap) || 0;
        return item.getBoundingClientRect().width + gutter;
      }

      /** Disables the button that no longer leads anywhere. */
      function updateButtons() {
        var max = track.scrollWidth - track.clientWidth;
        // 1px tolerance: fractional widths do not land exactly.
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft >= max - 1;
      }

      /** @param {number} direction -1 towards the left, +1 towards the right. */
      function scrollTrack(direction) {
        track.scrollBy({ left: direction * step(), behavior: core.scrollBehavior() });
      }

      prev.addEventListener('click', function () { scrollTrack(-1); });
      next.addEventListener('click', function () { scrollTrack(1); });

      // Scrolling fires many events: we batch them onto one frame.
      // `passive:true` promises not to call preventDefault, which spares the
      // browser from waiting on this listener.
      var pending = false;
      track.addEventListener('scroll', function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () { pending = false; updateButtons(); });
      }, { passive: true });

      window.addEventListener('resize', updateButtons, { passive: true });
      updateButtons();
    });
  })();

  /* --------------------------------------------------------------------------
     3. DEMO AMBIENT LOOPS
     Status dots, activity bars and shimmers loop forever
     (2.5s to 2.8s [measured] M). Letting them run off-screen makes the
     compositor work for nothing. `animationPlayState` pauses WITHOUT
     resetting: the loop resumes where it stopped, with no visible jump. Under
     reduced motion, the CSS has already switched these animations off — we
     then touch nothing, so as not to resurrect in JS what the CSS turned off.
  ---------------------------------------------------------------------------*/
  (function loops() {
    if (core.reducedMotion() || !('IntersectionObserver' in window)) return;
    var scenes = document.querySelectorAll('[data-loop]');
    if (!scenes.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var state = entry.isIntersecting ? 'running' : 'paused';
        entry.target.querySelectorAll('.dot, .bars i, .shimmer')
          .forEach(function (el) { el.style.animationPlayState = state; });
      });
    }, { threshold: 0 });

    scenes.forEach(function (s) { observer.observe(s); });
  })();
})();
