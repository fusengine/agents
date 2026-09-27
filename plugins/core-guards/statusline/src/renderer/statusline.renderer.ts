/**
 * Statusline Renderer - Main statusline generator
 *
 * @description SRP: Orchestrates segment rendering
 * DIP: Depends on the ISegment abstraction
 *
 * @see https://deepwiki.com/starship/starship/2.2-prompt-generation-process
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { createDefaultSegments } from "../segments";
import { colors } from "../utils";

/**
 * Renderer interface - DIP
 */
export interface IStatuslineRenderer {
	render(context: SegmentContext, config: StatuslineConfig): Promise<string>;
	addSegment(segment: ISegment): void;
	removeSegment(name: string): void;
}

/**
 * Statusline renderer
 * Orchestrates the rendering of all active segments
 */
export class StatuslineRenderer implements IStatuslineRenderer {
	private segments: ISegment[];

	constructor(segments?: ISegment[]) {
		this.segments = segments || createDefaultSegments();
		this.sortSegments();
	}

	/**
	 * Adds a segment - OCP
	 */
	addSegment(segment: ISegment): void {
		this.segments.push(segment);
		this.sortSegments();
	}

	/**
	 * Removes a segment by name
	 */
	removeSegment(name: string): void {
		this.segments = this.segments.filter((s) => s.name !== name);
	}

	/**
	 * Sorts segments by priority
	 */
	private sortSegments(): void {
		this.segments.sort((a, b) => a.priority - b.priority);
	}

	/**
	 * Renders the full statusline (1 or 2 lines)
	 */
	async render(context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const sep = colors.gray(config.global.separator);
		const separator = config.global.compactMode ? sep : ` ${sep} `;

		const rendered: Array<{ priority: number; output: string }> = [];
		for (const segment of this.segments) {
			if (segment.isEnabled(config)) {
				const output = await segment.render(context, config);
				if (output?.trim()) {
					rendered.push({ priority: segment.priority, output });
				}
			}
		}

		if (!config.global.twoLineMode) {
			return rendered.map((r) => r.output).join(separator);
		}

		const splitAt = config.global.lineSplitPriority ?? 45;
		const line1 = rendered.filter((r) => r.priority <= splitAt);
		const line2 = rendered.filter((r) => r.priority > splitAt);

		const lines = [line1, line2]
			.filter((l) => l.length > 0)
			.map((l) => l.map((r) => r.output).join(separator));

		return lines.join("\n");
	}
}
