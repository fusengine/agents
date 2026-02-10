/**
 * Option Toggler - Toggles individual options ON/OFF
 *
 * @description SRP + OCP: Toggle options using path-based approach
 */

import type { StatuslineConfig } from "../config/schema";
import { OPTION_PATHS } from "./option-paths";
import {
	cycleProgressBarStyle,
	cycleSeparator,
	getNestedValue,
	setNestedValue,
} from "./option-utils";

/**
 * Toggle a single option ON/OFF
 * Open for extension (add new paths), closed for modification
 */
export function toggleOption(config: StatuslineConfig, optionKey: string): StatuslineConfig {
	// Handle separator cycling
	if (optionKey === "global.separator") {
		const newSeparator = cycleSeparator(config.global.separator);
		return setNestedValue(config, "global.separator", newSeparator) as StatuslineConfig;
	}

	// Handle progress bar style cycling
	const styleKeys = [
		{ key: "context.progressBar.style", path: "context.progressBar.style" },
		{ key: "fiveHour.progressBar.style", path: "fiveHour.progressBar.style" },
		{ key: "weekly.progressBar.style", path: "weekly.progressBar.style" },
		{ key: "limits.progressBar.style", path: "limits.progressBar.style" },
	];

	for (const { key, path } of styleKeys) {
		if (optionKey === key) {
			const currentStyle = (getNestedValue(config, path) as string) ?? "filled";
			const newStyle = cycleProgressBarStyle(currentStyle);
			return setNestedValue(config, path, newStyle) as StatuslineConfig;
		}
	}

	const path = OPTION_PATHS[optionKey];

	if (!path) {
		// Unknown option, return config unchanged
		return config;
	}

	// Get current value and toggle the boolean
	const currentValue = getNestedValue(config, path);
	const newValue = !currentValue;

	// Set new value immutably
	return setNestedValue(config, path, newValue) as StatuslineConfig;
}
