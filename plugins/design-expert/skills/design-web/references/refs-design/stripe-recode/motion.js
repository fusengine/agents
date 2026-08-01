/* Solvo. Mouvement, socle : entete, menu, compteur, revelations, gerbe.
   Aucune duree ni courbe ici : elles vivent dans styles.css. Ce fichier ne
   fait que basculer des classes, armer des observateurs et les desarmer.
   Les carrousels et l'accordeon sont dans motion-carrousel.js. */
(function () {
  "use strict";

  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  var minuteries = [];
  var observateurs = [];

  function differe(fn, ms) {
    var id = window.setTimeout(fn, ms);
    minuteries.push(id);
    return id;
  }
  function purge() {
    minuteries.forEach(window.clearTimeout);
    minuteries.length = 0;
  }

  /* ---------------------------------------------- entete collee au scroll */
  var entete = document.getElementById("entete");
  if (entete) {
    var sentinelle = function () {
      entete.classList.toggle("est-collee", window.scrollY > 8);
    };
    sentinelle();
    window.addEventListener("scroll", sentinelle, { passive: true });
  }

  /* ---------------------------------------------------------- menu mobile */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu-mobile");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var ouvert = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!ouvert));
      menu.hidden = ouvert;
    });
    menu.addEventListener("click", function (e) {
      if (!e.target.closest("a")) return;
      burger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  }

  /* ------------------------------- compteur du sourcil, roulement chiffre */
  var compteur = document.querySelector("[data-compteur]");
  if (compteur) {
    var cible = compteur.getAttribute("data-cible");
    if (reduit.matches) {
      compteur.textContent = cible;
    } else {
      var chiffres = cible.replace(/[^0-9]/g, "");
      var pas = 0;
      var roule = function () {
        pas += 1;
        compteur.textContent = cible.split("").map(function (c, i) {
          if (!/[0-9]/.test(c)) return c;
          var rang = cible.slice(0, i).replace(/[^0-9]/g, "").length;
          return rang < pas ? c : String(Math.floor(Math.random() * 10));
        }).join("");
        if (pas <= chiffres.length) differe(roule, 90);
      };
      differe(roule, 400);
    }
  }

  /* -------------------------------------- revelations, observateur unique */
  var cibles = document.querySelectorAll("[data-reveal]");
  if (cibles.length && "IntersectionObserver" in window) {
    var vue = new IntersectionObserver(function (entrees, obs) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add("est-visible");
        obs.unobserve(entree.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    cibles.forEach(function (el) { vue.observe(el); });
    observateurs.push(vue);
  } else {
    cibles.forEach(function (el) { el.classList.add("est-visible"); });
  }

  /* ------------------------------------------------ gerbe : rayons en CSS */
  var gerbe = document.querySelector("[data-gerbe]");
  if (gerbe) {
    var total = 46;
    for (var i = 0; i < total; i += 1) {
      var rayon = document.createElement("i");
      var angle = -74 + (148 * i) / (total - 1);
      var longueur = 120 + Math.round(Math.abs(Math.cos((angle * Math.PI) / 180)) * 190);
      var teinte = i % 3 === 0 ? "#ffa319" : i % 3 === 1 ? "#533afd" : "#7f7dfc";
      rayon.style.height = longueur + "px";
      rayon.style.color = teinte;
      rayon.style.background = "linear-gradient(180deg, " + teinte + ", rgba(255,255,255,0))";
      rayon.style.transform = "rotate(" + angle + "deg) scaleY(.25)";
      rayon.setAttribute("data-angle", String(angle));
      gerbe.appendChild(rayon);
    }
    var deploie = function () {
      Array.prototype.forEach.call(gerbe.children, function (r, k) {
        var a = r.getAttribute("data-angle");
        differe(function () {
          r.style.transform = "rotate(" + a + "deg) scaleY(1)";
        }, reduit.matches ? 0 : k * 18);
      });
    };
    if ("IntersectionObserver" in window) {
      var vueGerbe = new IntersectionObserver(function (entrees, obs) {
        entrees.forEach(function (entree) {
          if (!entree.isIntersecting) return;
          entree.target.classList.add("est-visible");
          deploie();
          obs.unobserve(entree.target);
        });
      }, { threshold: 0.2 });
      vueGerbe.observe(gerbe);
      observateurs.push(vueGerbe);
    } else {
      gerbe.classList.add("est-visible");
      deploie();
    }
  }

  /* ------------------- arret propre : onglet masque ou page quittee */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") purge();
  });
  window.addEventListener("pagehide", function () {
    purge();
    observateurs.forEach(function (o) { o.disconnect(); });
    observateurs.length = 0;
  });
})();
