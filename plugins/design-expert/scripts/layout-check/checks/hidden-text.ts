/**
 * hidden-text.ts — Garde-fou anti « contrôle mort ».
 * Tous les contrôles ignorent les éléments invisibles. Si une page révèle son
 * contenu au défilement (opacité 0 jusqu'à l'entrée dans le viewport) et n'honore
 * pas `prefers-reduced-motion`, la page serait mesurée quasi vide et déclarée
 * conforme à tort. On compte donc ce qui reste caché, et on le REMONTE.
 */
import type { Warning } from "../types";
import type { PageLike } from "../page.types";

/**
 * Compte les éléments porteurs de texte rendus invisibles par l'opacité.
 *
 * @param page - Page déjà chargée
 * @param viewport - Largeur de viewport courante, en px
 * @returns Zéro ou un avertissement récapitulant le texte non mesurable
 */
export async function checkHiddenText(page: PageLike, viewport: number): Promise<Warning[]> {
  const result = await page.evaluate((): { hidden: number; total: number; sample: string } => {
    let hidden = 0;
    let total = 0;
    let sample = "";
    const all = Array.prototype.slice.call(document.querySelectorAll("*")) as Element[];
    for (const el of all) {
      const text = window.__lc.ownText(el) as string;
      if (!text) continue;
      total++;
      let node: Element | null = el;
      let invisible = false;
      while (node && !invisible) {
        const s = getComputedStyle(node);
        // `display: none` est un masquage assumé (menu fermé, onglet inactif) :
        // seul le masquage par opacité/visibilité signale une révélation en attente.
        if (s.display === "none") break;
        if (Number(s.opacity) <= 0.05 || s.visibility === "hidden") invisible = true;
        node = node.parentElement;
      }
      if (invisible) {
        hidden++;
        if (!sample) sample = `${window.__lc.cssPath(el)} « ${text.slice(0, 40)} »`;
      }
    }
    return { hidden, total, sample };
  }, undefined);

  if (result.hidden === 0) return [];
  return [
    {
      type: "probe" as const,
      selector: result.sample,
      viewport,
      reason:
        `${result.hidden}/${result.total} éléments porteurs de texte sont invisibles ` +
        `(opacité/visibilité) et donc NON mesurés — révélation au défilement probable. ` +
        `Vérifier que --motion n'a pas désactivé l'émulation reduced-motion, puis ` +
        `relancer avec --warmup ; ce qui reste caché doit être jugé sur capture.`,
    },
  ];
}
