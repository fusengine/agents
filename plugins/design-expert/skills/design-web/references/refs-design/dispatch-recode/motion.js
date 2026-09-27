/* ═══════════════════════════════════════════════════════════════════════════
   SODIUM — motion and interactions.  Vanilla, no framework, no build.
   TRACEABILITY. The source hands all of its motion to Framer Motion: the
   shipped HTML exposes ONLY the inline resting states. [measured] = those states
   and their triggers; [decided] = durations, curves, thresholds. → tokens-dispatch.md
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  /* ─── 0 ▸ Motion preference. `matches` for the instant test,
     addEventListener('change') for tracking (addListener is deprecated). */
  var reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reducedQuery.matches;
  var revealed = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var lines = Array.prototype.slice.call(document.querySelectorAll('[data-line]'));
  var observers = [];
  var frame = 0;

  reducedQuery.addEventListener('change', function (e) {
    reduced = e.matches;   // never leave a hidden block behind
    if (reduced) revealed.concat(lines).forEach(function (n) { n.classList.add('is-in'); });
  });

  /* ─── 1 ▸ Reveal on scroll. [decided] entirely. IntersectionObserver
     rather than `animation-timeline: view()`: not Baseline, and a keyframe starting
     from opacity:0 would leave the blocks PERMANENTLY invisible there. */
  if (!reduced && 'IntersectionObserver' in window && (revealed.length || lines.length)) {
    document.documentElement.classList.add('js-motion');
    var lookout = new IntersectionObserver(function (entries, self) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        self.unobserve(e.target);      // a reveal never replays
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    observers.push(lookout);
    revealed.forEach(function (n) { lookout.observe(n); });
    // The title lines rise in cascade: 0, 110, 220 ms. [decided]
    lines.forEach(function (n, i) {
      n.style.transitionDelay = (i * 110) + 'ms';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { n.classList.add('is-in'); });
      });
    });
  }

  /* ─── 2 ▸ Hero parallax. [measured] the technique (layer overflowing by 5 rem,
     will-change:transform); [decided] the travel: 0.18 × scrollY, ≤ 80 px. */
  var bg = document.querySelector('[data-parallax]');
  if (bg && !reduced) {
    var pending = false;
    var move = function () {
      pending = false;
      var y = window.scrollY;
      if (y > window.innerHeight * 1.4) return;
      bg.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
    };
    window.addEventListener('scroll', function () {
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(move);
    }, { passive: true });
    // visibilitychange, pagehide fallback (§9): cancel the pending frame.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; pending = false; }
    });
  }

  /* ─── 3 ▸ Card spotlight. [measured]: --spot-x / --spot-y in %, read by
     a 240 px radial-gradient. Disarmed on a coarse pointer. */
  if (matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-spotlight]'), function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        card.style.setProperty('--spot-y', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      });
    });
  }

  /* ─── 4 ▸ Tabs. [measured]: tablist/tab/tabpanel, a single tabindex at 0. */
  Array.prototype.forEach.call(document.querySelectorAll('[role="tablist"]'), function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function activate(i) {
      tabs.forEach(function (o, j) {
        var active = i === j;
        o.setAttribute('aria-selected', active ? 'true' : 'false');
        o.tabIndex = active ? 0 : -1;
        var panel = document.getElementById(o.getAttribute('aria-controls'));
        if (panel) panel.hidden = !active;
      });
    }
    tabs.forEach(function (o, i) {
      o.addEventListener('click', function () { activate(i); });
      o.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = (i + d + tabs.length) % tabs.length;
        activate(next);
        tabs[next].focus();
      });
    });
  });

  /* ─── 5 ▸ Mobile menu. [measured]: aria-expanded drives the panel. */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mobile');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      menu.hidden = open;
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      burger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  }

  /* ─── 6 ▸ Counters. [measured]: the source serves "0" and counts on the client. */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-counter]'));
  var render = function (n, v) { n.textContent = v.toLocaleString('en-US') + (n.dataset.suffix || ''); };
  if (reduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (n) { render(n, parseInt(n.dataset.counter, 10)); });
  } else if (counters.length) {
    var watcher = new IntersectionObserver(function (entries, self) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        self.unobserve(e.target);
        var n = e.target, goal = parseInt(n.dataset.counter, 10), start = performance.now();
        var step = function (t) {
          var p = Math.min((t - start) / 1400, 1);   // 1400 ms, cubic ease-out
          render(n, Math.round(goal * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    observers.push(watcher);
    counters.forEach(function (n) { watcher.observe(n); });
  }

  /* ─── 7 ▸ Calculator. [measured]: min=3 max=6 step=0.01, the value IS
     log10(volume) — source tick marks at 0 / 15.9 / 66.7 / 100 %. */
  var field = document.getElementById('volume');
  if (field) {
    var outVolume = document.getElementById('calc-volume');
    var outPlan = document.getElementById('calc-plan'), outDetail = document.getElementById('calc-detail');
    var tiers = [
      { name: 'Free',     base: 0,   included: 3000,   perThousand: null, note: 'no card, nothing to cancel' },
      { name: 'Standard', base: 18,  included: 25000,  perThousand: 0.60, note: null },
      { name: 'Scale',    base: 180, included: 500000, perThousand: 0.40, note: null }
    ];
    var roundOff = function (v) {
      var step = v < 10000 ? 100 : v < 100000 ? 1000 : 10000;
      return Math.max(1000, Math.round(v / step) * step);
    };
    var cost = function (p, v) {
      if (v <= p.included) return p.base;
      return p.perThousand === null ? Infinity : p.base + Math.ceil((v - p.included) / 1000) * p.perThousand;
    };
    var recalculate = function () {
      var raw = parseFloat(field.value);
      var v = roundOff(Math.pow(10, raw));
      var min = parseFloat(field.min), max = parseFloat(field.max);
      field.style.setProperty('--fill', (((raw - min) / (max - min)) * 100).toFixed(2) + '%');
      var winner = tiers[0], price = cost(tiers[0], v);
      tiers.forEach(function (p) { var c = cost(p, v); if (c < price) { price = c; winner = p; } });
      outVolume.textContent = v.toLocaleString('en-US');
      outPlan.innerHTML = winner.name + ' — $<span class="tab-num">'
        + (price % 1 === 0 ? price : price.toFixed(2)) + '</span>/month';
      outDetail.textContent = winner.included.toLocaleString('en-US') + ' included · '
        + (winner.perThousand === null ? winner.note : 'then $' + winner.perThousand.toFixed(2) + ' per 1,000');
    };
    field.addEventListener('input', recalculate);
    recalculate();
  }

  /* ─── 8 ▸ Demo gauge, revealed once then disarmed. */
  var demo = document.querySelector('.demo');
  if (demo && !reduced && 'IntersectionObserver' in window) {
    var eye = new IntersectionObserver(function (entries, self) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        self.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    observers.push(eye);
    eye.observe(demo);
  } else if (demo) { demo.classList.add('is-in'); }

  /* ─── 9 ▸ Cleanup — every armed observer ends up disarmed. */
  window.addEventListener('pagehide', function () {
    if (frame) cancelAnimationFrame(frame);
    observers.forEach(function (o) { o.disconnect(); });
    observers.length = 0;
  });
})();
