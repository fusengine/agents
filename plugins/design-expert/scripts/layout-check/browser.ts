/**
 * browser.ts — Résolution de Playwright et lancement du navigateur.
 * Aucune dépendance n'est ajoutée au dépôt : on réutilise le `playwright-core`
 * déjà présent (installation locale, globale, ou celui embarqué par @playwright/mcp)
 * et le Google Chrome du système via `channel: "chrome"`.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** Chemins candidats pour un module `playwright-core` déjà installé. */
function candidates(): string[] {
  const list: string[] = [];
  const override = process.env.LAYOUT_CHECK_PLAYWRIGHT;
  if (override) list.push(override);
  list.push("playwright", "playwright-core");
  try {
    const root = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
    list.push(join(root, "playwright", "index.js"));
    list.push(join(root, "playwright-core", "index.js"));
    list.push(join(root, "@playwright", "mcp", "node_modules", "playwright-core", "index.js"));
  } catch {
    /* npm absent : on se contente des résolutions par nom de module */
  }
  return list;
}

/**
 * Importe le premier Playwright résolvable.
 * @throws si aucun `playwright`/`playwright-core` n'est installé sur la machine.
 */
export async function loadPlaywright(): Promise<{ chromium: any; source: string }> {
  const tried: string[] = [];
  for (const path of candidates()) {
    if (path.includes("/") && !existsSync(path)) { tried.push(path); continue; }
    try {
      const mod: any = await import(path);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return { chromium, source: path };
    } catch {
      tried.push(path);
    }
  }
  throw new Error(
    `Playwright introuvable. Testé : ${tried.join(", ")}. ` +
      `Installez-le (npm i -g playwright) ou pointez LAYOUT_CHECK_PLAYWRIGHT sur un index.js.`,
  );
}

/**
 * Lance Chromium headless : Chrome système d'abord (aucun téléchargement),
 * puis le Chromium embarqué de Playwright en secours.
 */
export async function launchBrowser(chromium: any): Promise<any> {
  try {
    return await chromium.launch({ headless: true, channel: "chrome" });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

/** Normalise une cible : URL http(s) laissée telle quelle, chemin local → file://. */
export function toTargetUrl(input: string): string {
  if (/^(https?|file):\/\//.test(input)) return input;
  const abs = input.startsWith("/") ? input : join(process.cwd(), input);
  if (!existsSync(abs)) throw new Error(`Fichier introuvable : ${abs}`);
  return `file://${abs}`;
}
