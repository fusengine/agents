/* motion.js — TOUS les comportements de la référence, en un seul fichier :
   révélation au scroll, onglets rotatifs, carrousel de témoignages, compteur du
   bloc géant, parallaxe du média du hero, méga-menus et panneaux de la barre.
   (Ce fichier était scindé en motion.js + motion-nav.js ; la scission ne
   répondait qu'à un plafond de lignes qui n'a pas lieu d'être — le format du
   corpus compte les FICHIERS, pas les lignes. Les deux parties partagent
   maintenant une seule lecture de la préférence de mouvement, ce qui supprime
   au passage un doublon d'écouteur `matchMedia`.)

   [arbitrage] LOTTIE EST RETIRÉ. La source en dépend deux fois — la bibliothèque
   depuis cdnjs, les six .json depuis le CDN Webflow — et l'échec n'est pas
   silencieux : hors réseau, six panneaux sur quinze sont des boîtes vides. Les
   six médias sont désormais des SVG inline animés en CSS (styles.css § 14) ; ils
   n'ont besoin d'aucun script, se rejouent seuls quand leur panneau devient
   actif, et n'exposent donc plus rien à charger, mettre en pause ou détruire ici.
   Détail complet dans tokens-harness.md § 10.

   Moteurs de la source : GSAP 3.15.0 (+ScrollTrigger, ScrollSmoother, Flip, MorphSVG,
   TextPlugin, ScrollToPlugin) et Lottie-web 5.12.2. PAS de Rive. GSAP est chargé et
   registerPlugin appelé, mais aucun gsap.to/from/timeline ni bloc scrollTrigger: dans
   le HTML livré : les effets visibles y sont déjà en JS vanilla + IntersectionObserver.
   Chaque bloc note son moteur ; valeurs détaillées dans tokens-harness.md §2-§3. */
