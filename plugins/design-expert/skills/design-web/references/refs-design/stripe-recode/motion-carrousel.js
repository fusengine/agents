/* Solvo. Motion, second file: customer-case accordion, startup rail,
   news blades, testimonial rotation. Split from motion.js to stay under
   the corpus line ceiling. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var timers = [];

  function defer(fn, ms) {
    var id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }
  function purge() {
    timers.forEach(window.clearTimeout);
    timers.length = 0;
  }

  /* -------------------------------------------------------- accordion */
  var accordion = document.querySelector("[data-accordion]");
  if (accordion) {
    accordion.addEventListener("click", function (e) {
      var button = e.target.closest(".fold__button");
      if (!button) return;
      var fold = button.closest("[data-fold]");
      var already = button.getAttribute("aria-expanded") === "true";
      accordion.querySelectorAll("[data-fold]").forEach(function (p) {
        p.classList.remove("fold--open");
        p.querySelector(".fold__button").setAttribute("aria-expanded", "false");
        p.querySelector(".fold__body").hidden = true;
      });
      if (already) return;
      fold.classList.add("fold--open");
      button.setAttribute("aria-expanded", "true");
      fold.querySelector(".fold__body").hidden = false;
    });
  }

  /* ----------------------------------------------- customer-case rail */
  var rail = document.querySelector("[data-rail]");
  if (rail) {
    var track = rail.querySelector("[data-rail-track]");
    var slide = function (direction) {
      var card = track.querySelector(".case");
      var width = card ? card.getBoundingClientRect().width + 16 : 262;
      track.scrollBy({
        left: direction * width * 2,
        behavior: reduced.matches ? "auto" : "smooth"
      });
    };
    rail.querySelector("[data-rail-prev]").addEventListener("click", function () { slide(-1); });
    rail.querySelector("[data-rail-next]").addEventListener("click", function () { slide(1); });
  }

  /* ------------------------------------------------------ news blades */
  var summaries = [
    ["Businesses on Solvo generated US$1.4tn in 2025.",
      "Our annual letter explores the trends defining the internet economy: steeper growth for newer businesses, faster international expansion, stablecoin progress and agentic commerce."],
    ["130K+ users had their best sales day ever on Solvo.",
      "Over the four days of year-end sales, Solvo processed more than US$34bn for its customers while maintaining a 99.9999% uptime."],
    ["A benchmark report on SaaS for small businesses.",
      "Learn what's driving SaaS growth in 2025: going multiproduct, and embedding fintech and AI into the core of their products."],
    ["Two founders discuss the future of commerce.",
      "The choices that shaped their success, their read on the next ten years, and their advice for founders."],
    ["New tools to process payments outside app stores.",
      "New regulations mean new opportunities. Solvo lets you accept payments outside the iOS and Android app stores, without losing control of the customer experience."],
    ["Make your products shoppable through AI platforms.",
      "The agentic commerce protocol allows any business to accept purchases from AI platforms without requiring any major technical changes."]
  ];
  var blades = document.querySelector("[data-blades]");
  if (blades) {
    var all = blades.querySelectorAll("[data-blade]");
    var summary = document.querySelector("[data-news-summary]");
    var index = 0;
    var open = function (n) {
      index = (n + all.length) % all.length;
      all.forEach(function (l, k) {
        l.classList.toggle("is-open", k === index);
        l.querySelector("[data-trigger]").setAttribute("aria-expanded", String(k === index));
      });
      if (!summary) return;
      summary.querySelector("b").textContent = summaries[index][0];
      summary.querySelector("span").textContent = summaries[index][1];
    };
    all.forEach(function (l, k) {
      l.addEventListener("click", function () { open(k); });
    });
    document.querySelector("[data-news-prev]").addEventListener("click", function () { open(index - 1); });
    document.querySelector("[data-news-next]").addEventListener("click", function () { open(index + 1); });
  }

  /* --------------------------------- testimonial rotation, 7 s */
  var scene = document.querySelector("[data-testimonial]");
  if (scene) {
    var blocks = scene.querySelectorAll("[data-testimonial-item]");
    var tabs = document.querySelectorAll("[data-tab]");
    var current = 0;
    var loop = null;
    var show = function (n) {
      current = (n + blocks.length) % blocks.length;
      blocks.forEach(function (b, k) {
        b.hidden = k !== current;
        b.classList.toggle("is-visible", k === current);
      });
      tabs.forEach(function (o, k) {
        o.classList.toggle("is-active", k === current);
        o.setAttribute("aria-selected", String(k === current));
        var bar = o.querySelector("[data-bar]");
        bar.style.animation = "none";
        void bar.offsetWidth;
        bar.style.animation = "";
      });
    };
    var chain = function () {
      if (reduced.matches) return;
      loop = defer(function () { show(current + 1); chain(); }, 7000);
    };
    tabs.forEach(function (o, k) {
      o.addEventListener("click", function () {
        window.clearTimeout(loop);
        show(k);
        chain();
      });
    });
    show(0);
    chain();
  }

  /* ------------------ clean shutdown: tab hidden or page left */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") purge();
  });
  window.addEventListener("pagehide", purge);
})();
