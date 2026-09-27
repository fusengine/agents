/* =====
   motion.js — interface behaviours of the mainframe.app reference
   Vanilla JS, no framework, no build.

   GUIDING PRINCIPLE, and the whole point of this reference: the JS does
   NOTHING but toggle a class or write a height. It times nothing, it draws
   no curve. Every duration and every curve lives in styles.css.
   That is what lets the source have no @keyframes at all while still feeling
   alive.

   Same marking as the CSS: [measured] = read in the source, [decided] = added.
   IntersectionObserver: Baseline widely available (March 2019).
   `animation-timeline: view()/scroll()` is NOT used (not widely available).
   ===== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observable = 'IntersectionObserver' in window;

  /* Animated scroll, unless the system setting says otherwise. */
  function bringIntoView(el, inline) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth',
      block: inline ? 'nearest' : 'center', inline: inline || 'nearest' });
  }

  /* Positions a horizontal track on one of its children, without animation. */
  function centerOn(track, el) {
    if (el) track.scrollLeft = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
  }

  /* Index of the element whose centre is closest to the track's centre. */
  function centerIndex(track, elements) {
    var center = track.getBoundingClientRect().left + track.clientWidth / 2;
    var best = 0, minGap = Infinity;
    elements.forEach(function (el, i) {
      var b = el.getBoundingClientRect();
      var d = Math.abs(b.left + b.width / 2 - center);
      if (d < minGap) { minGap = d; best = i; }
    });
    return best;
  }

  /* ----- 1. HALOS
     [measured] transition-opacity duration-[800ms] ease-out, rest opacity-0.
     Trigger: the image load, not the scroll. ----- */
  function halos() {
    document.querySelectorAll('.halo__img').forEach(function (img) {
      if (img.complete) img.classList.add('is-loaded');
      else img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    });
  }

  /* ----- 2. REVEALS ON SCROLL
     The CSS holds the rest state (opacity 0 + blur), the JS adds `is-visible`
     then stops observing: [measured] a reveal never replays.
     [decided] both thresholds; the source drives them application-side. ----- */
  function reveals() {
    var blocks = document.querySelectorAll('[data-reveal]');
    if (reduced || !observable) {
      blocks.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var view = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        view.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    blocks.forEach(function (el) { view.observe(el); });
  }

  /* ----- 3. FULL-WIDTH CAROUSEL
     Measurement reminder: the panels have NO active/inactive state — the
     inline `opacity:1` / `opacity:0.4` of the source belong to the showcase,
     not here. Nothing to sync: the JS only re-centres.
     [decided] entirely — the source uses a carousel library. ----- */
  function carousel() {
    var track = document.querySelector('[data-carousel]');
    if (!track) return;
    var cells = track.querySelectorAll('.carousel__cell');
    if (!cells.length) return;
    function goTo(i) {
      bringIntoView(cells[Math.max(0, Math.min(i, cells.length - 1))], 'center');
    }
    track.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); goTo(centerIndex(track, cells) + 1); }
      if (ev.key === 'ArrowLeft')  { ev.preventDefault(); goTo(centerIndex(track, cells) - 1); }
    });
    cells.forEach(function (c, i) {
      var button = c.querySelector('.thumb__play');
      if (button) button.addEventListener('click', function () { goTo(i); });
    });
    /* [measured] on open the source centres one panel and shows its neighbours. */
    centerOn(track, cells[1] || cells[0]);
  }

  /* ----- 4. SHOWCASE — ACCORDION + STICKY TABLE OF CONTENTS
     a) the active entry unfolds its paragraph. [measured] the source declares
        `transition-property: height, opacity` WITHOUT an explicit duration: so it is
        the framework default duration (150 ms) and the default curve. A height
        does not animate from `auto` — the JS writes the measured height in pixels.
     b) the table of contents follows the centred image; a click scrolls to it. ----- */
  function showcase() {
    var toc = document.querySelector('[data-toc]');
    var stack = document.querySelector('[data-stack]');
    if (!toc || !stack) return;
    var entries = toc.querySelectorAll('.showcase__entry');
    var tabs = toc.querySelectorAll('.showcase__tab');

    function open(target) {
      entries.forEach(function (entry) {
        var tab = entry.querySelector('.showcase__tab');
        var fold = entry.querySelector('.showcase__fold');
        var active = tab.dataset.target === target;
        entry.classList.toggle('is-active', active);
        tab.setAttribute('aria-expanded', active ? 'true' : 'false');
        /* scrollHeight = natural height of the folded content; written in pixels
           so the transition has two numeric bounds. */
        fold.style.height = active ? fold.scrollHeight + 'px' : '0px';
      });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        open(tab.dataset.target);
        bringIntoView(document.getElementById(tab.dataset.target));
      });
    });
    var first = toc.querySelector('.showcase__entry.is-active .showcase__tab');
    if (first) open(first.dataset.target);

    /* [decided] 45 % dead band: the entry switches when the image fills the
       middle of the viewport, not as soon as it enters it. */
    if (observable) {
      var follow = new IntersectionObserver(function (obs) {
        obs.forEach(function (e) { if (e.isIntersecting) open(e.target.id); });
      }, { rootMargin: '-45% 0px -45% 0px' });
      stack.querySelectorAll('[id]').forEach(function (el) { follow.observe(el); });
    }
    /* A height frozen in pixels becomes wrong if the line reflows. */
    window.addEventListener('resize', function () {
      var active = toc.querySelector('.showcase__entry.is-active .showcase__tab');
      if (active) open(active.dataset.target);
    });
  }

  /* ----- 5. DISCS
     [measured] geometry and clip-path only: the content of these discs is a
     client component shipped EMPTY in the source HTML. On screen, the source shows
     round photographic PORTRAITS in them — so neither flat fill nor colour transition.
     [decided] ENTIRELY — having no portrait URL in the scraped source,
     we lay dark, low-saturation flat fills, matched to the value of the original
     photos so as not to unbalance the composition. Cadence declared in CSS. */
  function discs() {
    var group = document.querySelector('[data-discs]');
    if (!group) return;
    var tints = ['hsl(28 18% 42%)', 'hsl(220 12% 38%)', 'hsl(240 20% 40%)',
                 'hsl(150 12% 34%)', 'hsl(0 0% 30%)'];
    var chips = group.querySelectorAll('.disc');
    var index = 0;
    function paint() {
      chips.forEach(function (d, i) {
        d.style.backgroundColor = tints[(index + i) % tints.length];
      });
      index += 1;
    }
    paint();
    /* [decided] 2.6 s: the 1 s transition has time to settle. */
    /* [decided] interval stopped/restarted on visibilitychange so it does not run in the background. */
    if (!reduced) { var id = window.setInterval(paint, 2600); document.addEventListener('visibilitychange', function () { if (document.hidden) { window.clearInterval(id); } else { id = window.setInterval(paint, 2600); } }); }
  }

  /* ----- 6. BRAND RAIL — the ONLY active/inactive system on the page.
     [measured] centred card at opacity-100, the others at opacity-25, in 400 ms
     ease-out curve. The JS designates the centred card; the CSS does the fade.
     Clicking a card brings it back to the centre — that is what its aria-label says
     in the source ("Center … brand card"). ----- */
  function rail() {
    var track = document.querySelector('[data-rail]');
    if (!track) return;
    var cards = track.querySelectorAll('.rail__card');
    if (!cards.length) return;
    function reframe() {
      var active = centerIndex(track, cards);
      cards.forEach(function (c, i) { c.classList.toggle('is-active', i === active); });
    }
    cards.forEach(function (c) {
      c.addEventListener('click', function () { bringIntoView(c, 'center'); });
    });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(reframe); }, { passive: true });
    window.addEventListener('resize', reframe);
    centerOn(track, cards[1] || cards[0]); /* [measured] the rail opens on its 2nd card */
    reframe();
  }

  halos(); reveals(); carousel(); showcase(); discs(); rail();
})();
