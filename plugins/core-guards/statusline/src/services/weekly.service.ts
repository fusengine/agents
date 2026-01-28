/**
 * Weekly Service - Tracking hebdomadaire
 *
 * @description SRP: Tracking weekly uniquement
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { TIME_INTERVALS, TOKEN_LIMITS } from "../constants";
import type { WeeklyUsage } from "../interfaces";

const DATA_DIR = join(homedir(), ".claude", "statusline-data");
const WEEKLY_FILE = join(DATA_DIR, "weekly-usage.json");

interface WeeklyData {
	sessions: Array<{ timestamp: number; tokens: number; cost: number; sessionId: string }>;
}

function ensureDataDir(): void {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function loadWeeklyData(): WeeklyData {
	ensureDataDir();
	if (!existsSync(WEEKLY_FILE)) return { sessions: [] };
	try {
		return JSON.parse(readFileSync(WEEKLY_FILE, "utf-8"));
	} catch {
		return { sessions: [] };
	}
}

function saveWeeklyData(data: WeeklyData): void {
	ensureDataDir();
	writeFileSync(WEEKLY_FILE, JSON.stringify(data, null, 2));
}

function cleanOldSessions(data: WeeklyData): WeeklyData {
	const cutoff = Date.now() - TIME_INTERVALS.WEEK_MS;
	return { sessions: data.sessions.filter((s) => s.timestamp > cutoff) };
}

export function trackWeeklyUsage(
	sessionId: string,
	tokens: number,
	cost: number,
): WeeklyUsage {
	let data = loadWeeklyData();
	data = cleanOldSessions(data);

	const idx = data.sessions.findIndex((s) => s.sessionId === sessionId);
	const session = { timestamp: Date.now(), tokens, cost, sessionId };

	if (idx !== -1) data.sessions[idx] = session;
	else data.sessions.push(session);

	saveWeeklyData(data);

	const totalTokens = data.sessions.reduce((sum, s) => sum + s.tokens, 0);
	const totalCost = data.sessions.reduce((sum, s) => sum + s.cost, 0);
	const oldest = data.sessions[0];
	const timeLeft = oldest
		? Math.max(0, oldest.timestamp + TIME_INTERVALS.WEEK_MS - Date.now())
		: TIME_INTERVALS.WEEK_MS;

	return {
		tokens: totalTokens,
		maxTokens: TOKEN_LIMITS.WEEKLY_DEFAULT,
		timeLeft,
		percentage: Math.min((totalTokens / TOKEN_LIMITS.WEEKLY_DEFAULT) * 100, 100),
		cost: totalCost,
	};
}
