/* ═══════════════════════════════════════════════════════════════════════════
   SODIUM — mouvement et interactions.  Vanilla, sans framework ni build.
   TRAÇABILITÉ. La source confie tout son mouvement à Framer Motion : le HTML
   livré n'expose QUE les états de repos inline. [relevé] = ces états et leurs
   déclencheurs ; [arbitrage] = durées, courbes, seuils. → tokens-dispatch.md
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  /* ─── 0 ▸ Préférence de mouvement. `matches` pour le test instantané,
     addEventListener('change') pour le suivi (addListener est déprécié). */
  var requeteCalme = matchMedia('(prefers-reduced-motion: reduce)');
  var calme = requeteCalme.matches;
  var reveles = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var lignes = Array.prototype.slice.call(document.querySelectorAll('[data-ligne]'));
  var observateurs = [];
  var boucle = 0;

  requeteCalme.addEventListener('change', function (e) {
    calme = e.matches;   // ne jamais laisser un bloc caché derrière soi
    if (calme) reveles.concat(lignes).forEach(function (n) { n.classList.add('is-in'); });
  });

  /* ─── 1 ▸ Apparition au défilement. [arbitrage] intégral. IntersectionObserver
     et non `animation-timeline: view()` : non Baseline, et une keyframe partant
     d'opacity:0 y laisserait les blocs DÉFINITIVEMENT invisibles. */
  if (!calme && 'IntersectionObserver' in window && (reveles.length || lignes.length)) {
    document.documentElement.classList.add('js-motion');
    var vigie = new IntersectionObserver(function (entrees, self) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        self.unobserve(e.target);      // une apparition ne se rejoue jamais
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    observateurs.push(vigie);
    reveles.forEach(function (n) { vigie.observe(n); });
    // Les lignes du titre montent en cascade : 0, 110, 220 ms. [arbitrage]
    lignes.forEach(function (n, i) {
      n.style.transitionDelay = (i * 110) + 'ms';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { n.classList.add('is-in'); });
      });
    });
  }

  /* ─── 2 ▸ Parallaxe du héros. [relevé] le procédé (calque débordant de 5 rem,
     will-change:transform) ; [arbitrage] la course : 0.18 × scrollY, ≤ 80 px. */
  var fond = document.querySelector('[data-parallaxe]');
  if (fond && !calme) {
    var attendu = false;
    var deplacer = function () {
      attendu = false;
      var y = window.scrollY;
      if (y > window.innerHeight * 1.4) return;
      fond.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
    };
    window.addEventListener('scroll', function () {
      if (attendu) return;
      attendu = true;
      boucle = requestAnimationFrame(deplacer);
    }, { passive: true });
    // visibilitychange, repli pagehide (§9) : annuler la frame en attente.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && boucle) { cancelAnimationFrame(boucle); boucle = 0; attendu = false; }
    });
  }

  /* ─── 3 ▸ Projecteur des cartes. [relevé] : --spot-x / --spot-y en %, lus par
     un radial-gradient de 240 px. Désarmé sur pointeur grossier. */
  if (matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-projecteur]'), function (carte) {
      carte.addEventListener('pointermove', function (e) {
        var r = carte.getBoundingClientRect();
        carte.style.setProperty('--spot-x', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        carte.style.setProperty('--spot-y', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      });
    });
  }

  /* ─── 4 ▸ Onglets. [relevé] : tablist/tab/tabpanel, un seul tabindex à 0. */
  Array.prototype.forEach.call(document.querySelectorAll('[role="tablist"]'), function (liste) {
    var onglets = Array.prototype.slice.call(liste.querySelectorAll('[role="tab"]'));
    function activer(i) {
      onglets.forEach(function (o, j) {
        var actif = i === j;
        o.setAttribute('aria-selected', actif ? 'true' : 'false');
        o.tabIndex = actif ? 0 : -1;
        var panneau = document.getElementById(o.getAttribute('aria-controls'));
        if (panneau) panneau.hidden = !actif;
      });
    }
    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { activer(i); });
      o.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var suivant = (i + d + onglets.length) % onglets.length;
        activer(suivant);
        onglets[suivant].focus();
      });
    });
  });

  /* ─── 5 ▸ Menu mobile. [relevé] : aria-expanded pilote le panneau. */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu-mobile');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var ouvert = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      menu.hidden = ouvert;
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      burger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });
  }

  /* ─── 6 ▸ Compteurs. [relevé] : la source sert « 0 » et compte au client. */
  var compteurs = Array.prototype.slice.call(document.querySelectorAll('[data-compteur]'));
  var rendre = function (n, v) { n.textContent = v.toLocaleString('en-US') + (n.dataset.suffixe || ''); };
  if (calme || !('IntersectionObserver' in window)) {
    compteurs.forEach(function (n) { rendre(n, parseInt(n.dataset.compteur, 10)); });
  } else if (compteurs.length) {
    var guetteur = new IntersectionObserver(function (entrees, self) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        self.unobserve(e.target);
        var n = e.target, cible = parseInt(n.dataset.compteur, 10), depart = performance.now();
        var pas = function (t) {
          var p = Math.min((t - depart) / 1400, 1);   // 1400 ms, sortie cubique
          rendre(n, Math.round(cible * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(pas);
        };
        requestAnimationFrame(pas);
      });
    }, { threshold: 0.5 });
    observateurs.push(guetteur);
    compteurs.forEach(function (n) { guetteur.observe(n); });
  }

  /* ─── 7 ▸ Calculateur. [relevé] : min=3 max=6 step=0.01, la valeur EST
     log10(volume) — repères de la source à 0 / 15.9 / 66.7 / 100 %. */
  var champ = document.getElementById('volume');
  if (champ) {
    var sortieVolume = document.getElementById('calc-volume');
    var sortiePlan = document.getElementById('calc-plan'), sortieDetail = document.getElementById('calc-detail');
    var paliers = [
      { nom: 'Free',     base: 0,   inclus: 3000,   mille: null, note: 'no card, nothing to cancel' },
      { nom: 'Standard', base: 18,  inclus: 25000,  mille: 0.60, note: null },
      { nom: 'Scale',    base: 180, inclus: 500000, mille: 0.40, note: null }
    ];
    var arrondir = function (v) {
      var pas = v < 10000 ? 100 : v < 100000 ? 1000 : 10000;
      return Math.max(1000, Math.round(v / pas) * pas);
    };
    var cout = function (p, v) {
      if (v <= p.inclus) return p.base;
      return p.mille === null ? Infinity : p.base + Math.ceil((v - p.inclus) / 1000) * p.mille;
    };
    var recalculer = function () {
      var brut = parseFloat(champ.value);
      var v = arrondir(Math.pow(10, brut));
      var min = parseFloat(champ.min), max = parseFloat(champ.max);
      champ.style.setProperty('--remplissage', (((brut - min) / (max - min)) * 100).toFixed(2) + '%');
      var gagnant = paliers[0], prix = cout(paliers[0], v);
      paliers.forEach(function (p) { var c = cout(p, v); if (c < prix) { prix = c; gagnant = p; } });
      sortieVolume.textContent = v.toLocaleString('en-US');
      sortiePlan.innerHTML = gagnant.nom + ' — $<span class="tab-num">'
        + (prix % 1 === 0 ? prix : prix.toFixed(2)) + '</span>/month';
      sortieDetail.textContent = gagnant.inclus.toLocaleString('en-US') + ' included · '
        + (gagnant.mille === null ? gagnant.note : 'then $' + gagnant.mille.toFixed(2) + ' per 1,000');
    };
    champ.addEventListener('input', recalculer);
    recalculer();
  }

  /* ─── 8 ▸ Jauge de la démo, révélée une fois puis désarmée. */
  var demo = document.querySelector('.demo');
  if (demo && !calme && 'IntersectionObserver' in window) {
    var oeil = new IntersectionObserver(function (entrees, self) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        self.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    observateurs.push(oeil);
    oeil.observe(demo);
  } else if (demo) { demo.classList.add('is-in'); }

  /* ─── 9 ▸ Nettoyage — tout observateur armé finit désarmé. */
  window.addEventListener('pagehide', function () {
    if (boucle) cancelAnimationFrame(boucle);
    observateurs.forEach(function (o) { o.disconnect(); });
    observateurs.length = 0;
  });
})();
