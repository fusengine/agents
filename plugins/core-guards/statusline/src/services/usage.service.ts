/**
 * Usage Service - Tracking de l'usage 5 heures
 *
 * @description SRP: Tracking usage uniquement
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { TIME_INTERVALS, TOKEN_LIMITS } from "../constants";
import type { FiveHourUsage, SubscriptionType } from "../interfaces";

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

function detectSubscription(
	modelId: string,
	data: UsageData,
	configPlan?: SubscriptionType,
): SubscriptionType {
	// 1. Si le plan est défini dans la config, l'utiliser en priorité
	if (configPlan) return configPlan;

	// 2. Si le modèle actuel est Opus, c'est forcément le plan max
	if (modelId.includes("opus")) return "max";

	// 3. Vérifier l'historique pour détecter si l'utilisateur a déjà utilisé Opus
	const hasUsedOpus = data.sessions.some(s => s.modelId?.includes("opus"));
	if (hasUsedOpus) return "max";

	// 4. Par défaut, plan pro
	return "pro";
}

function getMaxTokens(subscription: SubscriptionType): number {
	switch (subscription) {
		case "free": return TOKEN_LIMITS.FREE.MAX_PER_5_HOURS;
		case "pro": return TOKEN_LIMITS.PRO.MAX_PER_5_HOURS;
		case "max": return TOKEN_LIMITS.MAX.MAX_PER_5_HOURS;
	}
}

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

	const subscription = detectSubscription(modelId, data, configPlan);
	const maxTokens = getMaxTokens(subscription);
	const timeLeft = Math.max(
		0,
		data.windowStart + TIME_INTERVALS.FIVE_HOURS_MS - Date.now(),
	);

	return {
		tokens: data.totalTokens,
		maxTokens,
		timeLeft,
		percentage: Math.min((data.totalTokens / maxTokens) * 100, 100),
	};
}
