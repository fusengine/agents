/**
 * Daily Service - Tracking des depenses quotidiennes
 *
 * @description SRP: Tracking daily uniquement
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { DailySpend } from "../interfaces";

const DATA_DIR = join(homedir(), ".claude", "statusline-data");
const DAILY_FILE = join(DATA_DIR, "daily-spend.json");

interface DailyData {
	date: string;
	sessions: Array<{ timestamp: number; cost: number; sessionId: string }>;
}

function getTodayDate(): string {
	return new Date().toISOString().split("T")[0];
}

function ensureDataDir(): void {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function loadDailyData(): DailyData {
	ensureDataDir();
	const today = getTodayDate();
	if (!existsSync(DAILY_FILE)) return { date: today, sessions: [] };
	try {
		const data: DailyData = JSON.parse(readFileSync(DAILY_FILE, "utf-8"));
		return data.date !== today ? { date: today, sessions: [] } : data;
	} catch {
		return { date: today, sessions: [] };
	}
}

function saveDailyData(data: DailyData): void {
	ensureDataDir();
	writeFileSync(DAILY_FILE, JSON.stringify(data, null, 2));
}

export function trackDailySpend(
	sessionId: string,
	cost: number,
	budget?: number,
): DailySpend {
	const data = loadDailyData();

	const idx = data.sessions.findIndex((s) => s.sessionId === sessionId);
	const session = { timestamp: Date.now(), cost, sessionId };

	if (idx !== -1) data.sessions[idx] = session;
	else data.sessions.push(session);

	saveDailyData(data);

	const totalCost = data.sessions.reduce((sum, s) => sum + s.cost, 0);
	return { cost: totalCost, budget };
}
