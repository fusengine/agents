/* =============================================================================
   motion-nav.js — navigation: mobile panel, header flyouts, language
   Depends on `window.CursorMotion` (motion.js), loaded just before with `defer`.

   [measured] = read in the source · [decided] = choice made by this reference
   ========================================================================== */

(function () {
  'use strict';

  var core = window.CursorMotion;
  if (!core) return;   // motion.js missing: break nothing, do nothing.

  /* --------------------------------------------------------------------------
     1. MOBILE NAVIGATION
     The source sets an attribute and leaves the opacity transition to CSS,
     declared as an INLINE style on the element:
       transition:opacity var(--duration) var(--ease-out-spring)      [measured] H
     Locking background scroll and returning focus are accessibility
     additions.                                                   [decided]
  ---------------------------------------------------------------------------*/
  (function mobileNavigation() {
    var panel = document.querySelector('[data-nav-mobile]');
    var openBtn  = document.querySelector('[data-nav-open]');
    var closeBtn = document.querySelector('[data-nav-close]');
    if (!panel || !openBtn || !closeBtn) return;

    var pushed = panel.querySelectorAll('[data-panel]');

    /** Closes every pushed panel and resets their buttons to false. */
    function closePushed() {
      pushed.forEach(function (p) {
        p.dataset.open = 'false';
        p.setAttribute('aria-hidden', 'true');
      });
      panel.querySelectorAll('[data-submenu]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
    }

    /**
     * Opens or closes the full-screen panel.
     * @param {boolean} open
     */
    function toggle(open) {
      panel.dataset.open = open ? 'true' : 'false';
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (!open) closePushed();
      (open ? closeBtn : openBtn).focus();
    }

    openBtn.addEventListener('click', function () {
      toggle(panel.dataset.open !== 'true');
    });
    closeBtn.addEventListener('click', function () { toggle(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || panel.dataset.open !== 'true') return;
      // Escape first closes the sub-panel, and only then the menu.
      if (panel.querySelector('[data-panel][data-open="true"]')) closePushed();
      else toggle(false);
    });

    // A click on a LINK closes the panel before navigating. Submenu buttons,
    // on the other hand, must never close it.
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) toggle(false);
    });

    /* Pushed submenus. The source caret is "→", not "↓": mobile PUSHES a
       side panel, it does not unfold downwards. The source renders them
       client-side — they are missing from the scraped HTML, only the
       `aria-expanded="false"` buttons and their caret remain. [measured] H [decided] */
    panel.querySelectorAll('[data-submenu]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = panel.querySelector(
          '[data-panel="' + button.dataset.submenu + '"]'
        );
        if (!target) return;
        closePushed();
        target.dataset.open = 'true';
        target.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        var back = target.querySelector('[data-back]');
        if (back) back.focus();
      });
    });

    panel.querySelectorAll('[data-back]').forEach(function (back) {
      back.addEventListener('click', function () {
        var parent = back.closest('[data-panel]');
        closePushed();
        var origin = panel.querySelector(
          '[data-submenu="' + (parent && parent.dataset.panel) + '"]'
        );
        if (origin) origin.focus();
      });
    });

    // Entry cascade: `navItemSlideIn .25s var(--ease-out-spring) forwards`,
    // 4px amplitude [measured] M. The delay between items is set in JS in the
    // source, hence unreadable in its CSS: we expose it as `--index`, which
    // the stylesheet multiplies by 30ms.                         [decided]
    panel.querySelectorAll('.nav-item-animate').forEach(function (el, i) {
      el.style.setProperty('--index', i);
    });
  })();

  /* --------------------------------------------------------------------------
     2. HEADER FLYOUTS
     The CSS already opens the panels on `:hover` and `:focus-within` — that
     is the exact technique of the source, which has NO JS for these menus on
     desktop. This block only serves pointers WITHOUT hover (touch), where
     `:hover` is emulated and then sticky: a click on the chevron sets
     `aria-expanded`, and the CSS opens on that attribute.        [decided]
  ---------------------------------------------------------------------------*/
  (function flyouts() {
    document.querySelectorAll('[data-flyout]').forEach(function (chevron) {
      function closeThis() { chevron.setAttribute('aria-expanded', 'false'); }
      core.registerCloser(closeThis);

      chevron.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = chevron.getAttribute('aria-expanded') === 'true';
        core.closeAll(closeThis);
        chevron.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });
  })();

  /* --------------------------------------------------------------------------
     3. LANGUAGE SELECTOR
     Same technique as the flyouts, but the panel opens UPWARDS
     (`bottom-full`): only the CSS knows it, the JS only toggles the state.
  ---------------------------------------------------------------------------*/
  (function languageSelector() {
    var group = document.querySelector('[data-language]');
    if (!group) return;
    var button = group.querySelector('[data-language-button]');
    if (!button) return;

    function closeThis() {
      button.setAttribute('aria-expanded', 'false');
      group.dataset.open = 'false';
    }
    core.registerCloser(closeThis);

    button.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = button.getAttribute('aria-expanded') === 'true';
      core.closeAll(closeThis);
      button.setAttribute('aria-expanded', open ? 'false' : 'true');
      group.dataset.open = open ? 'false' : 'true';
    });

    // Selecting a language updates the ARIA state of the whole list.
    var options = group.querySelectorAll('.language__option');
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        option.setAttribute('aria-selected', 'true');
        closeThis();
        button.focus();
      });
    });
  })();
})();
