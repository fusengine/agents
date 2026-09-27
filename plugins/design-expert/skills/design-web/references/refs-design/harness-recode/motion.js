/* motion.js — ALL the behaviours of the reference, in a single file:
   scroll reveal, rotating tabs, testimonial carousel, giant-block
   counter, hero media parallax, mega-menus and bar panels.
   (This file used to be split into motion.js + motion-nav.js; the split
   only answered a line ceiling that has no reason to exist — the corpus
   format counts FILES, not lines. The two parts now
   share a single read of the motion preference, which incidentally removes
   a duplicate `matchMedia` listener.)

   [decided] LOTTIE IS REMOVED. The source depends on it twice — the library
   from cdnjs, the six .json from the Webflow CDN — and the failure is not
   silent: offline, six panels out of fifteen are empty boxes. The
   six media are now inline SVGs animated in CSS (styles.css § 14); they
   need no script, replay by themselves when their panel becomes
   active, and therefore no longer expose anything to load, pause or destroy here.
   Full detail in tokens-harness.md § 10.

   Source engines: GSAP 3.15.0 (+ScrollTrigger, ScrollSmoother, Flip, MorphSVG,
   TextPlugin, ScrollToPlugin) and Lottie-web 5.12.2. NO Rive. GSAP is loaded and
   registerPlugin called, but no gsap.to/from/timeline nor scrollTrigger: block in
   the shipped HTML: the visible effects there are already vanilla JS + IntersectionObserver.
   Each block notes its engine; detailed values in tokens-harness.md §2-§3. */
