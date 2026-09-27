/**
 * Claude Segment - Displays the Claude version
 *
 * @description SRP: Claude version display only
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

export class ClaudeSegment implements ISegment {
	readonly name = "claude";
	readonly priority = 10;

	isEnabled(config: StatuslineConfig): boolean {
		return config.claude.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, global } = config;
		const version = context.input.version || "N/A";
		const label = global.showLabels ? " Claude:" : "";

		return `${colors.blue(icons.claude)}${colors.blue(label)} ${version}`;
	}
}
