/**
 * warnings.ts — Traitement des avertissements avant restitution.
 * Un avertissement n'est pas une violation : c'est ce que le script ne sait pas
 * trancher. Il doit donc rester LISIBLE, sinon il sera ignoré — et un cas non
 * mesurable ignoré est exactement le trou qu'on cherche à fermer.
 */
import type { Warning } from "./types";

/**
 * Fusionne les avertissements identiques d'une largeur à l'autre.
 * Un fond en dégradé ou un texte masqué ne dépend pas de la largeur de viewport :
 * le répéter à chaque largeur multiplie par six une sortie déjà non actionnable
 * (mesuré : 60 lignes sur une page réelle, 15 après fusion). Les largeurs
 * concernées sont conservées dans le motif.
 *
 * @param warnings - Avertissements bruts, toutes largeurs confondues
 * @returns Un avertissement par couple (type, sélecteur, motif)
 */
export function dedupeWarnings(warnings: Warning[]): Warning[] {
  const groups = new Map<string, { warning: Warning; widths: number[] }>();
  for (const warning of warnings) {
    const key = `${warning.type}|${warning.selector}|${warning.reason}`;
    const found = groups.get(key);
    if (found) found.widths.push(warning.viewport);
    else groups.set(key, { warning, widths: [warning.viewport] });
  }
  return [...groups.values()].map(({ warning, widths }) => ({
    ...warning,
    reason: widths.length > 1 ? `${warning.reason} [largeurs : ${widths.join(", ")}]` : warning.reason,
  }));
}
