/* motion-nav.js — behaviours of the reference, part 2/2: giant-block counter,
   hero media parallax, mega-menus and bar panels.
   Split from motion.js so as not to exceed the line ceiling imposed on the project;
   the two files are independent and each re-reads the motion preference. */
(function () {
  'use strict';
  /* == 0. MOTION PREFERENCE — same rule as in part 1: addListener() is
     deprecated, we listen to 'change'. Re-read live, never frozen at load. */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = mq.matches, subscribers = [];
  mq.addEventListener('change', function (e) {
    reduced = e.matches; subscribers.forEach(function (f) { f(reduced); });
  });

  /* == 4. GIANT-BLOCK COUNTER — engine: GSAP TextPlugin registered in the source,
     no call in the shipped HTML. [decided] rAF + easeOutCubic (a linear
     counter feels mechanical) and final value written EXPLICITLY: a counter that
     stops on 99 is a visible bug. [decided] threshold 0.6. */
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10), suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    function write(v) { el.textContent = String(v) + suffix; }
    new IntersectionObserver(function (es, o) {
      if (!es[0] || !es[0].isIntersecting) return;
      o.unobserve(el);
      if (reduced) { write(target); return; }
      var t0 = null;
      requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        var t = Math.min((ts - t0) / 1400, 1);
        write(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) { requestAnimationFrame(step); } else { write(target); }
      });
    }, { threshold: 0.6 }).observe(el);
  });

  /* == 5. HERO MEDIA PARALLAX — engine: GSAP ScrollSmoother is registered; the
     media is an overflowing absolute (inset:-15% -13% 0% auto) placed to be offset.
     [decided] passive scroll + rAF throttle, small and bounded amplitude (12 %, 90px)
     to stay inside the section's overflow:hidden. */
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    var ticking = false, active = !reduced;
    function calc() {
      var d = Math.min((window.scrollY || 0) * 0.12, 90);
      el.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!active || ticking) return;
      ticking = true; requestAnimationFrame(calc);
    }, { passive: true });
    if (active) calc();
    subscribers.push(function (r) { active = !r; if (r) { el.style.transform = ''; } else { calc(); } });
  });

  /* == 6. MEGA-MENU, SEARCH AND "GET STARTED" — engine: Webflow w-dropdown
     component, three uses of the same component in the source. [decided] vanilla; the
     technique reproduced is the CSS one (100vw panel unhooked by a
     position:static parent). Hover AND click: hover alone excludes keyboard and touch.
     [decided] the search panel does NOT open on hover — a panel that
     covers the page as soon as the mouse brushes the magnifier is a nuisance, not a help. */
  var menus = [].slice.call(document.querySelectorAll('[data-menu]'));
  function close(m) {
    m.classList.remove('is-open');
    var t = m.querySelector('.nav__toggle'), p = m.querySelector('.nav__panel');
    if (t) t.setAttribute('aria-expanded', 'false');
    if (p) p.setAttribute('hidden', '');
  }
  menus.forEach(function (m) {
    var t = m.querySelector('.nav__toggle'), p = m.querySelector('.nav__panel');
    if (!t || !p) return;
    var onHover = !p.classList.contains('nav__panel--search');
    function open() {
      menus.forEach(function (o) { if (o !== m) close(o); });
      m.classList.add('is-open'); t.setAttribute('aria-expanded', 'true'); p.removeAttribute('hidden');
    }
    t.addEventListener('click', function () { if (m.classList.contains('is-open')) { close(m); } else { open(); } });
    if (onHover) { m.addEventListener('mouseenter', open); }
    m.addEventListener('mouseleave', function () { if (onHover) close(m); });
    m.addEventListener('focusout', function (e) { if (!m.contains(e.relatedTarget)) close(m); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menus.forEach(close); });
})();
