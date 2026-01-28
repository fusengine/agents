/**
 * Model Segment - Affiche le modele et tokens
 *
 * @description SRP: Affichage modele uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatTokens } from "../utils";

export class ModelSegment implements ISegment {
	readonly name = "model";
	readonly priority = 30;

	isEnabled(config: StatuslineConfig): boolean {
		return config.model.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, model, global } = config;
		const modelName = context.input.model.display_name;
		const label = global.showLabels ? " model:" : "";

		let result = `${colors.purple(icons.model)}${colors.purple(label)} ${modelName}`;

		if (model.showTokens) {
			const tokens = formatTokens(context.context.tokens, model.showDecimals);
			const maxTokens = formatTokens(context.context.maxTokens, model.showDecimals);
			result += model.showMaxTokens
				? ` ${colors.yellow(`[${tokens}/${maxTokens}]`)}`
				: ` ${colors.yellow(`[${tokens}]`)}`;
		}

		return result;
	}
}
