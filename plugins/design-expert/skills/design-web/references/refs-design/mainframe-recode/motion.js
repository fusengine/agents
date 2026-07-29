/* =====
   motion.js — comportements d'interface de la référence mainframe.app
   JS vanilla, aucun framework, aucun build.

   PRINCIPE DIRECTEUR, et c'est tout l'intérêt de cette référence : le JS ne fait
   QUE basculer une classe ou écrire une hauteur. Il ne cadence rien, il ne dessine
   aucune courbe. Toutes les durées et toutes les courbes vivent dans styles.css.
   C'est ce qui permet à la source de n'avoir aucune @keyframes tout en paraissant
   vivante.

   Marquage identique au CSS : [relevé] = lu dans la source, [arbitrage] = ajouté.
   IntersectionObserver : Baseline widely available (mars 2019).
   `animation-timeline: view()/scroll()` n'est PAS utilisé (pas widely available).
   ===== */

(function () {
  'use strict';

  var sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observable = 'IntersectionObserver' in window;

  /* Défilement animé, sauf réglage système contraire. */
  function amener(el, inline) {
    if (!el) return;
    el.scrollIntoView({ behavior: sobre ? 'auto' : 'smooth',
      block: inline ? 'nearest' : 'center', inline: inline || 'nearest' });
  }

  /* Place une piste horizontale sur un de ses enfants, sans animation. */
  function centrerSur(piste, el) {
    if (el) piste.scrollLeft = el.offsetLeft - (piste.clientWidth - el.offsetWidth) / 2;
  }

  /* Index de l'élément dont le centre est le plus proche du centre de la piste. */
  function indexCentre(piste, elements) {
    var centre = piste.getBoundingClientRect().left + piste.clientWidth / 2;
    var meilleur = 0, ecartMin = Infinity;
    elements.forEach(function (el, i) {
      var b = el.getBoundingClientRect();
      var d = Math.abs(b.left + b.width / 2 - centre);
      if (d < ecartMin) { ecartMin = d; meilleur = i; }
    });
    return meilleur;
  }

  /* ----- 1. HALOS
     [relevé] transition-opacity duration-[800ms] ease-out, repos opacity-0.
     Déclencheur : le chargement de l'image, pas le défilement. ----- */
  function halos() {
    document.querySelectorAll('.halo__img').forEach(function (img) {
      if (img.complete) img.classList.add('est-chargee');
      else img.addEventListener('load', function () { img.classList.add('est-chargee'); });
    });
  }

  /* ----- 2. RÉVÉLATIONS AU DÉFILEMENT
     Le CSS porte l'état de repos (opacité 0 + flou), le JS ajoute `est-visible`
     puis cesse d'observer : [relevé] une révélation ne se rejoue jamais.
     [arbitrage] les deux seuils ; la source les pilote côté applicatif. ----- */
  function revelations() {
    var blocs = document.querySelectorAll('[data-reveler]');
    if (sobre || !observable) {
      blocs.forEach(function (el) { el.classList.add('est-visible'); });
      return;
    }
    var vue = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('est-visible');
        vue.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    blocs.forEach(function (el) { vue.observe(el); });
  }

  /* ----- 3. CARROUSEL PLEINE LARGEUR
     Rappel de relevé : les volets n'ont AUCUN état actif/inactif — les
     `opacity:1` / `opacity:0.4` inline de la source appartiennent à la vitrine,
     pas ici. Rien à synchroniser : le JS ne sert qu'à recentrer.
     [arbitrage] intégral — la source utilise une bibliothèque de carrousel. ----- */
  function carrousel() {
    var piste = document.querySelector('[data-carrousel]');
    if (!piste) return;
    var cases = piste.querySelectorAll('.carrousel__case');
    if (!cases.length) return;
    function allerVers(i) {
      amener(cases[Math.max(0, Math.min(i, cases.length - 1))], 'center');
    }
    piste.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); allerVers(indexCentre(piste, cases) + 1); }
      if (ev.key === 'ArrowLeft')  { ev.preventDefault(); allerVers(indexCentre(piste, cases) - 1); }
    });
    cases.forEach(function (c, i) {
      var bouton = c.querySelector('.vignette__lecture');
      if (bouton) bouton.addEventListener('click', function () { allerVers(i); });
    });
    /* [relevé] à l'ouverture la source centre un volet et laisse voir ses voisins. */
    centrerSur(piste, cases[1] || cases[0]);
  }

  /* ----- 4. VITRINE — ACCORDÉON + SOMMAIRE COLLANT
     a) l'entrée active déplie son paragraphe. [relevé] la source déclare
        `transition-property: height, opacity` SANS durée explicite : c'est donc la
        durée par défaut du framework (150 ms) et la courbe par défaut. Une hauteur
        ne s'anime pas depuis `auto` — le JS écrit la hauteur mesurée en pixels.
     b) le sommaire suit l'image centrée ; un clic défile jusqu'à elle. ----- */
  function vitrine() {
    var sommaire = document.querySelector('[data-sommaire]');
    var pile = document.querySelector('[data-pile]');
    if (!sommaire || !pile) return;
    var entrees = sommaire.querySelectorAll('.vitrine__entree');
    var onglets = sommaire.querySelectorAll('.vitrine__onglet');

    function ouvrir(cible) {
      entrees.forEach(function (entree) {
        var onglet = entree.querySelector('.vitrine__onglet');
        var repli = entree.querySelector('.vitrine__repli');
        var actif = onglet.dataset.cible === cible;
        entree.classList.toggle('est-active', actif);
        onglet.setAttribute('aria-expanded', actif ? 'true' : 'false');
        /* scrollHeight = hauteur naturelle du contenu replié ; écrite en pixels
           pour que la transition ait deux bornes chiffrées. */
        repli.style.height = actif ? repli.scrollHeight + 'px' : '0px';
      });
    }
    onglets.forEach(function (onglet) {
      onglet.addEventListener('click', function () {
        ouvrir(onglet.dataset.cible);
        amener(document.getElementById(onglet.dataset.cible));
      });
    });
    var premiere = sommaire.querySelector('.vitrine__entree.est-active .vitrine__onglet');
    if (premiere) ouvrir(premiere.dataset.cible);

    /* [arbitrage] bande morte de 45 % : l'entrée bascule quand l'image occupe le
       milieu du champ, pas dès qu'elle y entre. */
    if (observable) {
      var suivi = new IntersectionObserver(function (obs) {
        obs.forEach(function (e) { if (e.isIntersecting) ouvrir(e.target.id); });
      }, { rootMargin: '-45% 0px -45% 0px' });
      pile.querySelectorAll('[id]').forEach(function (el) { suivi.observe(el); });
    }
    /* Une hauteur figée en pixels devient fausse si la ligne se recompose. */
    window.addEventListener('resize', function () {
      var actif = sommaire.querySelector('.vitrine__entree.est-active .vitrine__onglet');
      if (actif) ouvrir(actif.dataset.cible);
    });
  }

  /* ----- 5. DISQUES
     [relevé] géométrie et clip-path uniquement : le contenu de ces disques est un
     composant client livré VIDE dans le HTML source. À l'écran, la source y affiche
     des PORTRAITS photographiques ronds — donc ni aplat, ni transition de couleur.
     [arbitrage] INTÉGRAL — n'ayant aucune URL de portrait dans la source aspirée,
     on pose des aplats sombres et peu saturés, calés sur la valeur des photos
     d'origine pour ne pas déséquilibrer la composition. Cadence déclarée en CSS. */
  function disques() {
    var groupe = document.querySelector('[data-disques]');
    if (!groupe) return;
    var teintes = ['hsl(28 18% 42%)', 'hsl(220 12% 38%)', 'hsl(240 20% 40%)',
                   'hsl(150 12% 34%)', 'hsl(0 0% 30%)'];
    var pastilles = groupe.querySelectorAll('.disque');
    var rang = 0;
    function peindre() {
      pastilles.forEach(function (d, i) {
        d.style.backgroundColor = teintes[(rang + i) % teintes.length];
      });
      rang += 1;
    }
    peindre();
    /* [arbitrage] 2,6 s : la transition d'1 s a le temps de se poser. */
    /* [arbitrage] intervalle coupé/relancé sur visibilitychange pour ne pas tourner en arrière-plan. */
    if (!sobre) { var id = window.setInterval(peindre, 2600); document.addEventListener('visibilitychange', function () { if (document.hidden) { window.clearInterval(id); } else { id = window.setInterval(peindre, 2600); } }); }
  }

  /* ----- 6. RAIL DE MARQUES — le SEUL système actif/inactif de la page.
     [relevé] carte centrée à opacity-100, les autres à opacity-25, en 400 ms
     courbe de sortie. Le JS désigne la carte centrée ; le CSS fait le fondu.
     Cliquer une carte la ramène au centre — c'est ce que dit son aria-label dans
     la source (« Center … brand card »). ----- */
  function rail() {
    var piste = document.querySelector('[data-rail]');
    if (!piste) return;
    var cartes = piste.querySelectorAll('.rail__carte');
    if (!cartes.length) return;
    function recadrer() {
      var actif = indexCentre(piste, cartes);
      cartes.forEach(function (c, i) { c.classList.toggle('est-active', i === actif); });
    }
    cartes.forEach(function (c) {
      c.addEventListener('click', function () { amener(c, 'center'); });
    });
    piste.addEventListener('scroll', function () { window.requestAnimationFrame(recadrer); }, { passive: true });
    window.addEventListener('resize', recadrer);
    centrerSur(piste, cartes[1] || cartes[0]); /* [relevé] le rail ouvre sur sa 2e carte */
    recadrer();
  }

  halos(); revelations(); carrousel(); vitrine(); disques(); rail();
})();
