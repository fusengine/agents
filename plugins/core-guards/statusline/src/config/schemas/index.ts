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
// Re-export design schemas
export * from "./design.schema";
// Re-export usage segment schemas
export * from "./usage-segments.schema";

// Import for assembly
import { zd } from "./common.schema";
import {
	AgentSegmentConfigSchema,
	ClaudeSegmentConfigSchema,
	ContextSegmentConfigSchema,
	CostSegmentConfigSchema,
	DirectorySegmentConfigSchema,
	ModelSegmentConfigSchema,
	TimeSegmentConfigSchema,
} from "./core-segments.schema";
import { ColorPaletteSchema, GlobalConfigSchema, IconSetSchema } from "./design.schema";
import {
	DailySpendSegmentConfigSchema,
	EditsSegmentConfigSchema,
	ExtraUsageSegmentConfigSchema,
	FiveHourSegmentConfigSchema,
	LimitsSegmentConfigSchema,
	NodeSegmentConfigSchema,
	WeeklySegmentConfigSchema,
} from "./usage-segments.schema";

// Complete schema
export const StatuslineConfigSchema = z.object({
	version: z.string().default("1.0.0"),

	// Core Segments
	agent: AgentSegmentConfigSchema.default(zd(AgentSegmentConfigSchema)),
	claude: ClaudeSegmentConfigSchema.default(zd(ClaudeSegmentConfigSchema)),
	directory: DirectorySegmentConfigSchema.default(zd(DirectorySegmentConfigSchema)),
	model: ModelSegmentConfigSchema.default(zd(ModelSegmentConfigSchema)),
	context: ContextSegmentConfigSchema.default(zd(ContextSegmentConfigSchema)),
	cost: CostSegmentConfigSchema.default(zd(CostSegmentConfigSchema)),
	time: TimeSegmentConfigSchema.default(zd(TimeSegmentConfigSchema)),

	// Usage Segments
	fiveHour: FiveHourSegmentConfigSchema.default(zd(FiveHourSegmentConfigSchema)),
	limits: LimitsSegmentConfigSchema.default(zd(LimitsSegmentConfigSchema)),
	weekly: WeeklySegmentConfigSchema.default(zd(WeeklySegmentConfigSchema)),
	dailySpend: DailySpendSegmentConfigSchema.default(zd(DailySpendSegmentConfigSchema)),
	extraUsage: ExtraUsageSegmentConfigSchema.default(zd(ExtraUsageSegmentConfigSchema)),
	node: NodeSegmentConfigSchema.default(zd(NodeSegmentConfigSchema)),
	edits: EditsSegmentConfigSchema.default(zd(EditsSegmentConfigSchema)),

	// Design
	global: GlobalConfigSchema.default(zd(GlobalConfigSchema)),
	colors: ColorPaletteSchema.default(zd(ColorPaletteSchema)),
	icons: IconSetSchema.default(zd(IconSetSchema)),
});

export type StatuslineConfig = z.infer<typeof StatuslineConfigSchema>;
