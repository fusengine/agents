/* =============================================================================
   motion-scroll.js — défilement : révélations, carrousels, boucles d'ambiance
   Dépend de `window.CursorMotion` (motion.js), chargé avant en `defer`.

   [relevé] = lu dans la source · [arbitrage] = choix de cette référence
   ========================================================================== */

(function () {
  'use strict';

  var noyau = window.CursorMotion;
  if (!noyau) return;

  /* --------------------------------------------------------------------------
     1. RÉVÉLATION AU DÉFILEMENT — le seul effet d'apparition du site
       @keyframes gallery-marquee-item-slide-up
         {0%{opacity:0;transform:translateY(25%)} to{opacity:1;transform:translate(0)}}
       animation : 1s var(--ease-out-spring) both                   [relevé] M

     Déclencheur : IntersectionObserver. Surtout PAS `animation-timeline:view()`,
     qui n'est pas « widely available » : là où il manque, une keyframe qui
     démarre à opacity:0 laisserait l'élément invisible pour de bon.

     Le masquage n'est PAS posé par ce fichier. La feuille déclare l'animation
     en `animation-play-state:paused`, ce qui fige l'élément sur son image de
     départ ; le JS ne fait que LEVER la pause via `.est-visible`. Conséquence
     capitale : si ce script ne tourne jamais, la règle `@media (scripting:none)`
     de la feuille remet l'animation en marche et la page se révèle seule.
     Aucun élément ne peut rester invisible faute de JS.

     Filet supplémentaire, absent de la source : si `IntersectionObserver`
     manque, on pose `data-intro="true"` sur <html> et tout se débloque d'un
     coup — la feuille a une règle pour ce cas.                    [arbitrage]

     `threshold:0.15` et la marge NÉGATIVE en bas (qui rétrécit la zone de
     déclenchement, pour que l'élément soit franchement entré avant de
     s'animer) sont des                                           [arbitrage].
     `unobserve` après le premier passage : l'effet ne se rejoue pas au retour.
  ---------------------------------------------------------------------------*/
  (function revelations() {
    var cibles = document.querySelectorAll('[data-revele]');
    if (!cibles.length) return;

    if (!('IntersectionObserver' in window)) {
      document.documentElement.setAttribute('data-intro', 'true');
      return;
    }

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add('est-visible');
        observateur.unobserve(entree.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    /* On n'arme la pause QU'UNE FOIS l'observateur construit, et juste avant de
       lui confier les cibles. Tant que `data-js` n'est pas posé, la feuille
       laisse l'animation se jouer : un script absent, bloqué par le réseau ou
       en erreur ne peut donc pas laisser la page vide. L'ordre de ces deux
       lignes EST le garde-fou — masquer avant de savoir observer rouvrirait
       exactement le trou qu'on vient de boucher.                 [arbitrage] */
    document.documentElement.setAttribute('data-js', '');
    cibles.forEach(function (el) { observateur.observe(el); });
  })();

  /* --------------------------------------------------------------------------
     2. CARROUSELS À ANCRAGE
     La piste défile nativement (`overflow-x:auto` + `scroll-snap-type:x
     mandatory` [relevé] H). Le JS n'ajoute que deux boutons de défilement,
     absents de la source, qui s'en remet au geste tactile.       [arbitrage]

     Deux précautions : `behavior` toujours explicite (le noyau lit
     `prefers-reduced-motion` lui-même) ; et `scroll-snap-type:x mandatory`
     combiné à un `scrollBy` fluide peut être interrompu et re-ancré par le
     navigateur en cours d'animation (surtout Safari) — c'est attendu, pas un
     bug : on ne le contre pas, on recalcule l'état des boutons après coup.
  ---------------------------------------------------------------------------*/
  (function carrousels() {
    document.querySelectorAll('[data-piste-cadre]').forEach(function (cadre) {
      var piste = cadre.querySelector('[data-piste]');
      var prec  = cadre.querySelector('[data-piste-prec]');
      var suiv  = cadre.querySelector('[data-piste-suiv]');
      if (!piste || !prec || !suiv) return;

      /** Largeur d'un saut : une carte + une gouttière. Mesurée sur le DOM
       *  plutôt que recalculée depuis la formule de grille — celle-ci vit dans
       *  le CSS et n'a pas à être dupliquée ici. `columnGap` peut valoir
       *  'normal' sans gap déclaré, d'où le repli sur 0.        [arbitrage]
       *  @returns {number} Distance de défilement en pixels. */
      function pas() {
        var item = piste.querySelector('.piste__item');
        var rail = piste.querySelector('.piste__rail');
        if (!item || !rail) return piste.clientWidth;
        var gouttiere = parseFloat(getComputedStyle(rail).columnGap) || 0;
        return item.getBoundingClientRect().width + gouttiere;
      }

      /** Grise le bouton qui ne mène plus nulle part. */
      function majBoutons() {
        var max = piste.scrollWidth - piste.clientWidth;
        // Tolérance d'1px : les largeurs fractionnaires ne retombent pas juste.
        prec.disabled = piste.scrollLeft <= 1;
        suiv.disabled = piste.scrollLeft >= max - 1;
      }

      /** @param {number} sens -1 vers la gauche, +1 vers la droite. */
      function defiler(sens) {
        piste.scrollBy({ left: sens * pas(), behavior: noyau.comportementScroll() });
      }

      prec.addEventListener('click', function () { defiler(-1); });
      suiv.addEventListener('click', function () { defiler(1); });

      // Le défilement émet beaucoup d'événements : on les regroupe sur une
      // frame. `passive:true` promet de ne pas appeler preventDefault, ce qui
      // dispense le navigateur d'attendre cet écouteur.
      var enAttente = false;
      piste.addEventListener('scroll', function () {
        if (enAttente) return;
        enAttente = true;
        requestAnimationFrame(function () { enAttente = false; majBoutons(); });
      }, { passive: true });

      window.addEventListener('resize', majBoutons, { passive: true });
      majBoutons();
    });
  })();

  /* --------------------------------------------------------------------------
     3. BOUCLES D'AMBIANCE DES DÉMOS
     Pastilles d'état, barres d'activité et chatoiements tournent en boucle
     infinie (2.5s à 2.8s [relevé] M). Les laisser tourner hors écran fait
     travailler le compositeur pour rien. `animationPlayState` met en pause SANS
     remettre à zéro : la boucle reprend où elle s'était arrêtée, sans saut
     visible. Sous mouvement réduit, le CSS a déjà coupé ces animations — on ne
     touche alors à rien, pour ne pas ressusciter en JS ce que le CSS a éteint.
  ---------------------------------------------------------------------------*/
  (function boucles() {
    if (noyau.mouvementReduit() || !('IntersectionObserver' in window)) return;
    var scenes = document.querySelectorAll('[data-boucle]');
    if (!scenes.length) return;

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        var etat = entree.isIntersecting ? 'running' : 'paused';
        entree.target.querySelectorAll('.pastille, .barres i, .chatoie')
          .forEach(function (el) { el.style.animationPlayState = etat; });
      });
    }, { threshold: 0 });

    scenes.forEach(function (s) { observateur.observe(s); });
  })();
})();
