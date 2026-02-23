/**
 * Web configurator - Client-side content rendering
 * @module configure-web/content
 */

/** Navigation sidebar and main content area rendering functions. */
export const CLIENT_CONTENT = `
    function renderNav() {
      const navHtml = SEGMENTS.map(s => {
        const enabled = getValue(s.key + '.enabled');
        const isActive = currentSegment === s.key;
        return '<div class="nav-item ' + (isActive ? 'active' : '') + '" onclick="showSegment(\\'' + s.key + '\\')">'
          + '<span class="icon">' + s.icon + '</span> ' + s.label
          + '<span class="badge">' + (enabled ? 'ON' : 'OFF') + '</span></div>';
      }).join('');
      document.getElementById('nav-segments').innerHTML = navHtml;
    }
    function renderContent() {
      let html = '';
      if (currentSegment) {
        const seg = SEGMENTS.find(s => s.key === currentSegment);
        if (seg) {
          const enabled = getValue(seg.key + '.enabled');
          html += '<div class="section-title">' + seg.icon + ' ' + seg.label + '</div>';
          html += '<div class="toggle-grid">';
          html += '<div class="toggle-item ' + (enabled ? 'on' : '') + '" onclick="toggle(\\'' + seg.key + '.enabled\\')">'
            + '<span class="text">Activer</span><span class="check">✓</span></div>';
          seg.options.forEach(o => {
            const on = getValue(o.key);
            html += '<div class="toggle-item ' + (on ? 'on' : '') + '" onclick="toggle(\\'' + o.key + '\\')">'
              + '<span class="text">' + o.label + '</span><span class="check">✓</span></div>';
          });
          html += '</div>';
          if (seg.hasSubscriptionPlan) {
            const currentPlan = config[seg.key]?.subscriptionPlan || 'pro';
            html += '<div class="section-title">Plan d\\'abonnement</div><div class="style-grid">';
            SUBSCRIPTION_PLANS.forEach(p => {
              html += '<button class="style-btn ' + (currentPlan === p.value ? 'active' : '')
                + '" onclick="setSubscriptionPlan(\\'' + p.value + '\\')" title="' + p.limit + ' tokens/5h">'
                + p.display + ' (' + p.limit + ')</button>';
            });
            html += '</div>';
          }
          if (seg.hasProgressBar) {
            const currentStyle = config[seg.key]?.progressBar?.style || 'filled';
            const currentLength = config[seg.key]?.progressBar?.length || 6;
            html += '<div class="section-title">Style Progress Bar</div><div class="style-grid">';
            BAR_STYLES.forEach(b => {
              html += '<button class="style-btn ' + (currentStyle === b.value ? 'active' : '')
                + '" onclick="setSegmentStyle(\\'' + seg.key + '\\', \\'' + b.value + '\\')">' + b.display + '</button>';
            });
            html += '</div>';
            html += '<div class="slider-row"><span class="slider-label">Longueur</span>'
              + '<input type="range" min="4" max="15" value="' + currentLength
              + '" oninput="setSegmentLength(\\'' + seg.key + '\\', this.value)">'
              + '<span class="slider-value" id="segmentBarLength">' + currentLength + '</span></div>';
          }
        }
      } else {
        html += '<div class="section-title">Global</div><div class="toggle-grid">';
        GLOBAL_OPTIONS.forEach(o => {
          const on = getValue(o.key);
          html += '<div class="toggle-item ' + (on ? 'on' : '') + '" onclick="toggle(\\'' + o.key + '\\')">'
            + '<span class="text">' + o.label + '</span><span class="check">✓</span></div>';
        });
        html += '</div>';
        html += '<div class="section-title">Progress Bar</div><div class="style-grid">';
        BAR_STYLES.forEach(b => {
          html += '<button class="style-btn ' + (config.context?.progressBar?.style === b.value ? 'active' : '')
            + '" onclick="setStyle(\\'' + b.value + '\\')">' + b.display + '</button>';
        });
        html += '</div>';
        const barLen = config.context?.progressBar?.length || 10;
        html += '<div class="slider-row"><span class="slider-label">Longueur</span>'
          + '<input type="range" min="5" max="20" value="' + barLen + '" oninput="setBarLength(this.value)">'
          + '<span class="slider-value" id="barLengthValue">' + barLen + '</span></div>';
        html += '<div class="section-title">Séparateur</div><div class="style-grid">';
        SEPARATORS.forEach(s => {
          html += '<button class="style-btn ' + (config.global?.separator === s.value ? 'active' : '')
            + '" onclick="setSep(\\'' + s.value + '\\')">' + s.display + '</button>';
        });
        html += '</div>';
        html += '<div class="section-title">Chemin</div><div class="style-grid">';
        PATH_STYLES.forEach(p => {
          html += '<button class="style-btn ' + (config.directory?.pathStyle === p.value ? 'active' : '')
            + '" onclick="setPathStyle(\\'' + p.value + '\\')">' + p.display + '</button>';
        });
        html += '</div>';
      }
      document.getElementById('content').innerHTML = html;
    }
`;
