/* =============================================================
   motion.js — interface behaviors of the x.ai reference
   Vanilla JS: no framework, no CDN, no build.
   [measured] = read in the source · [decided] = deliberate choice.
   PRINCIPLE — this file computes NO animation value: it sets
   classes, attributes and elements, the CSS interpolates. Like the source.
   ============================================================= */
(function () {
  "use strict";

  /* §0 REDUCED MOTION — JS scroll APIs do NOT apply it on their
     own; `addListener()` is deprecated → `change`. */
  var motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  motionQuery.addEventListener("change", function (e) { reducedMotion = e.matches; });

  /** @returns {ScrollBehavior} omitting `behavior` would follow the CSS. */
  function scrollBehavior() { return reducedMotion ? "instant" : "smooth"; }

  /* §1 CADENCES — [measured] inline start state on EVERY terminal line
     (opacity:0; translateY(6px)) and every bubble (whose arrival
     `filter:blur(0px)` betrays a blur at the start).
     @param {string} selector containers whose children are staggered */
  function stagger(selector) {
    document.querySelectorAll(selector).forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (n, rank) {
        n.style.setProperty("--i", String(rank));
      });
    });
  }
  stagger("[data-terminal]");
  stagger("[data-bubbles]");

  /* §2 REVEALS — [measured] inline start (opacity:0; translateY(45%)
     rotateX(-40deg)), lifted by the source JS. IO: available since 2019. */
  var targets = document.querySelectorAll("[data-reveal]");

  /** Forces the final state without transition — fallback and reduced motion. */
  function revealAll() {
    targets.forEach(function (n) { n.classList.add("is-visible"); });
  }

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);   /* a reveal does not replay */
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });  /* [decided] */
    targets.forEach(function (n) { observer.observe(n); });
  }

  /* §2 HEADER ─ [measured] the hairline is a <div class="h-px bg-border/50">
     with `style="opacity:0"` at rest, the header carrying `duration-200`. The
     JS only sets a state attribute: the 200 ms opacity transition is
     written in CSS. Passive listener + rAF throttle. */
  var header = document.getElementById("header");
  var pending = false;

  function updateHeader() {
    header.toggleAttribute("data-stuck", window.scrollY > 8);  /* [decided] threshold */
  }

  if (header) {
    updateHeader();
    addEventListener("scroll", function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { updateHeader(); pending = false; });
    }, { passive: true });
  }

  /* §3 TABS ─ [measured] placed BELOW the window, not in its bar;
     their only state change is a color (`text-secondary` →
     `text-primary`, transition-colors without duration → default 150 ms). The JS
     only touches `aria-selected` and `hidden`; the color follows through
     a CSS attribute selector.
     @param {HTMLElement} tab tab to activate */
  function activateTab(tab) {
    tab.closest('[role="tablist"]')
      .querySelectorAll('[role="tab"]').forEach(function (other) {
        var active = other === tab;
        other.setAttribute("aria-selected", String(active));
        var panel = document.getElementById(other.getAttribute("aria-controls"));
        if (panel) panel.hidden = !active;
      });
  }

  document.querySelectorAll('[role="tab"]').forEach(function (tab) {
    tab.addEventListener("click", function () { activateTab(tab); });
    tab.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var siblings = Array.prototype.slice.call(
        tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
      var step = e.key === "ArrowRight" ? 1 : -1;
      var next = siblings[(siblings.indexOf(tab) + step + siblings.length) % siblings.length];
      next.focus(); activateTab(next); e.preventDefault();
    });
  });

  /* §4 COUNTERS — [measured] the source mounts a shadow-DOM component
     that scrolls each digit behind a .25em mask.
     [decided] simple count-up; the final value is already in the HTML.
     @param {HTMLElement} node element carrying data-counter */
  var COUNTER_DURATION = 1400;  /* [decided] */

  function animateCounter(node) {
    var target = parseFloat(node.dataset.counter);
    if (!isFinite(target) || target === 0) return;
    var start = performance.now();
    (function tick(now) {
      var t = Math.min((now - start) / COUNTER_DURATION, 1);
      /* cubic deceleration, like the CSS exit curve */
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  if (!reducedMotion && "IntersectionObserver" in window) {
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target); watcher.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-counter]").forEach(function (n) { watcher.observe(n); });
  }

  /* §5 WHAT THE SOURCE PAINTS IN JS — two containers of the snapshot are
     EMPTY; the CSS says what to rebuild: "Voice" card + `@keyframes
     waveform` (.4×↔1×), banner sweep + `gridShimmerH` (-45→145cqw).
     The JS creates the elements, it animates none of them. */
  var BAR_COUNT = 38;  /* [decided] not measurable */

  document.querySelectorAll("[data-wave]").forEach(function (container) {
    for (var i = 0; i < BAR_COUNT; i++) {
      var bar = document.createElement("i");
      var envelope = Math.sin((i / (BAR_COUNT - 1)) * Math.PI);  /* tall in the center */
      var height = (14 + envelope * 78).toFixed(1) + "px";      /* [decided] */
      bar.style.setProperty("--bar-h", height);
      bar.style.animationDelay = (-(i % 7) * 0.11).toFixed(2) + "s";  /* [decided] */
      /* Under `reduce` the wave is drawn FROZEN: legible, still. */
      if (reducedMotion) bar.style.height = height;
      container.appendChild(bar);
    }
  });

  document.querySelectorAll("[data-sweep]").forEach(function (container) {
    if (reducedMotion) return;   /* nothing to scroll under `reduce` */
    container.appendChild(document.createElement("i"));
  });

  /* §6 CANVAS — [measured] a 173×32 `<canvas>` stands in for the word-mark,
     EMPTY in the snapshot: the drawing is not derivable, the procedure
     is — a deferred render revealed by a 300 ms opacity.
     The trigger is backed by a time floor: if the remote font never
     responds, `fonts.ready` never resolves and the word-mark would stay
     invisible FOREVER. An invisible rest state must NEVER depend on a
     single network promise. */
  var brand = document.getElementById("brand");
  if (brand) {
    brand.style.opacity = "0";
    brand.style.transition = "opacity 300ms var(--c-standard, ease)";
    var reveal = function () { brand.style.opacity = "1"; };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reveal);
    setTimeout(reveal, 900);   /* [decided] floor, no matter what */
  }
  /* §7 DRAWER — [measured] below 1100px the source swaps its controls. */
  var burger = document.getElementById("burger"), drawer = document.getElementById("drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = !drawer.hidden;
      drawer.hidden = open;
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
  }
  /* §8 "COPY" — [measured] reserved width, two stacked labels: the
     switch shifts nothing. @param {HTMLElement} button [data-copy] */
  function wireCopy(button) {
    var label = button.querySelector("[data-copy-label]"), timer = 0;
    button.addEventListener("click", function () {
      var pre = button.closest(".code-window").querySelector("pre:not([hidden])");
      if (!pre || !navigator.clipboard || !label) return;
      navigator.clipboard.writeText(pre.innerText).then(function () {
        label.textContent = "Copied";
        clearTimeout(timer);
        timer = setTimeout(function () { label.textContent = "Copy"; }, 1600);
      }, function () { /* permission denied: display nothing false */ });
    });
  }
  document.querySelectorAll("[data-copy]").forEach(wireCopy);
  window.reference = { reducedMotion: function () { return reducedMotion; },
    scrollBehavior: scrollBehavior, revealAll: revealAll };
})();
