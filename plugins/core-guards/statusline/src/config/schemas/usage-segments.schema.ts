/**
 * Usage Segment Schemas - FiveHour, Limits, Weekly, DailySpend, Node, Edits
 *
 * @description SRP: Usage and extras segment schema definitions
 */

import { z } from "zod";
import { ProgressBarConfigSchema, zd } from "./common.schema";

// 5-Hour limits segment
export const FiveHourSegmentConfigSchema = z.object({
	enabled: z.boolean().default(true),
	showTimeLeft: z.boolean().default(true),
	showCost: z.boolean().default(false),
	showPercentage: z.boolean().default(true),
	progressBar: ProgressBarConfigSchema.default(zd(ProgressBarConfigSchema, { style: "braille" })),
	subscriptionPlan: z.enum(["free", "pro", "max"]).optional(),
});

// OAuth Limits segment (real limits from API)
export const LimitsSegmentConfigSchema = z.object({
	enabled: z.boolean().default(false),
	show5h: z.boolean().default(true),
	show7d: z.boolean().default(true),
	showOpus: z.boolean().default(false),
	showSonnet: z.boolean().default(false),
	showResetTime: z.boolean().default(true),
	progressBar: ProgressBarConfigSchema.default(
		zd(ProgressBarConfigSchema, { style: "filled", length: 4 }),
	),
});

// Weekly limits segment
export const WeeklySegmentConfigSchema = z.object({
	enabled: z.boolean().default(false),
	showTimeLeft: z.boolean().default(true),
	showCost: z.boolean().default(false),
	showPercentage: z.boolean().default(true),
	progressBar: ProgressBarConfigSchema.default(zd(ProgressBarConfigSchema, { style: "braille" })),
});

// Daily spend segment
export const DailySpendSegmentConfigSchema = z.object({
	enabled: z.boolean().default(false),
	showBudget: z.boolean().default(false),
	budget: z.number().optional(),
	warnThreshold: z.number().min(0).max(100).default(80),
});

// Node segment
export const NodeSegmentConfigSchema = z.object({ enabled: z.boolean().default(true) });

// Edits segment
export const EditsSegmentConfigSchema = z.object({
	enabled: z.boolean().default(true),
	showLabel: z.boolean().default(false),
});
