/* =========================================================================
   fora.so — RÉFÉRENCE DE MOUVEMENT

   La source ne contient AUCUN @keyframes et AUCUN animation-timeline : tout le
   mouvement y est produit par le runtime Framer Motion plus Lenis 1.3.19 pour
   le scroll. Conséquence : chaque MÉCANIQUE de ce fichier est un [arbitrage],
   mais les VALEURS (état de départ, durée, courbe, délai) sont [relevé] —
   Framer les sérialise dans <script id="__framer__appearAnimationsContent">.

   Table des apparitions, telle qu'elle sort de ce JSON :

     id          élément             initial             transition
     ─────────── ─────────────────── ─────────────────── ─────────────────────
     1xw88z8     nav                 opacity .001, y −36 tween 1s [.44,0,.56,1]
     1ed9fxm     dégradé du hero     opacity .001        spring bounce 0, .5s
     u991jm      collines lointaines opacity .001, y 72  spring bounce 0, 1s
     f7ktf5      collines proches    opacity 1,    y 48  spring bounce 0, 1s
     1wreg0p-0   chip du hero        opacity .001, y 24  spring bounce 0, 1s
     1ke5g3l     h1                  opacity .001, y 24  spring 1s, delay .1
     jzdou5      accroche            opacity .001, y 24  spring 1s, delay .2
     1b8x4ar     bouton              opacity .001, y 24  spring 1s, delay .3
     13cc0rb     avant-plan          opacity 1,    y 36  spring bounce 0, 1s

   Sommaire
     0. Préambule            4. Intro : le texte qui s'allume
     1. Inertie de scroll    5. Onglets + galerie
     2. Apparitions          6. Compteur de prix + bascule
     3. Navigation           7. FAQ        8. Halo de carte
   ========================================================================= */

