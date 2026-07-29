/* =============================================================
   motion.js — comportements d'interface de la référence x.ai
   JS vanilla : aucun framework, aucun CDN, aucun build.
   [relevé] = lu dans la source · [arbitrage] = choix assumé.
   PRINCIPE — ce fichier ne calcule AUCUNE valeur d'animation : il pose
   classes, attributs et éléments, le CSS interpole. Comme la source.
   ============================================================= */
(function () {
  "use strict";

  /* §0 MOUVEMENT RÉDUIT — les API de scroll JS ne l'appliquent PAS
     seules ; `addListener()` est deprecated → `change`. */
  var requeteMouvement = matchMedia("(prefers-reduced-motion: reduce)");
  var mouvementReduit = requeteMouvement.matches;
  requeteMouvement.addEventListener("change", function (e) { mouvementReduit = e.matches; });

  /** @returns {ScrollBehavior} omettre `behavior` suivrait la CSS. */
  function comportementDefilement() { return mouvementReduit ? "instant" : "smooth"; }

  /* §1 CADENCES — [relevé] état de départ inline sur CHAQUE ligne du
     terminal (opacity:0; translateY(6px)) et chaque bulle (dont
     l'arrivée `filter:blur(0px)` trahit un flou au départ).
     @param {string} selecteur conteneurs dont les enfants sont cadencés */
  function cadencer(selecteur) {
    document.querySelectorAll(selecteur).forEach(function (groupe) {
      Array.prototype.forEach.call(groupe.children, function (n, rang) {
        n.style.setProperty("--i", String(rang));
      });
    });
  }
  cadencer("[data-terminal]");
  cadencer("[data-bulles]");

  /* §2 RÉVÉLATIONS — [relevé] départ inline (opacity:0; translateY(45%)
     rotateX(-40deg)), levé par le JS source. IO : dispo depuis 2019. */
  var cibles = document.querySelectorAll("[data-reveler]");

  /** Force l'état final sans transition — repli et mouvement réduit. */
  function revelerTout() {
    cibles.forEach(function (n) { n.classList.add("est-visible"); });
  }

  if (mouvementReduit || !("IntersectionObserver" in window)) {
    revelerTout();
  } else {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add("est-visible");
        observateur.unobserve(entree.target);   /* une révélation ne se rejoue pas */
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });  /* [arbitrage] */
    cibles.forEach(function (n) { observateur.observe(n); });
  }

  /* §2 EN-TÊTE ─ [relevé] le filet est un <div class="h-px bg-border/50">
     à `style="opacity:0"` au repos, l'en-tête portant `duration-200`. Le
     JS ne pose qu'un attribut d'état : la transition d'opacité de 200 ms
     est écrite en CSS. Écouteur passif + throttle rAF. */
  var entete = document.getElementById("entete");
  var enAttente = false;

  function majEntete() {
    entete.toggleAttribute("data-colle", window.scrollY > 8);  /* [arbitrage] seuil */
  }

  if (entete) {
    majEntete();
    addEventListener("scroll", function () {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(function () { majEntete(); enAttente = false; });
    }, { passive: true });
  }

  /* §3 ONGLETS ─ [relevé] placés SOUS la fenêtre, pas dans sa barre ;
     leur seul changement d'état est une couleur (`text-secondary` →
     `text-primary`, transition-colors sans durée → défaut 150 ms). Le JS
     ne touche qu'à `aria-selected` et `hidden` ; la couleur suit par
     sélecteur d'attribut CSS.
     @param {HTMLElement} onglet onglet à activer */
  function activerOnglet(onglet) {
    onglet.closest('[role="tablist"]')
      .querySelectorAll('[role="tab"]').forEach(function (autre) {
        var actif = autre === onglet;
        autre.setAttribute("aria-selected", String(actif));
        var panneau = document.getElementById(autre.getAttribute("aria-controls"));
        if (panneau) panneau.hidden = !actif;
      });
  }

  document.querySelectorAll('[role="tab"]').forEach(function (onglet) {
    onglet.addEventListener("click", function () { activerOnglet(onglet); });
    onglet.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var freres = Array.prototype.slice.call(
        onglet.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
      var pas = e.key === "ArrowRight" ? 1 : -1;
      var suivant = freres[(freres.indexOf(onglet) + pas + freres.length) % freres.length];
      suivant.focus(); activerOnglet(suivant); e.preventDefault();
    });
  });

  /* §4 COMPTEURS — [relevé] la source monte un composant à shadow DOM
     faisant défiler chaque chiffre derrière un masque de .25em.
     [arbitrage] décompte simple ; la valeur finale est déjà dans le HTML.
     @param {HTMLElement} noeud élément portant data-compteur */
  var DUREE_COMPTEUR = 1400;  /* [arbitrage] */

  function animerCompteur(noeud) {
    var cible = parseFloat(noeud.dataset.compteur);
    if (!isFinite(cible) || cible === 0) return;
    var debut = performance.now();
    (function pas(maintenant) {
      var t = Math.min((maintenant - debut) / DUREE_COMPTEUR, 1);
      /* décélération cubique, comme la courbe de sortie du CSS */
      noeud.textContent = String(Math.round(cible * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(pas);
    })(performance.now());
  }

  if (!mouvementReduit && "IntersectionObserver" in window) {
    var vigie = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        animerCompteur(entree.target); vigie.unobserve(entree.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-compteur]").forEach(function (n) { vigie.observe(n); });
  }

  /* §5 CE QUE LA SOURCE PEINT EN JS — deux conteneurs du snapshot sont
     VIDES ; le CSS dit quoi reconstruire : carte « Voice » + `@keyframes
     waveform` (.4×↔1×), balayage du bandeau + `gridShimmerH` (-45→145cqw).
     Le JS crée les éléments, il n'en anime aucun. */
  var NB_BARRES = 38;  /* [arbitrage] non relevable */

  document.querySelectorAll("[data-onde]").forEach(function (conteneur) {
    for (var i = 0; i < NB_BARRES; i++) {
      var barre = document.createElement("i");
      var enveloppe = Math.sin((i / (NB_BARRES - 1)) * Math.PI);  /* haute au centre */
      var hauteur = (14 + enveloppe * 78).toFixed(1) + "px";      /* [arbitrage] */
      barre.style.setProperty("--bar-h", hauteur);
      barre.style.animationDelay = (-(i % 7) * 0.11).toFixed(2) + "s";  /* [arbitrage] */
      /* Sous `reduce` l'onde est dessinée FIGÉE : lisible, immobile. */
      if (mouvementReduit) barre.style.height = hauteur;
      conteneur.appendChild(barre);
    }
  });

  document.querySelectorAll("[data-balayage]").forEach(function (conteneur) {
    if (mouvementReduit) return;   /* rien à faire défiler sous `reduce` */
    conteneur.appendChild(document.createElement("i"));
  });

  /* §6 CANVAS — [relevé] un `<canvas>` 173×32 tient lieu de mot-symbole,
     VIDE dans le snapshot : le tracé n'est pas déductible, le procédé
     l'est — un rendu différé révélé par une opacité en 300 ms.
     Le déclencheur est doublé d'un plancher de temps : si la police
     distante ne répond jamais, `fonts.ready` ne se résout pas et le
     mot-symbole resterait invisible À VIE. Un état de repos invisible
     ne doit JAMAIS dépendre d'une seule promesse réseau. */
  var marque = document.getElementById("marque");
  if (marque) {
    marque.style.opacity = "0";
    marque.style.transition = "opacity 300ms var(--c-standard, ease)";
    var reveler = function () { marque.style.opacity = "1"; };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reveler);
    setTimeout(reveler, 900);   /* [arbitrage] plancher, quoi qu'il arrive */
  }
  /* §7 VOLET — [relevé] sous 1100px la source échange ses commandes. */
  var burger = document.getElementById("burger"), volet = document.getElementById("volet");
  if (burger && volet) {
    burger.addEventListener("click", function () {
      var ouvert = !volet.hidden;
      volet.hidden = ouvert;
      burger.setAttribute("aria-expanded", String(!ouvert));
      burger.setAttribute("aria-label", ouvert ? "Open menu" : "Close menu");
    });
  }
  /* §8 « COPY » — [relevé] largeur réservée, deux libellés empilés : la
     bascule ne décale rien. @param {HTMLElement} bouton [data-copier] */
  function brancherCopie(bouton) {
    var etiquette = bouton.querySelector("[data-copier-txt]"), minuteur = 0;
    bouton.addEventListener("click", function () {
      var pre = bouton.closest(".fenetre-code").querySelector("pre:not([hidden])");
      if (!pre || !navigator.clipboard || !etiquette) return;
      navigator.clipboard.writeText(pre.innerText).then(function () {
        etiquette.textContent = "Copied";
        clearTimeout(minuteur);
        minuteur = setTimeout(function () { etiquette.textContent = "Copy"; }, 1600);
      }, function () { /* permission refusée : ne rien afficher de faux */ });
    });
  }
  document.querySelectorAll("[data-copier]").forEach(brancherCopie);
  window.reference = { mouvementReduit: function () { return mouvementReduit; },
    comportementDefilement: comportementDefilement, revelerTout: revelerTout };
})();
