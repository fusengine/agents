/**
 * Web configurator - Client-side action functions
 * @module configure-web/actions
 */

/** Config accessors, toggle, style setters, navigation, and API functions. */
export const CLIENT_ACTIONS = `
    function getValue(key) {
      const parts = key.split('.');
      let v = config;
      for (const p of parts) v = v?.[p];
      return v;
    }
    function setValue(key, val) {
      const parts = key.split('.');
      const last = parts.pop();
      let obj = config;
      for (const p of parts) { if (!obj[p]) obj[p] = {}; obj = obj[p]; }
      obj[last] = val;
    }
    function toggle(key) { setValue(key, !getValue(key)); render(); }
    function setStyle(style) {
      config.context.progressBar.style = style;
      config.fiveHour.progressBar.style = style;
      if (config.weekly?.progressBar) config.weekly.progressBar.style = style;
      render();
    }
    function setSep(sep) { config.global.separator = sep; render(); }
    function setBarLength(len) {
      const length = parseInt(len);
      config.context.progressBar.length = length;
      config.fiveHour.progressBar.length = length;
      if (config.weekly?.progressBar) config.weekly.progressBar.length = length;
      document.getElementById('barLengthValue').textContent = length;
      render();
    }
    function setSegmentStyle(segment, style) {
      if (!config[segment].progressBar) config[segment].progressBar = {};
      config[segment].progressBar.style = style;
      render();
    }
    function setSegmentLength(segment, len) {
      const length = parseInt(len);
      if (!config[segment].progressBar) config[segment].progressBar = {};
      config[segment].progressBar.length = length;
      document.getElementById('segmentBarLength').textContent = length;
      render();
    }
    function setPathStyle(style) { config.directory.pathStyle = style; render(); }
    function setSubscriptionPlan(plan) { config.fiveHour.subscriptionPlan = plan; render(); }
    function showSegment(key) {
      currentSegment = key;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      render();
    }
    function showTab() { currentSegment = null; render(); }
    function render() {
      document.getElementById('preview').innerHTML = renderPreview();
      renderNav();
      renderContent();
    }
    async function save() {
      const res = await fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
    }
    async function reset() {
      const res = await fetch('/reset', { method: 'POST' });
      if (res.ok) { config = await res.json(); render(); }
    }
`;
