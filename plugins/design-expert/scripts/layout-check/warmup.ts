/**
 * warmup.ts — Pré-passe de défilement.
 * Certaines pages révèlent leur contenu via IntersectionObserver, sans honorer
 * `prefers-reduced-motion`. On parcourt alors la page de haut en bas pour déclencher
 * les révélations, puis on revient en haut avant de mesurer.
 */
import type { PageLike } from "./page.types";

/** Pas de défilement, en fraction de la hauteur de viewport. */
const STEP_RATIO = 0.8;
/** Pause entre deux pas, en ms. */
const STEP_MS = 60;

/**
 * Parcourt la page de haut en bas puis revient à l'origine.
 *
 * @param page - Page déjà chargée
 * @param viewportHeight - Hauteur du viewport courant, en px
 * @returns Rien ; la page est laissée en position (0, 0)
 */
export async function warmupScroll(page: PageLike, viewportHeight: number): Promise<void> {
  const total = await page.evaluate(() => document.documentElement.scrollHeight, undefined);
  const step = Math.max(1, Math.round(viewportHeight * STEP_RATIO));
  for (let y = 0; y < total; y += step) {
    await page.evaluate((offset: number) => window.scrollTo(0, offset), y);
    await page.waitForTimeout(STEP_MS);
  }
  await page.evaluate(() => window.scrollTo(0, 0), undefined);
  await page.waitForTimeout(STEP_MS);
}
