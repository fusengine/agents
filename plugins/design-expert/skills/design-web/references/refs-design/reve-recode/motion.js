/* DESIGN REFERENCE — app.reve.com · behaviours. [measured] = mechanism read
   in the source · [decided] = the author's choice. NOT REPRODUCED:
   <rv-landing-explore-frame>, absent from the scraped page. Repo hook:
   200 lines max — quotes and prose in tokens-reve.md §1. */
(() => {
  'use strict';
  /* [measured] The source neutralizes motion by resetting its 5 duration
     tokens to 0s; whatever is driven in JS is handled in JS, same media query. */
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  /* 1. DEFERRED IMAGES — [measured] beyond the first 3 cards the URL lives in
     data-deferred-src/-srcset. [decided] resolved 600 px before the viewport. */
  function deferredImages() {
    const deferred = all('img[data-src], img[data-srcset]');
    if (!deferred.length) return;
    const resolve = (img) => {
      if (img.dataset.srcset) { img.srcset = img.dataset.srcset; delete img.dataset.srcset; }
      if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    };
    if (!('IntersectionObserver' in window)) return deferred.forEach(resolve);
    const obs = new IntersectionObserver((es, o) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      resolve(e.target); o.unobserve(e.target);
    }), { rootMargin: '600px' });
    deferred.forEach((img) => obs.observe(img));
  }
  /* 2. DRIFTING STRIP — extracted into motion-bande.js (hero AND gallery depend
     on it, and the mouse drag the source requires pushes it past the repo's
     line ceiling). Loaded before this file. */
  const driftStrip = (strip) => window.RevStrip && window.RevStrip.drift(strip);
  /* 3. VIDEO ON HOVER — [measured] the class is set on PROOF that a frame has
     been rendered (requestVideoFrameCallback, `playing` fallback), not on the
     intent to play: a slow video leaves the poster. CSS fade, 150 ms. */
  function videoHover(media) {
    const video = media.querySelector('video');
    if (!video) return;
    let cancel = null;
    const rendered = () => media.classList.add('is-playing');
    const play = () => {
      if (reducedMotion.matches) return; /* [decided] */
      const p = video.play();              /* preload="none": loads here */
      if (p && p.catch) p.catch(() => {});
      if ('requestVideoFrameCallback' in video) {
        const id = video.requestVideoFrameCallback(rendered);
        cancel = () => video.cancelVideoFrameCallback(id);
      } else {
        video.addEventListener('playing', rendered, { once: true });
        cancel = () => video.removeEventListener('playing', rendered);
      }
    };
    const stop = () => {
      if (cancel) { cancel(); cancel = null; }
      media.classList.remove('is-playing'); video.pause();
      try { video.currentTime = 0; } catch { /* source not ready yet */ }
    };
    ['pointerenter', 'focusin'].forEach((t) => media.addEventListener(t, play));
    ['pointerleave', 'focusout'].forEach((t) => media.addEventListener(t, stop));
  }
  /* 4. VEIL — [measured] the blur is NEVER toggled: only the tint varies. */
  function headerVeil() {
    const tint = document.querySelector('.veil-tint');
    const hero = document.querySelector('.hero-block');
    if (!tint || !hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver((es) => es.forEach((e) =>
      tint.classList.toggle('is-visible', !e.isIntersecting)), { threshold: 0 }).observe(hero);
  }
  /* 5. HEADER THEME — [measured] .color-scheme-text / -image have no CSS
     trigger in the source: set in JS according to the zone underneath. */
  function headerTheme() {
    const zones = all('[data-zone]'), root = document.documentElement;
    if (!zones.length || !('IntersectionObserver' in window)) return;
    const h = parseFloat(getComputedStyle(root).getPropertyValue('--header-height')) || 56;
    const apply = (n) => {
      root.classList.toggle('color-scheme-image', n === 'image');
      root.classList.toggle('color-scheme-text', n === 'text');
    };
    const visible = new Set();
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      /* Sticky hero: several zones overlap, take the lowest one. */
      const last = zones.filter((z) => visible.has(z)).pop();
      if (last) apply(last.dataset.zone);
    }, { rootMargin: `-${h}px 0px -100% 0px` }); /* [decided] slice under the header */
    zones.forEach((z) => obs.observe(z));
    apply('image'); /* [measured] the hero opens the page in dark theme */
  }
  /* 6. REFERENCE ELEMENTS — [measured] cards = <button> carrying the image in
     data-card; active state rendered entirely in CSS (150 ms on background AND
     box-shadow). [decided] two layers + decode() then 200 ms. */
  function references() {
    const cards = all('.reference-card[data-card]');
    const base = document.querySelector('[data-ref-base]');
    const layer = document.querySelector('[data-ref-layer]');
    const blurBg = document.querySelector('[data-blurred-bg]');
    if (!cards.length || !base || !layer) return;
    let busy = false;
    const select = async (card) => {
      if (busy || card.classList.contains('is-active')) return;
      busy = true;
      cards.forEach((c) => {
        c.classList.toggle('is-active', c === card);
        c.setAttribute('aria-pressed', String(c === card));
      });
      const url = card.dataset.card;
      layer.srcset = ''; layer.src = url;
      try { await layer.decode(); } catch { /* unavailable: keep the old one */ }
      layer.classList.add('is-visible');
      if (blurBg) { blurBg.srcset = ''; blurBg.src = url; } /* the blur follows the subject */
      setTimeout(() => {
        base.srcset = ''; base.src = url;
        layer.classList.remove('is-visible'); busy = false;
      }, reducedMotion.matches ? 0 : 200);
    };
    cards.forEach((c) => c.addEventListener('click', () => select(c)));
  }
  /* 7. TEMPLATES — [measured] the arrows cycle all THREE visuals as a block;
     200 ms fade in CSS. [decided] keyboard arrows at the group level. */
  function templates() {
    const render = document.querySelector('[data-templates-render]');
    const thumb = document.querySelector('[data-templates-thumb]');
    const field = document.getElementById('templates-name');
    if (!render || !thumb) return;
    const renders = all(':scope > img', render), thumbs = all(':scope > img', thumb);
    const total = Math.min(renders.length, thumbs.length);
    if (!total) return;
    let index = 0;
    const show = (next) => {
      index = (next + total) % total; /* cycles in both directions */
      renders.forEach((img, i) => img.classList.toggle('is-active', i === index));
      thumbs.forEach((img, i) => img.classList.toggle('is-active', i === index));
      if (field) field.value = thumbs[index].dataset.name || field.value;
    };
    all('.templates-arrow[data-dir]').forEach((b) =>
      b.addEventListener('click', () => show(index + Number(b.dataset.dir))));
    const demo = render.closest('.templates-demo');
    if (demo) demo.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') { show(index + 1); ev.preventDefault(); }
      if (ev.key === 'ArrowLeft') { show(index - 1); ev.preventDefault(); }
    });
    show(0);
  }
  /* 8. DEFERRED FOOTER — [measured] zero-height marker triggering the closing zone. */
  function deferredFooterZone() {
    const gallery = document.querySelector('.gallery[data-marquee]');
    const marker = document.querySelector('[data-lazy-footer]');
    if (!gallery) return;
    if (!marker || !('IntersectionObserver' in window)) return driftStrip(gallery);
    new IntersectionObserver((es, o) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      driftStrip(gallery); o.disconnect();
    }), { rootMargin: '400px' }).observe(marker);
  }
  deferredImages(); headerVeil(); headerTheme(); references(); templates();
  deferredFooterZone();
  all('[data-video-hover]').forEach(videoHover);
  all('.hero-strip[data-marquee]').forEach(driftStrip);
})();
