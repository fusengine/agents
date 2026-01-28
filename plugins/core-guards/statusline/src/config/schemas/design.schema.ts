/**
 * Design Schemas - Colors, Icons, and Global configuration
 *
 * @description SRP: Design-related schema definitions only
 */

import { z } from "zod";

// Color palette
export const ColorPaletteSchema = z
	.object({
		blue: z.string().default("\x1b[0;34m"),
		cyan: z.string().default("\x1b[0;36m"),
		purple: z.string().default("\x1b[38;5;135m"),
		yellow: z.string().default("\x1b[0;33m"),
		green: z.string().default("\x1b[0;32m"),
		red: z.string().default("\x1b[0;31m"),
		orange: z.string().default("\x1b[38;5;208m"),
		white: z.string().default("\x1b[0;37m"),
		magenta: z.string().default("\x1b[0;35m"),
		gray: z.string().default("\x1b[38;5;240m"),
		reset: z.string().default("\x1b[0m"),
	})
	.default({});
export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

// Icon set
export const IconSetSchema = z
	.object({
		claude: z.string().default("◆"),
		directory: z.string().default("⌂"),
		git: z.string().default("⎇"),
		model: z.string().default("⚙"),
		node: z.string().default("⬢"),
		cost: z.string().default("$"),
		edits: z.string().default("±"),
		usage: z.string().default("⏱"),
		time: z.string().default(""),
		warning: z.string().default("⚠"),
		check: z.string().default("✓"),
		cross: z.string().default("✗"),
		arrow: z.string().default("❯"),
	})
	.default({});
export type IconSet = z.infer<typeof IconSetSchema>;

// Global config
export const GlobalConfigSchema = z
	.object({
		separator: z.string().default("|"),
		showLabels: z.boolean().default(false),
		compactMode: z.boolean().default(false),
	})
	.default({});
