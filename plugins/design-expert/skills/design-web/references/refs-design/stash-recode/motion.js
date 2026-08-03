/* ═══════════════════════════════════════════════════════════════════════════
   MOUVEMENT — référence de design. Vanilla, sans framework ni build.

   TRAÇABILITÉ. La source ne contient NI @keyframes, NI
   animation-timeline, et une seule durée écrite en clair : les 150ms de
   `.landing-press button`. Tout son mouvement vient du runtime Framer Motion,
   illisible depuis le HTML livré. Ce qui EST lisible, et qui est donc [relevé] :
     · les états de départ, écrits dans les attributs `style` du HTML servi —
       `opacity:0;transform:translateY(16px)` sur les cinq enfants du héros,
       `opacity:0;transform:translateY(24px)` sur chaque bloc de section ;
     · le fait que ces deux distances soient DIFFÉRENTES et pas interchangeables ;
     · le fait que la zone de fil du panneau d'agent soit VIDE dans le HTML
       (`min-h-[320px] space-y-4 p-5` sans enfant) : son contenu est mis en
       scène par le runtime, donc joué et non affiché ;
     · le geste de pression, `transform: scale(0.96)` en 150ms.
   [arbitrage] = tout le reste : durées de révélation, courbes, seuils, pas de
   cascade. Aucune durée n'est en dur ici — elles viennent des variables CSS
   de :root, le CSS reste maître du timing.

   CONTRAT DE SÉCURITÉ. L'état de repos (`opacity: 0`) n'est armé que sous la
   classe `.js-motion`, et cette classe n'est posée qu'après vérification qu'on
   saura la lever. Script absent, IntersectionObserver indisponible ou mouvement
   réduit : le CSS ne cache rien, la page est intégralement lisible.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ─── 0 ▸ Préférence de mouvement ─────────────────────────────────────────
     `matches` pour le test instantané, `addEventListener('change')` pour le
     suivi — `addListener()` est déprécié. Un basculement en cours de session
     doit tout révéler, jamais tout cacher. [arbitrage] */
  var requeteCalme = matchMedia("(prefers-reduced-motion: reduce)");
  var calme = requeteCalme.matches;

  var montants = Array.prototype.slice.call(
    document.querySelectorAll("[data-monte], [data-reveal]")
  );
  var fils = Array.prototype.slice.call(document.querySelectorAll("[data-fil]"));
  var vigie = null;
  var minuteries = [];

  function toutAfficher() {
    montants.forEach(function (n) { n.classList.add("est-la"); });
    fils.forEach(function (n) { n.classList.add("est-la"); });
  }

  /* ─── 1 ▸ Cascade — le décalage est porté par une variable CSS ────────────
     `--i` est un INDEX, pas une durée : le pas (`--pas-cascade`) et la courbe
     restent dans la feuille de style. Trois familles cascadent : les cinq
     enfants du héros, les cellules d'une grille marquée `data-cascade`, et les
     messages du fil de l'agent. [arbitrage] intégral. */
  function indexer(parent, selecteur) {
    var enfants = selecteur
      ? parent.querySelectorAll(selecteur)
      : parent.children;
    Array.prototype.forEach.call(enfants, function (enfant, i) {
      enfant.style.setProperty("--i", i);
    });
  }

  document.querySelectorAll("[data-groupe-hero]").forEach(function (groupe) {
    indexer(groupe, "[data-monte]");
  });
  document.querySelectorAll("[data-cascade]").forEach(function (groupe) {
    indexer(groupe, "[data-reveal]");
  });
  fils.forEach(function (fil) {
    indexer(fil, "[data-message]");
  });

  /* ─── 2 ▸ Accordéon ───────────────────────────────────────────────────────
     Le HTML livre TOUS les panneaux ouverts (`aria-expanded="true"`, aucun
     `data-plie`). C'est délibéré : sans ce script, la FAQ reste entièrement
     lisible. Le script referme ici tout sauf le premier, puis prend la main.
     Une seule entrée ouverte à la fois — [relevé] : la source n'ouvre jamais
     deux réponses ensemble (`data-closed` sur les quatre items au repos). */
  var declencheurs = Array.prototype.slice.call(
    document.querySelectorAll(".pli__declencheur")
  );

  function plier(bouton, plie) {
    var panneau = document.getElementById(bouton.getAttribute("aria-controls"));
    if (!panneau) return;
    bouton.setAttribute("aria-expanded", plie ? "false" : "true");
    if (plie) panneau.setAttribute("data-plie", "");
    else panneau.removeAttribute("data-plie");
  }

  function armerAccordeon() {
    declencheurs.forEach(function (bouton, i) {
      plier(bouton, i !== 0);
      bouton.addEventListener("click", function () {
        var ouvert = bouton.getAttribute("aria-expanded") === "true";
        declencheurs.forEach(function (autre) { plier(autre, true); });
        if (!ouvert) plier(bouton, false);
      });
    });
  }

  /* ─── 3 ▸ Apparition au défilement ────────────────────────────────────────
     IntersectionObserver et NON `animation-timeline: view()` : non Baseline, et
     une keyframe partant d'`opacity:0` y laisserait les blocs DÉFINITIVEMENT
     invisibles en cas d'échec. Seuil 0.14 : révélé dès qu'un septième du bloc
     entre. rootMargin -10% en bas : la montée finit pendant que l'œil arrive.
     Chaque cible est désarmée dans le callback — une apparition ne se rejoue
     jamais, et l'observateur se vide de lui-même. [arbitrage] */
  function observer() {
    document.documentElement.classList.add("js-motion");

    vigie = new IntersectionObserver(function (entrees, self) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("est-la");
        self.unobserve(e.target);   /* le 2e paramètre EST l'observateur */
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });

    montants.forEach(function (n) {
      /* Le héros est déjà dans la fenêtre au chargement : il ne s'observe pas,
         il se joue tout de suite, en cascade. [relevé] la source distingue elle
         aussi une entrée de montage d'une entrée au défilement. */
      if (n.hasAttribute("data-monte")) return;
      vigie.observe(n);
    });
    fils.forEach(function (n) { vigie.observe(n); });

    /* Montage du héros : un tick pour que le navigateur ait peint l'état de
       repos, sinon la transition n'a pas lieu. */
    minuteries.push(requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll("[data-monte]").forEach(function (n) {
          n.classList.add("est-la");
        });
      });
    }));
  }

  /* ─── 4 ▸ Démarrage ───────────────────────────────────────────────────────
     Trois conditions pour armer : du contenu à révéler, pas de mouvement
     réduit, et un IntersectionObserver disponible. Sinon, tout est affiché. */
  if (montants.length && !calme && "IntersectionObserver" in window) {
    observer();
  } else {
    document.documentElement.classList.add("js-motion");
    toutAfficher();
  }
  armerAccordeon();

  requeteCalme.addEventListener("change", function (e) {
    calme = e.matches;
    if (calme) {
      demonter();
      toutAfficher();   /* ne jamais laisser un bloc caché derrière soi */
    }
  });

  /* ─── 5 ▸ Désarmement ─────────────────────────────────────────────────────
     `disconnect()` arrête TOUTES les cibles d'un coup, là où `unobserve(cible)`
     n'en vise qu'une : c'est la bonne primitive pour un nettoyage global.
     `visibilitychange` est le signal préférable pour annuler une frame en
     attente ; `pagehide` sert de repli pour le cas où l'onglet est fermé sans
     repasser par un état caché (et, sur iOS, quand la page part au cache
     bfcache sans jamais émettre `unload`). */
  function demonter() {
    if (vigie) { vigie.disconnect(); vigie = null; }
    minuteries.forEach(function (id) { cancelAnimationFrame(id); });
    minuteries = [];
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") demonter();
  });
  window.addEventListener("pagehide", demonter);

  /* ─── 6 ▸ Pression ────────────────────────────────────────────────────────
     [relevé] littéral de la source : `.landing-press button:active { transform:
     scale(0.96) }`, sur 150ms, en transitionnant transform, background-color,
     border-color, color et opacity. Le geste est écrit en CSS (`.bouton:active`)
     et pas ici — un `:active` piloté en JS rate le clavier et le tactile.
     Ce bloc ne fait donc qu'une chose que le CSS ne peut pas faire : rendre le
     geste également disponible à la barre d'espace sur un <a role=button>.
     Il n'y en a aucun sur cette page, la boucle est donc vide par construction
     et laissée en commentaire plutôt qu'en code mort. */

}());
