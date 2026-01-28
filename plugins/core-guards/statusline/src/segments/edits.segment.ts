/**
 * Edits Segment - Affiche les lignes ajoutees/supprimees
 *
 * @description SRP: Affichage edits uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

export class EditsSegment implements ISegment {
	readonly name = "edits";
	readonly priority = 100;

	isEnabled(config: StatuslineConfig): boolean {
		return config.edits.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, global, edits } = config;
		const added = context.input.cost.total_lines_added;
		const removed = context.input.cost.total_lines_removed;

		let label = "";
		if (global.showLabels || edits.showLabel) {
			label = " edits:";
		}

		return `${colors.cyan(icons.edits)}${colors.cyan(label)} ${colors.green(`+${added}`)}/${colors.red(`-${removed}`)}`;
	}
}
