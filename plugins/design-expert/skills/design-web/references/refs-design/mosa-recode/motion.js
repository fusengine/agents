/* Sylva AI — comportements de page. IIFE unique, chargée en fin de body.
   Toute durée et toute courbe vivent dans styles.css ; ce fichier ne pose que
   des classes, des attributs et des positions de défilement. */
(function () {
  "use strict";

  var requeteMouvement = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mouvementReduit = requeteMouvement.matches;
  var observateurs = [];
  var cadre = 0;

  /* 1. En-tête : surface opaque dès que la page a défilé. */
  var entete = document.querySelector("[data-entete]");

  function majEntete() {
    cadre = 0;
    if (entete) entete.classList.toggle("est-collee", window.scrollY > 24);
  }

  function surDefilement() {
    if (cadre) return;
    cadre = window.requestAnimationFrame(majEntete);
  }

  window.addEventListener("scroll", surDefilement, { passive: true });
  majEntete();

  /* 2. Révélation au défilement. L'état de repos est posé par JS seulement,
     donc un script en échec laisse toute la page visible. */
  if (!mouvementReduit && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-mouvement");

    var revelables = document.querySelectorAll("[data-reveler]");
    var observateurRevele = new IntersectionObserver(function (entrees, observateur) {
      for (var i = 0; i < entrees.length; i++) {
        if (!entrees[i].isIntersecting) continue;
        entrees[i].target.classList.add("est-visible");
        observateur.unobserve(entrees[i].target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (var r = 0; r < revelables.length; r++) {
      var cible = revelables[r];
      var groupe = cible.closest("[data-reveler-groupe]");
      if (groupe) {
        var freres = groupe.querySelectorAll("[data-reveler]");
        var rang = Array.prototype.indexOf.call(freres, cible);
        cible.style.transitionDelay = Math.min(rang, 5) * 60 + "ms";
      }
      observateurRevele.observe(cible);
    }
    observateurs.push(observateurRevele);
  }

  /* 3. Étapes : la borne active suit l'étape au centre du cadre. */
  var etapes = document.querySelectorAll(".etape");
  if (etapes.length && "IntersectionObserver" in window) {
    var observateurEtapes = new IntersectionObserver(function (entrees) {
      for (var j = 0; j < entrees.length; j++) {
        if (!entrees[j].isIntersecting) continue;
        for (var k = 0; k < etapes.length; k++) {
          etapes[k].classList.toggle("etape--active", etapes[k] === entrees[j].target);
        }
      }
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    for (var e = 0; e < etapes.length; e++) observateurEtapes.observe(etapes[e]);
    observateurs.push(observateurEtapes);
  }

  /* 4. Onglets des cas d'usage. */
  var onglets = Array.prototype.slice.call(document.querySelectorAll(".onglet"));

  function choisirOnglet(onglet) {
    for (var i = 0; i < onglets.length; i++) {
      var actif = onglets[i] === onglet;
      onglets[i].setAttribute("aria-selected", actif ? "true" : "false");
      onglets[i].tabIndex = actif ? 0 : -1;
      var panneau = document.getElementById(onglets[i].getAttribute("aria-controls"));
      if (panneau) panneau.hidden = !actif;
    }
  }

  onglets.forEach(function (onglet, index) {
    onglet.addEventListener("click", function () { choisirOnglet(onglet); });
    onglet.addEventListener("keydown", function (evenement) {
      var pas = evenement.key === "ArrowRight" ? 1 : evenement.key === "ArrowLeft" ? -1 : 0;
      if (!pas) return;
      evenement.preventDefault();
      var suivant = onglets[(index + pas + onglets.length) % onglets.length];
      choisirOnglet(suivant);
      suivant.focus();
    });
  });

  /* 5. FAQ : un seul volet ouvert à la fois. */
  var accordeons = Array.prototype.slice.call(document.querySelectorAll(".accordeon"));
  accordeons.forEach(function (volet) {
    volet.addEventListener("toggle", function () {
      if (!volet.open) return;
      accordeons.forEach(function (autre) { if (autre !== volet) autre.open = false; });
    });
  });

  /* 6. Bascule mensuel / annuel. */
  var interrupteur = document.querySelector("[data-bascule-periode]");
  if (interrupteur) {
    interrupteur.addEventListener("click", function () {
      var annuel = interrupteur.getAttribute("aria-checked") !== "true";
      interrupteur.setAttribute("aria-checked", annuel ? "true" : "false");

      var motMois = document.querySelector("[data-periode-mois]");
      var motAn = document.querySelector("[data-periode-an]");
      if (motMois) motMois.classList.toggle("bascule-tarifs__mot--eteint", annuel);
      if (motAn) motAn.classList.toggle("bascule-tarifs__mot--eteint", !annuel);

      var prix = document.querySelectorAll("[data-prix]");
      for (var p = 0; p < prix.length; p++) {
        prix[p].textContent = prix[p].getAttribute(annuel ? "data-an" : "data-mois");
      }
    });
  }

  /* 7. Rail des témoignages. */
  var piste = document.querySelector("[data-rail-piste]");
  var precedent = document.querySelector("[data-rail-prec]");
  var suivant = document.querySelector("[data-rail-suiv]");

  function majCommandes() {
    if (!piste || !precedent || !suivant) return;
    var reste = piste.scrollWidth - piste.clientWidth;
    precedent.disabled = piste.scrollLeft <= 2;
    suivant.disabled = piste.scrollLeft >= reste - 2;
  }

  function glisser(sens) {
    if (!piste) return;
    var carte = piste.querySelector(".carte-avis");
    var pas = carte ? carte.getBoundingClientRect().width + 12 : piste.clientWidth * 0.8;
    piste.scrollBy({ left: sens * pas, behavior: mouvementReduit ? "auto" : "smooth" });
  }

  if (piste) {
    if (precedent) precedent.addEventListener("click", function () { glisser(-1); });
    if (suivant) suivant.addEventListener("click", function () { glisser(1); });
    piste.addEventListener("scroll", majCommandes, { passive: true });
    window.addEventListener("resize", majCommandes);
    majCommandes();
  }

  /* 8. Menu mobile. */
  var bascule = document.querySelector("[data-bascule-menu]");
  var menu = document.querySelector("[data-menu-mobile]");
  if (bascule && menu) {
    bascule.addEventListener("click", function () {
      var ouvert = bascule.getAttribute("aria-expanded") !== "true";
      bascule.setAttribute("aria-expanded", ouvert ? "true" : "false");
      menu.hidden = !ouvert;
    });
    menu.addEventListener("click", function (evenement) {
      if (evenement.target.tagName !== "A") return;
      bascule.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  }

  /* 9. Infolettre : accusé local, aucune requête réseau. */
  var lettre = document.querySelector("[data-lettre]");
  if (lettre) {
    lettre.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      var etat = lettre.querySelector("[data-lettre-etat]");
      if (etat) etat.textContent = "Thank you, you are on the list.";
      lettre.reset();
    });
  }

  /* 10. Désarmement. visibilitychange plutôt que unload, qui casse le
     bfcache ; pagehide sert de repli pour la seule frame en attente. */
  function desarmer() {
    if (document.visibilityState !== "hidden") return;
    if (cadre) { window.cancelAnimationFrame(cadre); cadre = 0; }
    while (observateurs.length) observateurs.pop().disconnect();
    window.removeEventListener("scroll", surDefilement);
  }

  document.addEventListener("visibilitychange", desarmer);
  window.addEventListener("pagehide", function () {
    if (cadre) { window.cancelAnimationFrame(cadre); cadre = 0; }
  });
})();
