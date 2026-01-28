/**
 * Segment Interface - Contrat pour les segments du statusline
 *
 * @description Applique les principes SOLID:
 * - SRP: Chaque segment = une responsabilite
 * - OCP: Extension via implementation
 * - LSP: Segments substituables
 * - DIP: Dependance sur abstraction
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
