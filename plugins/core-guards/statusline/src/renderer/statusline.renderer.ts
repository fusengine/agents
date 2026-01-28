/**
 * Statusline Renderer - Generateur principal du statusline
 *
 * @description SRP: Orchestration du rendu des segments
 * DIP: Depend de l'abstraction ISegment
 *
 * @see https://deepwiki.com/starship/starship/2.2-prompt-generation-process
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { createDefaultSegments } from "../segments";
import { colors } from "../utils";

/**
 * Interface du renderer - DIP
 */
export interface IStatuslineRenderer {
	render(context: SegmentContext, config: StatuslineConfig): Promise<string>;
	addSegment(segment: ISegment): void;
	removeSegment(name: string): void;
}

/**
 * Renderer du statusline
 * Orchestre le rendu de tous les segments actifs
 */
export class StatuslineRenderer implements IStatuslineRenderer {
	private segments: ISegment[];

	constructor(segments?: ISegment[]) {
		this.segments = segments || createDefaultSegments();
		this.sortSegments();
	}

	/**
	 * Ajoute un segment - OCP
	 */
	addSegment(segment: ISegment): void {
		this.segments.push(segment);
		this.sortSegments();
	}

	/**
	 * Supprime un segment par nom
	 */
	removeSegment(name: string): void {
		this.segments = this.segments.filter((s) => s.name !== name);
	}

	/**
	 * Tri les segments par priorite
	 */
	private sortSegments(): void {
		this.segments.sort((a, b) => a.priority - b.priority);
	}

	/**
	 * Rend le statusline complet
	 */
	async render(
		context: SegmentContext,
		config: StatuslineConfig,
	): Promise<string> {
		const sep = colors.gray(config.global.separator);
		const separator = config.global.compactMode ? sep : ` ${sep} `;
		const parts: string[] = [];

		for (const segment of this.segments) {
			if (segment.isEnabled(config)) {
				const rendered = await segment.render(context, config);
				if (rendered && rendered.trim()) {
					parts.push(rendered);
				}
			}
		}

		return parts.join(separator);
	}
}
