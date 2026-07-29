/* Référence de design — comportements d'interface. JS vanilla, aucune dépendance.
   [relevé] = lu dans la source (HTML statique ou feuille CSS)
   [arbitrage] = choix de cette référence, non observable dans la source.

   La source est une application Next.js : le HTML aspiré ne garde des comportements que
   les traces déposées avant hydratation — un état de départ en style inline, les
   attributs de lecture des <video>, les classes de mise en page. Durées, courbes et
   mécanique de défilement vivent dans le bundle et sont signalées comme non relevables. */

(() => {
  'use strict';

  /* Relue à chaque décision plutôt que capturée une fois : la préférence peut changer en
     cours de session, et une page à huit vidéos doit s'y plier tout de suite.
     [arbitrage] — la source ne consulte cette préférence nulle part. */
  const calme = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observable = 'IntersectionObserver' in window;

  /* ==== 1. Apparition au défilement ====================================
     Procédé relevé : ~18 conteneurs portent, dans le HTML servi,
     `style="opacity:0;transform:translateY(5px)"` [relevé] — l'état de DÉPART, écrit en
     dur avant hydratation. Durée et courbe n'apparaissent nulle part dans la feuille :
     celles employées ici sont [arbitrage] et vivent dans styles.css.
     Deux écarts volontaires : l'état de départ est posé en CSS (pas inline), et sous
     `reduce` tout est révélé immédiatement, sans transition. */
  const cibles = document.querySelectorAll('[data-apparition]');
  const revelerTout = () => cibles.forEach((el) => el.classList.add('est-visible'));

  if (calme.matches || !observable) {
    revelerTout(); /* jamais de contenu laissé à opacity 0 */
  } else {
    const vigie = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('est-visible');
        vigie.unobserve(e.target); /* une seule fois : pas de ré-animation au retour */
      });
    }, {
      rootMargin: '0px 0px -10% 0px', /* [arbitrage] déclenche quand l'élément est franchement entré */
      threshold: 0.01
    });
    cibles.forEach((el) => vigie.observe(el));
  }

  /* ==== 2. Lecture des vidéos ==========================================
     Attributs relevés sur les 8 <video>, identiques pour toutes :
     `preload="none" loop muted autoplay playsinline` [relevé] — ni poster, ni <source>,
     ni controls.

     `preload="none"` empêche le préchargement, pas la lecture automatique : dès que le
     navigateur démarre, il télécharge. Sur huit vidéos, cela fait huit téléchargements
     concurrents au chargement.

     Ce que ce bloc ajoute [arbitrage] : `src` posé seulement à l'approche du viewport
     (les <video> portent data-src), lecture arrêtée à la sortie d'écran donc un seul
     décodage à la fois, et sous `reduce` la source est chargée pour afficher la première
     image mais play() n'est jamais appelé. */
  const videos = document.querySelectorAll('[data-video-differee]');

  const activerVideo = (v) => {
    /* [arbitrage] garde `&& v.dataset.src` : sans elle, un data-src absent (undefined) est
       coercé par l'IDL en "undefined" — le navigateur chargerait cette URL relative littérale. */
    if (!v.src && v.dataset.src) {
      v.src = v.dataset.src;
      v.preload = 'metadata'; /* [arbitrage] de quoi afficher la 1re image, la suite vient de la lecture */
    }
    if (calme.matches) return;
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {}); /* refus d'autoplay = cas normal */
  };

  if (observable) {
    const veilleuse = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) activerVideo(v);
        else if (v.src && !v.paused) v.pause();
      });
    }, {
      rootMargin: '200px 0px', /* [arbitrage] la vidéo se prépare avant d'être vue, sans charger de loin */
      threshold: 0.1
    });
    videos.forEach((v) => veilleuse.observe(v));
  } else {
    videos.forEach(activerVideo);
  }

  /* Préférence changée en cours de session : mise en conformité immédiate, dans les deux
     sens. [arbitrage] */
  if (typeof calme.addEventListener === 'function') {
    calme.addEventListener('change', () => {
      if (calme.matches) {
        videos.forEach((v) => { if (v.src && !v.paused) v.pause(); });
        revelerTout();
        return;
      }
      videos.forEach((v) => {
        const r = v.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) activerVideo(v);
      });
    });
  }

  /* ==== 3. Vidéos de survol de la mosaïque =============================
     DEUXIÈME traitement vidéo de la page, opposé au premier. Relevé sur les vignettes :
     `preload="auto" loop playsinline`, superposée en `absolute inset-0 object-cover`,
     `opacity-0` au repos et `group-hover:opacity-100` au survol.

     Deux défauts corrigés ici :
     - `preload="auto"` sur douze vidéos les fait toutes télécharger au chargement, pour
       un contenu que personne ne verra sans survoler. Remplacé par un chargement au
       premier survol. [arbitrage]
     - la source omet `muted` : sans lui, un navigateur refuse la lecture programmée.
       L'attribut est ajouté dans le HTML. [arbitrage]

     Sous `reduce`, aucune lecture : la vignette garde son image de couverture. */
  document.querySelectorAll('[data-video-survol]').forEach((v) => {
    const vignette = v.closest('.vignette');
    if (!vignette) return;

    const demarrer = () => {
      if (calme.matches) return;
      /* [arbitrage] même garde qu'en §2 : dataset.src absent → éviter la coercion "undefined". */
      if (!v.src && v.dataset.src) v.src = v.dataset.src; /* chargé au premier survol, jamais avant */
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    const arreter = () => { if (v.src && !v.paused) v.pause(); };

    vignette.addEventListener('mouseenter', demarrer);
    vignette.addEventListener('mouseleave', arreter);
    /* Au clavier : le focus vaut le survol, sinon le procédé n'existe que pour la souris. */
    vignette.addEventListener('focusin', demarrer);
    vignette.addEventListener('focusout', arreter);
  });

  /* ==== 4. Rails horizontaux (offres, témoignages) =====================
     Relevé : conteneur `overflow-hidden relative`, piste `flex items-end`, largeurs de
     cellule `w-[85%] sm:w-[45%] md:w-1/3`, commandes (deux flèches 40 × 40 à opacity .65,
     jauge 50 × 6 sur #333).

     NON relevable : la mécanique de déplacement. Le HTML statique ne contient ni
     `overflow-x-auto`, ni `snap-*`, ni `translate-x`, ni `transition-transform`
     (0 occurrence de chacun) — la source déplace ses rails en JS, styles posés au
     runtime. Le défilement natif retenu ici est un [arbitrage] : même geste (glisser,
     bouton suivant, position visible) sans inventer une implémentation invérifiable. */
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const piste = rail.querySelector('.rail__piste');
    if (!piste) return;

    /* Les commandes sont sous le rail, pas dedans : on les cherche dans le parent. Leur
       absence est un cas normal — le rail des offres n'en a pas. */
    const zone = rail.parentElement;
    const jauge = zone && zone.querySelector('[data-rail-jauge]');

    const majJauge = () => {
      if (!jauge) return;
      const course = piste.scrollWidth - piste.clientWidth;
      const part = course <= 0 ? 1 : piste.scrollLeft / course;
      jauge.style.width = (part * 100).toFixed(2) + '%';
    };

    piste.addEventListener('scroll', majJauge, { passive: true });
    window.addEventListener('resize', majJauge);
    majJauge();

    if (!zone) return;
    zone.querySelectorAll('[data-rail-pas]').forEach((bouton) => {
      bouton.addEventListener('click', () => {
        const cellule = piste.firstElementChild;
        const largeur = cellule ? cellule.offsetWidth : piste.clientWidth;
        piste.scrollBy({
          left: largeur * Number(bouton.dataset.railPas),
          /* Sous `reduce`, saut instantané : un défilement animé de plusieurs centaines
             de pixels est exactement ce que cette préférence écarte. */
          behavior: calme.matches ? 'auto' : 'smooth'
        });
      });
    });
  });

  /* ==== 5. Sélecteur de facturation ====================================
     Procédé relevé, contre-intuitif et réutilisable : l'option ACTIVE est celle qui porte
     `disabled`. La feuille ne définit aucune classe d'état sélectionné — c'est
     `disabled:text-white` qui allume l'option courante, pendant que l'autre reste à
     `text-white/30` avec un survol à `text-white/75`. [relevé]

     Basculer se réduit donc à déplacer l'attribut : aucun état en JS, aucune classe à
     synchroniser, et l'option active sort naturellement de l'ordre de tabulation. */
  document.querySelectorAll('.bascule').forEach((bascule) => {
    const options = bascule.querySelectorAll('.bascule__option');
    options.forEach((option) => {
      option.addEventListener('click', () => {
        options.forEach((o) => { o.disabled = (o === option); });
      });
    });
  });
})();
