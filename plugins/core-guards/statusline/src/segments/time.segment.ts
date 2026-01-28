/**
 * Time Segment - Affiche la date et l'heure
 *
 * @description SRP: Affichage date/heure uniquement
 */

import type { StatuslineConfig } from "../config/schema";
import type { ISegment, SegmentContext } from "../interfaces";
import { colors } from "../utils";

/**
 * Formate la date au format DD.M.YY
 */
function formatDate(date: Date): string {
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear().toString().slice(-2);
	return `${day}.${month}.${year}`;
}

/**
 * Formate l'heure au format HH:MM
 */
function formatTime(date: Date): string {
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
}

export class TimeSegment implements ISegment {
	readonly name = "time";
	readonly priority = 5; // En premier

	isEnabled(config: StatuslineConfig): boolean {
		return config.time.enabled;
	}

	async render(_context: SegmentContext, config: StatuslineConfig): Promise<string> {
		const { icons, global, time: timeConfig } = config;
		const now = new Date();
		const parts: string[] = [];

		if (timeConfig.showDate) {
			parts.push(formatDate(now));
		}

		if (timeConfig.showTime) {
			parts.push(formatTime(now));
		}

		const timeStr = parts.join(" - ");
		const label = global.showLabels ? `${icons.time} ` : "";

		return `${colors.gray(label)}${colors.gray(timeStr)}`;
	}
}
