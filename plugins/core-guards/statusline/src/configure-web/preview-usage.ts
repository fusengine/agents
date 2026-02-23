/**
 * Web configurator - Client-side preview rendering (usage segments)
 * @module configure-web/preview-usage
 */

/** Live preview - usage segments (limits, extraUsage, dailySpend, node, edits). */
export const CLIENT_PREVIEW_USAGE = `
    function renderUsageParts(parts, L) {
      if (config.limits?.enabled) {
        let lim = '';
        const lbc = config.limits.progressBar || {};
        const lc = BAR_CHARS[lbc.style] || BAR_CHARS.filled;
        const ll = lbc.length || 4;
        if (config.limits.show5h !== false) {
          const f5 = Math.round(0.13 * ll);
          lim += '<span class="c-cyan">5h:</span> 13%';
          if (lbc.enabled) lim += ' <span class="c-green">' + lc.fill.repeat(f5) + lc.empty.repeat(ll - f5) + '</span>';
        }
        if (config.limits.show7d !== false) {
          if (lim) lim += ' ';
          const f7 = Math.round(0.60 * ll);
          lim += '<span class="c-blue">7d:</span> 60%';
          if (lbc.enabled) lim += ' <span class="c-green">' + lc.fill.repeat(f7) + lc.empty.repeat(ll - f7) + '</span>';
        }
        if (lim) parts.push(lim);
      }
      if (config.extraUsage?.enabled) {
        let ex = '<span class="c-green">extra:</span>';
        if (config.extraUsage.showPercentage !== false) ex += ' 86%';
        const ebc = config.extraUsage.progressBar || {};
        if (ebc.enabled) {
          const ec = BAR_CHARS[ebc.style] || BAR_CHARS.filled;
          const el = ebc.length || 4; const ef = Math.round(0.86 * el);
          ex += ' <span class="c-green">' + ec.fill.repeat(ef) + ec.empty.repeat(el - ef) + '</span>';
        }
        if (config.extraUsage.showSpending !== false) ex += ' <span class="c-yellow">$158/$185</span>';
        parts.push(ex);
      }
      if (config.dailySpend.enabled) {
        parts.push('<span class="c-yellow">' + (L ? 'Daily' : 'Day') + ':</span> $2.40');
      }
      if (config.node.enabled) {
        parts.push('<span class="c-green">⬢</span>' + (L ? ' Node' : '') + ' v24');
      }
      if (config.edits.enabled) {
        const eL = config.edits.showLabel ?? L;
        parts.push('<span class="c-cyan">±</span>' + (eL ? ' Edits' : '') + ' <span class="c-green">+42</span>/<span class="c-red">-8</span>');
      }
    }
`;
