/**
 * Schema Index - Main configuration schema assembly
 *
 * @description Re-exports all schemas and assembles StatuslineConfigSchema
 */

import { z } from "zod";

// Re-export common schemas
export * from "./common.schema";

// Re-export core segment schemas
export * from "./core-segments.schema";

// Re-export usage segment schemas
export * from "./usage-segments.schema";

// Re-export design schemas
export * from "./design.schema";

// Import for assembly
import {
	ClaudeSegmentConfigSchema,
	DirectorySegmentConfigSchema,
	ModelSegmentConfigSchema,
	ContextSegmentConfigSchema,
	CostSegmentConfigSchema,
	TimeSegmentConfigSchema,
} from "./core-segments.schema";

import {
	FiveHourSegmentConfigSchema,
	LimitsSegmentConfigSchema,
	WeeklySegmentConfigSchema,
	DailySpendSegmentConfigSchema,
	NodeSegmentConfigSchema,
	EditsSegmentConfigSchema,
} from "./usage-segments.schema";

import { ColorPaletteSchema, IconSetSchema, GlobalConfigSchema } from "./design.schema";

// Complete schema
export const StatuslineConfigSchema = z.object({
	version: z.string().default("1.0.0"),

	// Core Segments
	claude: ClaudeSegmentConfigSchema.default({}),
	directory: DirectorySegmentConfigSchema.default({}),
	model: ModelSegmentConfigSchema.default({}),
	context: ContextSegmentConfigSchema.default({}),
	cost: CostSegmentConfigSchema.default({}),
	time: TimeSegmentConfigSchema.default({}),

	// Usage Segments
	fiveHour: FiveHourSegmentConfigSchema.default({}),
	limits: LimitsSegmentConfigSchema.default({}),
	weekly: WeeklySegmentConfigSchema.default({}),
	dailySpend: DailySpendSegmentConfigSchema.default({}),
	node: NodeSegmentConfigSchema.default({}),
	edits: EditsSegmentConfigSchema.default({}),

	// Design
	global: GlobalConfigSchema.default({}),
	colors: ColorPaletteSchema.default({}),
	icons: IconSetSchema.default({}),
});

export type StatuslineConfig = z.infer<typeof StatuslineConfigSchema>;