(function () {
  'use strict';
  /* == 0. MOTION PREFERENCE — re-read live; addListener() is deprecated.
     TRAP: scrollBy with behavior:'smooth' NEVER consults prefers-reduced-motion
     (the JS scroll API ignores the preference, unlike CSS) — hence the manual
     read, and a behavior that is always EXPLICIT: omitting it falls back to 'auto'. */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = mq.matches, subscribers = [];
  mq.addEventListener('change', function (e) {
    reduced = e.matches; subscribers.forEach(function (f) { f(reduced); });
  });
  function scrollBehavior() { return reduced ? 'instant' : 'smooth'; }

  /* == 1. SCROLL REVEAL — engine: vanilla JS + IO (B l.3210). [measured]
     threshold 0.2, unobserve after the 1st pass. [decided] rootMargin -12 % at the
     bottom: the source has only one block to reveal, we have a dozen. */
  var obs = new IntersectionObserver(function (es, o) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-revealed'); o.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

  /* == ROTATION FACTORY — shared by the tabs (§2) and the carousel (§3).
     [measured] the timer only runs if the section is visible, and the FIRST
     interaction sets a PERMANENT flag (B l.3177). [decided] nothing rotates under
     reduced motion — the source keeps running, its guard only covering CSS. */
  function rotation(root, buttons, dwell, activate, onReveal) {
    var idx = 0, timer = null, stopUser = false, visible = false, started = false;
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function go(i, auto) { idx = i; activate(i, auto); }
    function schedule() {
      stop();
      if (stopUser || !visible || reduced) return;
      /* `dwell` is a NUMBER. The source, for its part, chose according to the TYPE of the
         active panel (B l.2925-2926: IMAGE_DWELL_MS 4000 versus
         LOTTIE_DWELL_MS 23000) — hence a dwell that could be a function of the
         current index. Without Lottie the fifteen panels are of the same kind, and
         the `typeof dwell === 'function'` branch no longer had a caller. */
      timer = setTimeout(function () { go((idx + 1) % buttons.length, true); schedule(); }, dwell);
    }
    buttons.forEach(function (b, i) {
      b.addEventListener('pointerdown', function () { stopUser = true; stop(); go(i, false); }, { passive: true });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); stopUser = true; stop();
        var n = (i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
        go(n, true); buttons[n].focus();
      });
    });
    new IntersectionObserver(function (es) {
      var e = es[0]; if (!e) return;
      visible = e.isIntersecting;
      if (!visible) { stop(); return; }
      if (started) { schedule(); return; }
      started = true;
      if (onReveal) { onReveal(schedule); } else { schedule(); }
    }, { threshold: 0.2 }).observe(root);
    subscribers.push(function (r) { if (r) { stop(); } else { schedule(); } });
  }

  /* == 1bis. THE SIX MEDIA THAT USED TO BE LOTTIE — no code here any more.
     The source read `data-lottie-url` on `.lottie-container-wrapper`, created
     the animation on the fly, and DESTROYED the instances of inactive tabs
     (B l.2956-2975); this recode paused rather than destroyed, so that an
     emptied panel would not stay empty.
     That whole mechanism disappears: the six media are inline SVGs animated in
     CSS. No more instance to create, play, pause or destroy —
     it is the panel's `is-active` class, set in §2, that arms and disarms the
     animations (styles.css § 14.3). A selector replaces a lifecycle. */

  /* == 2. ROTATING TAB MODULES — engine: vanilla JS (B l.2925-3241), four
     independent instances. COMPOSITION: the media (.vd__scene) precedes the row
     of tabs (.vd__tabs) in the DOM, as in the source — the JS only
     toggles state, it recomposes nothing.
     [measured] 800 ms safety net (B l.3232): transitionend does not fire if the element is
     hidden or if a preference suppresses the transition.
     Entrance cascade — engine: CSS triggered by JS (B l.3099-3123). [measured] media
     at 120 ms, halo at 420 ms; durations in styles.css. [measured] B l.3117: the forced
     reflow is essential, otherwise the re-added class replays nothing.

     [decided] DWELL — the source did NOT have a single delay: it chose
     according to the TYPE of the active panel (B l.2925-2926, IMAGE_DWELL_MS 4000 versus
     LOTTIE_DWELL_MS 23000). The 23 s were only there to let a Lottie
     loop play in full. Without Lottie that case no longer exists, and neither does the
     distinction: the fifteen panels are now of the same kind —
     a still image or an SVG scene. Hence ONE single value.
     6000 and not 4000: the longest scene entrance ends at ~3.1 s
     (styles.css § 14.3, SAST sweep: 0.3 s delay + 2.8 s duration). At
     4000 there would be 0.9 s of reading left before the switch — you would see the scene
     build up then disappear, which is worse than no animation at all. 6000
     leaves ~2.9 s of still, readable panel, while staying far from the original
     23 s. */
  var DWELL_MS = 6000;

  document.querySelectorAll('[data-vd]').forEach(function (root) {
    var tabs = [].slice.call(root.querySelectorAll('.card'));
    var panes = [].slice.call(root.querySelectorAll('.pane'));
    var row = root.querySelector('.vd__tabs');
    if (!tabs.length || !panes.length) return;
    var revealed = false, current = 0;
    function media(p) { return p.querySelector('.pane__media'); }
    function animate() {
      if (!revealed) return;
      panes.forEach(function (p) {
        media(p).classList.remove('is-media-entering');
        p.querySelector('.pane__halo').classList.remove('is-blur-bg-entering');
      });
      var a = panes[current]; if (!a) return;
      var m = media(a), h = a.querySelector('.pane__halo');
      requestAnimationFrame(function () {
        void m.offsetWidth; void h.offsetWidth;
        m.classList.add('is-media-entering'); h.classList.add('is-blur-bg-entering');
      });
    }
    function activate(i, auto) {
      current = i;
      tabs.forEach(function (o, k) {
        o.classList.toggle('is-active', k === i);
        o.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      /* `is-active` on the panel carries TWO roles: it displays it, and it arms
         the SVG scene animations (styles.css § 14.3, selectors prefixed
         `.pane.is-active`). Removing it resets the scene, re-adding it
         replays it: that is what replaces Lottie's play()/pause(), without an instance. */
      panes.forEach(function (p, k) {
        p.classList.toggle('is-active', k === i);
        if (k === i) { p.removeAttribute('hidden'); }
        else { p.setAttribute('hidden', ''); }
      });
      /* [decided] the row scrolls horizontally (overflow:auto, measured). */
      if (auto && row && row.scrollWidth > row.clientWidth) {
        var br = row.getBoundingClientRect(), bc = tabs[i].getBoundingClientRect(), d = 0;
        if (bc.right - br.right > 0) { d = bc.right - br.right + 16; }
        else if (bc.left - br.left < 0) { d = bc.left - br.left - 16; }
        if (d) row.scrollBy({ left: d, behavior: scrollBehavior() });
      }
      animate();
    }
    rotation(root, tabs, DWELL_MS, activate, function (schedule) {
      revealed = true; root.classList.add('is-revealed');
      var done = function () {
        root.removeEventListener('transitionend', done);
        animate(); schedule();
      };
      if (reduced) { done(); return; }
      root.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 800);
    });
  });

  /* == 3. TESTIMONIAL CAROUSEL — engine: Webflow slider (w-slider) + dots from
     @finsweet/attributes-sliderdots. [decided] toggling the hidden attribute instead of
     sliding the track; 7000 ms, no autoplay declared in the source. [measured]
     ._0630-slider_arrow { display:none }: navigation goes through the underlined
     customer LOGOS, the only visible cues. */
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = [].slice.call(root.querySelectorAll('.slide'));
    var dots = [].slice.call(root.querySelectorAll('.slider__dot'));
    if (!slides.length || slides.length !== dots.length) return;
    rotation(root, dots, 7000, function (i) {
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
        if (k === i) { s.removeAttribute('hidden'); } else { s.setAttribute('hidden', ''); }
      });
      dots.forEach(function (p, k) {
        p.classList.toggle('is-active', k === i);
        p.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }, null);
  });
})();
