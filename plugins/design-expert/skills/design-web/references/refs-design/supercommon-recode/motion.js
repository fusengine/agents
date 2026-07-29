/* ═══════════════════════════════════════════════════════════════════════════
   MOUVEMENT — référence de design.  Vanilla, sans framework ni build.
   TRAÇABILITÉ. La source ne contient NI @keyframes, NI transition, NI
   animation-timeline : 100 % de son mouvement vient du runtime Framer Motion,
   illisible depuis le HTML livré. [relevé] = les DÉCLENCHEURS et les ÉTATS,
   seuls faits disponibles. [arbitrage] = tout le reste — chaque durée, chaque
   courbe, chaque seuil. Aucune durée n'est en dur ici : elles viennent des
   variables CSS de :root. Raisonnement complet : tokens-supercommon.md §3.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── 0 ▸ Préférence de mouvement ───────────────────────────────────────
     `matches` pour le test instantané ; écoute par addEventListener('change')
     — addListener() est déprécié. [arbitrage] */
  var requeteCalme = matchMedia('(prefers-reduced-motion: reduce)');
  var calme = requeteCalme.matches;

  var css = getComputedStyle(document.documentElement);
  var dureeCourte = css.getPropertyValue('--duree-court').trim() || '180ms';

  var reveles = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function toutAfficher() { reveles.forEach(function (n) { n.classList.add('is-in'); }); }

  requeteCalme.addEventListener('change', function (e) {
    calme = e.matches;
    if (calme) toutAfficher();  // ne jamais laisser un bloc caché derrière soi
  });

  /* ─── 1 ▸ Apparition au défilement ── [arbitrage] intégral ──────────────
     IntersectionObserver et NON `animation-timeline: view()` : non Baseline,
     et une keyframe partant d'opacity:0 y laisserait les blocs DÉFINITIVEMENT
     invisibles. Contrat : l'état de repos n'est armé (classe .js-motion) que
     si l'on sait le lever — sans JS, sans observateur ou en mouvement réduit,
     le CSS ne cache rien. Seuil 0.15 : révélé dès qu'un sixième est visible.
     rootMargin -12% en bas : l'apparition finit pendant que l'œil arrive. */
  if (reveles.length && !calme && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    var vigie = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        vigie.unobserve(e.target);   // une apparition ne se rejoue jamais
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
    reveles.forEach(function (n) { vigie.observe(n); });
  } else {
    toutAfficher();
  }

  /* ─── 1b ▸ Cascade ── [arbitrage] ───────────────────────────────────────
     Décalage porté par une variable CSS (--i), pas par une transition : le CSS
     reste maître du timing. Pas court (60 ms) — au-delà, neuf cellules mettent
     plus d'une seconde à se poser et la cascade devient le sujet. */
  document.querySelectorAll('[data-stagger]').forEach(function (groupe) {
    Array.prototype.forEach.call(groupe.children, function (enfant, i) {
      enfant.style.setProperty('--i', i);
    });
  });

  /* ─── 2 ▸ Contrôle segmenté (large / pill / slim) ───────────────────────
     [relevé] fond rgb(0,0,0) + opacity:1 sur l'onglet actif, rgba(0,0,0,0) +
     opacity:.5 sur les autres. Les états sont des faits ; la transition, non.
     [arbitrage] Un pouce unique glisse au lieu de repeindre trois fonds : on
     n'anime qu'un transform (composé par le GPU), et le déplacement RELIE les
     deux états — trois fonds qui s'allument sont trois événements, un pouce
     qui glisse est un seul geste. Position mesurée, jamais codée : les
     largeurs changent avec la fonte et le point de rupture. */
  var segmente = document.querySelector('.segmented');
  if (segmente) {
    var pouce = segmente.querySelector('.segmented__thumb');
    var onglets = Array.prototype.slice.call(segmente.querySelectorAll('.segmented__tab'));

    var placerPouce = function (onglet) {
      if (!onglet || !pouce) return;
      pouce.style.width = onglet.offsetWidth + 'px';
      pouce.style.transform = 'translateX(' + (onglet.offsetLeft - 2) + 'px)';
    };
    var activer = function (onglet) {
      onglets.forEach(function (t) {
        var actif = (t === onglet);
        t.classList.toggle('is-on', actif);
        t.setAttribute('aria-selected', actif ? 'true' : 'false');
        t.setAttribute('tabindex', actif ? '0' : '-1');
      });
      placerPouce(onglet);
    };
    onglets.forEach(function (o) {
      o.addEventListener('click', function () { activer(o); });
    });

    /* Navigation clavier, attendue de tout rôle `tablist`. [arbitrage] */
    segmente.addEventListener('keydown', function (e) {
      var i = onglets.indexOf(document.activeElement);
      if (i < 0) return;
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1
            : e.key === 'Home' ? 0 : e.key === 'End' ? onglets.length - 1 : null;
      if (j === null) return;
      e.preventDefault();
      var cible = onglets[(j + onglets.length) % onglets.length];
      cible.focus();
      activer(cible);
    });

    /* Repose au chargement, au redimensionnement, et à la bascule de la fonte
       de secours vers la fonte web — ce dernier cas est le plus oublié. */
    var reposer = function () { placerPouce(segmente.querySelector('.is-on')); };
    reposer();
    addEventListener('resize', reposer, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reposer);
  }

  /* ─── 3 ▸ Vidéo en boucle ───────────────────────────────────────────────
     [relevé] `loop muted playsinline preload="none"` + affiche : la source
     décide qu'elle ne coûte rien tant qu'on ne la regarde pas.
     [arbitrage] Le déclencheur : lecture à l'écran, pause à la sortie. En
     mouvement réduit elle ne démarre jamais, l'affiche suffit. */
  var video = document.querySelector('.media__video');
  if (video && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting && !calme) {
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* refusée : l'affiche reste */ });
        } else { video.pause(); }
      });
    }, { threshold: 0.25 }).observe(video);
  }

  /* ─── 4 ▸ Le bloc « 00:25:00 » ──────────────────────────────────────────
     [relevé] SVG FIGÉ de 117 × 34 px, tracé entièrement dans l'accent
     rgb(224,59,30), pictogramme de la cellule « reminder ». Framer ne l'anime
     pas ; il est repris au caractère près dans styles.css (.picto--timer).
     [arbitrage] Ce qui suit AJOUTE du mouvement là où la source n'en a pas —
     assumé et délimité : on ne remplace pas le picto, on le fait respirer à la
     cadence d'un deux-points d'afficheur. animationPlayState plutôt qu'un
     retrait/remise de classe, qui repartirait de zéro et ferait un à-coup. En
     mouvement réduit il n'est jamais posé : le picto reste à pleine opacité —
     réduire le mouvement ne doit pas réduire l'information. */
  var minuterie = document.querySelector('.picto--timer');
  if (minuterie && !calme && 'IntersectionObserver' in window) {
    var feuille = document.createElement('style');
    feuille.textContent = '@keyframes battement{0%,49%{opacity:1}50%,99%{opacity:.55}}';
    document.head.appendChild(feuille);

    minuterie.style.animation = 'battement 1s steps(1, end) infinite';
    minuterie.style.animationPlayState = 'paused';
    new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        minuterie.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0.4 }).observe(minuterie);
  }

  /* ─── 5 ▸ Progression de lecture ── [arbitrage] intégral ────────────────
     Une page qui tient sur ~200 vh de vide a besoin d'un repère. Filet de 1 px
     dans l'accent. Écoute {passive:true}, étranglée par requestAnimationFrame :
     un calcul par image au plus. */
  var jauge = document.createElement('div');
  jauge.setAttribute('aria-hidden', 'true');
  jauge.style.cssText =
    'position:fixed;top:0;left:0;height:1px;width:100%;transform-origin:0 50%;' +
    'transform:scaleX(0);background:var(--accent);z-index:9;pointer-events:none;' +
    'opacity:0;transition:opacity ' + dureeCourte + ' linear';
  document.body.appendChild(jauge);

  var enAttente = false;
  var mesurer = function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0;
    jauge.style.transform = 'scaleX(' + p + ')';
    jauge.style.opacity = p > 0.002 ? '1' : '0';
    enAttente = false;
  };
  addEventListener('scroll', function () {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(mesurer);
  }, { passive: true });
  addEventListener('resize', mesurer, { passive: true });
  mesurer();

  /* ─── 6 ▸ Défilement vers une ancre ─────────────────────────────────────
     LE PIÈGE le plus courant de ce fichier : scrollTo / scrollBy /
     scrollIntoView avec `behavior:'smooth'` NE CONSULTENT JAMAIS
     prefers-reduced-motion. L'API de défilement JS ignore la préférence, à la
     différence des transitions CSS : un 'smooth' codé en dur impose du
     mouvement à exactement le public que la préférence protège.
     Second piège : omettre `behavior` ne vaut pas « instantané » — le défaut
     'auto' suit la scroll-behavior CSS. Être explicite dans les DEUX branches. */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (lien) {
    lien.addEventListener('click', function (e) {
      var cible = document.querySelector(lien.getAttribute('href'));
      if (!cible) return;
      e.preventDefault();
      cible.scrollIntoView({ behavior: calme ? 'instant' : 'smooth', block: 'start' });
    });
  });
})();
