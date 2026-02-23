/**
 * Web configurator - HTML template assembly
 * @module configure-web/template
 */

import type { StatuslineConfig } from "../config/schema";
import { CLIENT_ACTIONS } from "./actions";
import { CLIENT_CONSTANTS } from "./constants";
import { CLIENT_CONTENT } from "./content";
import { CLIENT_PREVIEW } from "./preview";
import { CSS_STYLES } from "./styles";

/** Build the complete HTML page with injected config. */
export function buildHTML(config: StatuslineConfig): string {
	const configJSON = JSON.stringify(config, null, 2);
	return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Statusline Config</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>${CSS_STYLES}</style>
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
      <div id="content"></div>
      <div class="actions">
        <button class="btn btn-primary" onclick="save()">Sauvegarder</button>
        <button class="btn btn-ghost" onclick="reset()">Reset</button>
      </div>
    </main>
  </div>
  <div class="toast" id="toast">✓ Sauvegardé !</div>
  <script>
    let config = ${configJSON};
    let currentSegment = null;
${CLIENT_CONSTANTS}
${CLIENT_ACTIONS}
${CLIENT_PREVIEW}
${CLIENT_CONTENT}
    render();
  </script>
</body>
</html>`;
}
