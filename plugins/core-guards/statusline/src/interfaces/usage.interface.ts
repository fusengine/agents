/**
 * Usage Interfaces - Types pour le suivi d'usage
 */

export interface ContextResult {
	tokens: number;
	maxTokens: number;
	percentage: number;
}

export interface FiveHourUsage {
	tokens: number;
	maxTokens: number;
	timeLeft: number;
	percentage: number;
	cost?: number;
}

export interface WeeklyUsage {
	tokens: number;
	maxTokens: number;
	timeLeft: number;
	percentage: number;
	cost: number;
}

export interface DailySpend {
	cost: number;
	budget?: number;
}

export type SubscriptionType = "free" | "pro" | "max";

export interface SubscriptionConfig {
	type: SubscriptionType;
	maxTokensPer5Hours: number;
	resetIntervalMs: number;
}
