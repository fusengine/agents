/* ═══════════════════════════════════════════════════════════════════════════
   MOTION — design reference. Vanilla, no framework, no build.

   TRACEABILITY. The source contains NO @keyframes, NO
   animation-timeline, and a single duration written in plain text: the 150ms of
   `.landing-press button`. All its motion comes from the Framer Motion runtime,
   unreadable from the shipped HTML. What IS readable, and is therefore [measured]:
     · the start states, written in the `style` attributes of the served HTML —
       `opacity:0;transform:translateY(16px)` on the five hero children,
       `opacity:0;transform:translateY(24px)` on every section block;
     · the fact that those two distances are DIFFERENT and not interchangeable;
     · the fact that the thread area of the agent panel is EMPTY in the HTML
       (`min-h-[320px] space-y-4 p-5` with no child): its content is staged
       by the runtime, so it is played, not displayed;
     · the press gesture, `transform: scale(0.96)` over 150ms.
   [decided] = everything else: reveal durations, curves, thresholds, cascade
   step. No duration is hard-coded here — they come from the CSS variables of
   :root, the CSS stays in charge of timing.

   SAFETY CONTRACT. The resting state (`opacity: 0`) is armed only under the
   `.js-motion` class, and that class is set only after checking that we will
   be able to lift it. Missing script, IntersectionObserver unavailable or
   reduced motion: the CSS hides nothing, the page is fully readable.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ─── 0 ▸ Motion preference ───────────────────────────────────────────────
     `matches` for the instant test, `addEventListener('change')` for
     tracking — `addListener()` is deprecated. A switch mid-session must
     reveal everything, never hide everything. [decided] */
  var calmQuery = matchMedia("(prefers-reduced-motion: reduce)");
  var calm = calmQuery.matches;

  var risers = Array.prototype.slice.call(
    document.querySelectorAll("[data-rise], [data-reveal]")
  );
  var threads = Array.prototype.slice.call(document.querySelectorAll("[data-thread]"));
  var watcher = null;
  var timers = [];

  function showAll() {
    risers.forEach(function (n) { n.classList.add("is-visible"); });
    threads.forEach(function (n) { n.classList.add("is-visible"); });
  }

  /* ─── 1 ▸ Cascade — the offset is carried by a CSS variable ───────────────
     `--i` is an INDEX, not a duration: the step (`--cascade-step`) and the
     curve stay in the stylesheet. Three families cascade: the five hero
     children, the cells of a grid marked `data-cascade`, and the messages
     of the agent thread. [decided] in full. */
  function indexChildren(parent, selector) {
    var children = selector
      ? parent.querySelectorAll(selector)
      : parent.children;
    Array.prototype.forEach.call(children, function (child, i) {
      child.style.setProperty("--i", i);
    });
  }

  document.querySelectorAll("[data-hero-group]").forEach(function (group) {
    indexChildren(group, "[data-rise]");
  });
  document.querySelectorAll("[data-cascade]").forEach(function (group) {
    indexChildren(group, "[data-reveal]");
  });
  threads.forEach(function (thread) {
    indexChildren(thread, "[data-message]");
  });

  /* ─── 2 ▸ Accordion ───────────────────────────────────────────────────────
     The HTML ships ALL panels open (`aria-expanded="true"`, no
     `data-folded`). This is deliberate: without this script, the FAQ stays fully
     readable. The script closes everything here except the first, then takes over.
     Only one entry open at a time — [measured]: the source never opens
     two answers together (`data-closed` on the four items at rest). */
  var triggers = Array.prototype.slice.call(
    document.querySelectorAll(".fold__trigger")
  );

  function fold(button, folded) {
    var panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;
    button.setAttribute("aria-expanded", folded ? "false" : "true");
    if (folded) panel.setAttribute("data-folded", "");
    else panel.removeAttribute("data-folded");
  }

  function armAccordion() {
    triggers.forEach(function (button, i) {
      fold(button, i !== 0);
      button.addEventListener("click", function () {
        var open = button.getAttribute("aria-expanded") === "true";
        triggers.forEach(function (other) { fold(other, true); });
        if (!open) fold(button, false);
      });
    });
  }

  /* ─── 3 ▸ Reveal on scroll ────────────────────────────────────────────────
     IntersectionObserver and NOT `animation-timeline: view()`: not Baseline, and
     a keyframe starting from `opacity:0` would leave the blocks PERMANENTLY
     invisible on failure. Threshold 0.14: revealed as soon as a seventh of the
     block enters. rootMargin -10% at the bottom: the rise ends as the eye arrives.
     Each target is disarmed in the callback — a reveal never replays,
     and the observer empties itself. [decided] */
  function startObserving() {
    document.documentElement.classList.add("js-motion");

    watcher = new IntersectionObserver(function (entries, self) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        self.unobserve(e.target);   /* the 2nd parameter IS the observer */
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });

    risers.forEach(function (n) {
      /* The hero is already in the viewport on load: it is not observed,
         it plays straight away, in a cascade. [measured] the source also
         distinguishes a mount entrance from a scroll entrance. */
      if (n.hasAttribute("data-rise")) return;
      watcher.observe(n);
    });
    threads.forEach(function (n) { watcher.observe(n); });

    /* Hero mount: one tick so the browser has painted the resting
       state, otherwise the transition does not happen. */
    timers.push(requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll("[data-rise]").forEach(function (n) {
          n.classList.add("is-visible");
        });
      });
    }));
  }

  /* ─── 4 ▸ Startup ─────────────────────────────────────────────────────────
     Three conditions to arm: content to reveal, no reduced
     motion, and an IntersectionObserver available. Otherwise, everything is shown. */
  if (risers.length && !calm && "IntersectionObserver" in window) {
    startObserving();
  } else {
    document.documentElement.classList.add("js-motion");
    showAll();
  }
  armAccordion();

  calmQuery.addEventListener("change", function (e) {
    calm = e.matches;
    if (calm) {
      teardown();
      showAll();   /* never leave a block hidden behind you */
    }
  });

  /* ─── 5 ▸ Disarming ───────────────────────────────────────────────────────
     `disconnect()` stops ALL targets at once, whereas `unobserve(target)`
     only hits one: it is the right primitive for a global cleanup.
     `visibilitychange` is the preferred signal to cancel a pending
     frame; `pagehide` is the fallback for when the tab is closed without
     going through a hidden state (and, on iOS, when the page goes to the
     bfcache without ever firing `unload`). */
  function teardown() {
    if (watcher) { watcher.disconnect(); watcher = null; }
    timers.forEach(function (id) { cancelAnimationFrame(id); });
    timers = [];
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") teardown();
  });
  window.addEventListener("pagehide", teardown);

  /* ─── 6 ▸ Press ───────────────────────────────────────────────────────────
     [measured] source literal: `.landing-press button:active { transform:
     scale(0.96) }`, over 150ms, transitioning transform, background-color,
     border-color, color and opacity. The gesture is written in CSS (`.button:active`)
     and not here — a JS-driven `:active` misses keyboard and touch.
     This block therefore does only one thing CSS cannot do: make the
     gesture also available to the space bar on an <a role=button>.
     There is none on this page, so the loop is empty by construction
     and left as a comment rather than as dead code. */

}());
