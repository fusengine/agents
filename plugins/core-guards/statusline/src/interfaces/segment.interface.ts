/**
 * Segment Interface - Contract for statusline segments
 *
 * @description Applies the SOLID principles:
 * - SRP: Each segment = one responsibility
 * - OCP: Extension via implementation
 * - LSP: Substitutable segments
 * - DIP: Depend on an abstraction
 *
 * @see https://deepwiki.com/starship/starship/5-module-system
 */

import type { StatuslineConfig } from "../config/schema";
import type { SegmentContext } from "./context.interface";

export interface ISegment {
	readonly name: string;
	readonly priority: number;
	isEnabled(config: StatuslineConfig): boolean;
	render(context: SegmentContext, config: StatuslineConfig): Promise<string>;
}
