/* motion-nav.js — comportements de la référence, partie 2/2 : compteur du bloc géant,
   parallaxe du média du hero, méga-menus et panneaux de la barre.
   Séparé de motion.js pour ne pas dépasser le plafond de lignes imposé au projet ;
   les deux fichiers sont indépendants et relisent chacun la préférence de mouvement. */
(function () {
  'use strict';
  /* == 0. PRÉFÉRENCE DE MOUVEMENT — même règle qu'en partie 1 : addListener() est
     deprecated, on écoute 'change'. Relue à chaud, jamais figée au chargement. */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduit = mq.matches, abonnes = [];
  mq.addEventListener('change', function (e) {
    reduit = e.matches; abonnes.forEach(function (f) { f(reduit); });
  });

  /* == 4. COMPTEUR DU BLOC GÉANT — moteur : GSAP TextPlugin enregistré dans la source,
     aucun appel dans le HTML livré. [arbitrage] rAF + easeOutCubic (un compteur
     linéaire paraît mécanique) et valeur finale écrite EXPLICITEMENT : un compteur qui
     s'arrête sur 99 est un bug visible. [arbitrage] seuil 0.6. */
  document.querySelectorAll('[data-compteur]').forEach(function (el) {
    var cible = parseInt(el.getAttribute('data-cible'), 10), suf = el.getAttribute('data-suffixe') || '';
    if (isNaN(cible)) return;
    function ecrire(v) { el.textContent = String(v) + suf; }
    new IntersectionObserver(function (es, o) {
      if (!es[0] || !es[0].isIntersecting) return;
      o.unobserve(el);
      if (reduit) { ecrire(cible); return; }
      var t0 = null;
      requestAnimationFrame(function pas(ts) {
        if (t0 === null) t0 = ts;
        var t = Math.min((ts - t0) / 1400, 1);
        ecrire(Math.round(cible * (1 - Math.pow(1 - t, 3))));
        if (t < 1) { requestAnimationFrame(pas); } else { ecrire(cible); }
      });
    }, { threshold: 0.6 }).observe(el);
  });

  /* == 5. PARALLAXE DU MÉDIA DU HERO — moteur : GSAP ScrollSmoother est enregistré ; le
     média est un absolu débordant (inset:-15% -13% 0% auto) posé pour être décalé.
     [arbitrage] scroll passif + throttle rAF, amplitude faible et bornée (12 %, 90px)
     pour rester dans l'overflow:hidden de la section. */
  document.querySelectorAll('[data-parallaxe]').forEach(function (el) {
    var ticking = false, actif = !reduit;
    function calc() {
      var d = Math.min((window.scrollY || 0) * 0.12, 90);
      el.style.transform = 'translate3d(0,' + d.toFixed(1) + 'px,0)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!actif || ticking) return;
      ticking = true; requestAnimationFrame(calc);
    }, { passive: true });
    if (actif) calc();
    abonnes.push(function (r) { actif = !r; if (r) { el.style.transform = ''; } else { calc(); } });
  });

  /* == 6. MÉGA-MENU, RECHERCHE ET « GET STARTED » — moteur : composant w-dropdown de
     Webflow, trois usages du même composant dans la source. [arbitrage] vanilla ; le
     procédé reproduit est celui du CSS (panneau 100vw décroché par un parent
     position:static). Survol ET clic : le survol seul exclut clavier et tactile.
     [arbitrage] le panneau de recherche ne s'ouvre PAS au survol — un panneau qui
     couvre la page dès que la souris frôle la loupe est une gêne, pas une aide. */
  var menus = [].slice.call(document.querySelectorAll('[data-menu]'));
  function fermer(m) {
    m.classList.remove('is-open');
    var t = m.querySelector('.nav__toggle'), p = m.querySelector('.nav__panneau');
    if (t) t.setAttribute('aria-expanded', 'false');
    if (p) p.setAttribute('hidden', '');
  }
  menus.forEach(function (m) {
    var t = m.querySelector('.nav__toggle'), p = m.querySelector('.nav__panneau');
    if (!t || !p) return;
    var auSurvol = !p.classList.contains('nav__panneau--recherche');
    function ouvrir() {
      menus.forEach(function (o) { if (o !== m) fermer(o); });
      m.classList.add('is-open'); t.setAttribute('aria-expanded', 'true'); p.removeAttribute('hidden');
    }
    t.addEventListener('click', function () { if (m.classList.contains('is-open')) { fermer(m); } else { ouvrir(); } });
    if (auSurvol) { m.addEventListener('mouseenter', ouvrir); }
    m.addEventListener('mouseleave', function () { if (auSurvol) fermer(m); });
    m.addEventListener('focusout', function (e) { if (!m.contains(e.relatedTarget)) fermer(m); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menus.forEach(fermer); });
})();
