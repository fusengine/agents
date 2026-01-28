/**
 * Common Schemas - Base types and progress bar configuration
 *
 * @description SRP: Common shared schema definitions
 */

import { z } from "zod";

// Progress bar styles
export const ProgressBarStyleSchema = z.enum([
	"filled",
	"braille",
	"dots",
	"line",
	"blocks",
	"vertical",
]);
export type ProgressBarStyle = z.infer<typeof ProgressBarStyleSchema>;

// Progress bar color modes
export const ProgressBarColorSchema = z.enum(["progressive", "static", "gradient"]);
export type ProgressBarColor = z.infer<typeof ProgressBarColorSchema>;

// Path display modes
export const PathDisplaySchema = z.enum(["truncated", "full", "relative", "basename"]);
export type PathDisplay = z.infer<typeof PathDisplaySchema>;

// Progress bar config
export const ProgressBarConfigSchema = z
	.object({
		enabled: z.boolean().default(true),
		style: ProgressBarStyleSchema.default("filled"),
		length: z.number().min(1).max(50).default(10),
		color: ProgressBarColorSchema.default("progressive"),
		useProgressiveColor: z.boolean().default(true),
	})
	.default({});
export type ProgressBarConfig = z.infer<typeof ProgressBarConfigSchema>;
