/**
 * SOLID max-lines service
 * Single Responsibility: let the user set FUSE_SOLID_MAX_LINES in settings.env.
 */
import * as p from "@clack/prompts";
import type { Settings } from "./settings-manager";

const KEY = "FUSE_SOLID_MAX_LINES";
// First option is the visual default (p.select has no initialValue prop).
const OPTIONS = [
	{ value: "100", label: "100 lines (strict SOLID, default)" },
	{ value: "120", label: "120 lines" },
	{ value: "150", label: "150 lines (Swift-style)" },
	{ value: "200", label: "200 lines" },
] as const;

/**
 * Prompt for the SOLID max lines/file limit and persist it to settings.env.
 * @param settings - current settings object (mutated + returned)
 */
export async function promptSolidMaxLines(settings: Settings): Promise<Settings> {
	const choice = await p.select({
		message: "SOLID max lines per file (file-size enforcement hooks)?",
		options: OPTIONS.map((o) => ({ value: o.value, label: o.label })),
	});
	if (p.isCancel(choice)) return settings;
	const env = (settings.env as Record<string, string>) || {};
	env[KEY] = choice as string;
	settings.env = env;
	p.log.success(`SOLID limit set to ${choice} lines (${KEY}=${choice})`);
	return settings;
}
