/**
 * Worktree Segment - Displays active worktree info
 *
 * @description SRP: Worktree display only
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

export class WorktreeSegment implements ISegment {
	readonly name = "worktree";
	readonly priority = 24;

	isEnabled(config: StatuslineConfig): boolean {
		return config.worktree.enabled;
	}

	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const wt = context.input.worktree;
		if (!wt) return "";

		const { icons, global } = config;
		const icon = icons.worktree ?? "\u{1F33F}";
		const label = global.showLabels ? " Worktree:" : "";
		const branch = wt.original_branch ? ` \u2190 ${wt.original_branch}` : "";

		return `${colors.green(icon)}${colors.green(label)} ${wt.name}${colors.dim(branch)}`;
	}
}