(function () {
  'use strict';

  /* ---------- 0. PRÉAMBULE ---------------------------------------------- */

  /* Les états de départ du CSS ne s'appliquent que sous `.js`. Sans ce fichier,
     la page reste entièrement lisible au lieu d'être à moitié invisible — même
     précaution que celle qui rend les 243 opacity:0 de la source si dangereux
     à recopier tels quels. */
  document.documentElement.classList.add('js');

  /* Une seule source de vérité pour le mouvement réduit, relue à chaque
     changement : l'utilisateur peut basculer le réglage sans recharger.
     `addListener()` est deprecated — on utilise addEventListener('change'). */
  var mq = matchMedia('(prefers-reduced-motion: reduce)');
  var doux = mq.matches;
  mq.addEventListener('change', function (e) { doux = e.matches; });

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  /* Anti-rebond sur requestAnimationFrame : un handler de scroll doit rendre la
     main immédiatement et ne calculer qu'une fois par frame. */
  function parFrame(fn) {
    var attend = false;
    return function () {
      if (attend) return;
      attend = true;
      requestAnimationFrame(function () { attend = false; fn(); });
    };
  }

  /* Bézier cubique résolue par bissection — pour animer en JS une propriété non
     transitionnable (un compteur, un tracé) avec exactement les courbes de la
     page. Vingt itérations : la précision atteinte est très en dessous du pixel.
     `signature` est [relevé] : cubic-bezier(.44,0,.56,1) apparaît à deux endroits
     indépendants de la source — le preset de lien et l'ease du tween de la nav.
     `sortie` est l'[arbitrage] qui remplace {"type":"spring","bounce":0}. */
  function courbe(t, a, b) { var u = 1 - t; return 3*u*u*t*a + 3*u*t*t*b + t*t*t; }
  function bezier(x1, y1, x2, y2, x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bas = 0, haut = 1, t = x, i, xt;
    for (i = 0; i < 20; i++) {
      xt = courbe(t, x1, x2);
      if (Math.abs(xt - x) < 1e-6) break;
      if (xt < x) bas = t; else haut = t;
      t = (bas + haut) / 2;
    }
    return courbe(t, y1, y2);
  }
  window.foraEase = {
    signature: function (t) { return bezier(0.44, 0, 0.56, 1, t); },
    sortie:    function (t) { return bezier(0.16, 1, 0.30, 1, t); }
  };

  /* ---------- 1. INERTIE DE SCROLL --------------------------------------
     La source charge Lenis 1.3.19 (<link href=".../lenis@1.3.19/dist/lenis.css">).
     Reproduit ici sans dépendance : la molette n'est plus appliquée au document,
     elle nourrit une position CIBLE vers laquelle la position réelle glisse à
     chaque frame. LERP 0.1 est la valeur par défaut de Lenis.  [arbitrage]

     Trois garde-fous, parce qu'une inertie mal posée est pire que pas d'inertie :

       · coupée sous prefers-reduced-motion. À retenir : contrairement aux
         animations CSS, l'API de scroll JS ne consulte JAMAIS cette préférence
         d'elle-même — c'est au code de la lire et d'en tenir compte, sinon on
         anime précisément pour les gens qui ont demandé l'inverse ;
       · coupée sur pointeur grossier, où le défilement natif a déjà son inertie,
         fournie par l'OS et mieux calibrée que tout ce qu'on écrirait ;
       · le clavier, les ancres et la barre de défilement ne sont pas
         interceptés : un écouteur `scroll` resynchronise la cible dès qu'un
         défilement ne vient pas de la molette, sinon la page « revient en
         arrière » après un Page Down. */

  function inertie() {
    if (doux) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var LERP = 0.1, cible = window.scrollY, actuel = cible, anime = false;

    function frame() {
      var ecart = cible - actuel;
      if (Math.abs(ecart) < 0.4) {        /* sous un demi-pixel : arrêt net */
        actuel = cible;
        anime = false;
        window.scrollTo(0, actuel);
        return;
      }
      actuel += ecart * LERP;
      window.scrollTo(0, actuel);
      requestAnimationFrame(frame);
    }

    addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;              /* zoom du navigateur : ne pas toucher */
      e.preventDefault();
      var max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      cible = Math.min(max, Math.max(0, cible + e.deltaY));
      if (!anime) { anime = true; requestAnimationFrame(frame); }
    }, { passive: false });

    addEventListener('scroll', function () {
      if (!anime) { cible = actuel = window.scrollY; }
    }, { passive: true });

    addEventListener('resize', function () { cible = actuel = window.scrollY; });
  }

  /* ---------- 2. APPARITIONS --------------------------------------------
     PIÈGE CENTRAL DE CETTE SOURCE : 243 occurrences de opacity:0 / 0.001 et 10
     data-framer-appear-id. Ce sont des états d'AVANT-animation, jamais le
     design. Deux familles à distinguer :
       · data-framer-appear-id + opacity:0.001 → apparition au CHARGEMENT
       · opacity:0 + will-change:transform     → apparition au SCROLL          */

  var vus = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      vus.unobserve(e.target);   /* one-shot : rejouer au retour du scroll est
                                    du bruit, le lecteur a déjà vu le bloc */
    });
  }, {
    /* threshold:0 et non 0.12 : un seuil de RATIO ne se déclenche jamais sur un
       nœud de hauteur nulle ou quasi nulle — typiquement un <span> qui
       n'enveloppe qu'un bouton. Le retrait « franchement entré » est confié au
       rootMargin, qui est absolu et rétrécit la zone avant le calcul. */
    threshold: 0,
    rootMargin: '0px 0px -6% 0px'
  });

  var cibles = $$('[data-monte], [data-observe]');
  cibles.forEach(function (n) { vus.observe(n); });

  /* Filet de sécurité. Dans une référence de design, un bloc resté invisible est
     le pire défaut possible. Une fois les images chargées — donc le layout
     stabilisé — on révèle tout ce qui est DÉJÀ entré dans le champ, et rien de
     plus, pour ne pas court-circuiter le reveal des sections plus bas. */
  addEventListener('load', function () {
    setTimeout(function () {
      cibles.forEach(function (n) {
        if (n.getBoundingClientRect().top < innerHeight) n.classList.add('is-in');
      });
    }, 300);
  });

  /* ---------- 3. NAVIGATION ---------------------------------------------
     La nav s'anime au CHARGEMENT, pas au scroll : [relevé] appear id 1xw88z8,
     initial {opacity:.001, y:-36}, tween 1s, ease [0.44,0,0.56,1].
     Le voile est un objet distinct — [relevé] .framer-6fjk0p-container porte
     style="opacity:0" et un linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, …)
     que le runtime révèle au défilement. Ce n'est pas un backdrop-filter : la
     nav est NUE en haut de page, et se pose sur un voile dès qu'on descend. */

  var nav = $('.nav');
  if (nav) {
    requestAnimationFrame(function () { nav.classList.add('is-in'); });

    var SEUIL_VOILE = 24;   /* [arbitrage] quelques pixels suffisent : le voile
                               doit être là avant que le titre passe dessous. */
    var majNav = parFrame(function () {
      nav.classList.toggle('est-defile', window.scrollY > SEUIL_VOILE);
    });
    addEventListener('scroll', majNav, { passive: true });
    majNav();

    var basculeNav = $('.nav__bascule', nav);
    if (basculeNav) {
      basculeNav.addEventListener('click', function () {
        var ouvert = nav.classList.toggle('est-ouverte');
        basculeNav.setAttribute('aria-expanded', String(ouvert));
      });
      $$('.nav__liens a', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('est-ouverte');
          basculeNav.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---------- 4. INTRO : LE TEXTE QUI S'ALLUME --------------------------
     Le procédé le plus réutilisable de la page. [relevé] trois <h4> portant
     style="opacity:0.25" dans une variante nommée « Idle », surmontés de quatre
     zones vides #intro-1 … #intro4 dans un conteneur en position:absolute,
     pointer-events:none, user-select:none.

     ATTENTION — ce 0.25 est un état de REPOS, pas un état d'avant-animation :
     c'est le piège INVERSE des 243 opacity:0 du bloc 2. Le reproduire est
     indispensable ; le « corriger » à 1 ne répare rien, ça supprime l'effet.
     Le seul indice fiable est le nom de la variante : `Idle` désigne un repos,
     un appear-id désigne une entrée.

     Un IntersectionObserver ne suffit pas ici : il donne un booléen, alors qu'il
     faut une POSITION CONTINUE. On mesure la progression du bloc à travers le
     viewport et on allume ceil(q × n) paragraphes. Fenêtre resserrée sur
     0.30 → 0.70 de la traversée : l'effet doit se jouer pendant qu'on lit le
     bloc, pas quand il affleure le bord de l'écran.  [arbitrage]

     Quatre déclencheurs pour trois paragraphes : la quatrième zone sert à finir
     la séquence avant que le bloc quitte le champ. */

  var prose = $('.intro__prose');
  if (prose) {
    var paras = $$('h4', prose);

    var majIntro = function () {
      var r = prose.getBoundingClientRect();
      /* 0 quand le haut du bloc atteint le bas du viewport,
         1 quand le bas du bloc atteint le haut. */
      var p = (innerHeight - r.top) / (innerHeight + r.height);
      var q = Math.min(1, Math.max(0, (p - 0.30) / 0.40));
      var allumes = Math.ceil(q * paras.length);
      paras.forEach(function (el, i) {
        el.classList.toggle('est-allume', i < allumes);
      });
    };

    if (doux) {
      paras.forEach(function (el) { el.classList.add('est-allume'); });
    } else {
      addEventListener('scroll', parFrame(majIntro), { passive: true });
      addEventListener('resize', majIntro);
      majIntro();
    }
  }

  /* ---------- 5. ONGLETS + GALERIE --------------------------------------
     [relevé] quatre .framer-8x98wc (width:376px; padding:8px 24px; gap:12px)
     dans une pilule à rayon 72px. L'état actif superpose TROIS signaux : la
     couleur du libellé, une carte interne à rayon 66px remplie de
     rgba(33,33,33,.85), et un filet de 2px en top:-1px masqué par
     linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0, 0, 0) 50.49169398299905%,
     rgba(0,0,0,0) 100%). Le fondu entre visuels et le pilotage sont en JS. */

  var galerie = $('#galerie');
  if (galerie) {
    var calques = $$('.galerie__calque', galerie);
    var onglets = $$('.onglet');
    var legende = $('#legende');
    var index = 0;

    var activer = function (i, auClavier) {
      index = (i + calques.length) % calques.length;

      calques.forEach(function (c, k) {
        c.classList.toggle('is-active', k === index);
      });
      onglets.forEach(function (o, k) {
        var actif = k === index;
        o.setAttribute('aria-selected', String(actif));
        o.tabIndex = actif ? 0 : -1;      /* un seul onglet dans l'ordre de tab */
        if (actif && auClavier) o.focus();
      });

      /* La légende change en deux temps : sortie, remplacement du texte à
         mi-course, retour. La remplacer pendant qu'elle est visible produit un
         saut de texte. Le délai est aligné sur la transition d'opacité du CSS
         (.35s) — et tombe à 0 sous mouvement réduit, sinon le texte resterait
         invisible le temps d'un délai devenu inutile. */
      if (!legende) return;
      legende.classList.add('est-sortante');
      setTimeout(function () {
        legende.textContent = onglets[index].dataset.legende || '';
        legende.classList.remove('est-sortante');
      }, doux ? 0 : 350);
    };

    onglets.forEach(function (o, i) {
      o.addEventListener('click', function () { activer(i); });
    });

    /* Navigation clavier attendue d'un role="tablist" : flèches, Début, Fin. */
    var barre = $('.onglets');
    if (barre) {
      barre.addEventListener('keydown', function (e) {
        var k = e.key, n = calques.length;
        if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); activer(index + 1, true); }
        else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); activer(index - 1, true); }
        else if (k === 'Home') { e.preventDefault(); activer(0, true); }
        else if (k === 'End')  { e.preventDefault(); activer(n - 1, true); }
      });
    }

    var prec = $('#prec'), suiv = $('#suiv');
    if (prec) prec.addEventListener('click', function () { activer(index - 1); });
    if (suiv) suiv.addEventListener('click', function () { activer(index + 1); });

    activer(0);
  }

  /* ---------- 6. COMPTEUR DE PRIX + BASCULE -----------------------------
     Constat de départ [relevé] : le rendu serveur affiche « $ » suivi de « 0 »
     dans une typo h3 (font-size:36px, "Inter Display", letter-spacing:-0.02em).
     Un prix rendu à zéro côté serveur prouve qu'il est animé à l'arrivée — et
     deux captures du site en ligne à quelques secondes d'écart donnent $7/$15
     puis $8/$16, ce qui confirme un compteur en cours de montée.

     Mécanique [arbitrage] : chaque chiffre est une COLONNE de dix glyphes
     translatée verticalement. Trois points font l'effet —
       1. la hauteur de colonne vaut l'interligne relevé (1.35em), pas une
          valeur ronde : c'est ce qui aligne le rouleau sur la ligne de base ;
       2. font-variant-numeric: tabular-nums, sinon la largeur des colonnes
          change pendant le défilement et le nombre tremble ;
       3. un décalage de 60 ms entre colonnes — sans lui les chiffres bougent en
          bloc et l'effet se lit comme une translation, pas comme un compteur. */

  function rouler(el, valeur) {
    var chiffres = String(valeur).split('');

    /* Reconstruire dès que le NOMBRE de colonnes change (0 → 19 → 7) : sans ça,
       une valeur à deux chiffres ne remplirait que la première colonne. */
    if (el.dataset.cols !== String(chiffres.length)) {
      el.dataset.cols = String(chiffres.length);
      var glyphes = '0123456789'.split('').map(function (d) {
        return '<span>' + d + '</span>';
      }).join('');
      el.innerHTML =
        '<span class="rouleau__col"><div><span>$</span></div></span>' +
        chiffres.map(function (_, c) {
          return '<span class="rouleau__col"><div style="--c:' + (c + 1) + '">' +
                 glyphes + '</div></span>';
        }).join('');
    }

    /* Un frame de décalage : sur des colonnes tout juste créées, poser --d dans
       la foulée ne produit aucune transition, faute d'état de départ observé
       par le moteur de rendu. */
    requestAnimationFrame(function () {
      var cols = $$('.rouleau__col > div', el);
      chiffres.forEach(function (d, c) {
        if (cols[c + 1]) cols[c + 1].style.setProperty('--d', d);
      });
    });
  }

  var prix = $$('[data-prix]');
  var periode = 'mois';
  var majPrix = function () {
    prix.forEach(function (p) { rouler(p, p.dataset[periode]); });
  };

  if (prix.length) {
    prix.forEach(function (p) { rouler(p, 0); });   /* état SSR de la source */
    var obsPrix = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        majPrix();
        obsPrix.unobserve(e.target);
      });
    }, { threshold: 0.3 });
    prix.forEach(function (p) { obsPrix.observe(p); });
  }

  /* Bascule mensuel / annuel. [arbitrage] assumé : la source nomme la section
     « Animated Price Switch » mais ne contient AUCUN sélecteur de période dans
     son DOM. Le curseur est MESURÉ sur offsetLeft/offsetWidth du bouton actif,
     jamais codé en dur — traduire « Monthly » en « Mensuel » change la largeur
     du bouton, et une valeur figée décalerait le curseur. */

  var bascule = $('.bascule');
  if (bascule) {
    var curseur = $('.bascule__curseur', bascule);
    var boutons = $$('button', bascule);

    var placer = function (actif) {
      curseur.style.setProperty('--l', actif.offsetWidth + 'px');
      curseur.style.setProperty('--x', (actif.offsetLeft - boutons[0].offsetLeft) + 'px');
    };
    var courant = function () {
      return boutons.filter(function (b) {
        return b.getAttribute('aria-pressed') === 'true';
      })[0] || boutons[0];
    };

    boutons.forEach(function (b) {
      b.addEventListener('click', function () {
        boutons.forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
        periode = b.dataset.periode;
        placer(b);
        majPrix();
      });
    });

    placer(courant());
    /* Les polices web arrivent après le premier rendu et changent la largeur
       des libellés : on remesure une fois qu'elles sont là. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { placer(courant()); });
    }
    addEventListener('resize', function () { placer(courant()); });
  }

  /* ---------- 7. FAQ : CATÉGORIES + ACCORDÉONS --------------------------
     [relevé] deux colonnes au ratio 1:2 (.framer-2jfjwj{flex:2 0 0}), les
     catégories à gauche, les accordéons à droite. L'ouverture est faite en CSS
     par grid-template-rows: 0fr → 1fr : aucune hauteur n'est mesurée en JS, ce
     qui la rend insensible au contenu et au redimensionnement. */

  $$('.faq__tete').forEach(function (tete) {
    tete.addEventListener('click', function () {
      var item = tete.closest('.faq__item');
      var ouvert = item.classList.toggle('est-ouvert');
      tete.setAttribute('aria-expanded', String(ouvert));
    });
  });

  var cats = $$('.faq__cat');
  cats.forEach(function (c) {
    c.addEventListener('click', function () {
      cats.forEach(function (o) {
        o.setAttribute('aria-pressed', String(o === c));
      });
      $$('.faq__item').forEach(function (item) {
        var visible = c.dataset.groupe === 'tout' ||
                      item.dataset.groupe === c.dataset.groupe;
        item.hidden = !visible;
        /* Une question masquée doit être refermée : la retrouver dépliée plus
           tard produirait un saut de mise en page. */
        if (!visible) {
          item.classList.remove('est-ouvert');
          var t = $('.faq__tete', item);
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  /* ---------- 8. HALO DE CARTE ------------------------------------------
     [relevé] chaque carte de la source contient un <div data-glow="true"
     style="position:absolute;inset:0;opacity:0;pointer-events:none"> — une
     couche livrée VIDE et peinte par le runtime. On rend l'intention : deux
     variables CSS suivent le curseur, le dégradé radial reste décrit en CSS.
     Écrire des coordonnées plutôt qu'un `background` évite de recomposer une
     image à chaque frame. */

  $$('[data-lueur]').forEach(function (carte) {
    carte.addEventListener('pointermove', function (ev) {
      var r = carte.getBoundingClientRect();
      carte.style.setProperty('--mx', ((ev.clientX - r.left) / r.width  * 100) + '%');
      carte.style.setProperty('--my', ((ev.clientY - r.top)  / r.height * 100) + '%');
    });
  });

  /* ---------- Démarrage -------------------------------------------------- */
  inertie();
})();
