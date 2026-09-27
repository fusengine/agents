/* =============================================================
   umbrel-recode — motion.js
   All the interface behaviour of the page, in vanilla JS.

   Why this file exists: the source contains NO @keyframes
   and NO :hover rule in its stylesheets, while 50
   `:hover` are referenced in its HTML. All of its motion is
   driven by the Framer runtime. It therefore cannot be measured — it is
   rewritten here by hand, and the timing values are marked
   [decided] unless stated otherwise.

     1. Guard        — prefers-reduced-motion, read once
     2. Reveals      — IntersectionObserver, with a no-JS fallback
     3. Carousel     — scroll-snap driven by the chevrons and the keyboard
     4. Marquee      — pause on hover and on focus
   ============================================================= */
(function () {
  'use strict';

  /* --- 1. Guard -----------------------------------------------
     A single read, shared by every block. If the user
     asked for less motion, we set neither a hidden state nor an
     animated scroll: the CSS already neutralises the animations, this
     flag additionally avoids setting them up. */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- 2. Reveals on scroll ------------------------------------
     The source's trap: 27 of its elements carry an initial
     `opacity: 0.001` state HARD-CODED in the HTML. When its
     runtime does not run, the page stays empty forever.

     The countermeasure fits in one line: it is THIS script that sets the
     `.js` class on <html>, and the CSS only hides under that class. Without
     JavaScript — or with reduced motion — nothing is ever hidden.

     IntersectionObserver rather than `animation-timeline: view()`:
     the latter is not Baseline, and without support a keyframe
     starting from `opacity: 0` would leave the element invisible
     forever — the very defect we are trying to avoid. */
  function setupReveals() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js');

    var lookout = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        lookout.unobserve(entry.target);   // only once, no back-and-forth
      });
    }, {
      // Fires a little before the element reaches the bottom of the
      // viewport: the animation is finished when it arrives at eye
      // level. A NEGATIVE margin shrinks the observation zone.
      rootMargin: '0px 0px -12% 0px',     // [decided]
      threshold: 0.05
    });

    targets.forEach(function (target) { lookout.observe(target); });
  }

  /* --- 3. "Superpowers" carousel --------------------------------
     The rail is an `overflow-x: auto` container with
     `scroll-snap-type: x mandatory`: native, touch and
     wheel scrolling already work without a line of JS. This block only adds
     what CSS cannot do — drive the rail from the
     chevrons, and know which card occupies the centre.

     The step is not a constant: it is measured on the real
     card, width + gutter. A hard-coded value would break at the
     first change of format. */
  function setupCarousel() {
    var rail = document.querySelector('.rail');
    if (!rail) return;

    var cards = rail.querySelectorAll('.power');
    if (cards.length < 2) return;

    /** Width of one step: the card plus the gutter that follows it. */
    function step() {
      var box = cards[0].getBoundingClientRect();
      var gutter = parseFloat(getComputedStyle(rail).columnGap) || 0;
      return box.width + gutter;
    }

    /** Scrolls by one card. `direction` is -1 or 1. */
    function advance(direction) {
      rail.scrollBy({
        left: direction * step(),
        // Smoothing is a motion: it is disabled with the rest.
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    }

    // The chevrons become real controls: they were only
    // decorative for lack of JavaScript.
    var chevrons = document.querySelectorAll('.carousel__arrow');
    Array.prototype.forEach.call(chevrons, function (chevron) {
      chevron.setAttribute('role', 'button');
      chevron.setAttribute('tabindex', '0');
      chevron.removeAttribute('aria-hidden');

      // Accessible labels are CONTENT: they follow the language
      // of the document (<html lang="en">), not that of the comments.
      var toRight = chevron.classList.contains('carousel__arrow--right');
      chevron.setAttribute('aria-label',
        toRight ? 'Next card' : 'Previous card');

      chevron.addEventListener('click', function () {
        advance(toRight ? 1 : -1);
      });
      chevron.addEventListener('keydown', function (evt) {
        if (evt.key !== 'Enter' && evt.key !== ' ') return;
        evt.preventDefault();
        advance(toRight ? 1 : -1);
      });
    });

    // Keyboard arrows when the rail has focus. A focusable
    // container MUST be announced: `tabindex` alone gives a silent
    // tab stop (WCAG 4.1.2). `role="group"` + a name that also says
    // how to navigate.
    rail.setAttribute('role', 'group');
    rail.setAttribute('aria-label',
      'What you can do with umbrelOS — use the left and right arrow keys to browse');
    rail.setAttribute('tabindex', '0');
    rail.addEventListener('keydown', function (evt) {
      if (evt.key === 'ArrowRight') { evt.preventDefault(); advance(1); }
      if (evt.key === 'ArrowLeft')  { evt.preventDefault(); advance(-1); }
    });

    /* The card closest to the centre receives `.is-centered`. The
       CSS uses it to slightly dim the others: on the
       source, only the fade of the mask produces this effect; doubling
       it with an explicit state makes the position readable even for a
       card not yet masked. [decided] */
    var measurePending = false;

    function markCenterCard() {
      var railCenter = rail.scrollLeft + rail.clientWidth / 2;
      var best = null;
      var bestGap = Infinity;

      Array.prototype.forEach.call(cards, function (card) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var gap = Math.abs(cardCenter - railCenter);
        if (gap < bestGap) { bestGap = gap; best = card; }
      });

      Array.prototype.forEach.call(cards, function (card) {
        card.classList.toggle('is-centered', card === best);
      });
    }

    // `passive: true`: we only read, never preventDefault —
    // the browser can scroll without waiting for this handler. And a
    // single measurement per frame: `scroll` fires much faster than
    // rendering, and each measurement forces a layout computation.
    rail.addEventListener('scroll', function () {
      if (measurePending) return;
      measurePending = true;
      requestAnimationFrame(function () {
        measurePending = false;
        markCenterCard();
      });
    }, { passive: true });

    window.addEventListener('resize', markCenterCard);
    markCenterCard();
  }

  /* --- 4. Marquee ----------------------------------------------
     The scrolling stays a CSS animation: two exact copies of the
     content and a `translateX(-50%)`, which loops without a seam. The
     JS only adds the pause, to read a chip without chasing it. */
  function setupMarqueePause() {
    var marquee = document.querySelector('.marquee');
    if (!marquee) return;

    var tracks = marquee.querySelectorAll('.marquee__track');

    function setState(value) {
      Array.prototype.forEach.call(tracks, function (track) {
        track.style.animationPlayState = value;
      });
    }

    marquee.addEventListener('pointerenter', function () { setState('paused'); });
    marquee.addEventListener('pointerleave', function () { setState('running'); });
    marquee.addEventListener('focusin',  function () { setState('paused'); });
    marquee.addEventListener('focusout', function () { setState('running'); });
  }

  setupReveals();
  setupCarousel();
  setupMarqueePause();
})();
