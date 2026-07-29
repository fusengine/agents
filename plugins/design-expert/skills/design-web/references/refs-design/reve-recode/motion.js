/* RÉFÉRENCE DE DESIGN — app.reve.com · comportements. [relevé] = mécanique lue
   dans la source · [arbitrage] = choix de l'auteur. NON REPRODUIT :
   <rv-landing-explore-frame>, absent de la page aspirée. Hook du dépôt :
   200 lignes max — citations et prose dans tokens-reve.md §1. */
(() => {
  'use strict';
  /* [relevé] La source neutralise le mouvement en remettant ses 5 jetons de
     durée à 0s ; ce qui est piloté en JS l'est côté JS, même media query. */
  const mouvementReduit = matchMedia('(prefers-reduced-motion: reduce)');
  const tous = (sel, racine = document) => Array.from(racine.querySelectorAll(sel));
  /* 1. IMAGES DIFFÉRÉES — [relevé] au-delà des 3 premières cartes l'URL est dans
     data-deferred-src/-srcset. [arbitrage] résolues à 600 px du viewport. */
  function imagesDifferees() {
    const differees = tous('img[data-src], img[data-srcset]');
    if (!differees.length) return;
    const resoudre = (img) => {
      if (img.dataset.srcset) { img.srcset = img.dataset.srcset; delete img.dataset.srcset; }
      if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    };
    if (!('IntersectionObserver' in window)) return differees.forEach(resoudre);
    const obs = new IntersectionObserver((es, o) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      resoudre(e.target); o.unobserve(e.target);
    }), { rootMargin: '600px' });
    differees.forEach((img) => obs.observe(img));
  }
  /* 2. BANDE DÉRIVANTE — extraite dans motion-bande.js (hero ET galerie en
     dépendent, et le glisser-à-la-souris qu'exige la source la fait dépasser le
     plafond de lignes du dépôt). Chargée avant ce fichier. */
  const bandeDerivante = (bande) => window.RevBande && window.RevBande.deriver(bande);
  /* 3. VIDÉO AU SURVOL — [relevé] la classe se pose sur la PREUVE qu'une image a
     été rendue (requestVideoFrameCallback, repli `playing`), pas sur l'intention
     de jouer : une vidéo lente laisse l'affiche. Fondu en CSS, 150 ms. */
  function videoSurvol(media) {
    const video = media.querySelector('video');
    if (!video) return;
    let annuler = null;
    const rendue = () => media.classList.add('joue');
    const jouer = () => {
      if (mouvementReduit.matches) return; /* [arbitrage] */
      const p = video.play();              /* preload="none" : charge ici */
      if (p && p.catch) p.catch(() => {});
      if ('requestVideoFrameCallback' in video) {
        const id = video.requestVideoFrameCallback(rendue);
        annuler = () => video.cancelVideoFrameCallback(id);
      } else {
        video.addEventListener('playing', rendue, { once: true });
        annuler = () => video.removeEventListener('playing', rendue);
      }
    };
    const stopper = () => {
      if (annuler) { annuler(); annuler = null; }
      media.classList.remove('joue'); video.pause();
      try { video.currentTime = 0; } catch { /* source pas encore prête */ }
    };
    ['pointerenter', 'focusin'].forEach((t) => media.addEventListener(t, jouer));
    ['pointerleave', 'focusout'].forEach((t) => media.addEventListener(t, stopper));
  }
  /* 4. VOILE — [relevé] le flou n'est JAMAIS basculé : seule la teinte varie. */
  function voileEntete() {
    const teinte = document.querySelector('.voile-teinte');
    const hero = document.querySelector('.hero-bloc');
    if (!teinte || !hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver((es) => es.forEach((e) =>
      teinte.classList.toggle('est-visible', !e.isIntersecting)), { threshold: 0 }).observe(hero);
  }
  /* 5. THÈME DE L'EN-TÊTE — [relevé] .color-scheme-text / -image n'ont aucun
     déclencheur CSS dans la source : posées en JS selon la zone survolée. */
  function themeEntete() {
    const zones = tous('[data-zone]'), racine = document.documentElement;
    if (!zones.length || !('IntersectionObserver' in window)) return;
    const h = parseFloat(getComputedStyle(racine).getPropertyValue('--hauteur-entete')) || 56;
    const appliquer = (n) => {
      racine.classList.toggle('color-scheme-image', n === 'image');
      racine.classList.toggle('color-scheme-text', n === 'text');
    };
    const visibles = new Set();
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target)));
      /* Hero collant : plusieurs zones se chevauchent, on prend la plus basse. */
      const derniere = zones.filter((z) => visibles.has(z)).pop();
      if (derniere) appliquer(derniere.dataset.zone);
    }, { rootMargin: `-${h}px 0px -100% 0px` }); /* [arbitrage] tranche sous l'en-tête */
    zones.forEach((z) => obs.observe(z));
    appliquer('image'); /* [relevé] le hero ouvre la page en thème sombre */
  }
  /* 6. ÉLÉMENTS DE RÉFÉRENCE — [relevé] cartes = <button> portant l'image en
     data-card ; état actif entièrement rendu en CSS (150 ms sur background ET
     box-shadow). [arbitrage] deux couches + decode() puis 200 ms. */
  function references() {
    const cartes = tous('.reference-carte[data-card]');
    const base = document.querySelector('[data-ref-base]');
    const couche = document.querySelector('[data-ref-couche]');
    const fond = document.querySelector('[data-fond-flou]');
    if (!cartes.length || !base || !couche) return;
    let enCours = false;
    const choisir = async (carte) => {
      if (enCours || carte.classList.contains('est-active')) return;
      enCours = true;
      cartes.forEach((c) => {
        c.classList.toggle('est-active', c === carte);
        c.setAttribute('aria-pressed', String(c === carte));
      });
      const url = carte.dataset.card;
      couche.srcset = ''; couche.src = url;
      try { await couche.decode(); } catch { /* indisponible : on garde l'ancienne */ }
      couche.classList.add('est-visible');
      if (fond) { fond.srcset = ''; fond.src = url; } /* le flou suit le sujet */
      setTimeout(() => {
        base.srcset = ''; base.src = url;
        couche.classList.remove('est-visible'); enCours = false;
      }, mouvementReduit.matches ? 0 : 200);
    };
    cartes.forEach((c) => c.addEventListener('click', () => choisir(c)));
  }
  /* 7. GABARITS — [relevé] les flèches font défiler les TROIS visuels en bloc ;
     fondu 200 ms en CSS. [arbitrage] flèches clavier au niveau du groupe. */
  function gabarits() {
    const rendu = document.querySelector('[data-gabarits-rendu]');
    const vignette = document.querySelector('[data-gabarits-vignette]');
    const champ = document.getElementById('gabarits-nom');
    if (!rendu || !vignette) return;
    const rendus = tous(':scope > img', rendu), vignettes = tous(':scope > img', vignette);
    const total = Math.min(rendus.length, vignettes.length);
    if (!total) return;
    let index = 0;
    const afficher = (nouvel) => {
      index = (nouvel + total) % total; /* cycle dans les deux sens */
      rendus.forEach((img, i) => img.classList.toggle('est-active', i === index));
      vignettes.forEach((img, i) => img.classList.toggle('est-active', i === index));
      if (champ) champ.value = vignettes[index].dataset.nom || champ.value;
    };
    tous('.gabarits-fleche[data-dir]').forEach((b) =>
      b.addEventListener('click', () => afficher(index + Number(b.dataset.dir))));
    const demo = rendu.closest('.gabarits-demo');
    if (demo) demo.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') { afficher(index + 1); ev.preventDefault(); }
      if (ev.key === 'ArrowLeft') { afficher(index - 1); ev.preventDefault(); }
    });
    afficher(0);
  }
  /* 8. PIED DIFFÉRÉ — [relevé] marqueur nul déclenchant la zone finale. */
  function zonePiedDifferee() {
    const galerie = document.querySelector('.galerie[data-marquee]');
    const marqueur = document.querySelector('[data-lazy-pied]');
    if (!galerie) return;
    if (!marqueur || !('IntersectionObserver' in window)) return bandeDerivante(galerie);
    new IntersectionObserver((es, o) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      bandeDerivante(galerie); o.disconnect();
    }), { rootMargin: '400px' }).observe(marqueur);
  }
  imagesDifferees(); voileEntete(); themeEntete(); references(); gabarits();
  zonePiedDifferee();
  tous('[data-video-hover]').forEach(videoSurvol);
  tous('.hero-bande[data-marquee]').forEach(bandeDerivante);
})();
