/* =============================================================================
   motion.js — noyau des comportements d'interface de la référence cursor.com
   JS vanilla : aucun framework, aucun CDN, aucune étape de build.

   [relevé] = lu dans la source · [arbitrage] = choix de cette référence

   La source n'embarque AUCUNE bibliothèque d'animation : tout son mouvement est
   en CSS natif, son JS ne fait que poser des classes et des attributs. Ces
   fichiers suivent la même règle — ils ne calculent aucune position,
   n'interpolent aucune valeur, ne touchent à aucun style de mouvement. Ils
   commutent des états ; le CSS anime.

   CHARGEMENT — trois scripts `defer`, dans cet ordre :
     motion.js  →  motion-nav.js  →  motion-scroll.js
   `defer` s'exécute après le parse complet du DOM, avant DOMContentLoaded, et
   GARANTIT l'ordre entre scripts différés : aucun écouteur d'attente n'est
   requis, et les deux modules trouvent toujours ce noyau déjà en place.
   Le partage se fait par un objet global unique plutôt que par des modules ES :
   sur `file://`, l'origine est opaque et tout `import` échoue.   [arbitrage]
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     PRÉFÉRENCE DE MOUVEMENT
     Piège central : `scrollBy({behavior:'smooth'})` ne consulte JAMAIS
     `prefers-reduced-motion` tout seul. Contrairement aux animations CSS,
     l'API de défilement JS ignore la préférence — il faut la lire soi-même et
     forcer 'instant'. On garde une MediaQueryList vivante et on écoute
     'change' : `addListener()` est déprécié.                    [arbitrage]
  ---------------------------------------------------------------------------*/
  var mqMouvement = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mouvementReduit = mqMouvement.matches;
  mqMouvement.addEventListener('change', function (e) { mouvementReduit = e.matches; });

  /* --------------------------------------------------------------------------
     REGISTRE DE FERMETURE
     Tous les panneaux de la page (flyouts d'entête, sélecteur de langue)
     s'enregistrent ici. Un seul écouteur Échap et un seul écouteur de clic
     extérieur suffisent alors pour l'ensemble, au lieu d'un par composant.
  ---------------------------------------------------------------------------*/
  var fermetures = [];

  /**
   * Ferme tous les panneaux enregistrés.
   * @param {Function|null} sauf Fermeture à ne PAS déclencher (le panneau
   *        qu'on est en train d'ouvrir), ou null pour tout fermer.
   */
  function toutFermer(sauf) {
    fermetures.forEach(function (f) { if (f !== sauf) f(); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toutFermer(null);
  });
  document.addEventListener('click', function (e) {
    // Un clic hors de tout groupe à panneau referme l'ensemble.
    if (!e.target.closest('[data-flyout], .nav__panneau, [data-langue]')) {
      toutFermer(null);
    }
  });

  /* --------------------------------------------------------------------------
     SURFACE PARTAGÉE
  ---------------------------------------------------------------------------*/
  window.CursorMotion = {
    /**
     * Préférence de mouvement, LUE À CHAQUE APPEL — jamais mise en cache par
     * l'appelant : l'utilisateur peut la changer en cours de session.
     * @returns {boolean} true si le mouvement doit être réduit.
     */
    mouvementReduit: function () { return mouvementReduit; },

    /**
     * Comportement de défilement à passer à `scrollBy`/`scrollTo`. Toujours
     * explicite : omis, `behavior` vaut 'auto' et suivrait la
     * `scroll-behavior` CSS sans jamais passer par ce test.
     * @returns {'instant'|'smooth'}
     */
    comportementScroll: function () { return mouvementReduit ? 'instant' : 'smooth'; },

    /**
     * Enregistre une fonction de fermeture de panneau.
     * @param {Function} fn Ferme le panneau et remet son état ARIA à false.
     */
    enregistrerFermeture: function (fn) { fermetures.push(fn); },

    /**
     * Ferme tous les panneaux sauf celui passé en argument.
     * @param {Function|null} sauf
     */
    toutFermer: toutFermer
  };
})();
