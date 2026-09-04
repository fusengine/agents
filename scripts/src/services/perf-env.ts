/**
 * Claude Code performance tuning service
 * Single Responsibility: Manage perf env vars in settings.env
 * Source: https://code.claude.com/docs/en/env-vars
 */
import * as p from "@clack/prompts";
import type { Settings } from "./settings-manager";

/** Available perf env vars; `defaultOn` entries are enabled at install time. */
export const PERF_ENV_OPTIONS = [
	{
		value: "CLAUDE_CODE_ENABLE_TODO_TOOLS",
		label: "Task tools (TaskCreate/TaskGet/TaskList/TaskUpdate)",
		hint: "ON by default - APEX Plan and the shared team task list need them; Claude Code drops them on Opus/Sonnet 5 since v2.1.233",
		envValue: "1",
		defaultOn: true,
	},
	{
		value: "CLAUDE_CODE_FORK_SUBAGENT",
		label: "Fork subagent prompt cache",
		hint: "Subagents inherit parent cache - saves ~150k tok/session",
		envValue: "1",
		defaultOn: false,
	},
	{
		value: "CLAUDE_CODE_ATTRIBUTION_HEADER",
		label: "Strip attribution header",
		hint: "Better Anthropic prompt cache hit rate",
		envValue: "0",
		defaultOn: false,
	},
	{
		value: "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
		label: "Disable all non-essential traffic",
		hint: "Telemetry + autoupdater + feedback + error reporting OFF",
		envValue: "1",
		defaultOn: false,
	},
	{
		value: "DISABLE_AUTOUPDATER",
		label: "Disable autoupdater only",
		hint: "Keeps telemetry - pin your CLI version manually",
		envValue: "1",
		defaultOn: false,
	},
] as const;

/** Env vars enabled out of the box; the prompt lets the user opt OUT of them. */
export const DEFAULT_ON_PERF_ENV: readonly string[] = PERF_ENV_OPTIONS.filter(
	(o) => o.defaultOn,
).map((o) => o.value);

const PERF_ASKED_MARKER = "_FUSENGINE_PERF_ASKED";
const PERF_DEFAULTS_MARKER = "_FUSENGINE_PERF_DEFAULTS";

/**
 * Turn ON every `defaultOn` option, once per install.
 *
 * Runs BEFORE the "already asked" short-circuit so existing installs (which
 * already carry PERF_ASKED_MARKER) still receive newly-added defaults. The
 * dedicated marker makes it one-shot: a user who later unticks the option in
 * the prompt keeps it off instead of having it re-imposed on every re-run.
 *
 * @param settings - Settings object mutated in place
 * @returns The same settings, with defaults applied and the marker set
 */
export function applyDefaultPerfEnv(settings: Settings): Settings {
	const env = (settings.env as Record<string, string>) || {};
	if (env[PERF_DEFAULTS_MARKER] === "1") return settings;
	for (const opt of PERF_ENV_OPTIONS) {
		if (opt.defaultOn && env[opt.value] === undefined) {
			env[opt.value] = opt.envValue;
		}
	}
	env[PERF_DEFAULTS_MARKER] = "1";
	settings.env = env;
	return settings;
}

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
	settings = applyDefaultPerfEnv(settings);
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
