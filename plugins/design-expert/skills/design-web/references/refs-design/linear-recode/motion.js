/* motion.js — interface behaviours of the linear-recode reference.
   Vanilla JS: no framework, no CDN, no build.
   [measured] = literal value from the source · [decided] = my choice.
   Principle taken from the source: the JS NEVER writes a layout property.
   It sets a class, a `data-*` or a CSS variable and lets the CSS render —
   everything animatable stays in styles.css, hence inspectable. */
(function () {
  'use strict';
  /* [measured] the source prefixes with `html.js` every rule whose starting
     state is invisible, mirrored by `html:not(.js)`: without script, nothing
     stays hidden. Must run first. */
  var root = document.documentElement;
  root.classList.add('js');
  /* [measured] `prefers-reduced-motion` is handled everywhere in the source. */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  /* 1. REVEAL ON SCROLL
     [measured] .4s / ease-out-quart / translateY(4px) / fill `backwards`
       (NewHeroIllustration.css .w9ZFkq_staggerItem).
     [decided] the TRIGGER: the source animates on React mount; here
       IntersectionObserver (Baseline widely available, March 2019).
     Forbidden: `animation-timeline: view()` — not widely available, a
     keyframe starting at opacity:0 would leave the elements invisible. */
  function reveals() {
    var targets = document.querySelectorAll('.appears');
    if (!targets.length) return;
    /* Fallback without observer: everything becomes visible. An element never
       revealed is a worse defect than a missing animation. */
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    /* [decided] -10 % at the bottom: the effect ends inside the viewport. */
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);   /* stable final state, no replay */
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    targets.forEach(function (el) { obs.observe(el); });
  }
  /* 2. HALO AND EDGE FOLLOWING THE POINTER
     [measured] page.css: halo (.MwJdiW_glow) and masked edge (.MwJdiW_shine)
     positioned by --mask-x / --mask-y. The JS writes ONLY these variables. The
     geometry is measured on enter and on resize, never inside the move
     handler; one write per frame, because the pointer emits more events than
     the screen paints frames. */
  function followPointer() {
    document.querySelectorAll('[data-follow-pointer]').forEach(function (frame) {
      var box = null, pending = false, x = 0, y = 0;
      function measure() { box = frame.getBoundingClientRect(); }
      function write() {
        pending = false;
        if (!box) return;
        frame.style.setProperty('--x', ((x - box.left) / box.width * 100) + '%');
        frame.style.setProperty('--y', ((y - box.top) / box.height * 100) + '%');
      }
      frame.addEventListener('pointerenter', measure);
      frame.addEventListener('pointermove', function (e) {
        x = e.clientX; y = e.clientY;
        if (!box) measure();
        if (pending) return;
        pending = true;
        requestAnimationFrame(write);
      });
      /* [decided] back to rest on leave: the source leaves the halo frozen,
         but a motionless trace reads as a bug. */
      frame.addEventListener('pointerleave', function () {
        box = null;
        frame.style.removeProperty('--x');
        frame.style.removeProperty('--y');
      });
      window.addEventListener('resize', function () { box = null; });
    });
  }
  /* 3. IMAGE LOAD FADE
     [measured] Image.css: opacity:0 + mask offset to 150 %, animated .8s `both`
     once `data-loaded=true` is set by the JS. The key point is the failure
     path: a broken image must stay visible as such. */
  function fadeImages() {
    document.querySelectorAll('img[data-fade="true"]').forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) { img.dataset.loaded = 'true'; return; }
      img.addEventListener('load', function () { img.dataset.loaded = 'true'; });
      img.addEventListener('error', function () { img.dataset.fade = 'false'; });
    });
  }
  /* 4. MOBILE MENU
     [measured] Header.css: enter AND exit in .18s, fill `both` — `both`
     freezes the starting state, so no jump. We wait for the exit to finish
     before removing from the flow, otherwise the close is never visible. */
  var MENU_DURATION = 180; /* [measured] .18s */
  function mobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('menu-mobile');
    if (!button || !menu) return;
    var isOpen = false;
    function open() {
      isOpen = true;
      menu.removeAttribute('data-closed');
      menu.setAttribute('data-open', 'true');
      button.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      isOpen = false;
      menu.removeAttribute('data-open');
      menu.setAttribute('data-closed', 'true');
      button.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        if (!isOpen) menu.removeAttribute('data-closed');
      }, reducedMotion.matches ? 0 : MENU_DURATION);
    }
    button.addEventListener('click', function () { isOpen ? close() : open(); });
    /* Escape closes, and any link closes: a full-screen menu that survives
       navigation traps the user. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { close(); button.focus(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (e) {
      if (e.matches && isOpen) close();
    });
  }
  /* 5. THEME TOGGLE
     [measured] index.css: the whole token set is switched by the SINGLE
     `data-theme` attribute on <html>. No class to propagate. */
  function themeToggle() {
    var buttons = document.querySelectorAll('[data-theme-target]');
    if (!buttons.length) return;
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var target = b.dataset.themeTarget;
        root.dataset.theme = target;
        buttons.forEach(function (o) {
          o.setAttribute('aria-pressed', String(o.dataset.themeTarget === target));
        });
      });
    });
  }
  /* 6. QUOTE CAROUSEL (below 1024px)
     [measured] .Dc5tqa_stackedCarouselItem: width min(85vw, 360px) — the
     overhang of the next card signals that it scrolls. Snapping is in CSS;
     the JS only adds the keyboard. [decided] the source drives it in React. */
  function keyboardCarousel() {
    var track = document.querySelector('.clients__carousel');
    if (!track) return;
    track.setAttribute('tabindex', '0');
    track.setAttribute('role', 'group');
    track.setAttribute('aria-label', 'Customer quotes, horizontal scroll');
    track.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var card = track.querySelector('.client-card');
      if (!card) return;
      var step = card.getBoundingClientRect().width + 8; /* [measured] gap 8px */
      track.scrollBy({ left: e.key === 'ArrowRight' ? step : -step,
        behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
  }
  /* 7. GRAPH — bars grow on entering the viewport
     [measured] .4s / ease-out-quart, same values as the general reveal.
     [decided] the effect: the source renders a static graph. The final height
     is READ from the inline style, set to zero then restored: the final state
     stays the one written in the HTML. Without motion, nothing is touched. */
  function animatedGraph() {
    var graph = document.querySelector('[data-graph]');
    if (!graph) return;
    /* Heights are carried by the TWO segments of each bar
       (.count__top / .count__bottom), not by the bar itself. */
    var bars = Array.prototype.slice.call(graph.querySelectorAll('.count__top, .count__bottom'));
    if (!bars.length) return;
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    var heights = bars.map(function (b) { return b.style.height; });
    bars.forEach(function (b) {
      b.style.height = '0%';
      b.style.transition = 'height .4s cubic-bezier(.165, .84, .44, 1)';
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        bars.forEach(function (b, i) {
          b.style.transitionDelay = (i * 40) + 'ms';  /* [decided] sweep */
          b.style.height = heights[i];
        });
        obs.disconnect();
      });
    }, { threshold: 0.35 });
    obs.observe(graph);
  }
  function start() {
    reveals(); followPointer(); fadeImages();
    mobileMenu(); themeToggle(); keyboardCarousel(); animatedGraph();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
