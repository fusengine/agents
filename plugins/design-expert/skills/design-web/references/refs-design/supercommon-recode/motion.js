/* ═══════════════════════════════════════════════════════════════════════════
   MOTION — design reference.  Vanilla, no framework, no build.
   TRACEABILITY. The source contains NO @keyframes, NO transition, NO
   animation-timeline: 100 % of its motion comes from the Framer Motion runtime,
   unreadable from the shipped HTML. [measured] = the TRIGGERS and the STATES,
   the only facts available. [decided] = everything else — every duration, every
   curve, every threshold. No duration is hard-coded here: they come from the
   CSS variables in :root. Full reasoning: tokens-supercommon.md §3.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── 0 ▸ Motion preference ─────────────────────────────────────────────
     `matches` for the instant test; listen via addEventListener('change')
     — addListener() is deprecated. [decided] */
  var reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reducedQuery.matches;

  var css = getComputedStyle(document.documentElement);
  var durationShort = css.getPropertyValue('--duration-short').trim() || '180ms';

  var revealed = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function showAll() { revealed.forEach(function (n) { n.classList.add('is-in'); }); }

  reducedQuery.addEventListener('change', function (e) {
    reduced = e.matches;
    if (reduced) showAll();  // never leave a hidden block behind
  });

  /* ─── 1 ▸ Reveal on scroll ── [decided] entirely ────────────────────────
     IntersectionObserver and NOT `animation-timeline: view()`: not Baseline,
     and a keyframe starting from opacity:0 would leave blocks PERMANENTLY
     invisible. Contract: the resting state is only armed (class .js-motion)
     if we know how to lift it — without JS, without an observer or under
     reduced motion, the CSS hides nothing. Threshold 0.15: revealed as soon
     as a sixth is visible. rootMargin -12% at the bottom: the reveal ends as the eye arrives. */
  if (revealed.length && !reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        watcher.unobserve(e.target);   // a reveal never replays
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
    revealed.forEach(function (n) { watcher.observe(n); });
  } else {
    showAll();
  }

  /* ─── 1b ▸ Cascade ── [decided] ─────────────────────────────────────────
     Offset carried by a CSS variable (--i), not by a transition: the CSS
     stays in charge of timing. Short step (60 ms) — beyond that, nine cells
     take more than a second to settle and the cascade becomes the subject. */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  /* ─── 2 ▸ Segmented control (large / pill / slim) ───────────────────────
     [measured] background rgb(0,0,0) + opacity:1 on the active tab, rgba(0,0,0,0) +
     opacity:.5 on the others. The states are facts; the transition is not.
     [decided] A single thumb slides instead of repainting three backgrounds:
     only a transform is animated (GPU-composited), and the movement CONNECTS
     the two states — three backgrounds lighting up are three events, a thumb
     that slides is a single gesture. Position measured, never hard-coded: the
     widths change with the font and the breakpoint. */
  var segmented = document.querySelector('.segmented');
  if (segmented) {
    var thumb = segmented.querySelector('.segmented__thumb');
    var tabs = Array.prototype.slice.call(segmented.querySelectorAll('.segmented__tab'));

    var placeThumb = function (tab) {
      if (!tab || !thumb) return;
      thumb.style.width = tab.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + (tab.offsetLeft - 2) + 'px)';
    };
    var activate = function (tab) {
      tabs.forEach(function (t) {
        var active = (t === tab);
        t.classList.toggle('is-on', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      placeThumb(tab);
    };
    tabs.forEach(function (o) {
      o.addEventListener('click', function () { activate(o); });
    });

    /* Keyboard navigation, expected of any `tablist` role. [decided] */
    segmented.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1
            : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault();
      var target = tabs[(j + tabs.length) % tabs.length];
      target.focus();
      activate(target);
    });

    /* Reposition on load, on resize, and when the fallback font swaps to the
       web font — that last case is the one most often forgotten. */
    var reposition = function () { placeThumb(segmented.querySelector('.is-on')); };
    reposition();
    addEventListener('resize', reposition, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reposition);
  }

  /* ─── 3 ▸ Looping video ─────────────────────────────────────────────────
     [measured] `loop muted playsinline preload="none"` + poster: the source
     decides it costs nothing as long as nobody is watching it.
     [decided] The trigger: play when on screen, pause on exit. Under
     reduced motion it never starts, the poster is enough. */
  var video = document.querySelector('.media__video');
  if (video && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !reduced) {
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* refused: the poster stays */ });
        } else { video.pause(); }
      });
    }, { threshold: 0.25 }).observe(video);
  }

  /* ─── 4 ▸ The "00:25:00" block ──────────────────────────────────────────
     [measured] FROZEN SVG of 117 × 34 px, drawn entirely in the accent
     rgb(224,59,30), pictogram of the "reminder" cell. Framer does not animate
     it; it is reproduced character for character in styles.css (.picto--timer).
     [decided] What follows ADDS motion where the source has none — owned and
     bounded: the pictogram is not replaced, it is made to breathe at the pace
     of a display's colon. animationPlayState rather than removing/re-adding a
     class, which would restart from zero and cause a jolt. Under reduced
     motion it is never set: the pictogram stays at full opacity —
     reducing motion must not reduce information. */
  var timer = document.querySelector('.picto--timer');
  if (timer && !reduced && 'IntersectionObserver' in window) {
    var sheet = document.createElement('style');
    sheet.textContent = '@keyframes blink{0%,49%{opacity:1}50%,99%{opacity:.55}}';
    document.head.appendChild(sheet);

    timer.style.animation = 'blink 1s steps(1, end) infinite';
    timer.style.animationPlayState = 'paused';
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        timer.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0.4 }).observe(timer);
  }

  /* ─── 5 ▸ Reading progress ── [decided] entirely ────────────────────────
     A page that runs on ~200 vh of emptiness needs a landmark. A 1 px rule
     in the accent. {passive:true} listener, throttled by requestAnimationFrame:
     at most one computation per frame. */
  var gauge = document.createElement('div');
  gauge.setAttribute('aria-hidden', 'true');
  gauge.style.cssText =
    'position:fixed;top:0;left:0;height:1px;width:100%;transform-origin:0 50%;' +
    'transform:scaleX(0);background:var(--accent);z-index:9;pointer-events:none;' +
    'opacity:0;transition:opacity ' + durationShort + ' linear';
  document.body.appendChild(gauge);

  var pending = false;
  var measure = function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
    gauge.style.transform = 'scaleX(' + p + ')';
    gauge.style.opacity = p > 0.002 ? '1' : '0';
    pending = false;
  };
  addEventListener('scroll', function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(measure);
  }, { passive: true });
  addEventListener('resize', measure, { passive: true });
  measure();

  /* ─── 6 ▸ Scrolling to an anchor ────────────────────────────────────────
     THE most common TRAP in this file: scrollTo / scrollBy /
     scrollIntoView with `behavior:'smooth'` NEVER CONSULT
     prefers-reduced-motion. The JS scrolling API ignores the preference,
     unlike CSS transitions: a hard-coded 'smooth' forces motion on exactly
     the audience the preference protects.
     Second trap: omitting `behavior` does not mean "instant" — the default
     'auto' follows the CSS scroll-behavior. Be explicit in BOTH branches. */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    });
  });
})();
