/* motion.js — comportements d'interface de la référence linear-recode.
   JS vanilla : aucun framework, aucun CDN, aucun build.
   [relevé] = valeur littérale de la source · [arbitrage] = mon choix.
   Principe repris de la source : le JS n'écrit JAMAIS de propriété de mise en
   page. Il pose une classe, un `data-*` ou une variable CSS et laisse le CSS
   rendre — tout ce qui est animable reste dans styles.css, donc inspectable. */
(function () {
  'use strict';
  /* [relevé] la source préfixe `html.js` toute règle dont l'état de départ est
     invisible, avec `html:not(.js)` en miroir : sans script, rien ne reste
     caché. À faire en tout premier. */
  var racine = document.documentElement;
  racine.classList.add('js');
  /* [relevé] `prefers-reduced-motion` est traité partout dans la source. */
  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
  /* 1. APPARITION AU SCROLL
     [relevé] .4s / ease-out-quart / translateY(4px) / fill `backwards`
       (NewHeroIllustration.css .w9ZFkq_staggerItem).
     [arbitrage] le DÉCLENCHEUR : la source anime au montage React ; ici
       IntersectionObserver (Baseline widely available, mars 2019).
     Interdit : `animation-timeline: view()` — pas widely available, une
     keyframe partant d'opacity:0 y laisserait les éléments invisibles. */
  function apparitions() {
    var cibles = document.querySelectorAll('.apparait');
    if (!cibles.length) return;
    /* Repli sans observateur : tout devient visible. Un élément jamais révélé
       est un défaut plus grave que l'absence d'animation. */
    if (!('IntersectionObserver' in window)) {
      cibles.forEach(function (el) { el.classList.add('est-visible'); });
      return;
    }
    /* [arbitrage] -10 % en bas : l'effet se termine dans le champ de vision. */
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('est-visible');
        obs.unobserve(e.target);   /* état final stable, pas de rejeu */
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    cibles.forEach(function (el) { obs.observe(el); });
  }
  /* 2. HALO ET LISERÉ SUIVANT LE POINTEUR
     [relevé] page.css : halo (.MwJdiW_glow) et liseré masqué (.MwJdiW_shine)
     positionnés par --mask-x / --mask-y. Le JS n'écrit QUE ces variables. La
     géométrie est mesurée à l'entrée et au redimensionnement, jamais dans le
     gestionnaire de mouvement ; une écriture par trame, car le pointeur émet
     plus d'événements que l'écran n'affiche d'images. */
  function suiviPointeur() {
    document.querySelectorAll('[data-suivi-pointeur]').forEach(function (cadre) {
      var boite = null, enAttente = false, x = 0, y = 0;
      function mesurer() { boite = cadre.getBoundingClientRect(); }
      function ecrire() {
        enAttente = false;
        if (!boite) return;
        cadre.style.setProperty('--x', ((x - boite.left) / boite.width * 100) + '%');
        cadre.style.setProperty('--y', ((y - boite.top) / boite.height * 100) + '%');
      }
      cadre.addEventListener('pointerenter', mesurer);
      cadre.addEventListener('pointermove', function (e) {
        x = e.clientX; y = e.clientY;
        if (!boite) mesurer();
        if (enAttente) return;
        enAttente = true;
        requestAnimationFrame(ecrire);
      });
      /* [arbitrage] retour au repos à la sortie : la source laisse le halo
         figé, mais une trace immobile se lit comme un bug. */
      cadre.addEventListener('pointerleave', function () {
        boite = null;
        cadre.style.removeProperty('--x');
        cadre.style.removeProperty('--y');
      });
      window.addEventListener('resize', function () { boite = null; });
    });
  }
  /* 3. FONDU DE CHARGEMENT DES IMAGES
     [relevé] Image.css : opacity:0 + masque décalé à 150 %, animé .8s `both`
     une fois `data-loaded=true` posé côté JS. Le point important est le chemin
     d'échec : une image cassée doit rester visible comme telle. */
  function fonduImages() {
    document.querySelectorAll('img[data-fondu="true"]').forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) { img.dataset.charge = 'true'; return; }
      img.addEventListener('load', function () { img.dataset.charge = 'true'; });
      img.addEventListener('error', function () { img.dataset.fondu = 'false'; });
    });
  }
  /* 4. MENU MOBILE
     [relevé] Header.css : entrée ET sortie en .18s, fill `both` — le `both`
     fige l'état de départ, donc pas de saut. On attend la fin de la sortie
     avant de retirer du flux, sinon la fermeture n'est jamais visible. */
  var DUREE_MENU = 180; /* [relevé] .18s */
  function menuMobile() {
    var bouton = document.querySelector('[data-menu-bascule]');
    var menu = document.getElementById('menu-mobile');
    if (!bouton || !menu) return;
    var ouvert = false;
    function ouvrir() {
      ouvert = true;
      menu.removeAttribute('data-ferme');
      menu.setAttribute('data-ouvert', 'true');
      bouton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function fermer() {
      ouvert = false;
      menu.removeAttribute('data-ouvert');
      menu.setAttribute('data-ferme', 'true');
      bouton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        if (!ouvert) menu.removeAttribute('data-ferme');
      }, mouvementReduit.matches ? 0 : DUREE_MENU);
    }
    bouton.addEventListener('click', function () { ouvert ? fermer() : ouvrir(); });
    /* Échap ferme, et tout lien ferme : un menu plein écran qui survit à la
       navigation piège l'utilisateur. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ouvert) { fermer(); bouton.focus(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fermer(); });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (e) {
      if (e.matches && ouvert) fermer();
    });
  }
  /* 5. BASCULE DE THÈME
     [relevé] index.css : tout le jeu de tokens est commuté par le SEUL
     attribut `data-theme` sur <html>. Aucune classe à propager. */
  function basculeTheme() {
    var boutons = document.querySelectorAll('[data-theme-cible]');
    if (!boutons.length) return;
    boutons.forEach(function (b) {
      b.addEventListener('click', function () {
        var cible = b.dataset.themeCible;
        racine.dataset.theme = cible;
        boutons.forEach(function (o) {
          o.setAttribute('aria-pressed', String(o.dataset.themeCible === cible));
        });
      });
    });
  }
  /* 6. CARROUSEL DE CITATIONS (sous 1024px)
     [relevé] .Dc5tqa_stackedCarouselItem : largeur min(85vw, 360px) — le débord
     de la carte suivante signale qu'on peut défiler. L'accrochage est en CSS ;
     le JS n'ajoute que le clavier. [arbitrage] la source le pilote en React. */
  function carrouselClavier() {
    var piste = document.querySelector('.clients__carrousel');
    if (!piste) return;
    piste.setAttribute('tabindex', '0');
    piste.setAttribute('role', 'group');
    piste.setAttribute('aria-label', 'Citations clients, défilement horizontal');
    piste.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var carte = piste.querySelector('.client-carte');
      if (!carte) return;
      var pas = carte.getBoundingClientRect().width + 8; /* [relevé] gap 8px */
      piste.scrollBy({ left: e.key === 'ArrowRight' ? pas : -pas,
        behavior: mouvementReduit.matches ? 'auto' : 'smooth' });
    });
  }
  /* 7. GRAPHE — montée des barres à l'entrée dans le champ
     [relevé] .4s / ease-out-quart, mêmes valeurs que l'apparition générale.
     [arbitrage] l'effet : la source rend un graphe statique. La hauteur finale
     est LUE depuis le style inline, mise à zéro puis restaurée : l'état final
     reste celui écrit dans le HTML. Sans mouvement, on ne touche à rien. */
  function grapheAnime() {
    var graphe = document.querySelector('[data-graphe]');
    if (!graphe) return;
    /* Les hauteurs sont portées par les DEUX segments de chaque barre
       (.compte__haut / .compte__bas), pas par la barre elle-même. */
    var barres = Array.prototype.slice.call(graphe.querySelectorAll('.compte__haut, .compte__bas'));
    if (!barres.length) return;
    if (mouvementReduit.matches || !('IntersectionObserver' in window)) return;
    var hauteurs = barres.map(function (b) { return b.style.height; });
    barres.forEach(function (b) {
      b.style.height = '0%';
      b.style.transition = 'height .4s cubic-bezier(.165, .84, .44, 1)';
    });
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        barres.forEach(function (b, i) {
          b.style.transitionDelay = (i * 40) + 'ms';  /* [arbitrage] balayage */
          b.style.height = hauteurs[i];
        });
        obs.disconnect();
      });
    }, { threshold: 0.35 });
    obs.observe(graphe);
  }
  function demarrer() {
    apparitions(); suiviPointeur(); fonduImages();
    menuMobile(); basculeTheme(); carrouselClavier(); grapheAnime();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else { demarrer(); }
})();
