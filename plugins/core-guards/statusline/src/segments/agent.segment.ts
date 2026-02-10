/**
 * Agent Segment - Affiche l'agent actif
 *
 * @description SRP: Affichage agent actif uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

export class AgentSegment implements ISegment {
	readonly name = "agent";
	readonly priority = 25;

	isEnabled(config: StatuslineConfig): boolean {
		return config.agent.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const agentName = context.input.agent?.name;
		if (!agentName) return "";

		const { icons, global } = config;
		const icon = icons.agent ?? "\u25C8";
		const label = global.showLabels ? " Agent:" : "";

		return `${colors.cyan(icon)}${colors.cyan(label)} ${agentName}`;
	}
}
