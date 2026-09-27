/**
 * Usage Interfaces - Types for usage tracking
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
