/* =============================================================
   umbrel-recode — motion.js
   Tout le comportement d'interface de la page, en JS vanilla.

   Pourquoi ce fichier existe : la source ne contient AUCUN @keyframes
   et AUCUNE règle :hover dans ses feuilles de style, alors que 50
   `:hover` sont référencés dans son HTML. Tout son mouvement est
   piloté par le runtime Framer. Il n'est donc pas relevable — il est
   réécrit ici à la main, et les valeurs de timing sont marquées
   [arbitrage] sauf mention contraire.

     1. Garde        — prefers-reduced-motion, lu une seule fois
     2. Apparitions  — IntersectionObserver, avec repli sans JS
     3. Carrousel    — scroll-snap piloté aux chevrons et au clavier
     4. Marquee      — pause au survol et au focus
   ============================================================= */
(function () {
  'use strict';

  /* --- 1. Garde -----------------------------------------------
     Une seule lecture, partagée par tous les blocs. Si l'utilisateur
     a demandé moins de mouvement, on ne pose ni état masqué ni
     défilement animé : le CSS neutralise déjà les animations, ce
     drapeau évite en plus de les mettre en place. */
  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- 2. Apparitions au défilement ----------------------------
     Le piège de la source : 27 de ses éléments portent un état
     initial `opacity: 0.001` écrit EN DUR dans le HTML. Quand son
     runtime ne tourne pas, la page reste vide pour toujours.

     La parade tient en une ligne : c'est CE script qui pose la classe
     `.js` sur <html>, et le CSS ne masque que sous cette classe. Sans
     JavaScript — ou en mouvement réduit — rien n'est jamais caché.

     IntersectionObserver plutôt que `animation-timeline: view()` :
     ce dernier n'est pas Baseline, et sans support une image clé
     partant de `opacity: 0` laisserait l'élément invisible pour
     toujours — le défaut qu'on cherche justement à éviter. */
  function installerApparitions() {
    var cibles = document.querySelectorAll('[data-reveal]');
    if (!cibles.length) return;
    if (mouvementReduit.matches || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js');

    var vigie = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (!entree.isIntersecting) return;
        entree.target.classList.add('est-visible');
        vigie.unobserve(entree.target);   // une seule fois, pas d'aller-retour
      });
    }, {
      // Déclenchement un peu avant que l'élément atteigne le bas du
      // viewport : l'animation est finie quand il arrive à hauteur
      // d'œil. Une marge NÉGATIVE rétrécit la zone d'observation.
      rootMargin: '0px 0px -12% 0px',     // [arbitrage]
      threshold: 0.05
    });

    cibles.forEach(function (cible) { vigie.observe(cible); });
  }

  /* --- 3. Carrousel « superpowers » ----------------------------
     Le rail est un conteneur `overflow-x: auto` avec
     `scroll-snap-type: x mandatory` : défilement natif, tactile et
     molette fonctionnent déjà sans une ligne de JS. Ce bloc n'ajoute
     que ce que le CSS ne sait pas faire — piloter le rail depuis les
     chevrons, et savoir quelle carte occupe le centre.

     Le pas n'est pas une constante : il se mesure sur la carte
     réelle, largeur + gouttière. Une valeur en dur casserait au
     premier changement de format. */
  function installerCarrousel() {
    var rail = document.querySelector('.rail');
    if (!rail) return;

    var cartes = rail.querySelectorAll('.pouvoir');
    if (cartes.length < 2) return;

    /** Largeur d'un pas : la carte plus la gouttière qui la suit. */
    function pas() {
      var boite = cartes[0].getBoundingClientRect();
      var gouttiere = parseFloat(getComputedStyle(rail).columnGap) || 0;
      return boite.width + gouttiere;
    }

    /** Défile d'une carte. `sens` vaut -1 ou 1. */
    function avancer(sens) {
      rail.scrollBy({
        left: sens * pas(),
        // Le lissage est un mouvement : il se désactive avec le reste.
        behavior: mouvementReduit.matches ? 'auto' : 'smooth'
      });
    }

    // Les chevrons deviennent de vrais contrôles : ils n'étaient
    // décoratifs que faute de JavaScript.
    var chevrons = document.querySelectorAll('.carrousel__fleche');
    Array.prototype.forEach.call(chevrons, function (chevron) {
      chevron.setAttribute('role', 'button');
      chevron.setAttribute('tabindex', '0');
      chevron.removeAttribute('aria-hidden');

      // Les libellés accessibles sont du CONTENU : ils suivent la langue
      // du document (<html lang="en">), pas celle des commentaires.
      var versLaDroite = chevron.classList.contains('carrousel__fleche--d');
      chevron.setAttribute('aria-label',
        versLaDroite ? 'Next card' : 'Previous card');

      chevron.addEventListener('click', function () {
        avancer(versLaDroite ? 1 : -1);
      });
      chevron.addEventListener('keydown', function (evenement) {
        if (evenement.key !== 'Enter' && evenement.key !== ' ') return;
        evenement.preventDefault();
        avancer(versLaDroite ? 1 : -1);
      });
    });

    // Flèches du clavier quand le rail a le focus. Un conteneur
    // focalisable DOIT être annoncé : `tabindex` seul donne un arrêt
    // de tabulation muet (WCAG 4.1.2). `role="group"` + un nom qui dit
    // aussi comment naviguer.
    rail.setAttribute('role', 'group');
    rail.setAttribute('aria-label',
      'What you can do with umbrelOS — use the left and right arrow keys to browse');
    rail.setAttribute('tabindex', '0');
    rail.addEventListener('keydown', function (evenement) {
      if (evenement.key === 'ArrowRight') { evenement.preventDefault(); avancer(1); }
      if (evenement.key === 'ArrowLeft')  { evenement.preventDefault(); avancer(-1); }
    });

    /* La carte la plus proche du centre reçoit `.est-au-centre`. Le
       CSS s'en sert pour éteindre légèrement les autres : sur la
       source, seul le fondu du masque produit cet effet ; le doubler
       d'un état explicite rend la position lisible même pour une
       carte pas encore masquée. [arbitrage] */
    var mesureEnAttente = false;

    function marquerLaCarteCentrale() {
      var centreDuRail = rail.scrollLeft + rail.clientWidth / 2;
      var meilleure = null;
      var meilleurEcart = Infinity;

      Array.prototype.forEach.call(cartes, function (carte) {
        var centreCarte = carte.offsetLeft + carte.offsetWidth / 2;
        var ecart = Math.abs(centreCarte - centreDuRail);
        if (ecart < meilleurEcart) { meilleurEcart = ecart; meilleure = carte; }
      });

      Array.prototype.forEach.call(cartes, function (carte) {
        carte.classList.toggle('est-au-centre', carte === meilleure);
      });
    }

    // `passive: true` : on ne fait que lire, jamais preventDefault —
    // le navigateur peut défiler sans attendre ce handler. Et une
    // seule mesure par trame : `scroll` tire beaucoup plus vite que
    // le rendu, et chaque mesure force un calcul de mise en page.
    rail.addEventListener('scroll', function () {
      if (mesureEnAttente) return;
      mesureEnAttente = true;
      requestAnimationFrame(function () {
        mesureEnAttente = false;
        marquerLaCarteCentrale();
      });
    }, { passive: true });

    window.addEventListener('resize', marquerLaCarteCentrale);
    marquerLaCarteCentrale();
  }

  /* --- 4. Marquee ----------------------------------------------
     Le défilement reste une animation CSS : deux copies exactes du
     contenu et un `translateX(-50%)`, ce qui boucle sans raccord. Le
     JS n'ajoute que la pause, pour lire une pastille sans la suivre. */
  function installerPauseMarquee() {
    var marquee = document.querySelector('.marquee');
    if (!marquee) return;

    var pistes = marquee.querySelectorAll('.marquee__piste');

    function etat(valeur) {
      Array.prototype.forEach.call(pistes, function (piste) {
        piste.style.animationPlayState = valeur;
      });
    }

    marquee.addEventListener('pointerenter', function () { etat('paused'); });
    marquee.addEventListener('pointerleave', function () { etat('running'); });
    marquee.addEventListener('focusin',  function () { etat('paused'); });
    marquee.addEventListener('focusout', function () { etat('running'); });
  }

  installerApparitions();
  installerCarrousel();
  installerPauseMarquee();
})();
