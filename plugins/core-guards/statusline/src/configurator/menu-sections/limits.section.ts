/**
 * Limits Menu Sections - FiveHour, OAuth Limits, Weekly
 */

import type { StatuslineConfig } from "../../config/schema";
import { chk, getStyleIcon } from "../menu-helpers";
import type { MenuOption } from "../menu-options";

/** Build 5-Hour Limits section options */
export function buildFiveHourSection(config: StatuslineConfig): MenuOption[] {
	return [
		{ value: "header.fiveHour", label: "─── ⏰ 5-HOUR LIMITS ───", hint: "" },
		{
			value: "fiveHour.enabled",
			label: `  ${chk(config.fiveHour.enabled)} Enable section`,
			hint: "",
		},
		{
			value: "fiveHour.timeLeft",
			label: `    ${chk(config.fiveHour.showTimeLeft)} └─ Show time left`,
			hint: "",
		},
		{
			value: "fiveHour.progressBar",
			label: `    ${chk(config.fiveHour.progressBar.enabled)} └─ Progress bar`,
			hint: "",
		},
		{
			value: "fiveHour.progressBar.style",
			label: `      └─ Style: ${getStyleIcon(config.fiveHour.progressBar.style)}`,
			hint: "",
		},
	];
}

/** Build OAuth Limits section options (Real API) */
export function buildOAuthLimitsSection(config: StatuslineConfig): MenuOption[] {
	return [
		{ value: "header.limits", label: "─── 🔐 OAUTH LIMITS (Real) ───", hint: "" },
		{
			value: "limits.enabled",
			label: `  ${chk(config.limits?.enabled ?? false)} Enable OAuth limits`,
			hint: "",
		},
		{
			value: "limits.show5h",
			label: `    ${chk(config.limits?.show5h ?? true)} └─ Show 5-hour limit`,
			hint: "",
		},
		{
			value: "limits.show7d",
			label: `    ${chk(config.limits?.show7d ?? true)} └─ Show 7-day limit`,
			hint: "",
		},
		{
			value: "limits.showResetTime",
			label: `    ${chk(config.limits?.showResetTime ?? true)} └─ Show reset time`,
			hint: "",
		},
		{
			value: "limits.progressBar",
			label: `    ${chk(config.limits?.progressBar?.enabled ?? true)} └─ Progress bar`,
			hint: "",
		},
		{
			value: "limits.progressBar.style",
			label: `      └─ Style: ${getStyleIcon(config.limits?.progressBar?.style ?? "filled")}`,
			hint: "",
		},
	];
}

/** Build Weekly Limits section options */
export function buildWeeklySection(config: StatuslineConfig): MenuOption[] {
	return [
		{ value: "header.weekly", label: "─── 📅 WEEKLY LIMITS ───", hint: "" },
		{ value: "weekly.enabled", label: `  ${chk(config.weekly.enabled)} Enable section`, hint: "" },
		{
			value: "weekly.timeLeft",
			label: `    ${chk(config.weekly.showTimeLeft)} └─ Show time left`,
			hint: "",
		},
		{ value: "weekly.cost", label: `    ${chk(config.weekly.showCost)} └─ Show cost`, hint: "" },
		{
			value: "weekly.progressBar",
			label: `    ${chk(config.weekly.progressBar.enabled)} └─ Progress bar`,
			hint: "",
		},
		{
			value: "weekly.progressBar.style",
			label: `      └─ Style: ${getStyleIcon(config.weekly.progressBar.style)}`,
			hint: "",
		},
	];
}
