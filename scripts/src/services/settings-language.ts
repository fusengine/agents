/**
 * Settings language service
 * @description SRP: response-language options, the default-parameters writer,
 * and the interactive language prompt.
 */
import * as p from "@clack/prompts";
import type { Settings } from "./settings-manager";

/** Supported languages for Claude Code responses */
export const SUPPORTED_LANGUAGES = [
	{ value: "english", label: "English" },
	{ value: "french", label: "French" },
	{ value: "german", label: "German" },
	{ value: "spanish", label: "Spanish" },
	{ value: "italian", label: "Italian" },
	{ value: "portuguese", label: "Portuguese" },
	{ value: "dutch", label: "Dutch" },
	{ value: "japanese", label: "Japanese" },
	{ value: "chinese", label: "Chinese" },
	{ value: "korean", label: "Korean" },
] as const;

/** Default language when none selected */
export const DEFAULT_LANGUAGE = "english";

/**
 * Configure default parameters (response language + empty attribution).
 *
 * @param settings - Settings object to mutate.
 * @param language - Preferred response language; falls back to the existing
 *   value then {@link DEFAULT_LANGUAGE}.
 * @returns The same settings object with defaults applied.
 */
export function configureDefaults(
	settings: Settings,
	language?: string,
): Settings {
	settings.language = language ?? settings.language ?? DEFAULT_LANGUAGE;
	settings.attribution = { commit: "", pr: "" };
	return settings;
}

/** Prompt user for response language */
export async function promptLanguage(): Promise<string> {
	const choice = await p.select({
		message: "Select response language for Claude Code:",
		options: SUPPORTED_LANGUAGES.map((lang) => ({
			value: lang.value,
			label: lang.label,
		})),
		initialValue: DEFAULT_LANGUAGE,
	});
	return p.isCancel(choice) ? DEFAULT_LANGUAGE : (choice as string);
}
