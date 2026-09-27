/**
 * Formatters Module - Formatting functions
 *
 * @description SRP: Single responsibility of formatting
 */

import { basename } from "node:path";
import { TIME_INTERVALS } from "../constants";

export function formatPath(
	path: string,
	style: "truncated" | "full" | "relative" | "basename" = "truncated",
): string {
	const home = process.env.HOME || "";
	const isUnderHome = path.startsWith(home);
	const withTilde = isUnderHome ? path.replace(home, "~") : path;
	const parts = withTilde.split("/").filter(Boolean);
	const name = parts[parts.length - 1] || withTilde;

	switch (style) {
		case "full":
			return path;
		case "basename":
			return name;
		case "relative":
			return withTilde;
		default:
			// For paths under home with subdirs: ~/../basename
			if (isUnderHome && parts.length > 2) {
				return `~/../${name}`;
			}
			// Direct child of home: ~/basename
			if (isUnderHome) {
				return withTilde;
			}
			// Outside home with many levels: /../basename
			if (parts.length > 3) {
				return `/../${name}`;
			}
			return withTilde;
	}
}

export function formatBasename(path: string): string {
	return basename(path);
}

export function formatTimeLeft(ms: number): string {
	if (ms <= 0) return "0m";

	const days = Math.floor(ms / (TIME_INTERVALS.HOUR_MS * 24));
	const hours = Math.floor((ms % (TIME_INTERVALS.HOUR_MS * 24)) / TIME_INTERVALS.HOUR_MS);
	const minutes = Math.floor((ms % TIME_INTERVALS.HOUR_MS) / TIME_INTERVALS.MINUTE_MS);

	if (days > 0 && hours > 0) return `${days}d - ${hours}h`;
	if (days > 0) return `${days}d`;
	if (hours > 0 && minutes > 0) return `${hours}h - ${minutes}m`;
	if (hours > 0) return `${hours}h`;
	return `${minutes}m`;
}

export function formatTokens(tokens: number, showDecimals: boolean = false): string {
	// M branch: never round to an integer (1.5M must never become "2M").
	// showDecimals does not drive this branch: whole million -> no decimal,
	// fractional million -> 1 significant decimal (faithful and readable precision).
	if (tokens >= 1_000_000) {
		const m = tokens / 1_000_000;
		return Number.isInteger(m) ? `${m}M` : `${m.toFixed(1)}M`;
	}
	const k = tokens / 1000;
	return showDecimals ? `${k.toFixed(1)}K` : `${Math.round(k)}K`;
}

export function formatCost(cost: number, decimals: number = 2): string {
	return `$${cost.toFixed(decimals)}`;
}
