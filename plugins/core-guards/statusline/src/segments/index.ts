/**
 * Segments Index - Registre des segments
 *
 * @description OCP: Ajout de segments sans modification du code existant
 */

import type { ISegment } from "../interfaces";
import { ClaudeSegment } from "./claude.segment";
import { ContextSegment } from "./context.segment";
import { CostSegment } from "./cost.segment";
import { DailySpendSegment } from "./daily-spend.segment";
import { DirectorySegment } from "./directory.segment";
import { EditsSegment } from "./edits.segment";
import { FiveHourSegment } from "./five-hour.segment";
import { LimitsSegment } from "./limits.segment";
import { ModelSegment } from "./model.segment";
import { NodeSegment } from "./node.segment";
import { TimeSegment } from "./time.segment";
import { WeeklySegment } from "./weekly.segment";

export function createDefaultSegments(): ISegment[] {
	return [
		new TimeSegment(),
		new ClaudeSegment(),
		new DirectorySegment(),
		new ModelSegment(),
		new ContextSegment(),
		new CostSegment(),
		new FiveHourSegment(),
		new LimitsSegment(),
		new WeeklySegment(),
		new DailySpendSegment(),
		new NodeSegment(),
		new EditsSegment(),
	];
}

export { ClaudeSegment } from "./claude.segment";
export { ContextSegment } from "./context.segment";
export { CostSegment } from "./cost.segment";
export { DailySpendSegment } from "./daily-spend.segment";
export { DirectorySegment } from "./directory.segment";
export { EditsSegment } from "./edits.segment";
export { FiveHourSegment } from "./five-hour.segment";
export { LimitsSegment } from "./limits.segment";
export { ModelSegment } from "./model.segment";
export { NodeSegment } from "./node.segment";
export { TimeSegment } from "./time.segment";
export { WeeklySegment } from "./weekly.segment";
