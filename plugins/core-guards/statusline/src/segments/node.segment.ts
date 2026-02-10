/**
 * Node Segment - Affiche la version Node.js
 *
 * @description SRP: Affichage Node uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

export class NodeSegment implements ISegment {
	readonly name = "node";
	readonly priority = 15; // Juste après Claude (10)

	isEnabled(config: StatuslineConfig): boolean {
		return config.node.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, global } = config;
		const version = (context.nodeVersion?.trim() || "N/A").replace(/^v/, "");
		const label = global.showLabels ? " node:" : "";

		return `${colors.green(icons.node)}${colors.green(label)} ${version}`;
	}
}
