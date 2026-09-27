/**
 * Segment Context Interface - Context shared between segments
 */

import type { GitInfo } from "./git.interface";
import type { HookInput } from "./hook-input.interface";
import type { ContextResult, DailySpend, FiveHourUsage, WeeklyUsage } from "./usage.interface";

export interface SegmentContext {
	input: HookInput;
	context: ContextResult;
	fiveHourUsage: FiveHourUsage;
	weeklyUsage?: WeeklyUsage;
	dailySpend?: DailySpend;
	git: GitInfo;
	nodeVersion: string;
}
