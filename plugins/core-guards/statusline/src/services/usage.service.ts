/**
 * Usage Service - Tracking de l'usage 5 heures
 *
 * @description SRP: Tracking usage uniquement
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { TIME_INTERVALS } from "../constants";
import type { FiveHourUsage, SubscriptionType } from "../interfaces";
import { detectSubscription, getMaxTokens } from "./subscription.service";

const DATA_DIR = join(homedir(), ".claude", "statusline-data");
const USAGE_FILE = join(DATA_DIR, "usage.json");

interface UsageData {
	totalTokens: number;
	windowStart: number;
	sessions: Array<{ timestamp: number; tokens: number; sessionId: string; modelId?: string }>;
}

function ensureDataDir(): void {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function loadUsageData(): UsageData {
	ensureDataDir();
	if (!existsSync(USAGE_FILE)) {
		return { totalTokens: 0, windowStart: Date.now(), sessions: [] };
	}
	try {
		return JSON.parse(readFileSync(USAGE_FILE, "utf-8"));
	} catch {
		return { totalTokens: 0, windowStart: Date.now(), sessions: [] };
	}
}

function saveUsageData(data: UsageData): void {
	ensureDataDir();
	writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
}

function cleanOldSessions(data: UsageData): UsageData {
	const cutoff = Date.now() - TIME_INTERVALS.FIVE_HOURS_MS;
	const sessions = data.sessions.filter((s) => s.timestamp > cutoff);
	const totalTokens = sessions.reduce((sum, s) => sum + s.tokens, 0);
	const windowStart = sessions.length > 0 ? sessions[0].timestamp : Date.now();
	return { totalTokens, windowStart, sessions };
}

/**
 * Track token usage within a 5-hour sliding window
 * @param sessionId - Unique session identifier
 * @param tokens - Number of tokens used
 * @param modelId - Model identifier for subscription detection
 * @param configPlan - Optional plan override from config
 * @returns Current 5-hour usage statistics
 */
export function trackFiveHourUsage(
	sessionId: string,
	tokens: number,
	modelId: string,
	configPlan?: SubscriptionType,
): FiveHourUsage {
	let data = loadUsageData();
	data = cleanOldSessions(data);

	const idx = data.sessions.findIndex((s) => s.sessionId === sessionId);
	const session = { timestamp: Date.now(), tokens, sessionId, modelId };

	if (idx !== -1) data.sessions[idx] = session;
	else data.sessions.push(session);

	data.totalTokens = data.sessions.reduce((sum, s) => sum + s.tokens, 0);
	saveUsageData(data);

	const subscription = detectSubscription(modelId, data.sessions, configPlan);
	const maxTokens = getMaxTokens(subscription);
	const timeLeft = Math.max(0, data.windowStart + TIME_INTERVALS.FIVE_HOURS_MS - Date.now());

	return {
		tokens: data.totalTokens,
		maxTokens,
		timeLeft,
		percentage: Math.min((data.totalTokens / maxTokens) * 100, 100),
	};
}
