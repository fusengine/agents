/**
 * Claude Code performance tuning service
 * Single Responsibility: Manage perf env vars in settings.env
 * Source: https://code.claude.com/docs/en/env-vars
 */
import * as p from "@clack/prompts";
import type { Settings } from "./settings-manager";

export const PERF_ENV_OPTIONS = [
	{
		value: "CLAUDE_CODE_FORK_SUBAGENT",
		label: "Fork subagent prompt cache",
		hint: "Subagents inherit parent cache - saves ~150k tok/session",
		envValue: "1",
	},
	{
		value: "CLAUDE_CODE_ATTRIBUTION_HEADER",
		label: "Strip attribution header",
		hint: "Better Anthropic prompt cache hit rate",
		envValue: "0",
	},
	{
		value: "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
		label: "Disable all non-essential traffic",
		hint: "Telemetry + autoupdater + feedback + error reporting OFF",
		envValue: "1",
	},
	{
		value: "DISABLE_AUTOUPDATER",
		label: "Disable autoupdater only",
		hint: "Keeps telemetry - pin your CLI version manually",
		envValue: "1",
	},
] as const;

const PERF_ASKED_MARKER = "_FUSENGINE_PERF_ASKED";

/** Read currently-enabled perf env vars from settings */
export function getEnabledPerfEnv(settings: Settings): string[] {
	const env = (settings.env as Record<string, string>) || {};
	return PERF_ENV_OPTIONS.filter((o) => env[o.value] === o.envValue).map(
		(o) => o.value,
	);
}

/** True if the perf env prompt has already been answered */
export function isPerfEnvAsked(settings: Settings): boolean {
	const env = settings.env as Record<string, string> | undefined;
	return env?.[PERF_ASKED_MARKER] === "1";
}

/** Apply selected perf env vars; remove unselected ones; mark as asked */
export function configurePerfEnv(
	settings: Settings,
	selectedKeys: readonly string[],
): Settings {
	const env = (settings.env as Record<string, string>) || {};
	for (const opt of PERF_ENV_OPTIONS) {
		if (selectedKeys.includes(opt.value)) env[opt.value] = opt.envValue;
		else delete env[opt.value];
	}
	env[PERF_ASKED_MARKER] = "1";
	settings.env = env;
	return settings;
}

/** Interactive prompt: ask user which perf env vars to enable */
export async function promptPerfEnv(settings: Settings): Promise<Settings> {
	if (isPerfEnvAsked(settings)) {
		p.log.info("Perf tuning already configured (skipping prompt)");
		return settings;
	}
	const wants = await p.confirm({
		message: "Configure Claude Code performance tuning? (settings.env)",
		initialValue: true,
	});
	if (p.isCancel(wants) || !wants) return settings;

	const choices = await p.multiselect({
		message: "Select perf options to enable:",
		options: PERF_ENV_OPTIONS.map((o) => ({
			value: o.value,
			label: o.label,
			hint: o.hint,
		})),
		initialValues: getEnabledPerfEnv(settings),
		required: false,
	});
	if (p.isCancel(choices)) return settings;

	const keys = choices as string[];
	const updated = configurePerfEnv(settings, keys);
	p.log.success(`Perf tuning configured (${keys.length} enabled)`);
	return updated;
}
