/**
 * Cost Segment - Affiche le cout de session
 *
 * @description SRP: Affichage cout uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors, formatCost } from "../utils";

export class CostSegment implements ISegment {
	readonly name = "cost";
	readonly priority = 50;

	isEnabled(config: StatuslineConfig): boolean {
		return config.cost.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { global, cost } = config;
		// Le payload JSON (stdin) n'est pas type-safe : total_cost_usd peut etre
		// null ou une chaine malgre le typage. `?? 0` seul ne rattrape pas une
		// chaine et ferait crasher formatCost (`cost.toFixed is not a function`).
		const rawCost = context.input.cost?.total_cost_usd;
		const totalCost = typeof rawCost === "number" && Number.isFinite(rawCost) ? rawCost : 0;
		const costStr = formatCost(totalCost, cost.decimals);

		// Si label texte (cost:), afficher label + coût
		// Si icône $ (défaut), formatCost inclut déjà le $, pas besoin de label
		if (global.showLabels || cost.showLabel) {
			return `${colors.yellow("cost:")} ${costStr}`;
		}

		return colors.yellow(costStr);
	}
}
