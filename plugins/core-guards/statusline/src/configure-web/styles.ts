/**
 * Web configurator - CSS styles
 * @module configure-web/styles
 */

/** Complete CSS for the web configurator UI. */
export const CSS_STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #09090b; color: #fafafa; min-height: 100vh; }
.layout { display: flex; min-height: 100vh; }
.sidebar { width: 280px; background: #18181b; border-right: 1px solid #27272a; padding: 24px 0; position: fixed; height: 100vh; overflow-y: auto; }
.logo { padding: 0 20px 24px; border-bottom: 1px solid #27272a; margin-bottom: 16px; }
.logo h1 { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.logo h1::before { content: '◆'; color: #6366f1; }
.nav-section { padding: 8px 12px; }
.nav-title { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: all 0.15s; font-size: 14px; color: #a1a1aa; }
.nav-item:hover { background: #27272a; color: #fafafa; }
.nav-item.active { background: #6366f1; color: white; }
.nav-item .icon { width: 20px; text-align: center; }
.nav-item .badge { margin-left: auto; background: #27272a; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.nav-item.active .badge { background: rgba(255,255,255,0.2); }
.main { flex: 1; margin-left: 280px; padding: 32px 48px; }
.preview-card { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
.preview-label { font-size: 11px; font-weight: 600; color: #a5b4fc; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.preview-label::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: blink 1.5s infinite; }
@keyframes blink { 50% { opacity: 0.3; } }
.preview-output { font-family: 'JetBrains Mono', monospace; font-size: 14px; background: #09090b; border-radius: 10px; padding: 16px 20px; line-height: 1.8; }
.toggle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; margin-bottom: 24px; }
.toggle-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #18181b; border: 1px solid #27272a; border-radius: 10px; cursor: pointer; transition: all 0.15s; }
.toggle-item:hover { border-color: #3f3f46; }
.toggle-item.on { border-color: #22c55e; background: rgba(34, 197, 94, 0.1); }
.toggle-item .icon { font-size: 16px; width: 24px; text-align: center; }
.toggle-item .text { flex: 1; font-size: 13px; font-weight: 500; }
.toggle-item .check { width: 18px; height: 18px; border: 2px solid #3f3f46; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: transparent; }
.toggle-item.on .check { background: #22c55e; border-color: #22c55e; color: white; }
.section-title { font-size: 13px; font-weight: 600; color: #71717a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.style-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.style-btn { font-family: 'JetBrains Mono', monospace; font-size: 14px; padding: 10px 16px; background: #18181b; border: 2px solid #27272a; border-radius: 8px; color: #a1a1aa; cursor: pointer; transition: all 0.15s; }
.style-btn:hover { border-color: #6366f1; color: #fafafa; }
.style-btn.active { border-color: #6366f1; background: rgba(99, 102, 241, 0.15); color: #fafafa; }
.slider-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.slider-label { font-size: 13px; color: #71717a; min-width: 100px; }
.slider-value { background: #27272a; padding: 4px 12px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
input[type="range"] { flex: 1; height: 6px; background: #27272a; border-radius: 3px; -webkit-appearance: none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #6366f1; border-radius: 50%; cursor: pointer; }
.actions { display: flex; gap: 12px; padding-top: 24px; border-top: 1px solid #27272a; }
.btn { font-family: inherit; font-size: 14px; font-weight: 500; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.btn-primary { background: #6366f1; color: white; }
.btn-primary:hover { background: #4f46e5; }
.btn-ghost { background: transparent; color: #a1a1aa; border: 1px solid #27272a; }
.btn-ghost:hover { background: #18181b; color: #fafafa; }
.c-blue { color: #3b82f6; } .c-cyan { color: #06b6d4; } .c-green { color: #22c55e; } .c-yellow { color: #eab308; }
.c-red { color: #ef4444; } .c-magenta { color: #a855f7; } .c-gray { color: #71717a; } .c-orange { color: #f97316; }
.toast { position: fixed; bottom: 24px; right: 24px; background: #22c55e; color: white; padding: 14px 24px; border-radius: 10px; font-weight: 500; transform: translateY(100px); opacity: 0; transition: all 0.3s; }
.toast.show { transform: translateY(0); opacity: 1; }
`;
