/**
 * Settings language service
 * @description SRP: response-language options and the default-parameters writer.
 */
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
