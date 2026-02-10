/**
 * Menu Options - Assembles all menu sections
 *
 * @description SRP: Only responsible for assembling menu sections
 */

import type { StatuslineConfig } from "../config/schema";
import {
	buildClaudeSection,
	buildContextSection,
	buildCostSection,
	buildDailySection,
	buildDirectorySection,
	buildExtrasSection,
	buildFiveHourSection,
	buildGlobalSection,
	buildModelSection,
	buildOAuthLimitsSection,
	buildWeeklySection,
} from "./menu-sections";

/**
 * Menu option structure
 */
export interface MenuOption {
	value: string;
	label: string;
	hint: string;
}

/**
 * Builds the complete menu options array for multiselect
 */
export function buildMenuOptions(config: StatuslineConfig): MenuOption[] {
	return [
		...buildClaudeSection(config),
		...buildModelSection(config),
		...buildContextSection(config),
		...buildCostSection(config),
		...buildFiveHourSection(config),
		...buildOAuthLimitsSection(config),
		...buildWeeklySection(config),
		...buildDirectorySection(config),
		...buildDailySection(config),
		...buildGlobalSection(config),
		...buildExtrasSection(config),
	];
}
