/**
 * Web configurator - Client-side preview rendering (base segments)
 * @module configure-web/preview
 */

/** Live preview - base segments (claude, directory, model, context, cost, fiveHour, weekly). */
export const CLIENT_PREVIEW = `
    function renderPreview() {
      const parts = [];
      const sep = ' <span class="c-gray">' + config.global.separator + '</span> ';
      const L = config.global.showLabels;
      if (config.claude.enabled) {
        parts.push('<span class="c-blue">◆</span>' + (L ? ' Claude' : '') + ' 2.0.76');
      }
      if (config.directory.enabled) {
        let d = '<span class="c-cyan">⌂</span>' + (L ? ' Dir' : '') + ' proj';
        if (config.directory.showBranch) d += ' <span class="c-gray">⎇</span> main';
        if (config.directory.showDirtyIndicator) d += '<span class="c-yellow">(*)</span>';
        parts.push(d);
      }
      if (config.model.enabled) {
        let m = '<span class="c-magenta">⚙</span>' + (L ? ' Model' : '') + ' Opus';
        if (config.model.showTokens) {
          m += config.model.showMaxTokens
            ? ' <span class="c-yellow">[172K/200K]</span>'
            : ' <span class="c-yellow">[172K]</span>';
        }
        parts.push(m);
      }
      if (config.context.enabled) {
        let ctx = (L ? '<span class="c-gray">Ctx</span> ' : '') + '<span class="c-green">86%</span>';
        if (config.context.progressBar.enabled) {
          const c = BAR_CHARS[config.context.progressBar.style] || BAR_CHARS.filled;
          const len = config.context.progressBar.length || 10;
          const filled = Math.round(0.86 * len);
          ctx += ' <span class="c-green">' + c.fill.repeat(filled) + c.empty.repeat(len - filled) + '</span>';
        }
        parts.push(ctx);
      }
      if (config.cost.enabled) {
        const cL = config.cost.showLabel ?? L;
        parts.push('<span class="c-yellow">$</span>' + (cL ? ' Cost' : '') + ' $1.25');
      }
      if (config.fiveHour.enabled) {
        let f = '<span class="c-cyan">' + (L ? '5-Hour' : '⏱ 5H') + ':</span> 65%';
        if (config.fiveHour.progressBar.enabled) {
          const c = BAR_CHARS[config.fiveHour.progressBar.style] || BAR_CHARS.braille;
          const len = config.fiveHour.progressBar.length || 10;
          const filled = Math.round(0.65 * len);
          f += ' <span class="c-green">' + c.fill.repeat(filled) + c.empty.repeat(len - filled) + '</span>';
        }
        if (config.fiveHour.showTimeLeft) f += ' (3h22m)';
        parts.push(f);
      }
      if (config.weekly.enabled) {
        let w = '<span class="c-cyan">' + (L ? 'Weekly' : '⏱ W') + ':</span> 42%';
        if (config.weekly.progressBar?.enabled) {
          const c = BAR_CHARS[config.weekly.progressBar.style] || BAR_CHARS.braille;
          const len = config.weekly.progressBar.length || 6;
          const filled = Math.round(0.42 * len);
          w += ' <span class="c-green">' + c.fill.repeat(filled) + c.empty.repeat(len - filled) + '</span>';
        }
        parts.push(w);
      }
      renderUsageParts(parts, L);
      return parts.join(sep);
    }
`;
