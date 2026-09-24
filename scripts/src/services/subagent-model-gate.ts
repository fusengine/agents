/**
 * Subagent default-model gate
 * Single Responsibility: let the user set CLAUDE_CODE_SUBAGENT_MODEL, the
 * default model Claude Code assigns to sub-agents that declare no `model:`
 * of their own. Persisted to settings.json's `env` block (non-FUSE_ key,
 * routed via env-route) — Claude Code writes `env` entries into its own
 * process env, which is where it reads this var from. Precedence: an
 * explicit invocation param > an agent's frontmatter `model:` > this env
 * var > the current session model. It is a default, not a cap: the built-in
 * Explore/Plan agents keep inheriting the session model, and only
 * CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1 (not offered here) overrides frontmatter.
 * "unset" removes the key from settings.json only — a shell export, if any,
 * still applies.
 */
import * as p from "@clack/prompts";
import { loadEnvFile } from "./env-file";
import { readRoutedVar, writeRoutedVar } from "./env-route";
import type { Settings } from "./settings-manager";

const KEY = "CLAUDE_CODE_SUBAGENT_MODEL";

/** Options offered by the select prompt; order matters (opus is the default). */
export const SUBAGENT_MODEL_OPTIONS = [
	{ value: "opus", label: "Opus — latest Opus, same model as the plugin agents (recommended)" },
	{ value: "sonnet", label: "Sonnet — capable executor, lower cost" },
	{ value: "haiku", label: "Haiku — fastest, lowest cost" },
	{ value: "unset", label: "Inherit the session model (remove the key)" },
] as const;

type ModelChoice = (typeof SUBAGENT_MODEL_OPTIONS)[number]["value"];

/**
 * Resolve a select-prompt choice to the value to persist.
 * @param choice - one of SUBAGENT_MODEL_OPTIONS' `value`s
 * @returns the choice unchanged, or `undefined` for "unset" (removes the key)
 */
export function resolveSubagentModelValue(choice: string): string | undefined {
	return choice === "unset" ? undefined : choice;
}

/**
 * Prompt for the default sub-agent model and persist it to settings.env.
 * An already-set var is surfaced with a keep/replace choice.
 * @param settings - current settings object (mutated + returned)
 */
export async function promptSubagentModel(settings: Settings): Promise<Settings> {
	const envFile = loadEnvFile();
	const current = readRoutedVar(settings, envFile, KEY);
	if (current !== undefined) {
		const keep = await p.confirm({
			message: `${KEY} is set to "${current}". Keep it?`,
			initialValue: true,
		});
		if (p.isCancel(keep) || keep) return settings;
	}

	const isValidCurrent = SUBAGENT_MODEL_OPTIONS.some((o) => o.value === current);
	const choice = await p.select({
		message: "Default model for sub-agents without an explicit model (CLAUDE_CODE_SUBAGENT_MODEL)?",
		options: SUBAGENT_MODEL_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
		initialValue: (isValidCurrent ? (current as ModelChoice) : "opus") satisfies ModelChoice,
	});
	if (p.isCancel(choice)) return settings;

	const resolved = resolveSubagentModelValue(choice as string);
	writeRoutedVar(settings, KEY, resolved);
	p.log.success(
		resolved === undefined
			? `${KEY} removed from settings.json — sub-agents inherit the session model unless shell exports it`
			: `Default sub-agent model set to ${resolved} (${KEY}=${resolved})`,
	);
	return settings;
}