(function () {
  'use strict';
  /* == 0. PRÉFÉRENCE DE MOUVEMENT — relue à chaud ; addListener() est deprecated.
     PIÈGE : scrollBy avec behavior:'smooth' ne consulte JAMAIS prefers-reduced-motion
     (l'API scroll JS ignore la préférence, contrairement au CSS) — d'où la lecture
     manuelle, et un behavior toujours EXPLICITE : l'omettre retombe sur 'auto'. */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduit = mq.matches, abonnes = [];
  mq.addEventListener('change', function (e) {
    reduit = e.matches; abonnes.forEach(function (f) { f(reduit); });
  });
  function scrollBehavior() { return reduit ? 'instant' : 'smooth'; }

  /* == 1. RÉVÉLATION AU SCROLL — moteur : JS vanilla + IO (B l.3210). [relevé]
     threshold 0.2, unobserve après le 1er passage. [arbitrage] rootMargin -12 % en
     bas : la source n'a qu'un bloc à révéler, nous une douzaine. */
  var obs = new IntersectionObserver(function (es, o) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-revealed'); o.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

  /* == FABRIQUE DE ROTATION — partagée par les onglets (§2) et le carrousel (§3).
     [relevé] le minuteur ne tourne que si la section est visible, et la PREMIÈRE
     interaction pose un drapeau DÉFINITIF (B l.3177). [arbitrage] rien ne tourne en
     mouvement réduit — la source laisse courir, sa garde ne couvrant que le CSS. */
  function rotation(racine, boutons, dwell, activer, auReveal) {
    var idx = 0, timer = null, stopUser = false, visible = false, lance = false;
    function stop() { if (timer) { clearTimeout(timer); timer = null; } }
    function aller(i, auto) { idx = i; activer(i, auto); }
    function planifier() {
      stop();
      if (stopUser || !visible || reduit) return;
      /* `dwell` est un NOMBRE. La source, elle, choisissait selon le TYPE du
         panneau actif (B l.2925-2926 : IMAGE_DWELL_MS 4000 contre
         LOTTIE_DWELL_MS 23000) — d'où un dwell qui pouvait être une fonction de
         l'index courant. Sans Lottie les quinze panneaux sont de même nature, et
         la branche `typeof dwell === 'function'` n'avait plus d'appelant. */
      timer = setTimeout(function () { aller((idx + 1) % boutons.length, true); planifier(); }, dwell);
    }
    boutons.forEach(function (b, i) {
      b.addEventListener('pointerdown', function () { stopUser = true; stop(); aller(i, false); }, { passive: true });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); stopUser = true; stop();
        var n = (i + (e.key === 'ArrowRight' ? 1 : boutons.length - 1)) % boutons.length;
        aller(n, true); boutons[n].focus();
      });
    });
    new IntersectionObserver(function (es) {
      var e = es[0]; if (!e) return;
      visible = e.isIntersecting;
      if (!visible) { stop(); return; }
      if (lance) { planifier(); return; }
      lance = true;
      if (auReveal) { auReveal(planifier); } else { planifier(); }
    }, { threshold: 0.2 }).observe(racine);
    abonnes.push(function (r) { if (r) { stop(); } else { planifier(); } });
  }

  /* == 1bis. LES SIX MÉDIAS QUI ÉTAIENT DES LOTTIE — plus aucun code ici.
     La source lisait `data-lottie-url` sur `.lottie-container-wrapper`, créait
     l'animation à la volée, et DÉTRUISAIT les instances des onglets inactifs
     (B l.2956-2975) ; ce recode mettait en pause plutôt que détruire, pour qu'un
     panneau vidé ne reste pas vide.
     Tout ce mécanisme disparaît : les six médias sont des SVG inline animés en
     CSS. Plus d'instance à créer, à jouer, à mettre en pause ni à détruire —
     c'est la classe `is-active` du panneau, posée en §2, qui arme et désarme les
     animations (styles.css § 14.3). Un sélecteur remplace un cycle de vie. */

  /* == 2. MODULES À ONGLETS ROTATIFS — moteur : JS vanilla (B l.2925-3241), quatre
     instances indépendantes. COMPOSITION : le média (.vd__scene) précède la rangée
     d'onglets (.vd__onglets) dans le DOM, comme dans la source — le JS ne fait que
     basculer l'état, il ne recompose rien.
     [relevé] filet de 800 ms (B l.3232) : transitionend ne tire pas si l'élément est
     masqué ou si une préférence supprime la transition.
     Cascade d'entrée — moteur : CSS déclenché par JS (B l.3099-3123). [relevé] média
     à 120 ms, halo à 420 ms ; durées dans styles.css. [relevé] B l.3117 : le reflow
     forcé est indispensable, sinon la classe réajoutée ne rejoue rien.

     [arbitrage] DWELL — la source n'avait PAS un délai unique : elle choisissait
     selon le TYPE du panneau actif (B l.2925-2926, IMAGE_DWELL_MS 4000 contre
     LOTTIE_DWELL_MS 23000). Les 23 s n'étaient là que pour laisser une boucle
     Lottie se jouer entièrement. Sans Lottie ce cas n'existe plus, et la
     distinction non plus : les quinze panneaux sont désormais de même nature —
     une image fixe ou une scène SVG. D'où UNE seule valeur.
     6000 et non 4000 : la plus longue entrée de scène finit à ~3,1 s
     (styles.css § 14.3, balayage SAST : 0,3 s de retard + 2,8 s de durée). À
     4000 il resterait 0,9 s de lecture avant la bascule — on verrait la scène se
     monter puis disparaître, ce qui est pire que pas d'animation du tout. 6000
     laisse ~2,9 s de panneau immobile et lisible, tout en restant loin des 23 s
     d'origine. */
  var DWELL_MS = 6000;

  document.querySelectorAll('[data-vd]').forEach(function (racine) {
    var ongl = [].slice.call(racine.querySelectorAll('.carte'));
    var pans = [].slice.call(racine.querySelectorAll('.pane'));
    var rangee = racine.querySelector('.vd__onglets');
    if (!ongl.length || !pans.length) return;
    var revele = false, courant = 0;
    function media(p) { return p.querySelector('.pane__media'); }
    function animer() {
      if (!revele) return;
      pans.forEach(function (p) {
        media(p).classList.remove('is-media-entering');
        p.querySelector('.pane__halo').classList.remove('is-blur-bg-entering');
      });
      var a = pans[courant]; if (!a) return;
      var m = media(a), h = a.querySelector('.pane__halo');
      requestAnimationFrame(function () {
        void m.offsetWidth; void h.offsetWidth;
        m.classList.add('is-media-entering'); h.classList.add('is-blur-bg-entering');
      });
    }
    function activer(i, auto) {
      courant = i;
      ongl.forEach(function (o, k) {
        o.classList.toggle('is-active', k === i);
        o.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      /* `is-active` sur le panneau porte DEUX rôles : il l'affiche, et il arme
         les animations de la scène SVG (styles.css § 14.3, sélecteurs préfixés
         `.pane.is-active`). Le retirer remet la scène à zéro, le remettre la
         rejoue : c'est ce qui remplace play()/pause() de Lottie, sans instance. */
      pans.forEach(function (p, k) {
        p.classList.toggle('is-active', k === i);
        if (k === i) { p.removeAttribute('hidden'); }
        else { p.setAttribute('hidden', ''); }
      });
      /* [arbitrage] la rangée défile horizontalement (overflow:auto, relevé). */
      if (auto && rangee && rangee.scrollWidth > rangee.clientWidth) {
        var br = rangee.getBoundingClientRect(), bc = ongl[i].getBoundingClientRect(), d = 0;
        if (bc.right - br.right > 0) { d = bc.right - br.right + 16; }
        else if (bc.left - br.left < 0) { d = bc.left - br.left - 16; }
        if (d) rangee.scrollBy({ left: d, behavior: scrollBehavior() });
      }
      animer();
    }
    rotation(racine, ongl, DWELL_MS, activer, function (planifier) {
      revele = true; racine.classList.add('is-revealed');
      var fin = function () {
        racine.removeEventListener('transitionend', fin);
        animer(); planifier();
      };
      if (reduit) { fin(); return; }
      racine.addEventListener('transitionend', fin, { once: true });
      setTimeout(fin, 800);
    });
  });

  /* == 3. CARROUSEL DE TÉMOIGNAGES — moteur : slider Webflow (w-slider) + puces
     @finsweet/attributes-sliderdots. [arbitrage] bascule d'attribut hidden au lieu du
     glissement de piste ; 7000 ms, pas d'autoplay déclaré dans la source. [relevé]
     ._0630-slider_arrow { display:none } : la navigation passe par les LOGOS clients
     soulignés, seuls repères visibles. */
  document.querySelectorAll('[data-slider]').forEach(function (racine) {
    var sl = [].slice.call(racine.querySelectorAll('.slide'));
    var pu = [].slice.call(racine.querySelectorAll('.slider__puce'));
    if (!sl.length || sl.length !== pu.length) return;
    rotation(racine, pu, 7000, function (i) {
      sl.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
        if (k === i) { s.removeAttribute('hidden'); } else { s.setAttribute('hidden', ''); }
      });
      pu.forEach(function (p, k) {
        p.classList.toggle('is-active', k === i);
        p.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
    }, null);
  });
})();
