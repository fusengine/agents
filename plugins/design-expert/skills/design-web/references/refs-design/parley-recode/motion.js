/* =====================================================================
   Salut — motion.js
   Four behaviours, in the order they can fire:
     1. photographic fade-in on decode (the source's only real motion)
     2. section reveal on entry, self-disarming
     3. terminal step stagger, self-disarming
     4. header surface state on scroll, rAF-throttled
   Everything is a no-op under prefers-reduced-motion, and the DOM's
   default state is already visible: a failed script leaves the page whole.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var observers = [];
  var rafId = 0;

  function markAllLoaded() {
    var imgs = document.querySelectorAll(".media-img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.add("is-loaded");
    }
  }

  /* If motion is off we never stamp `.js`, so no CSS hiding rule ever
     applies and the page renders in its finished state immediately. */
  if (reduce.matches) {
    markAllLoaded();
    return;
  }
  root.classList.add("js");

  /* ---------------------------------------------------- 1. image fade-in */
  function fadeImages() {
    var imgs = document.querySelectorAll("img[data-fade]");
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        if (img.complete && img.naturalWidth > 0) {
          img.classList.add("is-loaded");
          return;
        }
        /* `error` reveals too: a missing file must not leave a hole where
           the reader expects a band. The alt text takes over. */
        var reveal = function () {
          img.classList.add("is-loaded");
          img.removeEventListener("load", reveal);
          img.removeEventListener("error", reveal);
        };
        img.addEventListener("load", reveal);
        img.addEventListener("error", reveal);
      })(imgs[i]);
    }
  }

  /* ------------------------------------------------- 2. section reveals */
  function revealOnEntry() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) { return; }

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < targets.length; i++) { targets[i].classList.add("is-in"); }
      return;
    }

    var io = new IntersectionObserver(function (entries, observer) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        if (!entry.isIntersecting) { continue; }
        entry.target.classList.add("is-in");
        /* Disarm this element: the reveal plays once, and the observer
           stops holding a reference to a node it will never re-read. */
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    for (var k = 0; k < targets.length; k++) { io.observe(targets[k]); }
    observers.push(io);
  }

  /* --------------------------------------------- 3. terminal step stagger */
  function staggerTerminal() {
    var list = document.querySelector(".term-steps");
    if (!list) { return; }
    var steps = list.querySelectorAll("[data-step]");
    if (!steps.length) { return; }

    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < steps.length; i++) { steps[i].classList.add("is-in"); }
      return;
    }

    var io = new IntersectionObserver(function (entries, observer) {
      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];
        if (!entry.isIntersecting) { continue; }
        for (var s = 0; s < steps.length; s++) {
          (function (el, index) {
            window.setTimeout(function () { el.classList.add("is-in"); }, 90 * index);
          })(steps[s], s);
        }
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.35 });

    io.observe(list);
    observers.push(io);
  }

  /* --------------------------------------------------- 4. header surface */
  function headerState() {
    var header = document.querySelector("[data-header]");
    if (!header) { return; }

    var apply = function () {
      rafId = 0;
      header.setAttribute("data-scrolled", window.scrollY > 24 ? "true" : "false");
    };
    var onScroll = function () {
      if (rafId) { return; }
      rafId = window.requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
  }

  /* ------------------------------------------------------------- cleanup */
  function cancelFrame() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function disarm() {
    for (var i = 0; i < observers.length; i++) { observers[i].disconnect(); }
    observers.length = 0;
    cancelFrame();
  }

  /* A backgrounded tab must not keep a queued frame alive; `pagehide` is
     the fallback for the browsers that skip `visibilitychange` on unload. */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { cancelFrame(); }
  });
  window.addEventListener("pagehide", disarm);

  /* If the user flips reduced motion on mid-visit, finish everything at
     once and release every observer rather than half-playing a reveal. */
  function onPreferenceChange() {
    if (!reduce.matches) { return; }
    disarm();
    markAllLoaded();
    var pending = document.querySelectorAll("[data-reveal], [data-step]");
    for (var i = 0; i < pending.length; i++) { pending[i].classList.add("is-in"); }
  }

  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", onPreferenceChange);
  } else if (typeof reduce.addListener === "function") {
    reduce.addListener(onPreferenceChange);
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    fadeImages();
    revealOnEntry();
    staggerTerminal();
    headerState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
