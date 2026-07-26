/**
 * Context Segment - Affiche le pourcentage de contexte
 *
 * @description SRP: Affichage contexte uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import { OVERHEAD_ESTIMATION } from "../constants";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, generateProgressBar, progressiveColor } from "../utils";

/**
 * Calcule le pourcentage d'ALERTE (utilise uniquement pour la couleur) a partir
 * du pourcentage reel de contexte utilise et de la VRAIE taille de fenetre.
 * Le buffer autocompact est ABSOLU (33K tokens, pas proportionnel a la fenetre)
 * @see https://github.com/anthropics/claude-code/issues/27037 - autoCompact.ts /
 * getAutocompactBufferTokens. Recalibre l'echelle pour que 100% d'alerte
 * corresponde au point estime d'autocompact, quelle que soit la taille de
 * fenetre (200K, 1M, ...). N'affecte jamais le pourcentage AFFICHE ni la barre.
 */
function calculateAlertPercentage(realPercentage: number, windowSize: number): number {
	// Clamp defensif : une fenetre <= buffer (absurde) ne doit jamais produire
	// une division par zero ou negative.
	const usableWindow = Math.max(windowSize - OVERHEAD_ESTIMATION.AUTOCOMPACT_BUFFER, 1);
	return Math.min((realPercentage * windowSize) / usableWindow, 100);
}

export class ContextSegment implements ISegment {
	readonly name = "context";
	readonly priority = 40;

	isEnabled(config: StatuslineConfig): boolean {
		return config.context.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { global } = config;
		const percentage = Math.round(context.context.percentage);
		const alertPercentage = Math.round(
			calculateAlertPercentage(context.context.percentage, context.context.maxTokens),
		);
		const labelPart = global.showLabels ? `${colors.magenta("context:")} ` : "";

		let result = `${labelPart}${progressiveColor(alertPercentage, `${percentage}%`)}`;

		if (config.context.progressBar.enabled) {
			let bar = generateProgressBar(percentage, {
				style: config.context.progressBar.style,
				length: config.context.progressBar.length,
				useProgressiveColor: false,
			});
			if (config.context.progressBar.useProgressiveColor) {
				bar = progressiveColor(alertPercentage, bar);
			}
			result += ` ${bar}`;
		}

		return result;
	}
}
