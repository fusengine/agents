/**
 * Harness gates service
 * Single Responsibility: opt-in enforcement gates (Gemini MCP, RALPH, Gemini
 * design pipeline) in settings.env. Only persists "1" when a gate is enabled —
 * a disabled gate is removed, never written as "0", to keep settings.env clean.
 */
import * as p from "@clack/prompts";
import type { Settings } from "./settings-manager";

interface Gate {
	key: string;
	message: string;
}

const GATES: readonly Gate[] = [
	{
		key: "FUSE_ENFORCE_GEMINI_MCP",
		message: "Enforce Gemini Design MCP for Tailwind writes? (blocks hand-written Tailwind)",
	},
	{
		key: "RALPH_MODE",
		message: "Enable RALPH mode? (git safe-commands skip confirmation)",
	},
	{
		key: "FUSE_DESIGN_GEMINI",
		message: "Enable Gemini design pipeline gates?",
	},
];

/**
 * Prompt for the opt-in harness gates and persist enabled ones to settings.env.
 * An already-set var is surfaced with a keep/replace choice; a gate left off is
 * deleted rather than stored as "0".
 * @param settings - current settings object (mutated + returned)
 */
export async function promptHarnessGates(settings: Settings): Promise<Settings> {
	const env = (settings.env as Record<string, string>) || {};
	for (const gate of GATES) {
		const current = env[gate.key];
		if (current !== undefined) {
			const keep = await p.confirm({
				message: `${gate.key} is set to "${current}". Keep it?`,
				initialValue: true,
			});
			if (p.isCancel(keep)) continue;
			if (keep) continue;
		}
		const enable = await p.confirm({ message: gate.message, initialValue: false });
		if (p.isCancel(enable)) continue;
		if (enable) env[gate.key] = "1";
		else delete env[gate.key];
	}
	settings.env = env;
	return settings;
}
