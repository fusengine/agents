/* Solvo. Motion, base: header, menu, counter, reveals, burst.
   No duration or curve here: they live in styles.css. This file only
   toggles classes, arms observers and disarms them.
   The carousels and the accordion are in motion-carrousel.js. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var timers = [];
  var observers = [];

  function defer(fn, ms) {
    var id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  }
  function purge() {
    timers.forEach(window.clearTimeout);
    timers.length = 0;
  }

  /* ------------------------------------------- header stuck on scroll */
  var masthead = document.getElementById("masthead");
  if (masthead) {
    var sentinel = function () {
      masthead.classList.toggle("is-stuck", window.scrollY > 8);
    };
    sentinel();
    window.addEventListener("scroll", sentinel, { passive: true });
  }

  /* ---------------------------------------------------------- mobile menu */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    menu.addEventListener("click", function (e) {
      if (!e.target.closest("a")) return;
      burger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  }

  /* ------------------------------------ eyebrow counter, digit scramble */
  var counter = document.querySelector("[data-counter]");
  if (counter) {
    var target = counter.getAttribute("data-target");
    if (reduced.matches) {
      counter.textContent = target;
    } else {
      var digits = target.replace(/[^0-9]/g, "");
      var step = 0;
      var roll = function () {
        step += 1;
        counter.textContent = target.split("").map(function (c, i) {
          if (!/[0-9]/.test(c)) return c;
          var rank = target.slice(0, i).replace(/[^0-9]/g, "").length;
          return rank < step ? c : String(Math.floor(Math.random() * 10));
        }).join("");
        if (step <= digits.length) defer(roll, 90);
      };
      defer(roll, 400);
    }
  }

  /* ---------------------------------------------- reveals, single observer */
  var targets = document.querySelectorAll("[data-reveal]");
  if (targets.length && "IntersectionObserver" in window) {
    var view = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    targets.forEach(function (el) { view.observe(el); });
    observers.push(view);
  } else {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------ burst: rays in CSS */
  var burst = document.querySelector("[data-burst]");
  if (burst) {
    var total = 46;
    for (var i = 0; i < total; i += 1) {
      var ray = document.createElement("i");
      var angle = -74 + (148 * i) / (total - 1);
      var length = 120 + Math.round(Math.abs(Math.cos((angle * Math.PI) / 180)) * 190);
      var hue = i % 3 === 0 ? "#ffa319" : i % 3 === 1 ? "#533afd" : "#7f7dfc";
      ray.style.height = length + "px";
      ray.style.color = hue;
      ray.style.background = "linear-gradient(180deg, " + hue + ", rgba(255,255,255,0))";
      ray.style.transform = "rotate(" + angle + "deg) scaleY(.25)";
      ray.setAttribute("data-angle", String(angle));
      burst.appendChild(ray);
    }
    var deploy = function () {
      Array.prototype.forEach.call(burst.children, function (r, k) {
        var a = r.getAttribute("data-angle");
        defer(function () {
          r.style.transform = "rotate(" + a + "deg) scaleY(1)";
        }, reduced.matches ? 0 : k * 18);
      });
    };
    if ("IntersectionObserver" in window) {
      var burstView = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          deploy();
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.2 });
      burstView.observe(burst);
      observers.push(burstView);
    } else {
      burst.classList.add("is-visible");
      deploy();
    }
  }

  /* ------------------- clean shutdown: tab hidden or page left */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") purge();
  });
  window.addEventListener("pagehide", function () {
    purge();
    observers.forEach(function (o) { o.disconnect(); });
    observers.length = 0;
  });
})();
