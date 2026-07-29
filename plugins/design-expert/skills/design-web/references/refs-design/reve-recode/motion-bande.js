/* RÉFÉRENCE DE DESIGN — app.reve.com · bande dérivante (hero et galerie).
   [relevé] = mécanique lue dans la source · [arbitrage] = choix de l'auteur.

   Module isolé parce qu'un hook du dépôt plafonne chaque fichier à 200 lignes :
   c'est le seul comportement assez gros pour justifier son propre fichier, et
   le seul dont deux autres blocs (hero, galerie) dépendent. Chargé AVANT
   motion.js — l'ordre des `defer` est garanti — et exposé sur `window.RevBande`
   plutôt qu'en module ES, qui ne se charge pas depuis une URL `file://`.

   Commentaire de la source, qui dicte tout ce qui suit :
   « a marquee carousel of curated examples. The strip drifts on its own and
     loops seamlessly (app.ts wireHeroMarquee clones the card set once);
     visitors can grab it directly at any width, and the page scrolls past it
     like any other section. »
   ========================================================================== */
(() => {
  'use strict';

  /* [relevé] La source neutralise le mouvement en remettant ses 5 jetons de
     durée à 0s ; ce qui est piloté en JS l'est côté JS, même media query. */
  const mouvementReduit = matchMedia('(prefers-reduced-motion: reduce)');
  const auReglage = [];
  mouvementReduit.addEventListener('change', () =>
    auReglage.forEach((f) => f(mouvementReduit.matches)));

  const tous = (sel, racine = document) => Array.from(racine.querySelectorAll(sel));

  /**
   * Fait dériver une bande à défilement horizontal, en boucle sans couture,
   * sans jamais confisquer le contrôle à l'utilisateur.
   * @param {HTMLElement} bande conteneur en `overflow-x: auto`
   */
  function deriver(bande) {
    const vitesse = Number(bande.dataset.vitesse || 18); /* [arbitrage] px/s */
    const originaux = Array.from(bande.children);
    let largeurJeu = 0, suspendue = false, dernier = 0, boucle = 0;

    /* [relevé] « clones the card set once » — UNE seule duplication. Les clones
       sortent de l'arbre d'accessibilité et du parcours clavier : ce sont des
       doublons visuels destinés à masquer la couture, pas du contenu. */
    originaux.forEach((el) => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.clone = '';
      tous('[tabindex], a, button', clone).forEach((n) => n.setAttribute('tabindex', '-1'));
      bande.appendChild(clone);
    });

    /* La largeur d'un jeu se mesure, elle ne se suppose pas : les cartes ont des
       ratios différents, donc des largeurs différentes. Remesurée au redimensionnement. */
    const mesurer = () => {
      const ecart = parseFloat(getComputedStyle(bande).columnGap) || 0;
      largeurJeu = originaux.reduce(
        (total, el) => total + el.getBoundingClientRect().width + ecart, 0);
    };
    mesurer();
    new ResizeObserver(mesurer).observe(bande);

    /* [arbitrage] On ÉCRIT `scrollLeft` plutôt que d'appeler
       `scrollBy({behavior:'smooth'})` : cette API ne consulte jamais
       `prefers-reduced-motion` et, `behavior` omis, suit silencieusement la
       `scroll-behavior` CSS. Une écriture directe n'anime rien — le mouvement
       est produit image par image et s'arrête donc net quand on le demande. */
    const pas = (instant) => {
      if (!dernier) dernier = instant;
      const delta = (instant - dernier) / 1000;
      dernier = instant;
      if (!suspendue && largeurJeu > 0) {
        bande.scrollLeft += vitesse * delta;
        /* Bouclage sans couture : on retranche la largeur d'un jeu au lieu de
           revenir à 0 — la position visuelle est rigoureusement identique. */
        if (bande.scrollLeft >= largeurJeu) bande.scrollLeft -= largeurJeu;
      }
      boucle = requestAnimationFrame(pas);
    };
    const demarrer = () => {
      if (!boucle) { dernier = 0; boucle = requestAnimationFrame(pas); }
    };
    const arreter = () => {
      if (boucle) { cancelAnimationFrame(boucle); boucle = 0; }
    };

    /* Toute interaction suspend la dérive. `pointer*` couvre souris, tactile et
       stylet ; `focus*` couvre la navigation clavier ; `wheel` le trackpad. */
    const gel = () => { suspendue = true; };
    const degel = () => { suspendue = false; };
    ['pointerenter', 'focusin'].forEach((t) => bande.addEventListener(t, gel));
    ['pointerleave', 'focusout'].forEach((t) => bande.addEventListener(t, degel));
    bande.addEventListener('wheel', gel, { passive: true });

    /* [relevé] « visitors can GRAB it directly at any width ». Un conteneur en
       `overflow-x: auto` se défile au trackpad et au doigt, mais PAS en le
       tirant à la souris : ce geste-là doit être posé. La capture du pointeur
       permet de continuer à tirer même quand le curseur sort de la bande, et
       `pointercancel` évite de rester bloqué en état saisi. */
    let xDepart = null, scrollDepart = 0;
    bande.addEventListener('pointerdown', (evenement) => {
      gel();
      xDepart = evenement.clientX;
      scrollDepart = bande.scrollLeft;
      bande.setPointerCapture(evenement.pointerId);
      bande.classList.add('est-saisie');
    });
    bande.addEventListener('pointermove', (evenement) => {
      if (xDepart === null) return;
      bande.scrollLeft = scrollDepart - (evenement.clientX - xDepart);
    });
    const relacher = () => {
      if (xDepart === null) return;
      xDepart = null;
      bande.classList.remove('est-saisie');
      degel();
    };
    ['pointerup', 'pointercancel'].forEach((t) => bande.addEventListener(t, relacher));

    /* [arbitrage] Hors écran, la boucle d'animation est libérée : faire tourner
       un `requestAnimationFrame` sur une bande invisible ne sert à rien. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entrees) => entrees.forEach((e) =>
        (e.isIntersecting && !mouvementReduit.matches ? demarrer() : arreter())
      ), { rootMargin: '100px' }).observe(bande);
    } else if (!mouvementReduit.matches) {
      demarrer();
    }

    /* Mouvement réduit : la dérive s'arrête, la bande reste manipulable. */
    auReglage.push((reduit) => (reduit ? arreter() : demarrer()));
    if (mouvementReduit.matches) arreter();
  }

  window.RevBande = { deriver, mouvementReduit };
})();
