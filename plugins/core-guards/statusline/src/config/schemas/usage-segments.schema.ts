/**
 * Usage Segment Schemas - FiveHour, Limits, Weekly, DailySpend, Node, Edits
 *
 * @description SRP: Usage and extras segment schema definitions
 */

import { z } from "zod";
import { ProgressBarConfigSchema } from "./common.schema";

// 5-Hour limits segment
export const FiveHourSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		showTimeLeft: z.boolean().default(true),
		showCost: z.boolean().default(false),
		showPercentage: z.boolean().default(true),
		progressBar: ProgressBarConfigSchema.default({ style: "braille" }),
		subscriptionPlan: z.enum(["free", "pro", "max"]).optional(),
	})
	.default({});

// OAuth Limits segment (real limits from API)
export const LimitsSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(false),
		show5h: z.boolean().default(true),
		show7d: z.boolean().default(true),
		showOpus: z.boolean().default(false),
		showSonnet: z.boolean().default(false),
		showResetTime: z.boolean().default(true),
		progressBar: ProgressBarConfigSchema.default({ style: "filled", length: 4 }),
	})
	.default({});

// Weekly limits segment
export const WeeklySegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(false),
		showTimeLeft: z.boolean().default(true),
		showCost: z.boolean().default(false),
		showPercentage: z.boolean().default(true),
		progressBar: ProgressBarConfigSchema.default({ style: "braille" }),
	})
	.default({});

// Daily spend segment
export const DailySpendSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(false),
		showBudget: z.boolean().default(false),
		budget: z.number().optional(),
		warnThreshold: z.number().min(0).max(100).default(80),
	})
	.default({});

// Node segment
export const NodeSegmentConfigSchema = z
	.object({ enabled: z.boolean().default(true) })
	.default({});

// Edits segment
export const EditsSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		showLabel: z.boolean().default(false),
	})
	.default({});
