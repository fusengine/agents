/* =============================================================================
   motion-nav.js — navigation : panneau mobile, flyouts d'entête, langue
   Dépend de `window.CursorMotion` (motion.js), chargé juste avant en `defer`.

   [relevé] = lu dans la source · [arbitrage] = choix de cette référence
   ========================================================================== */

(function () {
  'use strict';

  var noyau = window.CursorMotion;
  if (!noyau) return;   // motion.js absent : on ne casse rien, on s'abstient.

  /* --------------------------------------------------------------------------
     1. NAVIGATION MOBILE
     La source pose un attribut et laisse la transition d'opacité au CSS,
     déclarée en style INLINE sur l'élément :
       transition:opacity var(--duration) var(--ease-out-spring)      [relevé] H
     Le verrouillage du défilement de fond et le renvoi du focus sont des
     ajouts d'accessibilité.                                      [arbitrage]
  ---------------------------------------------------------------------------*/
  (function navigationMobile() {
    var panneau = document.querySelector('[data-nav-mobile]');
    var ouvrir  = document.querySelector('[data-nav-ouvrir]');
    var fermer  = document.querySelector('[data-nav-fermer]');
    if (!panneau || !ouvrir || !fermer) return;

    var pousses = panneau.querySelectorAll('[data-panneau]');

    /** Referme tous les panneaux poussés et remet leurs boutons à false. */
    function refermerPousses() {
      pousses.forEach(function (p) {
        p.dataset.ouvert = 'false';
        p.setAttribute('aria-hidden', 'true');
      });
      panneau.querySelectorAll('[data-sous-menu]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
    }

    /**
     * Ouvre ou ferme le panneau plein écran.
     * @param {boolean} ouvert
     */
    function basculer(ouvert) {
      panneau.dataset.ouvert = ouvert ? 'true' : 'false';
      ouvrir.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      document.documentElement.style.overflow = ouvert ? 'hidden' : '';
      if (!ouvert) refermerPousses();
      (ouvert ? fermer : ouvrir).focus();
    }

    ouvrir.addEventListener('click', function () {
      basculer(panneau.dataset.ouvert !== 'true');
    });
    fermer.addEventListener('click', function () { basculer(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || panneau.dataset.ouvert !== 'true') return;
      // Échap referme d'abord le sous-panneau, ensuite seulement le menu.
      if (panneau.querySelector('[data-panneau][data-ouvert="true"]')) refermerPousses();
      else basculer(false);
    });

    // Un clic sur un LIEN referme le panneau avant la navigation. Les boutons
    // de sous-menu, eux, ne doivent surtout pas le refermer.
    panneau.addEventListener('click', function (e) {
      if (e.target.closest('a')) basculer(false);
    });

    /* Sous-menus poussés. Le caret de la source est « → », pas « ↓ » : le
       mobile POUSSE un panneau latéral, il ne déplie pas vers le bas. La source
       les rend côté client — ils sont absents du HTML aspiré, seuls les boutons
       `aria-expanded="false"` et leur caret subsistent. [relevé] H [arbitrage] */
    panneau.querySelectorAll('[data-sous-menu]').forEach(function (bouton) {
      bouton.addEventListener('click', function () {
        var cible = panneau.querySelector(
          '[data-panneau="' + bouton.dataset.sousMenu + '"]'
        );
        if (!cible) return;
        refermerPousses();
        cible.dataset.ouvert = 'true';
        cible.setAttribute('aria-hidden', 'false');
        bouton.setAttribute('aria-expanded', 'true');
        var retour = cible.querySelector('[data-retour]');
        if (retour) retour.focus();
      });
    });

    panneau.querySelectorAll('[data-retour]').forEach(function (retour) {
      retour.addEventListener('click', function () {
        var parent = retour.closest('[data-panneau]');
        refermerPousses();
        var origine = panneau.querySelector(
          '[data-sous-menu="' + (parent && parent.dataset.panneau) + '"]'
        );
        if (origine) origine.focus();
      });
    });

    // Cascade d'entrée : `navItemSlideIn .25s var(--ease-out-spring) forwards`,
    // amplitude 4px [relevé] M. Le décalage entre items est posé en JS dans la
    // source, donc illisible dans son CSS : on l'expose en `--rang`, que la
    // feuille multiplie par 30ms.                               [arbitrage]
    panneau.querySelectorAll('.nav-item-animate').forEach(function (el, i) {
      el.style.setProperty('--rang', i);
    });
  })();

  /* --------------------------------------------------------------------------
     2. FLYOUTS D'ENTÊTE
     Le CSS ouvre déjà les panneaux au `:hover` et au `:focus-within` — c'est le
     procédé exact de la source, qui n'a AUCUN JS pour ces menus sur desktop.
     Ce bloc ne sert qu'aux pointeurs SANS survol (tactile), où `:hover` est
     simulé puis collant : un clic sur le chevron pose `aria-expanded`, et le
     CSS ouvre sur cet attribut.                                  [arbitrage]
  ---------------------------------------------------------------------------*/
  (function flyouts() {
    document.querySelectorAll('[data-flyout]').forEach(function (chevron) {
      function fermerCelui() { chevron.setAttribute('aria-expanded', 'false'); }
      noyau.enregistrerFermeture(fermerCelui);

      chevron.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var ouvert = chevron.getAttribute('aria-expanded') === 'true';
        noyau.toutFermer(fermerCelui);
        chevron.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      });
    });
  })();

  /* --------------------------------------------------------------------------
     3. SÉLECTEUR DE LANGUE
     Même procédé que les flyouts, mais le panneau s'ouvre vers le HAUT
     (`bottom-full`) : seul le CSS le sait, le JS ne fait que commuter l'état.
  ---------------------------------------------------------------------------*/
  (function selecteurLangue() {
    var groupe = document.querySelector('[data-langue]');
    if (!groupe) return;
    var bouton = groupe.querySelector('[data-langue-bouton]');
    if (!bouton) return;

    function fermerCelui() {
      bouton.setAttribute('aria-expanded', 'false');
      groupe.dataset.ouvert = 'false';
    }
    noyau.enregistrerFermeture(fermerCelui);

    bouton.addEventListener('click', function (e) {
      e.stopPropagation();
      var ouvert = bouton.getAttribute('aria-expanded') === 'true';
      noyau.toutFermer(fermerCelui);
      bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      groupe.dataset.ouvert = ouvert ? 'false' : 'true';
    });

    // Sélectionner une langue met à jour l'état ARIA de la liste entière.
    var options = groupe.querySelectorAll('.langue__option');
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        option.setAttribute('aria-selected', 'true');
        fermerCelui();
        bouton.focus();
      });
    });
  })();
})();
