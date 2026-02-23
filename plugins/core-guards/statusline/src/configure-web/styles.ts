/**
 * Web configurator - CSS styles
 * @module configure-web/styles
 */

/** Complete CSS for the web configurator UI. */
export const CSS_STYLES = `
:root { --bg: #09090b; --surface: #111113; --surface-2: #18181b; --surface-3: #1f1f23; --border: #27272a; --border-hover: #3f3f46; --text: #fafafa; --text-2: #a1a1aa; --text-3: #52525b; --accent: #6366f1; --accent-bg: rgba(99,102,241,0.08); --green: #22c55e; --green-bg: rgba(34,197,94,0.06); --r: 6px; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Satoshi', -apple-system, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; -webkit-font-smoothing: antialiased; }
.layout { display: flex; min-height: 100vh; }
.sidebar { width: 240px; background: var(--surface); border-right: 1px solid var(--border); position: fixed; height: 100vh; overflow-y: auto; display: flex; flex-direction: column; }
.sidebar::-webkit-scrollbar { width: 2px; } .sidebar::-webkit-scrollbar-thumb { background: var(--border); }
.logo { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
.logo-img { width: 28px; height: 28px; border-radius: 6px; }
.logo h1 { font-size: 13px; font-weight: 700; letter-spacing: -0.2px; color: var(--text); }
.nav-section { padding: 8px; flex: 1; }
.nav-title { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.8px; padding: 12px 12px 6px; }
.nav-item { display: flex; align-items: center; padding: 7px 12px; border-radius: var(--r); cursor: pointer; transition: all 0.15s; font-size: 13px; font-weight: 500; color: var(--text-2); margin: 1px 0; }
.nav-item:hover { background: var(--surface-2); color: var(--text); }
.nav-item.active { color: var(--text); background: var(--accent-bg); font-weight: 600; }
.nav-item .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-3); margin-left: auto; flex-shrink: 0; }
.nav-item .dot.on { background: var(--green); box-shadow: 0 0 4px rgba(34,197,94,0.4); }
.main { flex: 1; margin-left: 240px; padding: 24px 36px; max-width: 840px; }
.preview-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
.preview-label { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
.preview-output { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: #000; border-radius: var(--r); padding: 12px 16px; line-height: 1.9; border: 1px solid var(--border); }
.section-title { font-size: 10px; font-weight: 700; color: var(--text-3); margin: 4px 0 8px; text-transform: uppercase; letter-spacing: 0.7px; }
.toggle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 4px; margin-bottom: 18px; }
.toggle-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); cursor: pointer; transition: all 0.15s; }
.toggle-item:hover { border-color: var(--border-hover); }
.toggle-item.on { border-color: var(--green); background: var(--green-bg); }
.toggle-item .text { flex: 1; font-size: 12px; font-weight: 500; color: var(--text-2); }
.toggle-item.on .text { color: var(--text); }
.toggle-item .check { width: 14px; height: 14px; border: 1.5px solid var(--border); border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 9px; color: transparent; }
.toggle-item.on .check { background: var(--green); border-color: var(--green); color: #fff; }
.style-grid { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 18px; }
.style-btn { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); color: var(--text-2); cursor: pointer; transition: all 0.15s; }
.style-btn:hover { border-color: var(--accent); color: var(--text); }
.style-btn.active { border-color: var(--accent); background: var(--accent-bg); color: var(--text); }
.slider-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.slider-label { font-size: 12px; font-weight: 500; color: var(--text-2); min-width: 60px; }
.slider-value { background: var(--surface-2); padding: 2px 8px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; font-size: 11px; border: 1px solid var(--border); }
input[type="range"] { flex: 1; height: 3px; background: var(--border); border-radius: 2px; -webkit-appearance: none; cursor: pointer; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; cursor: pointer; }
.actions { display: flex; gap: 8px; padding-top: 18px; border-top: 1px solid var(--border); }
.btn { font-family: inherit; font-size: 12px; font-weight: 600; padding: 8px 20px; border: none; border-radius: var(--r); cursor: pointer; transition: all 0.15s; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #5558e6; }
.btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--surface); color: var(--text); }
.c-blue { color: #3b82f6; } .c-cyan { color: #06b6d4; } .c-green { color: #22c55e; } .c-yellow { color: #eab308; }
.c-red { color: #ef4444; } .c-magenta { color: #a855f7; } .c-gray { color: #6b7280; } .c-orange { color: #f97316; }
.toast { position: fixed; bottom: 20px; right: 20px; background: var(--surface); color: var(--green); padding: 10px 18px; border-radius: var(--r); font-weight: 600; font-size: 12px; border: 1px solid var(--green); transform: translateY(60px); opacity: 0; transition: all 0.2s; }
.toast.show { transform: translateY(0); opacity: 1; }
`;
