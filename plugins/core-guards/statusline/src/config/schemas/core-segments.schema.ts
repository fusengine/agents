/**
 * Core Segment Schemas - Claude, Directory, Model, Context, Cost
 *
 * @description SRP: Core segment schema definitions
 */

import { z } from "zod";
import { PathDisplaySchema, ProgressBarConfigSchema } from "./common.schema";

// Claude segment
export const ClaudeSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		showVersion: z.boolean().default(true),
	})
	.default({});

// Directory/Git segment
export const DirectorySegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		showGit: z.boolean().default(true),
		showBranch: z.boolean().default(true),
		showDirtyIndicator: z.boolean().default(true),
		showStagedCount: z.boolean().default(true),
		showUnstagedCount: z.boolean().default(true),
		pathStyle: PathDisplaySchema.default("truncated"),
	})
	.default({});

// Model segment
export const ModelSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		showTokens: z.boolean().default(true),
		showMaxTokens: z.boolean().default(true),
		showDecimals: z.boolean().default(false),
	})
	.default({});

// Context segment
export const ContextSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		progressBar: ProgressBarConfigSchema.default({}),
		estimateOverhead: z.boolean().default(true),
		overheadTokens: z.number().default(37000),
	})
	.default({});

// Cost segment
export const CostSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		decimals: z.number().min(0).max(4).default(2),
		showLabel: z.boolean().default(false),
	})
	.default({});

// Time segment
export const TimeSegmentConfigSchema = z
	.object({
		enabled: z.boolean().default(false),
		showDate: z.boolean().default(true),
		showTime: z.boolean().default(true),
	})
	.default({});
