/* =============================================================================
   motion.js — core of the interface behaviours of the cursor.com reference
   Vanilla JS: no framework, no CDN, no build step.

   [measured] = read in the source · [decided] = choice made by this reference

   The source ships NO animation library: all of its motion is native CSS, its
   JS only sets classes and attributes. These files follow the same rule —
   they compute no position, interpolate no value, touch no motion style. They
   toggle states; the CSS animates.

   LOADING — three `defer` scripts, in this order:
     motion.js  →  motion-nav.js  →  motion-scroll.js
   `defer` runs after the DOM is fully parsed, before DOMContentLoaded, and
   GUARANTEES the order between deferred scripts: no waiting listener is
   required, and both modules always find this core already in place.
   Sharing goes through a single global object rather than ES modules:
   on `file://`, the origin is opaque and every `import` fails.   [decided]
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     MOTION PREFERENCE
     Central trap: `scrollBy({behavior:'smooth'})` NEVER consults
     `prefers-reduced-motion` on its own. Unlike CSS animations, the JS
     scrolling API ignores the preference — you have to read it yourself and
     force 'instant'. We keep a live MediaQueryList and listen to 'change':
     `addListener()` is deprecated.                              [decided]
  ---------------------------------------------------------------------------*/
  var mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reducedMotion = mqMotion.matches;
  mqMotion.addEventListener('change', function (e) { reducedMotion = e.matches; });

  /* --------------------------------------------------------------------------
     CLOSE REGISTRY
     Every panel of the page (header flyouts, language selector) registers
     here. A single Escape listener and a single outside-click listener then
     cover all of them, instead of one per component.
  ---------------------------------------------------------------------------*/
  var closers = [];

  /**
   * Closes every registered panel.
   * @param {Function|null} except Closer NOT to trigger (the panel being
   *        opened right now), or null to close everything.
   */
  function closeAll(except) {
    closers.forEach(function (f) { if (f !== except) f(); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
  document.addEventListener('click', function (e) {
    // A click outside every panel group closes them all.
    if (!e.target.closest('[data-flyout], .nav__panel, [data-language]')) {
      closeAll(null);
    }
  });

  /* --------------------------------------------------------------------------
     SHARED SURFACE
  ---------------------------------------------------------------------------*/
  window.CursorMotion = {
    /**
     * Motion preference, READ ON EVERY CALL — never cached by the caller:
     * the user can change it mid-session.
     * @returns {boolean} true if motion must be reduced.
     */
    reducedMotion: function () { return reducedMotion; },

    /**
     * Scroll behaviour to pass to `scrollBy`/`scrollTo`. Always explicit:
     * when omitted, `behavior` is 'auto' and would follow the CSS
     * `scroll-behavior` without ever going through this test.
     * @returns {'instant'|'smooth'}
     */
    scrollBehavior: function () { return reducedMotion ? 'instant' : 'smooth'; },

    /**
     * Registers a panel-closing function.
     * @param {Function} fn Closes the panel and resets its ARIA state to false.
     */
    registerCloser: function (fn) { closers.push(fn); },

    /**
     * Closes every panel except the one passed as argument.
     * @param {Function|null} except
     */
    closeAll: closeAll
  };
})();
