/* Sylva AI — page behaviours. A single IIFE, loaded at the end of body.
   Every duration and every curve lives in styles.css; this file only sets
   classes, attributes and scroll positions. */
(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = motionQuery.matches;
  var observers = [];
  var frame = 0;

  /* 1. Header: opaque surface as soon as the page has scrolled. */
  var header = document.querySelector("[data-header]");

  function updateHeader() {
    frame = 0;
    if (header) header.classList.toggle("is-stuck", window.scrollY > 24);
  }

  function onScroll() {
    if (frame) return;
    frame = window.requestAnimationFrame(updateHeader);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateHeader();

  /* 2. Reveal on scroll. The resting state is set by JS only,
     so a failing script leaves the whole page visible. */
  if (!reducedMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-motion");

    var revealables = document.querySelectorAll("[data-reveal]");
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add("is-visible");
        observer.unobserve(entries[i].target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (var r = 0; r < revealables.length; r++) {
      var item = revealables[r];
      var group = item.closest("[data-reveal-group]");
      if (group) {
        var siblings = group.querySelectorAll("[data-reveal]");
        var rank = Array.prototype.indexOf.call(siblings, item);
        item.style.transitionDelay = Math.min(rank, 5) * 60 + "ms";
      }
      revealObserver.observe(item);
    }
    observers.push(revealObserver);
  }

  /* 3. Steps: the active marker follows the step at the centre of the viewport. */
  var steps = document.querySelectorAll(".step");
  if (steps.length && "IntersectionObserver" in window) {
    var stepObserver = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (!entries[j].isIntersecting) continue;
        for (var k = 0; k < steps.length; k++) {
          steps[k].classList.toggle("step--active", steps[k] === entries[j].target);
        }
      }
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    for (var e = 0; e < steps.length; e++) stepObserver.observe(steps[e]);
    observers.push(stepObserver);
  }

  /* 4. Use-case tabs. */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));

  function selectTab(tab) {
    for (var i = 0; i < tabs.length; i++) {
      var active = tabs[i] === tab;
      tabs[i].setAttribute("aria-selected", active ? "true" : "false");
      tabs[i].tabIndex = active ? 0 : -1;
      var panel = document.getElementById(tabs[i].getAttribute("aria-controls"));
      if (panel) panel.hidden = !active;
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (evt) {
      var offset = evt.key === "ArrowRight" ? 1 : evt.key === "ArrowLeft" ? -1 : 0;
      if (!offset) return;
      evt.preventDefault();
      var next = tabs[(index + offset + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* 5. FAQ: only one item open at a time. */
  var accordions = Array.prototype.slice.call(document.querySelectorAll(".accordion"));
  accordions.forEach(function (details) {
    details.addEventListener("toggle", function () {
      if (!details.open) return;
      accordions.forEach(function (other) { if (other !== details) other.open = false; });
    });
  });

  /* 6. Monthly / yearly toggle. */
  var periodSwitch = document.querySelector("[data-period-toggle]");
  if (periodSwitch) {
    periodSwitch.addEventListener("click", function () {
      var yearly = periodSwitch.getAttribute("aria-checked") !== "true";
      periodSwitch.setAttribute("aria-checked", yearly ? "true" : "false");

      var monthWord = document.querySelector("[data-period-month]");
      var yearWord = document.querySelector("[data-period-year]");
      if (monthWord) monthWord.classList.toggle("pricing-toggle__word--off", yearly);
      if (yearWord) yearWord.classList.toggle("pricing-toggle__word--off", !yearly);

      var prices = document.querySelectorAll("[data-price]");
      for (var p = 0; p < prices.length; p++) {
        prices[p].textContent = prices[p].getAttribute(yearly ? "data-year" : "data-month");
      }
    });
  }

  /* 7. Testimonials rail. */
  var track = document.querySelector("[data-rail-track]");
  var previous = document.querySelector("[data-rail-prev]");
  var next = document.querySelector("[data-rail-next]");

  function updateControls() {
    if (!track || !previous || !next) return;
    var remaining = track.scrollWidth - track.clientWidth;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= remaining - 2;
  }

  function slide(direction) {
    if (!track) return;
    var card = track.querySelector(".review-card");
    var offset = card ? card.getBoundingClientRect().width + 12 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * offset, behavior: reducedMotion ? "auto" : "smooth" });
  }

  if (track) {
    if (previous) previous.addEventListener("click", function () { slide(-1); });
    if (next) next.addEventListener("click", function () { slide(1); });
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    updateControls();
  }

  /* 8. Mobile menu. */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      menu.hidden = !open;
    });
    menu.addEventListener("click", function (evt) {
      if (evt.target.tagName !== "A") return;
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  }

  /* 9. Newsletter: local acknowledgement, no network request. */
  var newsletter = document.querySelector("[data-newsletter]");
  if (newsletter) {
    newsletter.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var status = newsletter.querySelector("[data-newsletter-status]");
      if (status) status.textContent = "Thank you, you are on the list.";
      newsletter.reset();
    });
  }

  /* 10. Disarming. visibilitychange rather than unload, which breaks the
     bfcache; pagehide is the fallback for the single pending frame. */
  function disarm() {
    if (document.visibilityState !== "hidden") return;
    if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
    while (observers.length) observers.pop().disconnect();
    window.removeEventListener("scroll", onScroll);
  }

  document.addEventListener("visibilitychange", disarm);
  window.addEventListener("pagehide", function () {
    if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
  });
})();
