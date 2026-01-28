#!/usr/bin/env bun
/**
 * Web-based Statusline Configurator
 * Opens in browser with FULL MOUSE SUPPORT
 */

import { ConfigManager } from "./src/config/manager";
import type { StatuslineConfig } from "./src/config/schema";

const manager = new ConfigManager();

const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Statusline Config</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #09090b;
      color: #fafafa;
      min-height: 100vh;
    }

    /* Layout */
    .layout { display: flex; min-height: 100vh; }

    /* Sidebar */
    .sidebar {
      width: 280px;
      background: #18181b;
      border-right: 1px solid #27272a;
      padding: 24px 0;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }
    .logo {
      padding: 0 20px 24px;
      border-bottom: 1px solid #27272a;
      margin-bottom: 16px;
    }
    .logo h1 {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo h1::before {
      content: '◆';
      color: #6366f1;
    }
    .nav-section {
      padding: 8px 12px;
    }
    .nav-title {
      font-size: 11px;
      font-weight: 600;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 14px;
      color: #a1a1aa;
    }
    .nav-item:hover { background: #27272a; color: #fafafa; }
    .nav-item.active { background: #6366f1; color: white; }
    .nav-item .icon { width: 20px; text-align: center; }
    .nav-item .badge {
      margin-left: auto;
      background: #27272a;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
    }
    .nav-item.active .badge { background: rgba(255,255,255,0.2); }

    /* Main */
    .main {
      flex: 1;
      margin-left: 280px;
      padding: 32px 48px;
    }

    /* Preview */
    .preview-card {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .preview-label {
      font-size: 11px;
      font-weight: 600;
      color: #a5b4fc;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .preview-label::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #22c55e;
      border-radius: 50%;
      animation: blink 1.5s infinite;
    }
    @keyframes blink { 50% { opacity: 0.3; } }
    .preview-output {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      background: #09090b;
      border-radius: 10px;
      padding: 16px 20px;
      line-height: 1.8;
    }

    /* Toggle Grid */
    .toggle-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
      margin-bottom: 24px;
    }
    .toggle-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .toggle-item:hover { border-color: #3f3f46; }
    .toggle-item.on { border-color: #22c55e; background: rgba(34, 197, 94, 0.1); }
    .toggle-item .icon { font-size: 16px; width: 24px; text-align: center; }
    .toggle-item .text { flex: 1; font-size: 13px; font-weight: 500; }
    .toggle-item .check {
      width: 18px;
      height: 18px;
      border: 2px solid #3f3f46;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: transparent;
    }
    .toggle-item.on .check {
      background: #22c55e;
      border-color: #22c55e;
      color: white;
    }

    /* Section */
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #71717a;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Style Options */
    .style-grid {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .style-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      padding: 10px 16px;
      background: #18181b;
      border: 2px solid #27272a;
      border-radius: 8px;
      color: #a1a1aa;
      cursor: pointer;
      transition: all 0.15s;
    }
    .style-btn:hover { border-color: #6366f1; color: #fafafa; }
    .style-btn.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.15); color: #fafafa; }

    /* Slider */
    .slider-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .slider-label { font-size: 13px; color: #71717a; min-width: 100px; }
    .slider-value {
      background: #27272a;
      padding: 4px 12px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }
    input[type="range"] {
      flex: 1;
      height: 6px;
      background: #27272a;
      border-radius: 3px;
      -webkit-appearance: none;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: #6366f1;
      border-radius: 50%;
      cursor: pointer;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid #27272a;
    }
    .btn {
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-primary { background: #6366f1; color: white; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-ghost { background: transparent; color: #a1a1aa; border: 1px solid #27272a; }
    .btn-ghost:hover { background: #18181b; color: #fafafa; }

    /* Colors */
    .c-blue { color: #3b82f6; }
    .c-cyan { color: #06b6d4; }
    .c-green { color: #22c55e; }
    .c-yellow { color: #eab308; }
    .c-red { color: #ef4444; }
    .c-magenta { color: #a855f7; }
    .c-gray { color: #71717a; }
    .c-orange { color: #f97316; }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #22c55e;
      color: white;
      padding: 14px 24px;
      border-radius: 10px;
      font-weight: 500;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s;
    }
    .toast.show { transform: translateY(0); opacity: 1; }
  </style>
</head>
<body>
  <div class="layout">
    <nav class="sidebar">
      <div class="logo"><h1>Statusline</h1></div>

      <div class="nav-section">
        <div class="nav-title">Segments</div>
        <div id="nav-segments"></div>
      </div>

      <div class="nav-section">
        <div class="nav-title">Style</div>
        <div class="nav-item active" onclick="showTab('style')">
          <span class="icon">🎨</span> Apparence
        </div>
      </div>
    </nav>

    <main class="main">
      <div class="preview-card">
        <div class="preview-label">Live Preview</div>
        <div class="preview-output" id="preview"></div>
      </div>

      <div id="content">
        <!-- Dynamic content -->
      </div>

      <div class="actions">
        <button class="btn btn-primary" onclick="save()">Sauvegarder</button>
        <button class="btn btn-ghost" onclick="reset()">Reset</button>
      </div>
    </main>
  </div>

  <div class="toast" id="toast">✓ Sauvegardé !</div>

  <script>
    let config = __CONFIG_PLACEHOLDER__;
    let currentSegment = null;

    const SEGMENTS = [
      { key: 'claude', icon: '◆', label: 'Claude', options: [] },
      { key: 'node', icon: '⬢', label: 'Node', options: [] },
      { key: 'directory', icon: '⌂', label: 'Directory', options: [
        { key: 'directory.showBranch', label: 'Git Branch' },
        { key: 'directory.showDirtyIndicator', label: 'Dirty *' },
        { key: 'directory.showStagedCount', label: 'Staged +N' },
        { key: 'directory.showUnstagedCount', label: 'Unstaged ~N' },
      ]},
      { key: 'model', icon: '⚙', label: 'Model', options: [
        { key: 'model.showTokens', label: 'Tokens [K]' },
        { key: 'model.showMaxTokens', label: 'Max [K/K]' },
        { key: 'model.showDecimals', label: 'Decimals .0' },
      ]},
      { key: 'context', icon: '📊', label: 'Context', hasProgressBar: true, options: [
        { key: 'context.progressBar.enabled', label: 'Progress Bar' },
        { key: 'context.estimateOverhead', label: 'Est. Overhead' },
      ]},
      { key: 'cost', icon: '$', label: 'Cost', options: [
        { key: 'cost.showLabel', label: 'Show Label' },
      ]},
      { key: 'fiveHour', icon: '⏰', label: '5-Hour', hasProgressBar: true, hasSubscriptionPlan: true, options: [
        { key: 'fiveHour.showPercentage', label: 'Percentage %' },
        { key: 'fiveHour.progressBar.enabled', label: 'Progress Bar' },
        { key: 'fiveHour.showTimeLeft', label: 'Time Left' },
        { key: 'fiveHour.showCost', label: 'Show Cost' },
      ]},
      { key: 'weekly', icon: '📅', label: 'Weekly', hasProgressBar: true, options: [
        { key: 'weekly.progressBar.enabled', label: 'Progress Bar' },
        { key: 'weekly.showTimeLeft', label: 'Time Left' },
      ]},
      { key: 'dailySpend', icon: '💰', label: 'Daily', options: [
        { key: 'dailySpend.showBudget', label: 'Show Budget' },
      ]},
      { key: 'edits', icon: '±', label: 'Edits', options: [
        { key: 'edits.showLabel', label: 'Show Label' },
      ]},
    ];

    const GLOBAL_OPTIONS = [
      { key: 'global.showLabels', label: 'Labels' },
      { key: 'global.compactMode', label: 'Compact' },
    ];

    const BAR_STYLES = [
      { value: 'filled', display: '████░░' },
      { value: 'braille', display: '⣿⣿⣿⣀' },
      { value: 'dots', display: '●●●○○' },
      { value: 'line', display: '━━━╌╌' },
      { value: 'blocks', display: '▰▰▰▱▱' },
      { value: 'vertical', display: '▮▮▮▯▯' },
    ];

    const SEPARATORS = [
      { value: '|', display: '|' },
      { value: '-', display: '-' },
      { value: '│', display: '│' },
      { value: '·', display: '·' },
      { value: ' ', display: '␣' },
    ];

    const PATH_STYLES = [
      { value: 'truncated', display: '~/' },
      { value: 'full', display: '/full' },
      { value: 'basename', display: 'name' },
    ];

    const SUBSCRIPTION_PLANS = [
      { value: 'free', display: 'Free', limit: '50K' },
      { value: 'pro', display: 'Pro', limit: '1M' },
      { value: 'max', display: 'Max', limit: '10M' },
    ];

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
      for (const p of parts) {
        if (!obj[p]) obj[p] = {};
        obj = obj[p];
      }
      obj[last] = val;
    }

    function toggle(key) {
      setValue(key, !getValue(key));
      render();
    }

    function setStyle(style) {
      config.context.progressBar.style = style;
      config.fiveHour.progressBar.style = style;
      if (config.weekly?.progressBar) config.weekly.progressBar.style = style;
      render();
    }

    function setSep(sep) {
      config.global.separator = sep;
      render();
    }

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

    function setPathStyle(style) {
      config.directory.pathStyle = style;
      render();
    }

    function setSubscriptionPlan(plan) {
      config.fiveHour.subscriptionPlan = plan;
      render();
    }

    function renderPreview() {
      const parts = [];
      const sep = \` <span class="c-gray">\${config.global.separator}</span> \`;

      const L = config.global.showLabels;

      if (config.claude.enabled) {
        parts.push(\`<span class="c-blue">◆</span>\${L ? ' Claude' : ''} 2.0.76\`);
      }
      if (config.directory.enabled) {
        let d = \`<span class="c-cyan">⌂</span>\${L ? ' Dir' : ''} proj\`;
        if (config.directory.showBranch) d += ' <span class="c-gray">⎇</span> main';
        if (config.directory.showDirtyIndicator) d += '<span class="c-yellow">(*)</span>';
        parts.push(d);
      }
      if (config.model.enabled) {
        let m = \`<span class="c-magenta">⚙</span>\${L ? ' Model' : ''} Opus\`;
        if (config.model.showTokens) {
          m += config.model.showMaxTokens
            ? ' <span class="c-yellow">[172K/200K]</span>'
            : ' <span class="c-yellow">[172K]</span>';
        }
        parts.push(m);
      }
      if (config.context.enabled) {
        let ctx = \`\${L ? '<span class="c-gray">Ctx</span> ' : ''}<span class="c-green">86%</span>\`;
        if (config.context.progressBar.enabled) {
          const chars = {
            filled: { fill: '█', empty: '░' },
            braille: { fill: '⣿', empty: '⣀' },
            dots: { fill: '●', empty: '○' },
            line: { fill: '━', empty: '╌' },
            blocks: { fill: '▰', empty: '▱' },
            vertical: { fill: '▮', empty: '▯' }
          };
          const c = chars[config.context.progressBar.style] || chars.filled;
          const len = config.context.progressBar.length || 10;
          const filled = Math.round(0.86 * len);
          const bar = c.fill.repeat(filled) + c.empty.repeat(len - filled);
          ctx += \` <span class="c-green">\${bar}</span>\`;
        }
        parts.push(ctx);
      }
      if (config.cost.enabled) {
        parts.push(\`<span class="c-yellow">$</span>\${L ? ' Cost' : ''} $1.25\`);
      }
      if (config.fiveHour.enabled) {
        let f = \`<span class="c-cyan">\${L ? '5-Hour' : '⏱ 5H'}:</span> 65%\`;
        if (config.fiveHour.progressBar.enabled) {
          const chars = {
            filled: { fill: '█', empty: '░' },
            braille: { fill: '⣿', empty: '⣀' },
            dots: { fill: '●', empty: '○' },
            line: { fill: '━', empty: '╌' },
            blocks: { fill: '▰', empty: '▱' },
            vertical: { fill: '▮', empty: '▯' }
          };
          const c = chars[config.fiveHour.progressBar.style] || chars.braille;
          const len = config.fiveHour.progressBar.length || 10;
          const filled = Math.round(0.65 * len);
          const bar = c.fill.repeat(filled) + c.empty.repeat(len - filled);
          f += \` <span class="c-green">\${bar}</span>\`;
        }
        if (config.fiveHour.showTimeLeft) f += ' (3h22m)';
        parts.push(f);
      }
      if (config.weekly.enabled) {
        let w = \`<span class="c-cyan">\${L ? 'Weekly' : '⏱ W'}:</span> 42%\`;
        if (config.weekly.progressBar?.enabled) {
          const chars = {
            filled: { fill: '█', empty: '░' },
            braille: { fill: '⣿', empty: '⣀' },
            dots: { fill: '●', empty: '○' },
            line: { fill: '━', empty: '╌' },
            blocks: { fill: '▰', empty: '▱' },
            vertical: { fill: '▮', empty: '▯' }
          };
          const c = chars[config.weekly.progressBar.style] || chars.braille;
          const len = config.weekly.progressBar.length || 6;
          const filled = Math.round(0.42 * len);
          const bar = c.fill.repeat(filled) + c.empty.repeat(len - filled);
          w += \` <span class="c-green">\${bar}</span>\`;
        }
        parts.push(w);
      }
      if (config.dailySpend.enabled) {
        parts.push(\`<span class="c-yellow">\${L ? 'Daily' : 'Day'}:</span> $2.40\`);
      }
      if (config.node.enabled) {
        parts.push(\`<span class="c-green">⬢</span>\${L ? ' Node' : ''} v24\`);
      }
      if (config.edits.enabled) {
        parts.push(\`<span class="c-cyan">±</span>\${L ? ' Edits' : ''} <span class="c-green">+42</span>/<span class="c-red">-8</span>\`);
      }

      return parts.join(sep);
    }

    function renderNav() {
      const navHtml = SEGMENTS.map(s => {
        const enabled = getValue(s.key + '.enabled');
        const isActive = currentSegment === s.key;
        return \`<div class="nav-item \${isActive ? 'active' : ''}" onclick="showSegment('\${s.key}')">
          <span class="icon">\${s.icon}</span> \${s.label}
          <span class="badge">\${enabled ? 'ON' : 'OFF'}</span>
        </div>\`;
      }).join('');
      document.getElementById('nav-segments').innerHTML = navHtml;
    }

    function renderContent() {
      let html = '';

      if (currentSegment) {
        const seg = SEGMENTS.find(s => s.key === currentSegment);
        if (seg) {
          const enabled = getValue(seg.key + '.enabled');
          html += \`<div class="section-title">\${seg.icon} \${seg.label}</div>\`;
          html += \`<div class="toggle-grid">\`;
          html += \`<div class="toggle-item \${enabled ? 'on' : ''}" onclick="toggle('\${seg.key}.enabled')">
            <span class="text">Activer</span>
            <span class="check">✓</span>
          </div>\`;
          seg.options.forEach(o => {
            const on = getValue(o.key);
            html += \`<div class="toggle-item \${on ? 'on' : ''}" onclick="toggle('\${o.key}')">
              <span class="text">\${o.label}</span>
              <span class="check">✓</span>
            </div>\`;
          });
          html += \`</div>\`;

          // Subscription plan selector for 5-Hour segment
          if (seg.hasSubscriptionPlan) {
            const currentPlan = config[seg.key]?.subscriptionPlan || 'pro';
            html += \`<div class="section-title">Plan d'abonnement</div>\`;
            html += \`<div class="style-grid">\`;
            SUBSCRIPTION_PLANS.forEach(p => {
              const active = currentPlan === p.value;
              html += \`<button class="style-btn \${active ? 'active' : ''}" onclick="setSubscriptionPlan('\${p.value}')" title="\${p.limit} tokens/5h">\${p.display} (\${p.limit})</button>\`;
            });
            html += \`</div>\`;
          }

          // Progress bar options for segments that have them
          if (seg.hasProgressBar) {
            const currentStyle = config[seg.key]?.progressBar?.style || 'filled';
            const currentLength = config[seg.key]?.progressBar?.length || 6;

            html += \`<div class="section-title">Style Progress Bar</div>\`;
            html += \`<div class="style-grid">\`;
            BAR_STYLES.forEach(b => {
              const active = currentStyle === b.value;
              html += \`<button class="style-btn \${active ? 'active' : ''}" onclick="setSegmentStyle('\${seg.key}', '\${b.value}')">\${b.display}</button>\`;
            });
            html += \`</div>\`;

            html += \`<div class="slider-row">
              <span class="slider-label">Longueur</span>
              <input type="range" min="4" max="15" value="\${currentLength}" oninput="setSegmentLength('\${seg.key}', this.value)">
              <span class="slider-value" id="segmentBarLength">\${currentLength}</span>
            </div>\`;
          }
        }
      } else {
        // Style tab
        html += \`<div class="section-title">Global</div>\`;
        html += \`<div class="toggle-grid">\`;
        GLOBAL_OPTIONS.forEach(o => {
          const on = getValue(o.key);
          html += \`<div class="toggle-item \${on ? 'on' : ''}" onclick="toggle('\${o.key}')">
            <span class="text">\${o.label}</span>
            <span class="check">✓</span>
          </div>\`;
        });
        html += \`</div>\`;

        html += \`<div class="section-title">Progress Bar</div>\`;
        html += \`<div class="style-grid">\`;
        BAR_STYLES.forEach(b => {
          const active = config.context?.progressBar?.style === b.value;
          html += \`<button class="style-btn \${active ? 'active' : ''}" onclick="setStyle('\${b.value}')">\${b.display}</button>\`;
        });
        html += \`</div>\`;

        html += \`<div class="slider-row">
          <span class="slider-label">Longueur</span>
          <input type="range" min="5" max="20" value="\${config.context?.progressBar?.length || 10}" oninput="setBarLength(this.value)">
          <span class="slider-value" id="barLengthValue">\${config.context?.progressBar?.length || 10}</span>
        </div>\`;

        html += \`<div class="section-title">Séparateur</div>\`;
        html += \`<div class="style-grid">\`;
        SEPARATORS.forEach(s => {
          const active = config.global?.separator === s.value;
          html += \`<button class="style-btn \${active ? 'active' : ''}" onclick="setSep('\${s.value}')">\${s.display}</button>\`;
        });
        html += \`</div>\`;

        html += \`<div class="section-title">Chemin</div>\`;
        html += \`<div class="style-grid">\`;
        PATH_STYLES.forEach(p => {
          const active = config.directory?.pathStyle === p.value;
          html += \`<button class="style-btn \${active ? 'active' : ''}" onclick="setPathStyle('\${p.value}')">\${p.display}</button>\`;
        });
        html += \`</div>\`;
      }

      document.getElementById('content').innerHTML = html;
    }

    function showSegment(key) {
      currentSegment = key;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      render();
    }

    function showTab(tab) {
      currentSegment = null;
      render();
    }

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
      if (res.ok) {
        config = await res.json();
        render();
      }
    }

    render();
  </script>
</body>
</html>`;

const server = Bun.serve({
	port: 3847,
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/") {
			// Load config fresh on each page load
			const currentConfig = await manager.load();
			const html = HTML.replace(
				"__CONFIG_PLACEHOLDER__",
				JSON.stringify(currentConfig, null, 2)
			);
			return new Response(html, {
				headers: { "Content-Type": "text/html" },
			});
		}

		if (url.pathname === "/save" && req.method === "POST") {
			const newConfig = await req.json();
			await manager.save(newConfig as StatuslineConfig);
			return new Response("OK");
		}

		if (url.pathname === "/reset" && req.method === "POST") {
			const resetConfig = await manager.reset();
			return new Response(JSON.stringify(resetConfig), {
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log("\n🎨 Configurateur Web ouvert!");
console.log(`\n   👉 http://localhost:${server.port}\n`);
console.log("   Clique sur les options pour les activer/désactiver");
console.log("   Ctrl+C pour fermer\n");

// Try to open browser
const openCommands: Record<string, string[]> = {
	darwin: ["open"],
	linux: ["xdg-open"],
	win32: ["cmd", "/c", "start"],
};

const cmd = openCommands[process.platform];
if (cmd) {
	Bun.spawn([...cmd, `http://localhost:${server.port}`]);
}
